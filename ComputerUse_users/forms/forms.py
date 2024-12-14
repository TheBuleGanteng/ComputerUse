from django import forms
from .form_fields import *

__all__ = ['LoginForm', 'RegisterForm',]


#-------------------------------------------------------------

class LoginForm(forms.Form):
    username=username
    password=password


#-------------------------------------------------------------


class RegisterForm(forms.Form):

    first_name = first_name
    last_name = last_name
    username = username
    email = email
    password = password
    password_confirmation = password_confirmation


