import requests
import logging
from logging.handlers import RotatingFileHandler
from WapsClient.uniswap import Uniswap
from WapsClient.logger import logger

import web3
from web3.auto import w3
from eth_account.messages import encode_defunct
import json


with open('settings.txt', 'r') as f:
    lines = [i.replace('\n', '') for i in f.readlines()]
    for line in lines:
        if line.startswith('ADDR='):
            addr = line[len('ADDR='):]
        if line.startswith('KEY='):
            key = line[len('KEY='):]
        if line.startswith('INFURA_ID='):
            infura_id = line[len('INFURA_ID='):]
        if line.startswith('TELEGRAM_TOKEN_HTTP_API='):
            telegram_id = line[len('TELEGRAM_TOKEN_HTTP_API='):]


def sign_message(msg, key):
    message = encode_defunct(text=msg)
    signed = w3.eth.account.sign_message(message, private_key=key)
    return msg, signed.signature.hex()


def get_signer(msg, signature):
    message = encode_defunct(text=msg)
    return w3.eth.account.recover_message(message, signature=signature)


def telegram_bot_sendtext(bot_message, bot_chatID=-1001217489815):
    try:
        if bot_chatID is None or telegram_id is None or telegram_id=='':
            return None
        bot_token = telegram_id
        send_text = 'https://api.telegram.org/bot' + bot_token + '/sendMessage?chat_id=' + str(
            int(bot_chatID)) + '&parse_mode=Markdown&text=' + bot_message
        response = requests.get(send_text)
        return response.json()
    except Exception as ex:
        logger.exception(ex,exc_info=True)

def get_balances_eth_weth_waps(addr, key, mainnet, follower, w3=None):
    if follower is None:
        follower = Uniswap(addr, key, provider=w3, mainnet=mainnet)

    weth_balance = follower.weth_contr.functions.balanceOf(addr).call()
    eth_balance = follower.provider.eth.getBalance(addr)
    waps_balance = follower.waps_contr.functions.balanceOf(addr).call()

    return eth_balance, weth_balance, waps_balance





allowed_methods = [
    'swapExactETHForTokens', 'swapExactETHForTokensSupportingFeeOnTransferTokens', 'swapETHForExactTokens',
    'swapExactTokensForETH', 'swapExactTokensForETHSupportingFeeOnTransferTokens', 'swapTokensForExactETH',
    'swapExactTokensForTokens', 'swapExactTokensForTokensSupportingFeeOnTransferTokens', 'swapTokensForExactTokens'
]


def parse_msg(request):
    response = json.loads(request)
    net_name = response['network']
    addr_uni = "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F"
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



def parse_msg_bsc(request,contr,w):
    try:
        logger.info(request)
        response = json.loads(request).get('result',{})
        net_name = 'main'
        addr_uni = "0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F"
        from_addr = response['from']
        to_addr = response['to']
        tx_hash = response['hash']
        if response['blockNumber'] is None:
            response_status = 'pending'
        else:
            receipt=w.follower.provider.eth.getTransactionReceipt(tx_hash)
            if receipt['status']==1:
                response_status='confirmed'
            else:
                response_status = 'failed'
        gas = int(response['gas'],0)
        gas_price = int(response['gasPrice'],0)
        input=contr.decode_function_input(response['input'])
        method = input[0].fn_name
        if method in allowed_methods:
            fee = False
            if 'SupportingFeeOnTransferTokens' in method:
                fee = True
            if method in allowed_methods:

                path = input[1]['path']
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
                    print(response)
                    in_token_amount = int(response['value'],0)
                    out_token_amount_with_slippage = int(input[1]['amountOutMin'])

                elif check_method == 'swapETHForExactTokens':
                    in_token_amount_with_slippage = int(response['value'],0)
                    out_token_amount = int(input[1]['amountOut'])

                elif check_method in ('swapExactTokensForETH', 'swapExactTokensForTokens'):
                    in_token_amount = int(input[1]['amountIn'])
                    out_token_amount_with_slippage = int(input[1]['amountOutMin'])
                elif check_method in ('swapTokensForExactETH', 'swapTokensForExactTokens'):
                    in_token_amount_with_slippage = int(input[1]['amountInMax'])
                    out_token_amount = int(input[1]['amountOut'])
                else:
                    raise Exception('unknown error')
                return {'gas':gas,'gas_price':gas_price,'tx_hash':tx_hash,'from':web3.Web3.toChecksumAddress(from_addr),'net_name':net_name,'status':response_status,
                        'method': method,'path':path,
                        'in_token_amount': in_token_amount,
                        'in_token_amount_with_slippage': in_token_amount_with_slippage,
                         'out_token_amount': out_token_amount,
                        'out_token_amount_with_slippage': out_token_amount_with_slippage,'fee': fee}
            else:
                return None
        else:
            return None
    except Exception as ex:
        logger.exception(ex,exc_info=True)


