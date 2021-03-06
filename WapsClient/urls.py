from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('run', views.start_stop, name='run'),
    path('get_wallet', views.get_wallet, name='get_wallet'),
    path('update_wallet', views.update_wallet, name='update_wallet'),
    path('update_donor', views.update_donor, name='update_donor'),
    path('delete_donor', views.delete_donor, name='delete_donor'),
    path('update_skip', views.update_skip, name='update_skip'),
    path('update_asset', views.update_asset, name='update_asset'),
    path('update_asset_name', views.update_asset_name, name='update_asset_name'),
    path('delete_skip', views.delete_skip, name='delete_skip'),
    path('delete_asset', views.delete_asset, name='delete_asset'),
    path('activate', views.start_stop, name='activate'),
]