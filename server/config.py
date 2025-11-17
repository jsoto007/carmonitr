import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///staffmonitr.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'staff-monitr-secret')
    MAIL_SENDER = os.getenv('MAIL_SENDER', 'noreply@staffmonitr.local')
    JWT_EXPIRY = timedelta(hours=int(os.getenv('JWT_EXPIRY_HOURS', '8')))
    SSO_DOMAINS = os.getenv('SSO_DOMAINS', 'staffmonitr.local').split(',')
