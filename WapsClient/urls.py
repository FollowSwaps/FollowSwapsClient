from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('run', views.start_stop, name='run'),
    path('get_wallet', views.get_wallet, name='get_wallet'),
    path('refresh_balances', views.refresh_balances, name='refresh_balances'),
    path('refresh_tokens', views.refresh_tokens, name='refresh_tokens'),
    path('refresh_token_balance', views.refresh_token_balance, name='refresh_token_balance'),
    path('refresh_token_price', views.refresh_token_price, name='refresh_token_price'),
    path('approve_token', views.approve_token, name='approve_token'),
    path('update_wallet', views.update_wallet, name='update_wallet'),
    path('update_donor', views.update_donor, name='update_donor'),
    path('delete_donor', views.delete_donor, name='delete_donor'),
    path('update_skip', views.update_skip, name='update_skip'),
    path('update_asset', views.update_asset, name='update_asset'),
    path('update_limit', views.update_limit, name='update_limit'),
    path('update_donor_asset', views.update_donor_token, name='update_donor_asset'),
    path('delete_limit', views.delete_limit, name='delete_limit'),
    path('update_asset_name', views.update_asset_name, name='update_asset_name'),
    path('delete_skip', views.delete_skip, name='delete_skip'),
    path('delete_asset', views.delete_donor_asset, name='delete_asset'),
    path('delete_asset_full', views.delete_asset, name='delete_asset_full'),
    path('activate', views.start_stop, name='activate'),
]