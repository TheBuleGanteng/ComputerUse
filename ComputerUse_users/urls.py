from django.urls import path
from . import views

app_name = 'ComputerUse_users'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    #
    path('check_password_valid/', views.check_password_valid, name='check_password_valid')
]