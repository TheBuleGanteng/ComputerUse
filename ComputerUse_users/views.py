from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods
from .forms import *
from .helpers import *


import logging
import os


logger = logging.getLogger('django')
PROJECT_NAME = settings.PROJECT_NAME


#-------------------------------------------------------------------------
# Used with jsPasswordValidation() to check if inputted password is valid
@require_http_methods(["POST"])
def check_password_valid(request):
    logger.debug('running check_password_valid() ... view started')

    # Pull in data passed in by JavaScript
    password = request.POST.get('password')
    password_confirmation = request.POST.get('password_confirmation')

    # Start performing checks, adding the name of each check passed to the checks_passed array.
    checks_passed = check_password_strength_verbose(password)
    
    if len(checks_passed)==4 and password == password_confirmation:
        confirmation_match = True
    else:
        confirmation_match = False
    logger.info(f'running check_password_valid() ... '
                f'checks_passed is: { checks_passed } and '
                f'confirmation_match is: { confirmation_match }')
        
    # Step 5: Pass the checks_passed array and confirmation_match back to JavaScript
    logger.debug(f'running check_password_valid() ... check finished, passing data back to JavaScript')
    return JsonResponse({'checks_passed': checks_passed, 'confirmation_match': confirmation_match} )




# Create your views here.
#-------------------------------------------------------------------------------
@require_http_methods(["GET", "POST"])
def login_view(request):
    logger.debug('running login_view ... view started')
    
    if request.user.is_authenticated:
        logger.debug('running login_view ... user arrived at login already authenticated, logging user out')
        logout(request)
    
    form = LoginForm(request.POST or None)

    context = {
        'form': form,  
        'route_used': 'login_view',
    }
    logger.debug(f'running login_view ... context passed to the template is: {context}')

    # If POST
    if request.method == "POST":
        logger.debug('running login_view ... user submitted via POST')

        if form.is_valid():
            logger.debug('running login_view ... user submitted via POST and form passed validation')

            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            logger.debug(f'running login_view ... username is: { username }')

            user = authenticate(request, username=username, password=password)
            logger.debug(f'running login_view ... retrieved user object: {user}')

            if user and user.is_active:
                login(request, user)
                messages.success(request, f'Welcome { user.first_name }, you are now logged in to { PROJECT_NAME } '), 
                {
                    'first_name': user.first_name,
                    'PROJECT_NAME': settings.PROJECT_NAME
                }
                
                logger.info(f'running login_view ... logged in user: { user }, redirecting to index') 
                return HttpResponseRedirect(reverse('ComputerUse_ai:index'))

            elif user and not user.is_active:
                logger.debug('running login_view ... user found in DB and is not active. Showing error message.')
                messages.error(request, f'You must confirm your account before logging in. Please check your email inbox and spam folders for an email from { PROJECT_NAME } or re-register your account.'),
               
            else:
                logger.debug('running login_view ... user not found in DB')
                messages.error(request, f'Error: Invalid credentials. Please check your entries for email and password. If you have not yet registered for { PROJECT_NAME }, please do so via the link below.')
               
        else:
            logger.debug('running login_view ... user submitted via POST and form failed validation')
            messages.error(request, 'Error: Invalid input. Please see the red text below for assistance.')

    # If GET
    else:
        logger.debug('running login_view ... user arrived via GET')

    return render(request, 'ComputerUse_users/login.html', context)


#-------------------------------------------------------------------------


@require_http_methods(['GET', 'POST'])
@login_required(login_url='ComputerUse_users:login')
def logout_view(request):
    logger.debug('running logout_view ... view started')

    user = request.user
    
    logout(request)

    messages.info(request, f'You have been logged out of { PROJECT_NAME }.')
    logger.debug(f'running logout_view ... user: { user } is logged out and is being redirected to login.html')
    
    return redirect('ComputerUse_users:login')


#-------------------------------------------------------------------------
@require_http_methods(["GET", "POST"])
def register_view(request):
    logger.debug('running register_view ... view started')

    # Instantiate the form with request.POST or no data depending on the request type
    register_form = RegisterForm(request.POST or None)
    
    # Since the form is registered several times, defining context here for brevity
    context = {
        "register_form": register_form,
        "pw_req_length": pw_req_length,
        "pw_req_letter": pw_req_letter,
        "pw_req_num": pw_req_num,
        "pw_req_symbol": pw_req_symbol,
    }

    if request.method == "POST":
        logger.info('running register_view ... user submitted via POST')

        # Do the following if submission=POST && submission passes validation...
        if register_form.is_valid():
            logger.info('running register_view ... user submitted via POST and form passed validation')
        
            # Assigns to variables the username and password passed in via the form in login.html
            first_name = register_form.cleaned_data['first_name']
            last_name = register_form.cleaned_data['last_name']
            username = register_form.cleaned_data['username']
            email = register_form.cleaned_data['email']
            password = register_form.cleaned_data['password']
            
            # Check if email and/or username are already registered.
            # If yes, flash error and redirect to register.html.
            if retrieve_email(email) or retrieve_username(username):
                logger.error(f'running register_view ... user-submitted email and/or username is already registered. Flashing error msg and returning to register.html')
                messages.error(request, 'Error: Email address and/or username is unavailable. If you already have an account, please log in. Otherwise, please amend your entries.')
                return render(request, 'cd50fp_users/register.html', context)
                
            # If email and username are not already registered, input data to DB.
            logger.info(f'running register_view ... creating user with: '
                        f'first_name={first_name}, last_name={last_name}, '
                        f'username={username}, email={email}, password=******')
                
            try:
                user = User.objects.create_user(
                    first_name=first_name,
                    last_name=last_name,
                    username=username, 
                    email=email, 
                    password=password,
                    is_active=True, 
                )
                user.save()
                logger.info(f'running register_view ... new user object saved: { user }')
            except Exception as e:
                logger.error(f'running register_view ... error occurred during user creation: {e}')
                return render(request, 'cd50fp_users/register.html', context)
            
            messages.success(request, 'Thank you for registering. Please log in with your email and password.')
            return HttpResponseRedirect(reverse('ComputerUse_users:login'))

        
        # Step 2.2: Handle submission via post + user input fails form validation
        else:
            logger.debug(f'running register_view ... Error 2.2 (form validation errors), flashing message and redirecting user to /register')    
            for field, errors in register_form.errors.items():
                logger.debug(f'running register_view ... erroring field is: { field }')
                for error in errors:
                    logger.debug(f'running register_view ... erroring on this field is: {error}')
            messages.error(request, 'Error: Invalid input. Please see the red text below for assistance.')
            return render(request, 'ComputerUse_users/register.html', context)
            
    # Step 3: User arrived via GET
    else:
        logger.debug(f'running register_view ... user arrived via GET')
        return render(request, 'ComputerUse_users/register.html', context)