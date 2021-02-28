import web3
from django.db import models
from .uniswap import Uniswap
from .errs import *
import logging
from .utils import *
import hashlib
import os

addr = None
key = None
infura_id = None

try:
    # read settings

    addr = os.environ.get('ADDR', None)
    key = os.environ.get('KEY', None)
    infura_id = os.environ.get('INFURA_ID', None)

    if all([i is None for i in [addr,key,infura_id]]):
        with open('settings.txt','r') as f:
            lines=[i.replace('\n','') for i in f.readlines()]
            for line in lines:
                if line.startswith('ADDR='):
                    addr=line[len('ADDR='):]
                if line.startswith('KEY='):
                    key=line[len('KEY='):]
                if line.startswith('INFURA_ID='):
                    infura_id=line[len('INFURA_ID='):]


    test_provider_url = f"https://rinkeby.infura.io/v3/{infura_id}"
    test_tx_url = 'https://rinkeby.etherscan.io/tx/'

    main_tx_url = 'https://etherscan.io/tx/'
    main_provider_url = f"https://mainnet.infura.io/v3/{infura_id}"

    # connect to infura
    try:
        w3_mainnet = web3.Web3(
            web3.Web3.HTTPProvider(main_provider_url, request_kwargs={"timeout": 60})
        )

        w3_test = web3.Web3(
            web3.Web3.HTTPProvider(test_provider_url, request_kwargs={"timeout": 60})
        )
    except:
        raise ('cant connect to infura node')

    try:
        addr = web3.main.to_checksum_address(addr)
    except:
        raise Exception('address is not valid')

    # check key is valid for addr
    try:
        if str(w3_mainnet.eth.account.from_key(key).address) != addr:
            raise Exception('key is not valid for address')
    except:
        raise Exception('key is not valid for address')

except Exception as ex:
    logger.error('invalid settings')
    raise ex


class SkipTokens(models.Model):
    name = models.CharField(max_length=128, )
    addr = models.CharField(max_length=128, )

    def __str__(self):
        return str(self.addr)


class DonorAddr(models.Model):
    name = models.CharField(max_length=128, )
    addr = models.CharField(max_length=128, unique=True)
    gas_multiplier = models.FloatField(null=False)
    fixed_trade = models.BooleanField()
    fixed_value_trade = models.CharField(max_length=128, null=False)
    percent_value_trade = models.FloatField(null=True, )
    trade_on_confirmed = models.BooleanField()
    retry_count = models.IntegerField(null=True)
    follow_min = models.CharField(max_length=128, null=True)
    follow_max = models.CharField(max_length=128, null=True)
    slippage = models.FloatField()
    donor_slippage = models.BooleanField(default=False)

    wallet = models.ForeignKey('Wallet', on_delete=models.CASCADE, related_name='donors')

    def __str__(self):
        return str(self.name)


class Wallet(models.Model):
    addr = models.CharField(max_length=128, unique=True, null=False)
    key = models.CharField(max_length=128, unique=True, null=False)
    key_hash = models.CharField(max_length=128, unique=True, null=False)
    active = models.BooleanField(default=False)
    telegram_channel_id = models.CharField(null=True, max_length=128)
    mainnet = models.BooleanField(default=False)
    waps_balance = models.CharField(max_length=128, null=True)
    weth_balance = models.CharField(max_length=128, null=True)
    eth_balance = models.CharField(max_length=128, null=True)
    max_gas = models.CharField(max_length=128, null=True, default=str(500 * 10 ** 9))
    skip_tokens = models.ManyToManyField(SkipTokens, related_name='wallets')
    socket_msg = models.CharField(max_length=255, null=True)
    initial_state = models.BooleanField(default=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.waps_addr = '0xD8fd31E40423a4CeF8e4a488793e87BB5b7D876D'
        if self.mainnet:
            self.follower = Uniswap(self.addr, self.key, provider=w3_mainnet, mainnet=self.mainnet)
        else:
            self.follower = Uniswap(self.addr, self.key, provider=w3_test, mainnet=self.mainnet)

    def parse_client_msg(self, msg):
        '''
        {'tx_hash':tx_hash,'from':from_addr,'net_name':net_name,'status':response_status,
                            'method': method,'path':path,
                            'in_token_amount': in_token_amount,
                            'in_token_amount_with_slippage': in_token_amount_with_slippage,
                             'out_token_amount': out_token_amount,
                            'out_token_amount_with_slippage': out_token_amount_with_slippage,'fee': fee_support}
                            '''

        try:
            try:
                response = json.loads(json.loads(msg)['message'])
            except:
                logger.info(f'not json msg: {msg}')
                return
            net_name = response['net_name']
            if net_name == 'main':
                mainnet = True
                tx_url = 'https://etherscan.io/tx/'
                weth_adr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
            else:
                weth_adr = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
                tx_url = 'https://rinkeby.etherscan.io/tx/'
                mainnet = False
            if self.mainnet != mainnet:
                return
            from_addr = response['from']
            tx_hash = response['tx_hash']
            path = response['path']
            response_status = response['status']
            gas = int(response['gas'])
            gas_price = int(int(response['gas_price']))
            in_token = path[0]
            in_token_amount = response['in_token_amount']
            in_token_amount_with_slippage = response['in_token_amount_with_slippage']
            out_token_amount = response['out_token_amount']
            out_token_amount_with_slippage = response['out_token_amount_with_slippage']
            fee_support = response['fee']
            out_token = path[-1]

            if response_status == 'pending':
                # follow on pending
                if DonorAddr.objects.filter(addr=from_addr, trade_on_confirmed=False).exists():
                    donor = DonorAddr.objects.get(addr=from_addr, trade_on_confirmed=False)
                    logger.debug(f'new pending tx for donor: {from_addr}: {tx_hash}')
                    self.follow(donor, gas_price, path, in_token, in_token_amount, in_token_amount_with_slippage,
                                out_token, out_token_amount, out_token_amount_with_slippage, tx_hash,
                                fee_support)
                else:
                    logger.debug(f'new pending tx for addr: {from_addr}: {tx_hash}')


            elif response['status'] == 'confirmed':
                # follow on confirmed
                if DonorAddr.objects.filter(addr=from_addr, trade_on_confirmed=True).exists():
                    donor = DonorAddr.objects.get(addr=from_addr, trade_on_confirmed=True)
                    logger.debug(f'new confirmed tx for donor: {from_addr}: {response}')
                    # получили то, сколько чувак отдал и за что
                    # params=(method,(in_token, in_amount, in_amount_slippage ),(out_token, out_amount, out_amount))
                    # если какой то ебанутый метод, то возвращаем None, если нет, то все ок
                    self.follow(donor, gas_price, path, in_token, in_token_amount, in_token_amount_with_slippage,
                                out_token, out_token_amount, out_token_amount_with_slippage, tx_hash,
                                fee_support)
                else:
                    logger.debug(f'new confirmed tx for addr: {from_addr}: {tx_hash}')

                # если мы меняем один на другой, то у двух ассетов будет эта транзакция, у одного на покупку, у другого на продажу
                if Asset.objects.filter(donor_tx_hash=tx_hash).exists() and Asset.objects.filter(
                        donor_sell_tx_hash=tx_hash).exists():
                    new_asset = Asset.objects.get(donor_tx_hash=tx_hash)
                    new_asset.donor_confirmed = True
                    new_asset.save()
                    msg = f'donor tx confirmed: {tx_url}{tx_hash}\nchange {new_asset.addr}'
                    logger.info(msg)
                    new_asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если конфирмед донор, то просто пишем в лог и сообщение
                elif Asset.objects.filter(donor_tx_hash=tx_hash).exists():
                    for asset in Asset.objects.filter(donor_tx_hash=tx_hash, donor__trade_on_confirmed=False):
                        asset.donor_confirmed = True
                        asset.save()
                        msg = f'donor tx confirmed: {tx_url}{tx_hash}\nbuy {asset.addr}'
                        logger.info(msg)
                        asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если донорская продалась, то сообщение, что у донора продалась
                elif Asset.objects.filter(donor_sell_tx_hash=tx_hash).exists():
                    for asset in Asset.objects.filter(donor_sell_tx_hash=tx_hash, donor__trade_on_confirmed=False):
                        msg = f'donor tx confirmed: {tx_url}{tx_hash}\n sell {asset.addr}'
                        logger.info(msg)
                        asset.wallet.send_msg_to_subscriber_tlg(msg)

                # эта проверка обязательно идет перед двумя следующими,
                # проверям, что у двух ассетов эта транзакция будет у одного в покупке, у другого в продаже
                # значит это обмен, обязательно перед, потому что оно сначала проверит, что обе совпадает, потом по одной
                elif Asset.objects.filter(our_tx_hash=tx_hash).exists() and Asset.objects.filter(
                        our_sell_tx_hash=tx_hash).exists():
                    # удаляем старый
                    asset = Asset.objects.get(our_sell_tx_hash=tx_hash)
                    old_asset_addr = asset.addr
                    asset.delete()

                    # подтверждаем новый
                    new_asset = Asset.objects.get(our_tx_hash=tx_hash)
                    new_asset.our_confirmed = True
                    wallet = new_asset.wallet
                    if new_asset.qnty is None:
                        new_asset.qnty = wallet.follower.get_asset_out_qnty_from_tx(tx_hash, new_asset.addr)
                    else:
                        new_asset.qnty += int(wallet.follower.get_asset_out_qnty_from_tx(tx_hash, new_asset.addr))
                    new_asset.save()

                    msg = f'Our tx *confirmed*: {tx_url}{tx_hash}\n *change* {old_asset_addr} \nfor {new_asset.addr}\nnew token qnty={wallet.follower.convert_wei_to_eth(new_asset.qnty)}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.refresh_balances()
                    wallet.approve_if_not(new_asset, gas_price)

                # если наша подтвердилась на покупку, берем количество токенов из транзакции, и ставим подтверждение
                elif Asset.objects.filter(our_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(our_tx_hash=tx_hash)
                    wallet = asset.wallet
                    asset.our_confirmed = True
                    asset.qnty = wallet.follower.get_asset_out_qnty_from_tx(tx_hash, asset.addr)
                    asset.save()
                    msg = f'Our tx *confirmed*: {tx_url}{tx_hash}\n *buy* {asset.addr}\nqnty={wallet.follower.convert_wei_to_eth(asset.qnty)}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.approve_if_not(asset, gas_price)
                    wallet.refresh_balances()
                # если наша подтвердилась на продажу, удаляем ассет, берем значение, за которое продалась, отправляем сооб
                elif Asset.objects.filter(our_sell_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(our_sell_tx_hash=tx_hash)
                    wallet = asset.wallet
                    asset.delete()
                    qnty_out = wallet.follower.get_asset_out_qnty_from_tx(tx_hash, asset.addr)
                    msg = f'Our tx *confirmed*: {tx_url}{tx_hash}\n *sell* {asset.addr}\nqnty={wallet.follower.convert_wei_to_eth(qnty_out)}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.refresh_balances()
                # подтверждение аппрува
                elif Asset.objects.filter(approve_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(approve_tx_hash=tx_hash)
                    wallet = asset.wallet
                    msg = f'token {asset.addr} approved: {tx_url}{tx_hash}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.refresh_balances()
                else:
                    msg = f'some tx confirmed: {tx_url}{tx_hash}\n addr: {from_addr}'
                    logger.info(msg)
                    # telegram_bot_sendtext(msg)



            elif response['status'] == 'failed':

                logger.debug(f'new failed tx: {response}')
                # если мы меняем один на другой, то у двух ассетов будет эта транзакция, у одного на покупку, у другого на продажу
                # на фэйлед удаляем новый, а в старом убираем хэш удаления
                if Asset.objects.filter(donor_tx_hash=tx_hash).exists() and Asset.objects.filter(
                        donor_sell_tx_hash=tx_hash).exists():
                    for asset in Asset.objects.filter(donor_tx_hash=tx_hash).exists() and Asset.objects.filter(
                            donor_sell_tx_hash=tx_hash):
                        msg = f'donor tx failed: {tx_url}{tx_hash}\nchange {Asset.objects.get(donor_sell_tx_hash=tx_hash).addr} for {Asset.objects.filter(donor_tx_hash=tx_hash)}'
                        logger.info(msg)
                        asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если failed донор, то просто пишем в лог и сообщение, конфирмед не проставляем, типа и так ок
                elif Asset.objects.filter(donor_tx_hash=tx_hash).exists():
                    for asset in Asset.objects.filter(donor_tx_hash=tx_hash):
                        msg = f'donor tx failed: {tx_url}{tx_hash}\nbuy {Asset.objects.get(donor_tx_hash=tx_hash).addr}'
                        logger.info(msg)
                        asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если донорская не продалась, то сообщение, что у донора не продалась
                elif Asset.objects.filter(donor_sell_tx_hash=tx_hash).exists():
                    for asset in Asset.objects.filter(donor_sell_tx_hash=tx_hash):
                        msg = f'donor tx failed: {tx_url}{tx_hash}\n sell {Asset.objects.get(donor_sell_tx_hash=tx_hash).addr}'
                        logger.info(msg)
                        asset.wallet.send_msg_to_subscriber_tlg(msg)

                # эта проверка обязательно идет перед двумя следующими,
                # проверям, что у двух ассетов эта транзакция будет у одного в покупке, у другого в продаже
                # значит это обмен, обязательно перед, потому что оно сначала проверит, что обе совпадает, потом по одной
                elif Asset.objects.filter(our_tx_hash=tx_hash).exists() and Asset.objects.filter(
                        our_sell_tx_hash=tx_hash).exists():
                    # на фэйлед надо удалить новый токен, а на старом убрать тх_хэш о продаже
                    # удаляем старый
                    asset = Asset.objects.get(our_sell_tx_hash=tx_hash)
                    asset.our_sell_tx_hash = None
                    asset.save()

                    # подтверждаем новый
                    new_asset = Asset.objects.get(our_tx_hash=tx_hash)
                    new_asset_addr = new_asset.addr
                    new_asset.delete()

                    msg = f'Our tx *failed*: {tx_url}{tx_hash}\n *change* {asset.addr} \nfor {new_asset_addr}'
                    logger.info(msg)
                    asset.wallet.send_msg_to_subscriber_tlg(msg)


                # если наша провалилась на покупку, удаляем новый токен
                elif Asset.objects.filter(our_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(our_tx_hash=tx_hash)
                    asset_addr = asset.addr
                    asset.delete()
                    msg = f'Our tx *failed*: {tx_url}{tx_hash}\n *buy* {asset_addr}'
                    logger.info(msg)
                    asset.wallet.send_msg_to_subscriber_tlg(msg)

                # если наша провалилась на продажу, удаляем у ассета тх_хэш продажи
                elif Asset.objects.filter(our_sell_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(our_sell_tx_hash=tx_hash)
                    asset.our_sell_tx_hash = None
                    asset.save()
                    msg = f'Our tx *failed*: {tx_url}{tx_hash}\n *sell* {asset.addr}'
                    logger.info(msg)
                    asset.wallet.send_msg_to_subscriber_tlg(msg)
                # провал аппрува
                elif Asset.objects.filter(approve_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(approve_tx_hash=tx_hash)
                    asset.approve_failed = True
                    msg = f'token {asset.addr} approve *failed*: {tx_url}{tx_hash}\n we will try to sell it, *so approve it manually*'
                    logger.info(msg)
                    asset.wallet.send_msg_to_subscriber_tlg(msg)
                else:

                    msg = f'some tx failed: {tx_url}{tx_hash}\n addr: {from_addr}'
                    logger.info(msg)


            else:
                pass

        except Exception as ex:
            logger.exception(ex, exc_info=True)
            self.send_msg_to_subscriber_tlg(f'unknown error, check log please and contact support {ex}')

    def follow(self, donor: DonorAddr, donor_gas_price, donor_path, in_token, in_token_amount,
               in_token_amount_with_slippage, out_token, out_token_amount, out_token_amount_with_slippage, tx_hash,
               fee_support):
        if self.active == False:
            return
        if self.mainnet:
            tx_url = main_tx_url
            weth_adr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        else:
            weth_adr = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
            tx_url = test_tx_url

        our_gas_price = int(donor_gas_price * donor.gas_multiplier)
        # если in_token - weth, то это покупка
        if in_token == weth_adr:
            # проверяем, что это не какой то юсдт
            if out_token not in [i.addr for i in self.skip_tokens.all()]:
                # покупаем, если еще не покупали за этим донором, и проходит по фильтрам
                if not Asset.objects.filter(addr=out_token, wallet=self, donor=donor).exists():
                    # todo сделать следование в процентах от сделки
                    # устанавливаем значение, на которое торговать
                    if donor.fixed_trade:
                        my_in_token_amount = int(donor.fixed_value_trade)
                    else:
                        my_in_token_amount = None

                    # узнаем, сколько токенов за 1 эфир
                    buyed_asset_out_for_one_ether = self.follower.get_out_qnty_by_path(10 ** 18, donor_path)

                    if in_token_amount is not None:
                        # если за конкретное кол-во эфиров, то вот сумма сделки донора в эфирах
                        donor_eth_value = in_token_amount
                        if my_in_token_amount is None:
                            my_in_token_amount = int(donor_eth_value * donor.percent_value_trade)
                        my_out_token_amount = int(
                            buyed_asset_out_for_one_ether * self.follower.convert_wei_to_eth(my_in_token_amount))
                        if donor.donor_slippage:
                            slippage = (self.follower.convert_wei_to_eth(
                                donor_eth_value) * buyed_asset_out_for_one_ether) / out_token_amount_with_slippage - 1
                        else:
                            slippage = donor.slippage

                        my_min_out_token_amount = self.follower.get_min_out_tokens(my_out_token_amount, slippage)
                    else:
                        # если не знаем, то нужно получать цену монеты по этому пути, что он купил
                        # но второй раз цену не нужно узнавать, когда мы уже сами будем покупать, поэтому
                        # из этого значения приведем к нашему

                        # мы точно знаем, сколлько токенов он купил,
                        # делим это количество на цена в эфирах за 1 токен
                        donor_eth_value = self.follower.convert_eth_to_wei(
                            out_token_amount / buyed_asset_out_for_one_ether)

                        if my_in_token_amount is None:
                            my_in_token_amount = int(donor_eth_value * donor.percent_value_trade)
                        # так как цену мы уже запросили за 1 эфир, приведем к тому,
                        # сколько нам нужно, чтобы еще раз не просить
                        if donor.fixed_trade:
                            my_out_token_amount = int(
                                buyed_asset_out_for_one_ether * self.follower.convert_wei_to_eth(
                                    int(donor.fixed_value_trade)))
                        else:
                            my_out_token_amount = int(
                                buyed_asset_out_for_one_ether * self.follower.convert_wei_to_eth(
                                    int(donor.percent_value_trade * donor_eth_value)))
                        if donor.donor_slippage:
                            slippage = in_token_amount_with_slippage / donor_eth_value - 1
                        else:
                            slippage = donor.slippage
                        my_min_out_token_amount = self.follower.get_min_out_tokens(my_out_token_amount, slippage)
                    follow_min = int(donor.follow_min)
                    follow_max = int(donor.follow_max)
                    if follow_max == 0:
                        follow_max = 10 ** 25
                    if donor_eth_value >= follow_min and donor_eth_value <= follow_max:

                        our_tx = self.swap_exact_token_to_token(donor=donor, path=donor_path,
                                                                in_token_amount=my_in_token_amount,
                                                                min_out_token_amount=my_min_out_token_amount,
                                                                gas_price=our_gas_price, fee_support=fee_support)
                        if our_tx is not None:
                            msg = f'Following on {"confirmed" if donor.trade_on_confirmed else "pending"} *{donor.name}*,\nBuying not less {self.follower.convert_wei_to_eth(my_min_out_token_amount)}\nToken - {out_token}\nfor {self.follower.convert_wei_to_eth(my_in_token_amount)} ether\nDonor tx - {tx_url}{tx_hash}\nOur tx {tx_url}{our_tx}'

                            self.assets.create(addr=out_token, buyed_for_addr=in_token,
                                               buyed_for_qnty=my_in_token_amount, donor_tx_hash=tx_hash,
                                               our_tx_hash=our_tx, donor=donor,
                                               donor_confirmed=donor.trade_on_confirmed)

                            logger.info(msg)
                            self.send_msg_to_subscriber_tlg(msg)
                        else:
                            self.send_msg_to_subscriber_tlg(
                                f'buy tx was not created by some reason, look at previous messages\n donor tx: {tx_hash}')
                    else:
                        msg = f'donors value for trade is {self.follower.convert_wei_to_eth(donor_eth_value)}, dont follow'
                        logger.info(msg)
                        self.send_msg_to_subscriber_tlg(msg)
                else:
                    msg = f'token {out_token} is already bought'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
            else:
                msg = f'donor is buying {out_token} - skip token'
                logger.info(msg)
                self.send_msg_to_subscriber_tlg(msg)
        # если out_token - weth, то продажа, а если значение out_token - юсдт..., меняем его на ветх
        elif out_token == weth_adr or out_token in [i.addr for i in self.skip_tokens.all()]:
            if out_token in [i.addr for i in self.skip_tokens.all()]:
                msg = f'donor is trying to sell token{in_token} for {out_token}, its in skip list, we wil sell it for weth directly'
                logger.info(msg)
                self.send_msg_to_subscriber_tlg(msg)

                path = [in_token, weth_adr]
                out_token = weth_adr

            # продаем, если уже покупали за этим донором
            if Asset.objects.filter(addr=in_token, wallet=self, our_confirmed=True, donor=donor).exists():
                my_in_token_amount = int(Asset.objects.get(addr=in_token, wallet=self, donor=donor).qnty)

                buyed_asset_out_for_one_ether = self.follower.get_out_qnty_by_path(10 ** 18, donor_path)

                my_out_token_amount = int(buyed_asset_out_for_one_ether * self.follower.convert_wei_to_eth(
                    my_in_token_amount))

                if in_token_amount is not None:
                    # если за конкретное кол-во эфиров, то вот сумма сделки донора в эфирах
                    donor_eth_value = in_token_amount
                    if donor.donor_slippage:
                        slippage = (self.follower.convert_wei_to_eth(
                            donor_eth_value) * buyed_asset_out_for_one_ether) / out_token_amount_with_slippage - 1
                    else:
                        slippage = donor.slippage
                else:
                    # мы точно знаем, сколлько токенов он купил,
                    # делим это количество на цена в эфирах за 1 токен
                    donor_eth_value = self.follower.convert_eth_to_wei(
                        out_token_amount / buyed_asset_out_for_one_ether)
                    # так как цену мы уже запросили за 1 эфир, приведем к тому,
                    # сколько нам нужно, чтобы еще раз не просить
                    if donor.donor_slippage:
                        slippage = in_token_amount_with_slippage / donor_eth_value - 1
                    else:
                        slippage = donor.slippage
                my_min_out_token_amount = self.follower.get_min_out_tokens(my_out_token_amount, slippage)
                our_tx = self.swap_exact_token_to_token(donor=donor, in_token_amount=my_in_token_amount,
                                                        min_out_token_amount=my_min_out_token_amount,
                                                        path=donor_path,
                                                        gas_price=our_gas_price, fee_support=fee_support)
                if our_tx is not None:
                    msg = f'Following on {"confirmed" if donor.trade_on_confirmed else "pending"} *{donor.name}*,\nSelling  {self.follower.convert_wei_to_eth(my_in_token_amount)} Token - {out_token}\nfor not less {self.follower.convert_wei_to_eth(my_min_out_token_amount)} ether\nDonor tx - {tx_url}{tx_hash}\nOur tx {tx_url}{our_tx}'
                    asset = self.assets.get(addr=in_token, donor=donor)
                    asset.donor_sell_tx_hash = tx_hash
                    asset.our_sell_tx_hash = our_tx
                    asset.donor_confirmed = donor.trade_on_confirmed
                    asset.save()
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                else:
                    self.send_msg_to_subscriber_tlg(
                        f'sell tx was not created by some reason, look at previous messages\n donor tx: {tx_hash}')

            else:
                msg = f'donor is selling token {in_token}, we dont have it'
                logger.info(msg)
                self.send_msg_to_subscriber_tlg(msg)

        # иначе это обмен
        else:
            # продаем, если у нас есть что продавать
            if Asset.objects.filter(addr=in_token, wallet=self, our_confirmed=True, donor=donor).exists():
                if self.assets.filter(addr=out_token, our_confirmed=False, donor=donor):
                    msg = f'now we are trying to buy {out_token} in another tx, so we cant change {in_token} to {out_token}, *you have to sell it manually*'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                elif self.assets.filter(addr=out_token, our_sell_tx_hash__isnull=False, donor=donor):
                    msg = f'now we are trying to sell {out_token} in another tx, so we cant change {in_token} to {out_token}, *you have to sell it manually*'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                else:
                    my_in_token_amount = int(
                        Asset.objects.get(addr=in_token, wallet=self, donor=donor).qnty)

                    buyed_asset_out_for_one_ether = self.follower.get_out_qnty_by_path(10 ** 18, donor_path)

                    my_out_token_amount = int(buyed_asset_out_for_one_ether * self.follower.convert_wei_to_eth(
                        my_in_token_amount))

                    if in_token_amount is not None:
                        # если за конкретное кол-во эфиров, то вот сумма сделки донора в эфирах
                        donor_eth_value = in_token_amount
                        if donor.donor_slippage:
                            slippage = (self.follower.convert_wei_to_eth(
                                donor_eth_value) * buyed_asset_out_for_one_ether) / out_token_amount_with_slippage - 1
                        else:
                            slippage = donor.slippage
                    else:
                        # мы точно знаем, сколлько токенов он купил,
                        # делим это количество на цена в эфирах за 1 токен
                        donor_eth_value = self.follower.convert_eth_to_wei(
                            out_token_amount / buyed_asset_out_for_one_ether)
                        # так как цену мы уже запросили за 1 эфир, приведем к тому,
                        # сколько нам нужно, чтобы еще раз не просить
                        if donor.donor_slippage:
                            slippage = in_token_amount_with_slippage / donor_eth_value - 1
                        else:
                            slippage = donor.slippage
                    my_min_out_token_amount = self.follower.get_min_out_tokens(my_out_token_amount, slippage)
                    our_tx = self.swap_exact_token_to_token(donor=donor, path=donor_path,
                                                            in_token_amount=my_in_token_amount,
                                                            min_out_token_amount=my_min_out_token_amount,
                                                            gas_price=our_gas_price, fee_support=fee_support)
                    if our_tx is not None:
                        msg = f'Following on {"confirmed" if donor.trade_on_confirmed else "pending"} *{donor.name}*,\n*Changing* {self.follower.convert_wei_to_eth(my_in_token_amount)} Token - {in_token}\nfor not less {self.follower.convert_wei_to_eth(my_min_out_token_amount)} {out_token}\nDonor tx - {tx_url}{tx_hash}\nOur tx {tx_url}{our_tx}'
                        # поставили на продажу старый токен
                        asset = self.assets.get(addr=in_token, donor=donor)
                        asset.donor_sell_tx_hash = tx_hash
                        asset.our_sell_tx_hash = our_tx
                        asset.donor_confirmed = donor.trade_on_confirmed
                        asset.save()
                        # создаем новый asset, который покупаем, либо берем существующий
                        new_asset, created = self.assets.get_or_create(addr=out_token, donor=donor)
                        new_asset.buyed_for_addr = in_token
                        new_asset.buyed_for_qnty = my_in_token_amount
                        new_asset.donor_tx_hash = tx_hash
                        new_asset.donor_confirmed = donor.trade_on_confirmed
                        new_asset.our_tx_hash = our_tx
                        new_asset.save()
                        logger.info(msg)
                        self.send_msg_to_subscriber_tlg(msg)
                    else:
                        self.send_msg_to_subscriber_tlg(
                            f'change tx was not created by some reason, look at previous messages\n donor tx: {tx_hash}')
            else:
                msg = f'donor is changing token {in_token} for another token, we dont have it'
                logger.info(msg)
                self.send_msg_to_subscriber_tlg(msg)

    #
    def send_msg_to_subscriber_tlg(self, msg):
        return telegram_bot_sendtext(f'wallet: {self.addr}\n' + str(msg), self.telegram_channel_id)

    def refresh_balances(self, send_msg=True):
        try:
            eth_balance, weth_balance, waps_balance = get_balances_eth_weth_waps(self.addr, self.key,
                                                                                 follower=self.follower,
                                                                                 mainnet=self.mainnet)
            self.weth_balance = weth_balance
            self.eth_balance = eth_balance
            self.waps_balance = waps_balance
            self.save()

            msg = f'weth balance: {self.follower.convert_wei_to_eth(int(self.weth_balance))}\n eth balance={self.follower.convert_wei_to_eth(int(self.eth_balance))}\n waps balanse={self.follower.convert_wei_to_eth(int(self.waps_balance))}'
            logger.info(msg)
            if send_msg:
                self.send_msg_to_subscriber_tlg(msg)
            return self.waps_balance, self.weth_balance, self.eth_balance
        except Exception as ex:
            logger.exception(ex, exc_info=True)
            return self.waps_balance, self.weth_balance, self.eth_balance

    def approve_if_not(self, asset, gas_price=None):
        appr_tx = None
        try:
            # всегда передаем в аргумент фолловера, ему нужно присвоить правильные ключи, чтобы он торговал с этого акка

            if self.follower.get_allowance(asset.addr) < int(asset.qnty):
                appr_tx = self.follower.approve(asset.addr, gas_price=gas_price)
                asset.approve_tx_hash = appr_tx
                asset.save()
                msg = f'approve tx sent: tx_url{appr_tx}'
                logger.info(msg)
                telegram_bot_sendtext(msg)
                return appr_tx
            else:
                return None
        except Exception as ex:
            logger.error(ex)
            if appr_tx is None:
                self.send_msg_to_subscriber_tlg(
                    f'approve for token {asset} was failed, approve it yourself please, error: {ex}')
            else:
                self.send_msg_to_subscriber_tlg(
                    f'approve was sent, but there is some issue, check log for details, error: {ex}')

    def swap_exact_token_to_token(self, donor, path: list, in_token_amount, min_out_token_amount,
                                  gas_price=None, gas=None, deadline=None, fee_support=True):
        ''' неважно, что это, просто покупаем токены'''
        try:
            # всегда передаем в аргумент фолловера, ему нужно присвоить правильные ключи, чтобы он торговал с этого акка

            # выставляем значение, на которое торгуем: если покупаем за эфир, то in_token_amount=self.fixed_value_trade
            # иначе ошибка

            if self.follower.weth_addr == path[0]:
                if int(self.weth_balance) < in_token_amount:
                    raise FollowSwapsErr('Not enough weth to follow')

            if gas is None:
                gas = 320000
                # todo log
            logger.debug(f'trying to buy {path} tokens, input tokens: {in_token_amount}, gas price: {gas_price}')

            # # если газ больше максимального, ошибка
            if gas_price is not None:
                if self.follower.weth_addr == path[0]:
                    if self.max_gas != 0 and self.max_gas is not None and self.max_gas != '0':
                        if gas_price > int(self.max_gas):
                            raise TooHighGas(
                                f' cant trade: gas value is {self.follower.provider.fromWei(gas_price, "gwei")}, maximum allowed is {self.follower.provider.fromWei(int(self.max_gas), "gwei")}, path: {path}')
            else:
                raise FollowSwapsErr('gas is not set')

            try:

                tx = self.follower.swap_exact_token_for_token(in_token_amount, path,
                                                              min_out_token_amount=min_out_token_amount,
                                                              deadline=deadline, gas=gas, gas_price=gas_price,
                                                              fee_support=fee_support)
                hex_tx = tx.hex()
                return hex_tx

            except FollowSwapsErr as ex:
                logger.error(ex)
                self.send_msg_to_subscriber_tlg(str(ex))

            except Exception as ex:
                logger.exception(ex, exc_info=True)
                if 'insufficient funds for gas * price + value' in str(ex):
                    self.send_msg_to_subscriber_tlg(str(ex))
                    raise LowBalance('Not enough ETH for gas')

                else:
                    raise ex


        except FollowSwapsErr as ex:
            logger.error(ex)
            self.send_msg_to_subscriber_tlg(ex)

        except Exception as ex:
            logger.exception(ex, exc_info=True)
            self.send_msg_to_subscriber_tlg('unknown error, stop bot please and message admins')


class Asset(models.Model):
    addr = models.CharField(max_length=128, null=False)
    buyed_for_addr = models.CharField(max_length=128, null=False)
    qnty = models.CharField(null=True, max_length=100)
    buyed_for_qnty = models.CharField(null=True, max_length=100)
    donor_tx_hash = models.CharField(max_length=128, null=False)
    donor_sell_tx_hash = models.CharField(max_length=128, null=True)
    our_tx_hash = models.CharField(max_length=128, null=False)
    our_sell_tx_hash = models.CharField(max_length=128, null=True)
    approve_tx_hash = models.CharField(max_length=128, null=True)
    approve_failed = models.BooleanField(default=False)
    donor_confirmed = models.BooleanField(default=False)
    our_confirmed = models.BooleanField(default=False)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='assets')
    donor = models.ForeignKey(DonorAddr, on_delete=models.CASCADE, related_name='assets')
    attemts = models.IntegerField(null=True)

    # todo везде такое сделать

    def clean(self):
        self.addr = web3.main.to_checksum_address(self.addr)

    class Meta:
        unique_together = ['addr', 'wallet', 'donor']
