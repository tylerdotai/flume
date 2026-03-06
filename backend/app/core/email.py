"""Email utility for sending transactional emails."""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import secrets

from app.core.config import settings


def generate_token() -> tuple[str, datetime]:
    """Generate a secure token and expiration (24 hours)."""
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(hours=24)
    return token, expires


def send_email(to: str, subject: str, body: str, html: str = None) -> bool:
    """Send an email. Returns True if successful."""
    if not settings.email_enabled:
        print(f"[EMAIL] Would send to {to}: {subject}")
        return False
    
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.SMTP_FROM
        msg['To'] = to
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'plain'))
        if html:
            msg.attach(MIMEText(html, 'html'))
        
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, to, msg.as_string())
        
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


def send_password_reset_email(email: str, username: str, token: str) -> bool:
    """Send password reset email."""
    reset_url = f"{settings.BASE_URL}/reset-password?token={token}"
    
    subject = "Reset your Flume password"
    body = f"""Hi {username},

You requested to reset your Flume password.

Click the link below to reset your password:
{reset_url}

This link expires in 24 hours.

If you didn't request this, please ignore this email.
"""
    html = f"""<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Reset your Flume password</h2>
    <p>Hi {username},</p>
    <p>You requested to reset your Flume password.</p>
    <p><a href="{reset_url}" style="background: #FF5A1F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset Password</a></p>
    <p>Or copy this link: {reset_url}</p>
    <p>This link expires in 24 hours.</p>
    <p>If you didn't request this, please ignore this email.</p>
</body>
</html>"""
    
    return send_email(email, subject, body, html)


def send_verification_email(email: str, username: str, token: str) -> bool:
    """Send email verification email."""
    verify_url = f"{settings.BASE_URL}/verify-email?token={token}"
    
    subject = "Verify your Flume email"
    body = f"""Hi {username},

Welcome to Flume! Please verify your email address.

Click the link below to verify:
{verify_url}

This link expires in 24 hours.
"""
    html = f"""<html>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <h2>Welcome to Flume!</h2>
    <p>Hi {username},</p>
    <p>Please verify your email address.</p>
    <p><a href="{verify_url}" style="background: #FF5A1F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Verify Email</a></p>
    <p>Or copy this link: {verify_url}</p>
    <p>This link expires in 24 hours.</p>
</body>
</html>"""
    
    return send_email(email, subject, body, html)
