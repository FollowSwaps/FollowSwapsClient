import requests
import logging
from .uniswap import Uniswap
from logging.handlers import RotatingFileHandler
from web3.auto import w3
from eth_account.messages import encode_defunct
import json


def sign_message(msg, key):
    message = encode_defunct(text=msg)
    signed = w3.eth.account.sign_message(message, private_key=key)
    return msg, signed.signature.hex()


def get_signer(msg, signature):
    message = encode_defunct(text=msg)
    return w3.eth.account.recover_message(message, signature=signature)


def telegram_bot_sendtext(bot_message, bot_chatID=-1001217489815):
    bot_token = '1556903063:AAGZaP6aNP-zrq6NUeMCBLjxQNSjzA4Eoe8'
    send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + str(
        int(bot_chatID)) + '&parse_mode=Markdown&text=' + bot_message

    response = requests.get(send_text)
    return response.json()


def get_balances_eth_weth_waps(addr, key, mainnet, follower, w3=None):
    if follower is None:
        follower = Uniswap(addr, key, provider=w3, mainnet=mainnet)

    weth_balance = follower.weth_contr.functions.balanceOf(addr).call()
    eth_balance = follower.provider.eth.getBalance(addr)
    waps_balance = follower.waps_contr.functions.balanceOf(addr).call()

    return eth_balance, weth_balance, waps_balance



logger = logging.getLogger('FollowSwaps')
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
ch.setFormatter(formatter)
fh = RotatingFileHandler('log', mode='a', encoding='utf-8', maxBytes=1024*1024* 50, backupCount=5)
fh.setLevel(logging.DEBUG)
fh.setFormatter(formatter)
logger.addHandler(ch)
logger.addHandler(fh)

allowed_methods = [
    'swapExactETHForTokens', 'swapExactETHForTokensSupportingFeeOnTransferTokens', 'swapETHForExactTokens',
    'swapExactTokensForETH', 'swapExactTokensForETHSupportingFeeOnTransferTokens', 'swapTokensForExactETH',
    'swapExactTokensForTokens', 'swapExactTokensForTokensSupportingFeeOnTransferTokens', 'swapTokensForExactTokens'
]


def parse_msg(request):
    response = json.loads(request.body)
    net_name = response['network']
    addr_uni = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    from_addr = response['from']
    to_addr = response['to']
    tx_hash = response['hash']
    response_status = response['status']
    gas = int(response['gas'])
    gas_price = int(int(response['gasPrice']))
    if to_addr == addr_uni:
        method = response.get('contractCall', {}).get('methodName', None)
        if method in allowed_methods:
            fee = False
            if 'SupportingFeeOnTransferTokens' in method:
                fee = True
            if method in allowed_methods:

                path = response['contractCall']['params']['path']
                # находим какие токены меняли, и их количество
                in_token = path[0]
                out_token = path[-1]

                # количество входного токена, и его количество со слиппадж
                in_token_amount = None
                in_token_amount_with_slippage = None

                # количество выходного токена, и его количество со слиппадж
                out_token_amount = None
                out_token_amount_with_slippage = None

                check_method= method.replace('SupportingFeeOnTransferTokens','')

                if check_method == 'swapExactETHForTokens':
                    in_token_amount = int(response['value'])
                    out_token_amount_with_slippage = int(response['contractCall']['params']['amountOutMin'])

                elif check_method == 'swapETHForExactTokens':
                    in_token_amount_with_slippage = int(response['value'])
                    out_token_amount = int(response['contractCall']['params']['amountOut'])

                elif check_method in ('swapExactTokensForETH', 'swapExactTokensForTokens'):
                    in_token_amount = int(response['contractCall']['params']['amountIn'])
                    out_token_amount_with_slippage = int(response['contractCall']['params']['amountOutMin'])
                elif check_method in ('swapTokensForExactETH', 'swapTokensForExactTokens'):
                    in_token_amount_with_slippage = int(response['contractCall']['params']['amountInMax'])
                    out_token_amount = int(response['contractCall']['params']['amountOut'])
                else:
                    raise Exception('unknown error')
                return {'gas':gas,'gas_price':gas_price,'tx_hash':tx_hash,'from':from_addr,'net_name':net_name,'status':response_status,
                        'method': method,'path':path,
                        'in_token_amount': in_token_amount,
                        'in_token_amount_with_slippage': in_token_amount_with_slippage,
                         'out_token_amount': out_token_amount,
                        'out_token_amount_with_slippage': out_token_amount_with_slippage,'fee': fee}
            else:
                return None
        else:
            return None
    else:
        return None


