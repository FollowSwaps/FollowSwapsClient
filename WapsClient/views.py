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
from .models import Wallet, DonorAddr, Asset, addr, key, SkipTokens,DonorAsset,LimitAsset
from rest_framework.decorators import api_view
from .serializers import DonorSerializer, WalletSerializer, DonorAssetSerializer, SkipTokensSerializer,LimitAssetSerializer, tempSer
from .utils import sign_message
from WapsClient.logger import logger
import multiprocessing
from rest_framework.parsers import JSONParser
import json
import hashlib
import time
import web3
from django.views.decorators.csrf import ensure_csrf_cookie
import websockets
import asyncio
from asgiref.sync import sync_to_async

def socket():
    donors=[i.addr for i in Wallet.objects.get(addr=addr).donors.all()]
    w = Wallet.objects.get(addr=addr, key=key)
    for asset in Asset.objects.filter(decimals__isnull=True):
        asset.save()
    async def limits():
        while 1:
            # print('start limit')
            await sync_to_async(w.scan)()
            await asyncio.sleep(3)


    async def hello():
        uri = f"wss://followswaps.com/ws/{addr}/"
        conn_msg = {"action": "logon", 'subscriber': addr,
               'donors': donors}
        _, signed_msg = sign_message(str(conn_msg), key)
        async with websockets.connect(uri) as ws:


            await ws.send(json.dumps({'msg': conn_msg, "hash": signed_msg}))
            err = False
            while 1:
                if ws.closed==False:
                    if err == True:
                        sync_to_async(w.send_msg_to_subscriber_tlg)(' socket was reconnected')
                        err = False
                    try:
                        msg = await ws.recv()
                        logger.info(msg)


                        if msg == 'Low balance':
                            w.active = False
                            w.send_msg_to_subscriber_tlg(' stopped, low balance')
                            w.refresh_balances()
                            w.save()
                            return
                        if msg.startswith('Failed'):
                            w.active = False
                            w.send_msg_to_subscriber_tlg(f' stopped, {msg}')
                            w.save()
                            return
                        if msg == 'success':
                            pass
                            asyncio.ensure_future(limits())
                        else:
                            try:
                                await sync_to_async(w.parse_client_msg)(msg)
                            except:
                                logger.exception(f'wrong message: {msg}')

                    except Exception as ex:
                        logger.exception(ex, exc_info=True)

                        if err == False:
                            w.send_msg_to_subscriber_tlg(
                                'error with socket connection, we are trying to reconnect')
                            err = True
                        else:
                            logger.info('trying to reconnect to socket')
                            try:
                                ws=await websockets.connect(uri)
                                await ws.send(json.dumps({'msg': conn_msg, "hash": signed_msg}))

                                msg = await ws.recv()
                                logger.info(msg)

                                if msg == 'Low balance':
                                    w.active = False
                                    w.send_msg_to_subscriber_tlg(' stopped, low balance')
                                    w.refresh_balances()
                                    w.save()
                                    return
                                if msg.startswith('Failed'):
                                    w.active = False
                                    w.send_msg_to_subscriber_tlg(f' stopped, {msg}')
                                    w.save()
                                    return
                                if msg == 'success':
                                    pass
                                    asyncio.ensure_future(limits())
                                else:
                                    try:
                                        await sync_to_async(w.parse_client_msg)(msg)
                                    except:
                                        logger.exception(f'wrong message: {msg}')


                            except:
                                pass
                            time.sleep(15)
                else:
                    if err == False:
                        w.send_msg_to_subscriber_tlg(
                            'error with socket connection, we are trying to reconnect')
                        err = True
                    else:
                        logger.info('trying to reconnect to socket')
                        try:
                            ws=await websockets.connect(uri)
                            print('123',ws.closed)
                            await ws.send(json.dumps({'msg': conn_msg, "hash": signed_msg}))

                            msg = await ws.recv()
                            logger.info(msg)

                            if msg == 'Low balance':
                                w.active = False
                                w.send_msg_to_subscriber_tlg(' stopped, low balance')
                                w.refresh_balances()
                                w.save()
                                return
                            if msg.startswith('Failed'):
                                w.active = False
                                w.send_msg_to_subscriber_tlg(f' stopped, {msg}')
                                w.save()
                                return
                            if msg == 'success':
                                pass
                                asyncio.ensure_future(limits())
                            else:
                                try:
                                    await sync_to_async(w.parse_client_msg)(msg)
                                except:
                                    logger.exception(f'wrong message: {msg}')


                        except Exception as ex:
                            logger.exception(ex,exc_info=True)
                            pass
                        time.sleep(15)
    loop=asyncio.new_event_loop()
    loop.run_until_complete(hello())



    global new_process


# if Wallet.objects.get(addr=addr,key=key).active==False:
new_process = None


# else:
#     new_process = multiprocessing.Process(target=socket)
#     new_process.start()

@ensure_csrf_cookie
def index(request):
    if Wallet.objects.filter(addr=addr, key=key).exists() == False:
        Wallet.objects.create(addr=addr, key=key, key_hash=hashlib.md5(key.encode('utf-8')).hexdigest(),
                              max_gas=str(500 * 10 ** 9),mainnet=True)
    w = Wallet.objects.get(addr=addr, key=key)
    w.refresh_balances(send_msg=False)
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
def refresh_balances(request):
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
        wallet.refresh_all_balances()
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
    # if int(Wallet.objects.get(key_hash=key_hash).waps_balance) / 10 ** 18 < 10 or Wallet.objects.get(key_hash=key_hash).waps_balance is None:
    #     return JsonResponse(
    #         {'non_field_errors': ['Insufficient WAPS balance']},
    #         status=400)



    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
        if wallet.initial_state == True:
            data['initial_state'] = False
        serializer = WalletSerializer(instance=wallet, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=200)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def update_skip(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)

    key_hash = data['key_hash']

    try:
        token_addr = web3.main.to_checksum_address(data['token']['addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)
    data['token']['addr'] = token_addr
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    if token_addr in ('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xc778417E063141139Fce010982780140Aa0cD5Ab'):
        return JsonResponse({'addr': ['cant blacklist weth']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)

        if data['token']['id'] != -2:
            if data['token']['name'] is None:
                data['token']['name'] = wallet.follower.get_erc_contract_by_addr(data['token']['addr']).functions.name().call()
            skip_token = SkipTokens.objects.get(pk=data['token']['id'])
            skip_ser = SkipTokensSerializer(data=data['token'], instance=skip_token)
            if skip_ser.is_valid():
                skip_ser.save()
            else:
                return JsonResponse(skip_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            data['token']['wallets'] = [wallet.id]
            new_skip_token = SkipTokensSerializer(data=data['token'])

            if new_skip_token.is_valid():
                new_skip_token.save()
            wallet.skip_tokens.add(new_skip_token.instance)
            wallet.save()
        serializer = WalletSerializer(instance=wallet)
        return JsonResponse(serializer.data, status=200)

@api_view(['POST'])
def update_asset_name(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)

    key_hash = data['key_hash']

    try:
        token_addr = web3.main.to_checksum_address(data['token']['addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)
    data['token']['addr'] = token_addr
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
    if data['token']['name']!='':
        for asset in Asset.objects.filter(addr=token_addr):
            asset.name=data['token']['name']
            asset.save()
        serializer = WalletSerializer(instance=wallet)
        return JsonResponse(serializer.data, status=200)
    else:
        return JsonResponse({'name': ['required field']}, status=400)


@api_view(['POST'])
def update_asset(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)

    key_hash = data['key_hash']

    try:
        token_addr = web3.main.to_checksum_address(data['token']['addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)
    data['token']['addr'] = token_addr
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
        if token_addr in ('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', '0xc778417E063141139Fce010982780140Aa0cD5Ab'):
            return JsonResponse({'addr': ['cant trade weth']}, status=400)
        if data['token']['id'] != -2:
            skip_token = DonorAsset.objects.get(pk=data['token']['id'])
            changed=False
            try:
                if skip_token.asset.decimals is None:
                    skip_token.asset.decimals = wallet.follower.get_erc_contract_by_addr(data['token']['addr']).functions.decimals().call()
                    changed=True
                if skip_token.asset.name is None or skip_token.asset.name =='':
                    skip_token.asset.name = wallet.follower.get_erc_contract_by_addr(data['token']['addr']).functions.name().call()
                    changed = True
                if changed:
                    skip_token.asset.save()
            except:
                return JsonResponse({'addr': ['invalid address or wrong token']}, status=400)
            skip_ser = DonorAssetSerializer(data=data['token'], instance=skip_token)
            if skip_ser.is_valid():
                skip_ser.save()
            else:
                return JsonResponse(skip_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else:

            data['token']['wallet'] = wallet.id
            asset,created=Asset.objects.get_or_create(wallet_id=wallet.id,addr=data['token']['addr'])
            try:

                changed=False
                if asset.decimals is None:
                    asset.decimals = wallet.follower.get_erc_contract_by_addr(data['token']['addr']).functions.decimals().call()
                    changed=True
                if asset.name is None or asset.name =='':
                    asset.name = wallet.follower.get_erc_contract_by_addr(data['token']['addr']).functions.name().call()
                    changed = True
                asset.price_for_token = wallet.follower.get_out_qnty_by_path(10 ** asset.decimals,
                                                                             [asset.addr, wallet.follower.weth_addr, ])

                if changed:
                    asset.save()
                wallet.refresh_token_balance(asset.id)
            except:
                if created:
                    asset.delete()
                return JsonResponse({'addr': ['invalid address or wrong token']}, status=400)
            data['token']['asset'] = asset.id
            new_skip_token = DonorAssetSerializer(data=data['token'])

            if new_skip_token.is_valid():
                new_skip_token.save()
            # wallet.assets.add(new_skip_token.instance)
            # wallet.save()
        serializer = WalletSerializer(instance=wallet)
        return JsonResponse(serializer.data, status=200)


@api_view(['POST'])
def update_limit(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)

    key_hash = data['key_hash']


    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:
        if data['token']['active']==True:
            data['token']['status']='running'
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)

        if data['token']['id'] != -2:
            skip_token =LimitAsset.objects.get(pk=data['token']['id'])
            skip_ser = LimitAssetSerializer(data=data['token'], instance=skip_token)

            if data['token']['type']!='buy':
                if data['token']['qnty']>skip_token.asset.balance:
                    data['token']['qnty'] = skip_token.asset.balance
            else:
                if data['token']['qnty']>skip_token.asset.wallet.weth_balance:
                    data['token']['qnty'] = skip_token.asset.wallet.weth_balance
            if skip_ser.is_valid():
                skip_ser.save()
            else:
                return JsonResponse(skip_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else:

            data['token']['wallet'] = wallet.id
            asset,created=Asset.objects.get_or_create(wallet_id=wallet.id,id=data['token']['asset_id'])
            data['token']['asset'] = asset.id
            if data['token']['type'] != 'buy':
                if data['token']['qnty'] > asset.balance:
                    data['token']['qnty'] = asset.balance
            else:
                if data['token']['qnty'] > asset.wallet.weth_balance:
                    data['token']['qnty'] = asset.wallet.weth_balance

            new_skip_token = LimitAssetSerializer(data=data['token'])

            if new_skip_token.is_valid(raise_exception=True):
                new_skip_token.save()
            else:
                return JsonResponse(new_skip_token.errors, status=status.HTTP_400_BAD_REQUEST)
            # wallet.assets.add(new_skip_token.instance)
            # wallet.save()
        serializer = WalletSerializer(instance=wallet)
        return JsonResponse(serializer.data, status=200)


@api_view(['POST'])
def update_donor_token(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)

    key_hash = data['key_hash']


    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)



        if data['token']['id'] != -2:
            skip_token =DonorAsset.objects.get(pk=data['token']['id'])
            if data['token']['qnty'] > skip_token.asset.balance:
                data['token']['qnty'] = skip_token.asset.balance
            skip_token.our_confirmed=True
            skip_token.save()
            skip_ser = DonorAssetSerializer(data=data['token'], instance=skip_token)
            if skip_ser.is_valid():
                skip_ser.save()
            else:
                return JsonResponse(skip_ser.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if DonorAsset.objects.filter(asset__id=data['token']['asset_id'], donor_id=data['token']['donor']).exists():
                return JsonResponse({'donor': ['donor must be unique for each token']}, status=400)
            data['token']['wallet'] = wallet.id
            asset,created=Asset.objects.get_or_create(wallet_id=wallet.id,id=data['token']['asset_id'])
            data['token']['asset'] = asset.id
            data['token']['our_confirmed'] = True
            if data['token']['qnty'] > asset.balance:
                data['token']['qnty'] = asset.balance
            new_skip_token = DonorAssetSerializer(data=data['token'])

            if new_skip_token.is_valid(raise_exception=True):
                new_skip_token.save()
            else:
                if created:
                    asset.delete()
                return JsonResponse(new_skip_token.errors, status=status.HTTP_400_BAD_REQUEST)
            # wallet.assets.add(new_skip_token.instance)
            # wallet.save()
        serializer = WalletSerializer(instance=wallet)
        return JsonResponse(serializer.data, status=200)


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
    data['donor']['addr'] = donor_addr
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:
        wallet = Wallet.objects.get(addr=addr, key_hash=key_hash)
        data['donor']['wallet'] = wallet.id
        if data['donor']['id'] != -2:
            if wallet.donors.filter(pk=data['donor']['id']).exists():
                donor = wallet.donors.get(pk=data['donor']['id'])
                serializer = DonorSerializer(instance=donor, data=data['donor'])
                if serializer.is_valid():
                    serializer.save()
                    wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
                    wallet.send_msg_to_subscriber_tlg(f'donor *{donor.name}* was updated')
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
            Wallet.objects.get(addr=addr, key_hash=key_hash).send_msg_to_subscriber_tlg(
                f' donor *{donor_addr}* was deleted')
        else:
            return JsonResponse({'non_field_errors': ['donor does not exists']}, status=400)

        wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        return JsonResponse(wallet_ser.data, status=200)


@api_view(['POST'])
def delete_skip(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    try:
        token_addr = web3.main.to_checksum_address(data['token_addr'])
    except:
        return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:

        if SkipTokens.objects.filter(addr=token_addr).exists():
            [i.delete() for i in SkipTokens.objects.filter(addr=token_addr)]
        else:
            return JsonResponse({'non_field_errors': ['skip token does not exists']}, status=400)

        wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        return JsonResponse(wallet_ser.data, status=200)

@api_view(['POST'])
def delete_limit(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)


    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:

        if LimitAsset.objects.filter(pk=data['id']).exists():
            [i.delete() for i in LimitAsset.objects.filter(pk=data['id'])]
        else:
            return JsonResponse({'non_field_errors': ['limit order does not exists']}, status=400)

        wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        return JsonResponse(wallet_ser.data, status=200)


@api_view(['POST'])
def delete_donor_asset(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    # try:
    #     token_addr = web3.main.to_checksum_address(data['token_addr'])
    # except:
    #     return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:

        if DonorAsset.objects.filter(id=data['token_id']).exists():
            DonorAsset.objects.get(id=data['token_id']).delete()
        else:
            return JsonResponse({'non_field_errors': ['Token does not exists']}, status=400)

        wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        return JsonResponse(wallet_ser.data, status=200)

@api_view(['POST'])
def delete_asset(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    # try:
    #     token_addr = web3.main.to_checksum_address(data['token_addr'])
    # except:
    #     return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)
    else:

        if Asset.objects.filter(id=data['token_id']).exists():
            Asset.objects.get(id=data['token_id']).delete()
        else:
            return JsonResponse({'non_field_errors': ['Token does not exists']}, status=400)

        wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        return JsonResponse(wallet_ser.data, status=200)

@api_view(['POST'])
def refresh_token_balance(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    # try:
    #     token_addr = web3.main.to_checksum_address(data['token_addr'])
    # except:
    #     return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)

    else:
        wallet = Wallet.objects.get(key_hash=key_hash,addr=addr)
        if Asset.objects.filter(id=data['token_id']).exists():
            new_balance=wallet.refresh_token_balance(data['token_id'])
            return JsonResponse({'balance': new_balance}, status=200)
        else:
            return JsonResponse({'non_field_errors': ['Token does not exists']}, status=400)

        # wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        # return JsonResponse(wallet_ser.data, status=200)


@api_view(['POST'])
def approve_token(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    # try:
    #     token_addr = web3.main.to_checksum_address(data['token_addr'])
    # except:
    #     return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)

    else:
        wallet = Wallet.objects.get(key_hash=key_hash,addr=addr)
        wallet.get_gas_price()
        if Asset.objects.filter(id=data['token_id']).exists() or data['token_id']==-1:
            if id==-1:
                approve_tx = wallet.approve_if_not(-1, gas_price=wallet.fast_gas)
            else:
                approve_tx=wallet.approve_if_not(Asset.objects.get(id=data['token_id']),gas_price=wallet.fast_gas)
            if approve_tx is not None:
                return JsonResponse({'approve': approve_tx}, status=200)
            else:
                return JsonResponse({'approve': 'already approved'}, status=400)
        else:
            return JsonResponse({'non_field_errors': ['Token does not exists']}, status=400)

        # wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        # return JsonResponse(wallet_ser.data, status=200)



@api_view(['POST'])
def refresh_token_price(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    # try:
    #     token_addr = web3.main.to_checksum_address(data['token_addr'])
    # except:
    #     return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)

    else:
        wallet = Wallet.objects.get(key_hash=key_hash,addr=addr)
        if Asset.objects.filter(id=data['token_id']).exists():
            new_price=wallet.refresh_token_price(data['token_id'])
            return JsonResponse({'price_for_token': new_price}, status=200)
        else:
            return JsonResponse({'non_field_errors': ['Token does not exists']}, status=400)

        # wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        # return JsonResponse(wallet_ser.data, status=200)


@api_view(['POST'])
def refresh_tokens(request):
    data = JSONParser().parse(request)
    try:
        addr = web3.main.to_checksum_address(data['addr'])
    except:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    # try:
    #     token_addr = web3.main.to_checksum_address(data['token_addr'])
    # except:
    #     return JsonResponse({'addr': ['invalid address']}, status=400)

    key_hash = data['key_hash']
    if Wallet.objects.filter(addr=addr).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid address for wallet, update wallet information']}, status=400)
    if Wallet.objects.filter(key_hash=key_hash).exists() == False:
        return JsonResponse({'non_field_errors': ['invalid key for wallet, update wallet information']}, status=400)

    else:
        assets = Asset.objects.all()
        ser=tempSer(assets,many=True)
        w=Wallet.objects.get(key_hash=key_hash)
        balances={'eth_balance':int(w.eth_balance),'weth_balance':int(w.weth_balance),'waps_balance':int(w.waps_balance),}
        return JsonResponse({'assets': ser.data,'balances':balances,'active':w.active}, status=200)

        # wallet_ser = WalletSerializer(instance=Wallet.objects.get(addr=addr, key_hash=key_hash))
        # return JsonResponse(wallet_ser.data, status=200)


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

    w = Wallet.objects.get(addr=addr)
    if w.initial_state == True:
        return JsonResponse({'non_field_errors': [
            'Seems like it\'s you first start, update all fields for your wallet and add donors first']}, status=400)
    w.refresh_balances(send_msg=False)



    if w.active == False:
        if w.weth_balance == 0 or w.weth_balance is None:
            return JsonResponse({'non_field_errors': ['You don\'t have weth on your wallet. The bot trade weth only.']},
                                status=400)

    # if w.active == False:
    #     if int(w.waps_balance/10**18) < 10 or w.waps_balance is None:
    #         return JsonResponse(
    #             {'non_field_errors': ['Insufficient WAPS balance']},
    #             status=400)

        if w.follower.get_allowance(w.follower.weth_addr) < 10 ** 20:
            return JsonResponse({'non_field_errors': ['Please approve weth on uniswap. The bot trade weth only.']},
                                status=400)

    global new_process
    if w.active == False:
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
            new_process = None
        # ws.connected = True
        # ws.connect("ws://127.0.0.1:8001/ws/chat/qwe/")
        # ws.send(json.dumps({'message': 'run'}))
    if w.active == True:
        w.send_msg_to_subscriber_tlg(' started')
    else:
        w.send_msg_to_subscriber_tlg(' stopped')
    return JsonResponse({'active': w.active}, status=status.HTTP_200_OK)
