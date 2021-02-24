# Create your views here.
import os

os.environ['DJANGO_SETTINGS_MODULE'] = "FollowSwaps.settings"
import django

django.setup()
# Create your views here.
from django.shortcuts import render, HttpResponse
from websocket import create_connection
from django.http import HttpResponse, JsonResponse
from rest_framework import status
from .models import Wallet,DonorAddr,Asset,addr,key
from rest_framework.decorators import api_view
from .serializers import DonorSerializer,WalletSerializer
from .utils import sign_message,logger
import multiprocessing
from rest_framework.parsers import JSONParser
import json
import hashlib
import time
import web3
from django.views.decorators.csrf import ensure_csrf_cookie


def socket():
    server_ws_url = f"wss://followswaps.com/ws/{addr}/"
    ws = create_connection(server_ws_url, )
    msg={"action":"logon",'subscriber':addr,'donors':[i.addr for i in Wallet.objects.get(addr=addr).donors.all()]}
    _,signed_msg=sign_message(str(msg), key)
    ws.send(json.dumps({'msg':msg,"hash":signed_msg}))
    err=False
    global new_process
    while 1:
        if ws.connected:
            if err==True:
                Wallet.objects.get(addr=addr, key=key).send_msg_to_subscriber_tlg(' socket was reconnected')
                err=False
            try:
                msg = ws.recv()
                logger.info(msg)

                w = Wallet.objects.get(addr=addr,key=key)
                if msg=='Low balance':
                    w.active=False
                    w.send_msg_to_subscriber_tlg(' stopped, low balance')
                    w.refresh_balances()
                    w.save()
                    return
                if msg.startswith('Failed'):
                    w.active = False
                    w.send_msg_to_subscriber_tlg(f' stopped, {msg}')
                    w.save()
                    return
                if msg=='success':
                    pass
                else:
                    try:
                        w.parse_client_msg(msg)
                    except:
                        logger.exception(f'wrong message: {msg}')

            except Exception as ex:
                logger.exception(ex,exc_info=True)
                if err==False:
                    Wallet.objects.get(addr=addr, key=key).send_msg_to_subscriber_tlg('error with socket connection, we are trying to reconnect')
                    err=True
        else:
            logger.info('trying to reconnect to socket')
            try:
                ws = create_connection(server_ws_url, )
                msg = {"action": "logon", 'subscriber': addr,
                       'donors': [i.addr for i in Wallet.objects.get(addr=addr).donors.all()]}
                _, signed_msg = sign_message(str(msg), key)
                ws.send(json.dumps({'msg': msg, "hash": signed_msg}))
            except :
                pass
            time.sleep(15)


# if Wallet.objects.get(addr=addr,key=key).active==False:
new_process=None
# else:
#     new_process = multiprocessing.Process(target=socket)
#     new_process.start()

@ensure_csrf_cookie
def index(request):
    if Wallet.objects.filter(addr=addr, key=key).exists() == False:
        Wallet.objects.create(addr=addr, key=key, key_hash=hashlib.md5(key.encode('utf-8')).hexdigest(),
                              max_gas=str(500 * 10 ** 9))
    w = Wallet.objects.get(addr=addr, key=key)
    w.refresh_balances(send_msg=False)
    w.active = False
    w.save()
    return render(request, 'index.html')


@api_view(['POST'])
def get_wallet(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']

    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'addr': ['invalid address']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'key': ['invalid key for address']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
        serializer = WalletSerializer(instance=wallet)
        return JsonResponse(serializer.data, status=200)


@api_view(['POST'])
def update_wallet(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']

    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'addr': ['invalid address']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'key': ['invalid key for address']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
        if wallet.initial_state==True:
            data['initial_state']=False
        serializer = WalletSerializer(instance=wallet, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def update_donor(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    try:
        donor_addr = web3.main.to_checksum_address(data['donor']['addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)



    key_hash = data['key_hash']
    data['donor']['addr']=donor_addr
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
        data['donor']['wallet']=wallet.id
        if data['donor']['id'] != -2:
            if wallet.donors.filter(pk=data['donor']['id']).exists():
                donor = wallet.donors.get(pk=data['donor']['id'])
                serializer = DonorSerializer(instance=donor, data=data['donor'])
                if serializer.is_valid():
                    serializer.save()
                    wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
                    wallet.send_msg_to_subscriber_tlg( f'donor *{donor.name}* was updated')
                    return JsonResponse(wallet_ser.data, status=200)
                else:
                    return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return JsonResponse({'non_field_errors': ['donor does not exists']}, status=400)
        else:
            serializer = DonorSerializer(data=data['donor'])
            if serializer.is_valid():
                serializer.save()
                wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
                wallet.send_msg_to_subscriber_tlg(f' donor *{donor_addr}* was created')
                return JsonResponse(wallet_ser.data, status=200)
            else:
                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def delete_donor(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    try:
        donor_addr = web3.main.to_checksum_address(data['donor_addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:

        if DonorAddr.objects.filter(addr=donor_addr).exists():
            DonorAddr.objects.get(addr=donor_addr).delete()
            Wallet.objects.get(addr=addr, key_hash=key_hash).send_msg_to_subscriber_tlg(f' donor *{donor_addr}* was deleted')
        else:
            return JsonResponse({'non_field_errors': ['donor does not exists']}, status=400)

        wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        return JsonResponse(wallet_ser.data, status=200)


@api_view(['POST'])
def start_stop(request):

    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)

    key_hash = data['key_hash']

    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address, update wallet information.']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for address, update wallet information.']}, status=400)

    w=Wallet.objects.get(addr=addr)
    if w.initial_state==True:
        return JsonResponse({'non_field_errors': ['Seems like it\'s you first start, update all fields for your wallet and add donors first']}, status=400)
    w.refresh_balances(send_msg=False)


    if w.active==False:
        if w.weth_balance==0 or w.weth_balance is None:
            return JsonResponse({'non_field_errors': ['You don\'t have weth on your wallet. The bot trade weth only.']}, status=400)

        if w.follower.get_allowance(w.follower.weth_addr) < 10**20:
            return JsonResponse({'non_field_errors': ['Please approve weth on uniswap. The bot trade weth only.']}, status=400)

    global new_process
    if w.active==False:
        w.active = True
        w.save()
        if new_process is not None:
            try:
                new_process.terminate()
            except:
                pass
        new_process = multiprocessing.Process(target=socket)
        new_process.start()

    else:
        w.active = False
        w.save()
        if new_process is not None:
            try:
                new_process.terminate()
            except:
                pass
            new_process=None
        # ws.connected = True
        # ws.connect("ws://127.0.0.1:8001/ws/chat/qwe/")
        # ws.send(json.dumps({'message': 'run'}))
    if w.active==True:
        w.send_msg_to_subscriber_tlg(' started')
    else:
        w.send_msg_to_subscriber_tlg(' stopped')
    return JsonResponse({'active':w.active}, status=status.HTTP_200_OK)
