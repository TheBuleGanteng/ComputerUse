from django.contrib.auth.models import User
import logging
import os
import re
logger = logging.getLogger('django')


__all__ = ['check_password_strength', 'check_password_strength_verbose', 'pw_req_length', 'pw_req_letter', 'pw_req_num', 'pw_req_symbol', 'retrieve_email', 'retrieve_username', ]



# Validates password strength, subject to the requirements listed below. 
pw_req_length = 4
pw_req_letter = 2
pw_req_num = 2
pw_req_symbol = 0
def check_password_strength(user_input):
    if (
        len(user_input) >= pw_req_length and 
        len(re.findall(r'[a-zA-Z]', user_input)) >= pw_req_letter and 
        len(re.findall(r'[0-9]', user_input)) >= pw_req_num and
        len(re.findall(r'[^a-zA-Z0-9]', user_input)) >= pw_req_symbol
        ):
        return True



# Validates password strength, returning a list of requirements passed
def check_password_strength_verbose(user_input):
    checks_passed = []
    if len(user_input) >= pw_req_length:
        checks_passed.append('pw-req-length')
    if len(re.findall(r'[a-zA-Z]', user_input)) >= pw_req_letter:
        checks_passed.append('pw-req-letter')
    if len(re.findall(r'[0-9]', user_input)) >= pw_req_num:
        checks_passed.append('pw-req-num')
    if len(re.findall(r'[^a-zA-Z0-9]', user_input)) >= pw_req_symbol:
        checks_passed.append('pw-req-symbol')

    return checks_passed



# Queries the DB to check if user_input matches a registered email. Returns None if no match.
def retrieve_email(user_input):
    logger.info(f'running retrieve_email() ... function started')
    user = User.objects.filter(email=user_input).first()
    logger.info(f'running retrieve_email() ... returned user: { user }')
    return user



# Queries the DB to check if user_input matches a registered email
def retrieve_username(user_input):
    logger.info(f'running retrieve_username() ... function started')
    user = User.objects.filter(username=user_input).first()
    logger.info(f'running retrieve_username() ... returneds user: { user }')
    return user

