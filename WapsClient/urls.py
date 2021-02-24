from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('run', views.start_stop, name='run'),
    path('get_wallet', views.get_wallet, name='get_wallet'),
    path('update_wallet', views.update_wallet, name='update_wallet'),
    path('update_donor', views.update_donor, name='update_donor'),
    path('delete_donor', views.delete_donor, name='delete_donor'),
    path('activate', views.start_stop, name='activate'),
]