import web3
from django.db import models
from .uniswap import Uniswap
from .errs import *
import logging
from .utils import *
import hashlib
import os
import requests
from WapsClient.logger import logger
import base64
addr = None
key = None
infura_id = None

try:
    # read settings

    addr = os.environ.get('ADDR', None)
    key = os.environ.get('KEY', None)
    infura_id = os.environ.get('INFURA_ID', None)
    etherplorer_api_key=os.environ.get('ETHERPLORER_API', None)
    if all([i is None for i in [addr,key,infura_id]]):
        with open('settings.txt','r') as f:
            lines=[i.replace('\n','') for i in f.readlines()]
            for line in lines:
                if line.startswith('ADDR='):
                    addr=line[len('ADDR='):]
                if line.startswith('KEY='):
                    key=line[len('KEY='):]
                if line.startswith('HTTP_NODE='):
                    infura_id=line[len('HTTP_NODE='):]
                if line.startswith('ETHERPLORER_API='):
                    etherplorer_api_key=line[len('ETHERPLORER_API='):]

    if infura_id in (None,''):
        infura_id='http://app-80d6021d-f28f-4ec5-ab0e-8766ab3845a0.cls-dec3c32b-4f06-462f-b827-dee931d39a72.ankr.com'


    test_provider_url = infura_id
    test_tx_url = 'https://bscscan.com/tx/'

    main_tx_url = 'https://bscscan.com/tx/'
    main_provider_url = infura_id

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
    addr = models.CharField(max_length=128, unique=True)

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
    low_gas=models.IntegerField(null=True)
    fast_gas=models.IntegerField(null=True)
    medium_gas=models.IntegerField(null=True)
    addr = models.CharField(max_length=128, unique=True, null=False)
    key = models.CharField(max_length=128, unique=True, null=False)
    key_hash = models.CharField(max_length=128, unique=True, null=False)
    active = models.BooleanField(default=False)
    telegram_channel_id = models.CharField(null=True, max_length=128)
    mainnet = models.BooleanField(default=False)
    waps_balance = models.CharField(max_length=128, null=True)
    bwaps_balance = models.CharField(max_length=128, null=True)
    weth_balance = models.CharField(max_length=128, null=True)
    eth_balance = models.CharField(max_length=128, null=True)
    max_gas = models.CharField(max_length=128, null=True, default=str(500 * 10 ** 9))
    skip_tokens = models.ManyToManyField(SkipTokens, related_name='wallets')
    socket_msg = models.CharField(max_length=255, null=True)
    initial_state = models.BooleanField(default=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.waps_addr = '0x0c79b8f01d6f0dd7ca8c98477ebf0998e1dbaf91'
        if self.mainnet:
            self.follower = Uniswap(self.addr, self.key, provider=w3_mainnet, mainnet=self.mainnet)
        else:
            self.follower = Uniswap(self.addr, self.key, provider=w3_test, mainnet=self.mainnet)

    def refresh_all_balances(self):
        addr_info=requests.get(f'https://api.ethplorer.io/getAddressInfo/{self.addr}?apiKey={etherplorer_api_key}').json()
        for token in addr_info.get('tokens',{}):
            asset,created = Asset.objects.get_or_create(addr=web3.Web3.toChecksumAddress(token['tokenInfo']['address']),wallet_id=self.id)
            changed=False
            if asset.decimals!=int(token['tokenInfo']['decimals']):
                asset.decimals=int(token['tokenInfo']['decimals'])
                changed=True
            if asset.name==''  or asset.name is  None:
                asset.name=token['tokenInfo']['name']
                changed=True
            if asset.balance!=token['balance']:
                asset.balance=int(token['balance'])
                changed=True
            if changed==True:
                asset.save()
        self.refresh_balances(send_msg=False)

    def refresh_token_balance(self,token_id):
        asset=self.assets.get(id=token_id)
        token_contr=self.follower.get_erc_contract_by_addr(asset.addr)
        new_balance=token_contr.functions.balanceOf(self.addr).call()
        asset.balance=new_balance
        asset.save()
        return new_balance

    def refresh_token_price(self,token_id):
        asset=self.assets.get(id=token_id)
        new_price_for_token = self.follower.get_out_qnty_by_path(10**asset.decimals,
                                                            [asset.addr, self.follower.weth_addr, ])
        asset.price_for_token=new_price_for_token
        asset.save()
        return new_price_for_token


    def scan(self):
        try:
            for asset in LimitAsset.objects.filter(active=True):
                # print(asset)
                if asset.status not in ('pending','failed','executed'):
                    if asset.status=='stopped':
                        asset.status='running'
                    if asset.type=='buy':
                        price_for_qnty=self.follower.get_out_qnty_by_path(int(asset.qnty),
                                                                            [self.follower.weth_addr,asset.asset.addr,  ])
                        price_per_token = int(asset.qnty)/10**(18-asset.asset.decimals)/price_for_qnty
                        asset.curr_price = price_per_token
                        if asset.price>=asset.curr_price:
                            qnty_slippage=int(price_for_qnty*(1-(asset.slippage)/100))
                            self.get_gas_price()
                            gas_price = (int(self.fast_gas))+(asset.gas_plus) *10**9
                            our_tx=self.swap_exact_token_to_token(None,[self.follower.weth_addr,asset.asset.addr],int(asset.qnty),qnty_slippage,gas_price=gas_price,fee_support=False)
                            # print(our_tx.hex())
                            if our_tx is None:
                                asset.status='failed'
                                msg=f'limit order failed: token {asset.asset.name}, side {asset.type}'
                                logger.info(msg)
                                self.send_msg_to_subscriber_tlg(msg)
                            else:
                                asset.tx_hash=our_tx
                                asset.status='pending'
                                asset.active=False
                                msg = f'limit order triggered: token {asset.asset.name}, side {asset.type}'
                                logger.info(msg)
                                self.send_msg_to_subscriber_tlg(msg)

                    else:
                        price_for_qnty = self.follower.get_out_qnty_by_path(int(asset.qnty),
                                                                            [asset.asset.addr, self.follower.weth_addr, ])
                        price_per_token = price_for_qnty / int(asset.qnty)/10**(18-asset.asset.decimals)
                        asset.curr_price = price_per_token
                        if asset.price<=asset.curr_price:
                            qnty_slippage = int(price_for_qnty * (1 - (asset.slippage) / 100))
                            self.get_gas_price()
                            gas_price = (int(self.fast_gas)) + (asset.gas_plus) * 10 ** 9
                            our_tx = self.swap_exact_token_to_token(None,[ asset.asset.addr,self.follower.weth_addr,],int(asset.qnty),
                                                                              qnty_slippage, gas_price=gas_price,
                                                                              fee_support=False)
                            # print(our_tx.hex())
                            if our_tx is None:
                                asset.status='failed'
                                msg = f'limit order failed: token {asset.asset.name}, side {asset.type}'
                                logger.info(msg)
                                self.send_msg_to_subscriber_tlg(msg)
                            else:
                                asset.tx_hash = our_tx
                                asset.status = 'pending'
                                asset.active = False
                                msg = f'limit order triggered: token {asset.asset.name}, side {asset.type}'
                                logger.info(msg)
                                self.send_msg_to_subscriber_tlg(msg)
                    asset.save()
                    print(price_per_token)
        except Exception as ex:
            logger.exception(f'error while executing limit order: {ex}',exc_info=True)

    def get_gas_price(self):
        try:
            self.low_gas=10*10**9
            self.medium_gas=11*10**9
            self.fast_gas=12*10**9
            self.save()
        except:
            logger.exception('cant get gas price')

    def parse_client_msg(self, msg):
        # print(msg)
        # return
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
            if net_name == 'bsc-main':
                tx_url = 'https://bscscan.com/tx/'
                mainnet = True
            else:
                tx_url = 'https://bscscan.com/tx/'
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
            to_addr=response['to_addr']
            if to_addr!='0x10ED43C718714eb63d5aA57B78B54704E256024E':
                logger.info('msg not to pancake router')
                return
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
                if LimitAsset.objects.filter(tx_hash=tx_hash):
                    limit_asset=LimitAsset.objects.get(tx_hash=tx_hash)
                    limit_asset.status='executed'
                    limit_asset.save()
                    msg=f'limit order executed: token {limit_asset.asset.name}, side {limit_asset.type}, transaction {tx_hash}'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                    self.approve_if_not(limit_asset.asset)
                    self.refresh_token_balance(token_id=limit_asset.asset.id)
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
                if DonorAsset.objects.filter(donor_tx_hash=tx_hash).exists() and DonorAsset.objects.filter(
                        donor_sell_tx_hash=tx_hash).exists():
                    new_asset = DonorAsset.objects.get(donor_tx_hash=tx_hash)
                    new_asset.donor_confirmed = True
                    new_asset.save()
                    self.refresh_token_balance(token_id=new_asset.asset.id)
                    msg = f'donor tx confirmed: {tx_url}{tx_hash}\nchange {new_asset.asset.addr}'
                    logger.info(msg)
                    new_asset.asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если конфирмед донор, то просто пишем в лог и сообщение
                elif DonorAsset.objects.filter(donor_tx_hash=tx_hash).exists():
                    for asset in DonorAsset.objects.filter(donor_tx_hash=tx_hash, donor__trade_on_confirmed=False):
                        asset.donor_confirmed = True
                        asset.save()
                        msg = f'donor tx confirmed: {tx_url}{tx_hash}\nbuy {asset.asset.addr}'
                        logger.info(msg)
                        asset.asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если донорская продалась, то сообщение, что у донора продалась
                elif DonorAsset.objects.filter(donor_sell_tx_hash=tx_hash).exists():
                    for asset in DonorAsset.objects.filter(donor_sell_tx_hash=tx_hash, donor__trade_on_confirmed=False):
                        msg = f'donor tx confirmed: {tx_url}{tx_hash}\n sell {asset.asset.addr}'
                        logger.info(msg)
                        asset.asset.wallet.send_msg_to_subscriber_tlg(msg)

                # эта проверка обязательно идет перед двумя следующими,
                # проверям, что у двух ассетов эта транзакция будет у одного в покупке, у другого в продаже
                # значит это обмен, обязательно перед, потому что оно сначала проверит, что обе совпадает, потом по одной
                elif DonorAsset.objects.filter(our_tx_hash=tx_hash).exists() and DonorAsset.objects.filter(
                        our_sell_tx_hash=tx_hash).exists():
                    # удаляем старый
                    asset = DonorAsset.objects.get(our_sell_tx_hash=tx_hash)
                    old_asset_addr = asset.asset.addr
                    old_asset = asset.asset
                    asset.delete()
                    self.refresh_token_balance(token_id=old_asset.id)
                    # подтверждаем новый
                    new_asset = DonorAsset.objects.get(our_tx_hash=tx_hash)
                    new_asset.our_confirmed = True
                    wallet = new_asset.asset.wallet

                    if new_asset.qnty is None:
                        new_asset.qnty = wallet.follower.get_asset_out_qnty_from_tx(tx_hash, new_asset.asset.addr)
                    else:
                        new_asset.qnty += int(wallet.follower.get_asset_out_qnty_from_tx(tx_hash, new_asset.asset.addr))
                    new_asset.save()
                    self.refresh_token_balance(token_id=new_asset.asset.id)
                    msg = f'Our tx *confirmed*: {tx_url}{tx_hash}\n *change* {old_asset_addr} \nfor {new_asset.asset.addr}\nnew token qnty={wallet.follower.convert_wei_to_eth(new_asset.qnty)}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.refresh_balances()
                    wallet.approve_if_not(new_asset.asset, gas_price)

                # если наша подтвердилась на покупку, берем количество токенов из транзакции, и ставим подтверждение
                elif DonorAsset.objects.filter(our_tx_hash=tx_hash).exists():
                    asset = DonorAsset.objects.get(our_tx_hash=tx_hash)
                    wallet = asset.asset.wallet
                    asset.our_confirmed = True
                    asset.qnty = wallet.follower.get_asset_out_qnty_from_tx(tx_hash, asset.asset.addr)
                    asset.save()
                    self.refresh_token_balance(token_id=asset.asset.id)
                    msg = f'Our tx *confirmed*: {tx_url}{tx_hash}\n *buy* {asset.asset.addr}\nqnty={wallet.follower.convert_wei_to_eth(asset.qnty)}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.approve_if_not(asset.asset, gas_price)
                    wallet.refresh_balances()
                # если наша подтвердилась на продажу, удаляем ассет, берем значение, за которое продалась, отправляем сооб
                elif DonorAsset.objects.filter(our_sell_tx_hash=tx_hash).exists():
                    asset = DonorAsset.objects.get(our_sell_tx_hash=tx_hash)
                    wallet = asset.asset.wallet
                    self.refresh_token_balance(token_id=asset.asset.id)
                    asset.delete()
                    qnty_out = wallet.follower.get_asset_out_qnty_from_tx(tx_hash, asset.asset.addr)
                    msg = f'Our tx *confirmed*: {tx_url}{tx_hash}\n *sell* {asset.asset.addr}\nqnty={wallet.follower.convert_wei_to_eth(qnty_out)}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.refresh_balances()
                # подтверждение аппрува
                elif Asset.objects.filter(approve_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(approve_tx_hash=tx_hash)
                    wallet = asset.asset.wallet
                    msg = f'token {asset.asset.addr} approved: {tx_url}{tx_hash}'
                    logger.info(msg)
                    wallet.send_msg_to_subscriber_tlg(msg)
                    wallet.refresh_balances()
                else:
                    msg = f'some tx confirmed: {tx_url}{tx_hash}\n addr: {from_addr}'
                    logger.info(msg)
                if from_addr==self.addr:
                    self.refresh_balances(send_msg=False)
                    # telegram_bot_sendtext(msg)



            elif response['status'] == 'failed':

                logger.debug(f'new failed tx: {response}')

                if LimitAsset.objects.filter(tx_hash=tx_hash):
                    limit_asset=LimitAsset.objects.get(tx_hash=tx_hash)
                    limit_asset.status='failed'
                    msg = f'limit order failed: token {limit_asset.asset.name}, side {limit_asset.type}, transaction {tx_hash}'
                    if limit_asset.retry_count>limit_asset.current_retry_count:
                        limit_asset.current_retry_count+=1
                        limit_asset.status='running'
                        limit_asset.active=True
                        msg = f'limit order failed: token {limit_asset.asset.name}, side {limit_asset.type}, transaction {tx_hash}, attempt {limit_asset.current_retry_count}, total attempts {limit_asset.retry_count}'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                    limit_asset.save()
                # если мы меняем один на другой, то у двух ассетов будет эта транзакция, у одного на покупку, у другого на продажу
                # на фэйлед удаляем новый, а в старом убираем хэш удаления
                if DonorAsset.objects.filter(donor_tx_hash=tx_hash).exists() and DonorAsset.objects.filter(
                        donor_sell_tx_hash=tx_hash).exists():
                    for asset in DonorAsset.objects.filter(donor_sell_tx_hash=tx_hash):
                        msg = f'donor tx failed: {tx_url}{tx_hash}\nchange {DonorAsset.objects.get(donor_sell_tx_hash=tx_hash).asset.addr} for {DonorAsset.objects.get(donor_tx_hash=tx_hash).asset.addr}'
                        logger.info(msg)
                        asset.asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если failed донор, то просто пишем в лог и сообщение, конфирмед не проставляем, типа и так ок
                elif DonorAsset.objects.filter(donor_tx_hash=tx_hash).exists():
                    for asset in DonorAsset.objects.filter(donor_tx_hash=tx_hash):
                        msg = f'donor tx failed: {tx_url}{tx_hash}\nbuy {DonorAsset.objects.get(donor_tx_hash=tx_hash).asset.addr}'
                        logger.info(msg)
                        asset.asset.wallet.send_msg_to_subscriber_tlg(msg)
                # если донорская не продалась, то сообщение, что у донора не продалась
                elif DonorAsset.objects.filter(donor_sell_tx_hash=tx_hash).exists():
                    for asset in DonorAsset.objects.filter(donor_sell_tx_hash=tx_hash):
                        msg = f'donor tx failed: {tx_url}{tx_hash}\n sell {DonorAsset.objects.get(donor_sell_tx_hash=tx_hash).asset.addr}'
                        logger.info(msg)
                        asset.asset.wallet.send_msg_to_subscriber_tlg(msg)

                # эта проверка обязательно идет перед двумя следующими,
                # проверям, что у двух ассетов эта транзакция будет у одного в покупке, у другого в продаже
                # значит это обмен, обязательно перед, потому что оно сначала проверит, что обе совпадает, потом по одной
                elif DonorAsset.objects.filter(our_tx_hash=tx_hash).exists() and DonorAsset.objects.filter(
                        our_sell_tx_hash=tx_hash).exists():
                    # на фэйлед надо удалить новый токен, а на старом убрать тх_хэш о продаже
                    # удаляем старый
                    asset = DonorAsset.objects.get(our_sell_tx_hash=tx_hash)
                    asset.our_sell_tx_hash = None
                    asset.save()

                    # подтверждаем новый
                    new_asset = DonorAsset.objects.get(our_tx_hash=tx_hash)
                    new_asset_addr = new_asset.asset.addr
                    new_asset.delete()

                    msg = f'Our tx *failed*: {tx_url}{tx_hash}\n *change* {asset.asset.addr} \nfor {new_asset_addr}'
                    logger.info(msg)
                    asset.asset.wallet.send_msg_to_subscriber_tlg(msg)


                # если наша провалилась на покупку, удаляем новый токен
                elif DonorAsset.objects.filter(our_tx_hash=tx_hash).exists():
                    asset = DonorAsset.objects.get(our_tx_hash=tx_hash)
                    asset_addr = asset.asset.addr
                    asset.delete()
                    msg = f'Our tx *failed*: {tx_url}{tx_hash}\n *buy* {asset_addr}'
                    logger.info(msg)
                    asset.asset.wallet.send_msg_to_subscriber_tlg(msg)

                # если наша провалилась на продажу, удаляем у ассета тх_хэш продажи
                elif DonorAsset.objects.filter(our_sell_tx_hash=tx_hash).exists():
                    asset = DonorAsset.objects.get(our_sell_tx_hash=tx_hash)
                    asset.our_sell_tx_hash = None
                    asset.save()
                    msg = f'Our tx *failed*: {tx_url}{tx_hash}\n *sell* {asset.asset.addr}'
                    logger.info(msg)
                    asset.asset.wallet.send_msg_to_subscriber_tlg(msg)
                # провал аппрува
                elif Asset.objects.filter(approve_tx_hash=tx_hash).exists():
                    asset = Asset.objects.get(approve_tx_hash=tx_hash)
                    asset.approve_failed = True
                    msg = f'token {asset.asset.addr} approve *failed*: {tx_url}{tx_hash}\n we will try to sell it, *so approve it manually*'
                    logger.info(msg)
                    asset.asset.wallet.send_msg_to_subscriber_tlg(msg)
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
            weth_adr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
        else:
            weth_adr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
            tx_url = test_tx_url

        our_gas_price = int(donor_gas_price * donor.gas_multiplier)
        # если in_token - weth, то это покупка
        if in_token == weth_adr:
            if Asset.objects.filter(addr=out_token,decimals__isnull=False).exists()==False:
                decimals=self.follower.get_erc_contract_by_addr(out_token).functions.decimals().call()
                asset,created=Asset.objects.get_or_create(addr=out_token,wallet_id=self.id)
                asset.decimals=decimals
                if asset.name=='' or asset.name is None:
                    name = self.follower.get_erc_contract_by_addr(out_token).functions.name().call()
                    asset.name=name
                asset.save()
            else:
                decimals=Asset.objects.get(addr=out_token,decimals__isnull=False).decimals
            # проверяем, что это не какой то юсдт
            if out_token not in [i.addr for i in self.skip_tokens.all()]:
                # покупаем, если еще не покупали за этим донором, и проходит по фильтрам
                if not DonorAsset.objects.filter(asset__addr=out_token, asset__wallet=self, donor=donor).exists():
                    # todo сделать следование в процентах от сделки
                    # устанавливаем значение, на которое торговать
                    if donor.fixed_trade:
                        my_in_token_amount = int(donor.fixed_value_trade)
                    else:
                        my_in_token_amount = None

                    # узнаем, сколько токенов за 1 эфир
                    # buyed_asset_out_for_one_ether = self.follower.get_out_qnty_by_path(10 ** 18, donor_path)

                    if in_token_amount is not None:
                        # если за конкретное кол-во эфиров, то вот сумма сделки донора в эфирах
                        donor_eth_value = in_token_amount
                        if my_in_token_amount is None:
                            my_in_token_amount = int(donor_eth_value * donor.percent_value_trade)
                        my_out_token_amount = int(self.follower.get_out_qnty_by_path(my_in_token_amount, donor_path))
                        if donor.donor_slippage:
                            slippage = self.follower.get_out_qnty_by_path(donor_eth_value, donor_path) / out_token_amount_with_slippage - 1
                        else:
                            slippage = donor.slippage

                        my_min_out_token_amount = self.follower.get_min_out_tokens(my_out_token_amount, slippage)
                    else:
                        # если не знаем, то нужно получать цену монеты по этому пути, что он купил
                        # но второй раз цену не нужно узнавать, когда мы уже сами будем покупать, поэтому
                        # из этого значения приведем к нашему

                        # мы точно знаем, сколлько токенов он купил,
                        # делим это количество на цена в эфирах за 1 токен
                        donor_eth_value = self.follower.get_in_qnty_by_path(out_token_amount, donor_path)

                        if my_in_token_amount is None:
                            my_in_token_amount = int(donor_eth_value * donor.percent_value_trade)
                        # так как цену мы уже запросили за 1 эфир, приведем к тому,
                        # сколько нам нужно, чтобы еще раз не просить
                        if donor.fixed_trade:
                            my_out_token_amount = int(self.follower.get_out_qnty_by_path(donor.fixed_value_trade, donor_path))
                        else:
                            my_out_token_amount = int(self.follower.get_out_qnty_by_path(my_in_token_amount, donor_path))
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

                            ass,created_ass=self.assets.get_or_create(addr=out_token)
                            ass.donor_assets.create( buyed_for_addr=in_token,
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
            if Asset.objects.filter(addr=in_token,decimals__isnull=False).exists()==False:
                decimals=self.follower.get_erc_contract_by_addr(out_token).functions.decimals().call()
                asset,created=Asset.objects.get_or_create(addr=out_token,wallet_id=self.id)
                asset.decimals=decimals
                if asset.name=='' or asset.name is None:
                    name = self.follower.get_erc_contract_by_addr(out_token).functions.name().call()
                    asset.name=name
                asset.save()

            if out_token in [i.addr for i in self.skip_tokens.all()]:
                msg = f'donor is trying to sell token{in_token} for {out_token}, its in skip list, we wil sell it for wBNB directly'
                logger.info(msg)
                self.send_msg_to_subscriber_tlg(msg)

                path = [in_token, weth_adr]
                out_token = weth_adr

            # продаем, если уже покупали за этим донором
            if DonorAsset.objects.filter(asset__addr=in_token, asset__wallet=self, our_confirmed=True, donor=donor).exists():
                my_in_token_amount = int(DonorAsset.objects.get(asset__addr=in_token, asset__wallet=self, donor=donor).qnty)

                # buyed_asset_out_for_one_ether = self.follower.get_out_qnty_by_path(10 ** 18, donor_path)

                my_out_token_amount = self.follower.get_out_qnty_by_path(my_in_token_amount,donor_path)

                if in_token_amount is not None:
                    # если за конкретное кол-во эфиров, то вот сумма сделки донора в эфирах
                    donor_eth_value = in_token_amount
                    if donor.donor_slippage:
                        slippage = self.follower.get_out_qnty_by_path(in_token_amount,donor_path) / out_token_amount_with_slippage - 1
                    else:
                        slippage = donor.slippage
                else:
                    # мы точно знаем, сколлько токенов он купил,
                    # делим это количество на цена в эфирах за 1 токен
                    # donor_eth_value = self.follower.get_in_qnty_by_path()
                    # так как цену мы уже запросили за 1 эфир, приведем к тому,
                    # сколько нам нужно, чтобы еще раз не просить
                    if donor.donor_slippage:
                        slippage = in_token_amount_with_slippage / self.follower.get_in_qnty_by_path(out_token_amount,donor_path) - 1
                    else:
                        slippage = donor.slippage
                my_min_out_token_amount = self.follower.get_min_out_tokens(my_out_token_amount, slippage)
                our_tx = self.swap_exact_token_to_token(donor=donor, in_token_amount=my_in_token_amount,
                                                        min_out_token_amount=my_min_out_token_amount,
                                                        path=donor_path,
                                                        gas_price=our_gas_price, fee_support=fee_support)
                if our_tx is not None:
                    msg = f'Following on {"confirmed" if donor.trade_on_confirmed else "pending"} *{donor.name}*,\nSelling  {self.follower.convert_wei_to_eth(my_in_token_amount)} Token - {out_token}\nfor not less {self.follower.convert_wei_to_eth(my_min_out_token_amount)} ether\nDonor tx - {tx_url}{tx_hash}\nOur tx {tx_url}{our_tx}'
                    asset = DonorAsset.objects.get(asset__addr=in_token, donor=donor)
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
            if Asset.objects.filter(addr=out_token,decimals__isnull=False).exists()==False:
                decimals=self.follower.get_erc_contract_by_addr(out_token).functions.decimals().call()
                asset,created=Asset.objects.get_or_create(addr=out_token,wallet_id=self.id)
                asset.decimals=decimals
                if asset.name=='' or asset.name is None:
                    name = self.follower.get_erc_contract_by_addr(out_token).functions.name().call()
                    asset.name=name
                asset.save()
            else:
                decimals=Asset.objects.get(addr=out_token,decimals__isnull=False).decimals
            # продаем, если у нас есть что продавать
            if DonorAsset.objects.filter(asset__addr=in_token, asset__wallet=self, our_confirmed=True, donor=donor).exists():
                if DonorAsset.objects.filter(asset__addr=out_token,asset__wallet=self, our_confirmed=False, donor=donor):
                    msg = f'now we are trying to buy {out_token} in another tx, so we cant change {in_token} to {out_token}, *you have to sell it manually*'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                elif DonorAsset.objects.filter(asset__addr=out_token,asset__wallet=self, our_sell_tx_hash__isnull=False, donor=donor):
                    msg = f'now we are trying to sell {out_token} in another tx, so we cant change {in_token} to {out_token}, *you have to sell it manually*'
                    logger.info(msg)
                    self.send_msg_to_subscriber_tlg(msg)
                else:
                    my_in_token_amount = int(
                        DonorAsset.objects.get(asset__addr=in_token, asset__wallet=self, donor=donor).qnty)

                    # buyed_asset_out_for_one_ether = self.follower.get_out_qnty_by_path(10 ** 18, donor_path)

                    my_out_token_amount = self.follower.get_out_qnty_by_path(my_in_token_amount,donor_path)

                    if in_token_amount is not None:
                        # если за конкретное кол-во эфиров, то вот сумма сделки донора в эфирах
                        donor_eth_value = in_token_amount
                        if donor.donor_slippage:
                            slippage = self.follower.get_out_qnty_by_path(in_token_amount,donor_path) / out_token_amount_with_slippage - 1
                        else:
                            slippage = donor.slippage
                    else:
                        # мы точно знаем, сколлько токенов он купил,
                        # делим это количество на цена в эфирах за 1 токен
                        # donor_eth_value = self.follower.get_out_qnty_by_path()
                        # так как цену мы уже запросили за 1 эфир, приведем к тому,
                        # сколько нам нужно, чтобы еще раз не просить
                        if donor.donor_slippage:
                            slippage = in_token_amount_with_slippage / self.follower.get_in_qnty_by_path(out_token_amount,donor_path) - 1
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
                        asset = DonorAsset.objects.get(asset__addr=in_token,asset__wallet=self, donor=donor)
                        asset.donor_sell_tx_hash = tx_hash
                        asset.our_sell_tx_hash = our_tx
                        asset.donor_confirmed = donor.trade_on_confirmed
                        asset.save()
                        # создаем новый asset, который покупаем, либо берем существующий
                        new_asset, created = self.assets.get_or_create(addr=out_token)[0].donor_assets.get_or_create( donor=donor)
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
            if asset==-1:
                allowance = self.follower.get_allowance(self.follower.weth_addr)
                if allowance < int(10**20) or (allowance == 0):
                    if asset == -1:
                        appr_tx = self.follower.approve(self.follower.weth_addr, gas_price=gas_price)
                    msg = f'approve tx sent: tx_url{appr_tx}'
                    logger.info(msg)
                    telegram_bot_sendtext(msg)
                    return appr_tx
                else:
                    return None
            else:
                allowance=self.follower.get_allowance(asset.addr)
            if allowance < int(asset.balance) or (allowance==0):
                if asset == -1:
                    appr_tx = self.follower.approve(self.follower.weth_addr, gas_price=gas_price)
                else:
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
            hex_tx=None
            # всегда передаем в аргумент фолловера, ему нужно присвоить правильные ключи, чтобы он торговал с этого акка

            # выставляем значение, на которое торгуем: если покупаем за эфир, то in_token_amount=self.fixed_value_trade
            # иначе ошибка

            if self.follower.weth_addr == path[0]:
                if int(self.weth_balance) < in_token_amount:
                    raise FollowSwapsErr('Not enough wBNB to follow')

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


            except FollowSwapsErr as ex:
                logger.error(ex)
                self.send_msg_to_subscriber_tlg(str(ex))

            except Exception as ex:
                logger.exception(ex, exc_info=True)
                if 'insufficient funds for gas * price + value' in str(ex):
                    self.send_msg_to_subscriber_tlg(' error, not enough BNB to pay for gas most probably')
                    raise LowBalance('Not enough BNB for gas')

                else:
                    raise ex
            finally:
                return hex_tx

        except FollowSwapsErr as ex:
            logger.error(ex)
            self.send_msg_to_subscriber_tlg(ex)

        except Exception as ex:
            logger.exception(ex, exc_info=True)
            self.send_msg_to_subscriber_tlg('unknown error, stop bot please and message admins')

class Asset(models.Model):

    addr = models.CharField(max_length=128, null=False)
    name = models.CharField(max_length=128, null=False)
    balance=models.CharField(max_length=128,null=False,default='0')
    decimals=models.IntegerField(null=True)
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='assets')
    price_for_token=models.FloatField(null=True)
    approve_tx_hash = models.CharField(max_length=128, null=True)
    # def save(self,*args,**kwargs):
    #     if self.decimals is None:
    #         self.decimals = self.wallet.follower.get_erc_contract_by_addr(self.addr).functions.decimals().call()
    #     if self.name is None:
    #         self.name = self.wallet.follower.get_erc_contract_by_addr(self.addr).functions.name().call()
    #     super().save(*args,**kwargs)


    def clean(self):
        if self.decimals is None:
            self.decimals=self.wallet.follower.get_erc_contract_by_addr(self.addr).functions.decimals().call()
class LimitAsset(models.Model):
    slippage = models.FloatField(default=5, )
    asset=models.ForeignKey(Asset,on_delete=models.CASCADE,related_name='limit_assets')
    price=models.FloatField(null=False )
    curr_price = models.FloatField(null=True)
    qnty=models.CharField(max_length=128,null=False )
    active=models.BooleanField(default=False)
    gas_plus=models.IntegerField(default=0)
    retry_count=models.IntegerField(default=0)
    current_retry_count=models.IntegerField(default=0)
    tx_hash=models.CharField(max_length=128,null=True )
    type=models.CharField(choices=[('buy','buy'),('sell','sell'),('stop loss','stop loss'),('take profit','take profit')],max_length=128)
    status=models.CharField(choices=[('running','running'),('stopped','stopped'),('failed','failed'),('pending','pending'),('executed','executed')],max_length=128)



class DonorAsset(models.Model):

    asset=models.ForeignKey(Asset,on_delete=models.CASCADE,related_name='donor_assets')
    buyed_for_addr = models.CharField(max_length=128, null=False)
    qnty = models.CharField(null=True, max_length=100)
    buyed_for_qnty = models.CharField(null=True, max_length=100)
    donor_tx_hash = models.CharField(max_length=128, null=False)
    donor_sell_tx_hash = models.CharField(max_length=128, null=True)
    our_tx_hash = models.CharField(max_length=128, null=False)
    our_sell_tx_hash = models.CharField(max_length=128, null=True)
    approve_failed = models.BooleanField(default=False)
    donor_confirmed = models.BooleanField(default=False)
    our_confirmed = models.BooleanField(default=False)

    donor = models.ForeignKey(DonorAddr, on_delete=models.CASCADE, related_name='assets')
    attemts = models.IntegerField(null=True)

    # todo везде такое сделать

    def clean(self):
        self.addr = web3.main.to_checksum_address(self.addr)

    class Meta:
        unique_together = ['asset', 'donor']
