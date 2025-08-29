"""
Configuration management for StudentsAI MVP
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    """Application settings with environment variable support"""

    # Database
    database_url: str = "postgresql://username:password@localhost:5432/studentsai_db"

    # JWT
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    verification_token_expire_minutes: int = 1440  # 24 hours for email verification token expiry

    # Email Configuration (NEW)
    mail_username: str = "your-email@gmail.com"
    mail_password: str = "your-app-password"
    mail_from: str = "your-email@gmail.com"
    mail_port: int = 587
    mail_tls: bool = True
    mail_ssl: bool = False
    mail_from_name: str = "StudentsAI"
    mail_timeout: int = 120  # Email sending timeout in seconds (2 minutes for slow connections)
    mail_server: str = "smtp.gmail.com"  # SMTP server (can be changed to alternatives)

    # Google OAuth Configuration (NEW)
    google_client_id: str = "your-google-client-id"
    google_client_secret: str = "your-google-client-secret"
    google_redirect_uri: str = "http://localhost:3000/auth/google/callback"

    # App
    app_name: str = "StudentsAI"
    host: str = "0.0.0.0"
    port: int = 8000
    frontend_url: str = "http://localhost:3000"  # NEW: Frontend URL for email links (use https://www.studentsai.org for production)
    backend_cors_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://www.studentsai.org",
        "https://studentsai.org",
        "https://api.studentsai.org",
    ]
    allowed_origins: str = "http://localhost:3000,http://localhost:8000,https://www.studentsai.org,https://studentsai.org,https://api.studentsai.org"  # For backward compatibility

    # AI Configuration
    openai_api_key: str = "your-openai-api-key"
    daily_ai_request_limit: int = 100
    ai_requests_per_hour: int = 100  # Hourly AI request limit

    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # seconds

    # Redis (optional)
    redis_url: str = "redis://localhost:6379/0"

    # Environment
    environment: str = "development"
    debug: bool = True  # Set to False in production via environment variable

    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()

# Database URL for SQLAlchemy
DATABASE_URL = settings.database_url

# OpenAI configuration
OPENAI_API_KEY = settings.openai_api_key

# Security configuration
SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

# Google OAuth configuration (NEW)
GOOGLE_CLIENT_ID = settings.google_client_id
GOOGLE_CLIENT_SECRET = settings.google_client_secret
GOOGLE_REDIRECT_URI = settings.google_redirect_uri

# Application configuration
ENVIRONMENT = settings.environment
DEBUG = settings.debug
HOST = settings.host
PORT = settings.port

# Rate limiting configuration
RATE_LIMIT_REQUESTS = settings.rate_limit_requests
RATE_LIMIT_WINDOW = settings.rate_limit_window

# Redis configuration
REDIS_URL = settings.redis_url

# CORS configuration
ALLOWED_ORIGINS = settings.backend_cors_origins
