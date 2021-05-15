import json
import web3
import datetime
from WapsClient.logger import logger

class Uniswap():

    @staticmethod
    def convert_wei_to_eth(wei):
        return web3.Web3.fromWei(wei, 'ether')

    @staticmethod
    def convert_eth_to_wei(wei):
        return web3.Web3.toWei(wei, 'ether')

    @staticmethod
    def get_default_deadline():
        return int(datetime.datetime.now().timestamp() + 180)

    def get_asset_out_qnty_from_tx(self,tx,token_addr):
        ''' по транзакции ищем количество монет, которое вывелось в конечном счете с контракта юнисвопа'''
        err=0
        while err==0:
            print(1)
            try:
                tx_rec=self.provider.eth.getTransactionReceipt(tx)
                err=1
            except:
                err=0
        for i in tx_rec['logs']:
            if i['address']==token_addr and any([j.hex().endswith(tx_rec['from'].lower()[2:]) for j in i['topics'] ]):
                amount=int(i['data'],0)
                return int(amount)
        return None

    def get_erc_contract_by_addr(self,addr):
        if addr==self.waps_addr:
            from WapsClient.models import w3_mainnet
            contr = w3_mainnet.eth.contract(address=w3_mainnet.toChecksumAddress(addr),
                                               abi=self.erc_20_abi)
        else:
            contr = self.provider.eth.contract(address=self.provider.toChecksumAddress(addr),
                                           abi=self.erc_20_abi)
        return contr

    def __init__(self, addr, key, provider: web3, mainnet=False, slippage=0.05):

        # адрес с которого что то делаем
        self.addr = addr

        # ключ от этого кошелька
        # todo убрать адрес, заменить импортом по ключу
        self.key = key

        # допустимая просадка в цене - коэф 0-1
        self.slippage = slippage

        # объект web3 через который коннектиться
        self.provider = provider

        # для всей хуйни мира берем аби контракта ерц20
        with open("erc20.abi") as f:
            self.erc_20_abi = json.load(f)

        if mainnet:
            self.weth_addr = self.provider.toChecksumAddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")
        else:
            self.weth_addr = self.provider.toChecksumAddress("0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c")

        # контракт ветх, чтобы баланс и всякое такое
        self.weth_contr = provider.eth.contract(self.weth_addr, abi=self.erc_20_abi)


        self.waps_addr='0x0c79b8f01d6f0dd7ca8c98477ebf0998e1dbaf91'
        self.waps_contr=self.get_erc_contract_by_addr(self.waps_addr)

        # адрес роутера юнисвопа
        self.uni_adr = '0x10ED43C718714eb63d5aA57B78B54704E256024E'

        # abi роутера юнисвопа
        abi = '[{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WETH","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WETH","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]'

        # контракт юнисвопа, через который уже можно шо то делать
        self.uni_contract = provider.eth.contract(self.uni_adr, abi=abi)



    def get_out_qnty_by_path(self, amount, path):
        ''' количество токенов path[-1], которое мы получим, отдав amount количества токенов path[0]
        типа сколько мы получим токенов, если обменяем какое то количество по пути
        SwapExactTokensForTokens'''
        try:
            return self.uni_contract.functions.getAmountsOut(int(amount),
                                                         path).call()[-1]
        except Exception as ex:
            print(ex)
            return None
    def get_in_qnty_by_path(self, amount, path):
        '''количество токенов path[0], которое нам нужно, чтобы получить amount токенов path[-1]
        типа сколько нам нужно токенов а, чтобы получить конкретное количество токенов б по пути path
        SwapTokensForExactTokens'''

        return self.uni_contract.functions.getAmountsIn(int(amount),
                                                        path).call()[0]

    def get_min_out_tokens(self, price,slippage):
        ''' минимальное количество токенов, которое мы получим с slippage'''
        return int(price / (1 + slippage))

    def get_max_in_tokens(self, price,slippage):
        ''' максимальное количество токенов, которое нам нужно для покупки с slippage'''
        return int(price / (1 - slippage))

    def _create_exact_token_for_token_tx(self, in_token_amount, min_out_token_amount, path, deadline,fee_support=True ):
        ''' создаем транзакцию на обмен конкретного количества токена на эфир
        все аргументы обязательные, так как эта функция в самом низу вызовов, сюда может обрашаться только другой метод'''

        # создаем транзакцию через функцию контракта роутера
        if fee_support==False:
            tx = self.uni_contract.functions.swapExactTokensForTokens(int(in_token_amount), int(min_out_token_amount), path,
                                                                  self.addr,
                                                                  deadline, )
        else:
            tx=self.uni_contract.functions.swapExactTokensForTokensSupportingFeeOnTransferTokens(int(in_token_amount), int(min_out_token_amount), path,
                                                                  self.addr,
                                                                  deadline, )
        return tx

    def _create_token_for_exact_token_tx(self, max_in_token_amount, out_token_amount, path, deadline,):
        ''' создаем транзакцию на обмен  токена на конкретное количества другого токена'''


        # создаем транзакцию через функцию контракта роутера
        tx = self.uni_contract.functions.swapTokensForExactTokens(int(out_token_amount), int(max_in_token_amount), path,
                                                                  self.addr,
                                                                  deadline, )
        return tx


    def swap_exact_token_for_token(self, in_token_amount, path, min_out_token_amount,
                                   deadline=None, gas=320000,
                                   gas_price=None,fee_support=True):
        ''' отправить транзакцию на обмен конкретного количества эфиров на токен'''
        # устанавливаем дедлайн
        try:
            if deadline is None:
                deadline = self.get_default_deadline()

            # создаем транзакцию
            tx = self._create_exact_token_for_token_tx(in_token_amount, min_out_token_amount, path,
                                                       deadline=deadline,fee_support=fee_support )

            # добавляем всякую хуйню типа нонсе,газ и проч
            b_tx = self.build_tx(tx, gas=gas, gas_price=gas_price)

            # подписали транзакцию ключом
            signed_tx = self.sign_row_tx(b_tx)
            # исполнили
            return self.send_signed_raw_tx(signed_tx)
        except Exception as ex:
            logger.exception(ex)
            raise ex


    def swap_token_for_exact_token(self, out_token_amount, path, max_in_token_amount=None,
                                   deadline=None, gas=320000,
                                   gas_price=None):
        ''' отправить транзакцию на обмен конкретного количества эфиров на токен'''
        # устанавливаем дедлайн
        if deadline is None:
            deadline = self.get_default_deadline()

        # создаем транзакцию
        tx = self._create_token_for_exact_token_tx(max_in_token_amount, out_token_amount, path,
                                                   deadline=deadline, )

        # добавляем всякую хуйню типа нонсе,газ и проч
        b_tx = self.build_tx(tx, gas=gas, gas_price=gas_price)

        signed_tx = self.sign_row_tx(b_tx)

        return self.send_signed_raw_tx(signed_tx)

    def build_tx(self, tx, gas, gas_price):
        # добавляем в транзакцию обязательные поля


        b_tx = tx.buildTransaction({'from': self.addr, 'gas': gas,
                                    'gasPrice': gas_price,
                                    'nonce': self.provider.eth.getTransactionCount(self.addr),
                                    })
        return b_tx

    def sign_row_tx(self, tx):
        ''' подписываем транзакцию нашим ключом'''
        s_tx = self.provider.eth.account.sign_transaction(tx,
                                                          private_key=self.key)
        return s_tx

    def send_signed_raw_tx(self, tx):
        ''' отпаравляем уже подписанную транзакцию'''
        return self.provider.eth.sendRawTransaction(tx.rawTransaction)

    def get_allowance(self, contr_addr):
        contr = self.get_erc_contract_by_addr(contr_addr)
        return contr.functions.allowance(self.addr, self.uni_adr).call()

    def approve(self, contr_addr,gas_price,value=None):
        contr = self.get_erc_contract_by_addr(contr_addr)
        if value is None:
            value=115792089237316195423570985008687907853269984665640564039457584007913129639935
        tx = contr.functions.approve(self.uni_adr, value)
        b_tx = self.build_tx(tx,gas= 300000,gas_price=gas_price)
        signed_tx = self.sign_row_tx(b_tx)
        return self.send_signed_raw_tx(signed_tx).hex()
