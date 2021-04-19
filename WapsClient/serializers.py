from rest_framework import serializers
from .models import Wallet,DonorAddr,SkipTokens, Asset,DonorAsset, LimitAsset
from rest_framework.exceptions import ValidationError
import web3
from .utils import *
from .uniswap import Uniswap
import base64
from .models import test_provider_url


class DonorAssetSerializer(serializers.ModelSerializer):
    addr=serializers.CharField(max_length=128,source='asset.addr',read_only=True)

    qnty=serializers.IntegerField()
    errs = serializers.DictField(read_only=True, default={})
    name=serializers.CharField(source='asset.name',read_only=True)
    decimals=serializers.IntegerField(source='asset.decimals',read_only=True)
    class Meta:
        model=DonorAsset
        fields=['qnty','donor','errs','id','asset','addr','decimals','name','our_confirmed']

class LimitAssetSerializer(serializers.ModelSerializer):
    qnty = serializers.IntegerField()
    price = serializers.FloatField()
    decimals=serializers.IntegerField(source='asset.decimals',read_only=True)
    addr=serializers.CharField(max_length=128,source='asset.addr',read_only=True)
    name = serializers.CharField(source='asset.name',read_only=True)
    slippage=serializers.FloatField()
    errs = serializers.DictField(read_only=True, default={})
    class Meta:
        model=LimitAsset
        fields=['qnty','price','errs','id','asset','addr','active','tx_hash','type','status','gas_plus','curr_price','decimals','name','slippage','retry_count']

    def validate(self, attrs):
        if attrs['qnty'] in (None,'',0):
            raise ValidationError({'qnty':'required field'})
        return attrs

class SkipTokensSerializer(serializers.ModelSerializer):
    name=serializers.CharField(max_length=128)
    addr=serializers.CharField(max_length=128)
    errs = serializers.DictField(read_only=True, default={})
    class Meta:
        model=SkipTokens
        exclude=[]

class DonorSerializer(serializers.ModelSerializer):

    fixed_value_trade=serializers.IntegerField(default=0)
    percent_value_trade=serializers.FloatField(default=0)
    gas_multiplier=serializers.FloatField(default=1)
    slippage=serializers.FloatField(default=0)
    id=serializers.IntegerField(read_only=True)
#     donors=serializers.StringRelatedField(many=True,read_only=True)

#     max_gas=serializers.IntegerField(read_only=True,default=0)
    follow_max=serializers.IntegerField(default=10**25)
    follow_min=serializers.IntegerField(default=0)
    retry_count=serializers.IntegerField(default=0,)
    errs=serializers.DictField(read_only=True,default={})
#     active=serializers.BooleanField(read_only=True)
#     telegram_channel_id=serializers.CharField()


    class Meta:
        model = DonorAddr
        exclude=[]

class tempSer(serializers.ModelSerializer):
    donor_assets=DonorAssetSerializer(many=True,read_only=True)
    limit_assets=LimitAssetSerializer(many=True,read_only=True)
    name=serializers.CharField(max_length=128)
    errs=serializers.DictField(read_only=True,default={})
    balance=serializers.IntegerField()
    class Meta:
        model = Asset
        exclude=[]

class WalletSerializer(serializers.ModelSerializer):
    active=serializers.BooleanField(read_only=True)
    mainnet=serializers.BooleanField()
    assets=tempSer(many=True,read_only=True,)
    eth_balance=serializers.IntegerField(read_only=True)
    weth_balance=serializers.IntegerField(read_only=True)
    waps_balance=serializers.IntegerField(read_only=True)
    max_gas=serializers.IntegerField()
    telegram_channel_id=serializers.IntegerField(allow_null=True)
    key_hash=serializers.CharField(max_length=128,write_only=True)

    skip_tokens=SkipTokensSerializer(many=True,read_only=True)
    donors=DonorSerializer(many=True,read_only=True)

    class Meta:
        model = Wallet
        exclude=['key']





    def validate(self, data):

        mainnet=data['mainnet']



        provider_url =test_provider_url

        my_w3 = web3.Web3(web3.Web3.HTTPProvider(provider_url, request_kwargs={"timeout": 60}))
        follower = Uniswap(data['addr'], 'key', provider=my_w3, mainnet=mainnet)

        eth_balance,weth_balance,waps_balance=get_balances_eth_weth_waps(data['addr'],'key',mainnet,follower=follower)

        data['weth_balance']=weth_balance
        data['eth_balance']=eth_balance
        data['waps_balance']=waps_balance



        if Wallet.objects.filter(addr=data['addr']).exists():
            donors = Wallet.objects.get(addr=data['addr']).donors
            if donors.count()>3:
                raise ValidationError('you cant follow more than 3 wallets, server will not allow to follow more anyway')


        #todo проверка на создание или изменени
        # tlg_check =telegram_bot_sendtext(f'wallet {data["addr"]}  was updated',int(data['telegram_channel_id']))
        # if not tlg_check['ok']:
        #     raise ValidationError('incorrect telegram channel id, or u have to add your bot to your channel as admin ',)
        return data



