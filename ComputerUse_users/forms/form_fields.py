from django import forms

__all__ = ['chat_history_window', 'email', 'first_name', 'last_name', 'password', 'password_confirmation', 'username',]

chat_history_window = forms.IntegerField(
    label='Chat history window:',
    min_value=0,
    max_value=20,
    required=False,
    widget=forms.NumberInput(attrs={
        'type': 'range',
        'min': '0',
        'max': '20',
        'step': "1",
        'class': 'form-range',
        'id': 'chat-history-window',
        'form-element': 'profileForm',
    })
)


email = forms.EmailField(
    label='Email address:',
    max_length=100,
    widget=forms.EmailInput(attrs={
        'autocomplete': 'off',
        'class': 'form-control',
        'id': 'email',
    })
)


first_name = forms.CharField(
    label='First name:',
    required=False,
    max_length=100,
    widget=forms.TextInput(attrs={
        'autocomplete': 'off',
        'class': 'form-control',
    })
)


last_name = forms.CharField(
    label='Last name:',
    required=False,
    max_length=100,
    widget=forms.TextInput(attrs={
        'autocomplete': 'off',
        'class': 'form-control',
    })
)


password = forms.CharField(
    label='Password:',
    max_length=50,
    strip=True,
    widget=forms.PasswordInput(attrs={
        'autocomplete': 'off',
        'class': 'form-control',
        'id': 'password',
        'placeholder': 'password',
    })
)



password_confirmation = forms.CharField(
    label='Password confirmation:',
    max_length=50,
    strip=True,
    widget=forms.PasswordInput(attrs={
        'autocomplete': 'off',
        'class': 'form-control',
        'id': 'password-confirmation',
    })
)


username = forms.CharField(
    label='Username:',
    max_length=25,
    required=False,
    strip=True,
    widget=forms.TextInput(attrs={
        'autocomplete': 'off',
        'class': 'form-control',
        'placeholder': 'username',
    })
)
