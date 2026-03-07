"""Email utility for sending transactional emails via Resend API."""
import resend
from datetime import datetime, timedelta, timezone
import secrets

from app.core.config import settings


def generate_token() -> tuple[str, datetime]:
    """Generate a secure token and expiration (24 hours)."""
    token = secrets.token_urlsafe(32)
    expires = datetime.now(timezone.utc) + timedelta(hours=24)
    return token, expires


def send_email(to: str, subject: str, body: str, html: str = None) -> bool:
    """Send an email via Resend API. Returns True if successful."""
    if not settings.RESEND_API_KEY:
        print(f"[EMAIL] No RESEND_API_KEY configured. Would send to {to}: {subject}")
        return False
    
    try:
        resend.api_key = settings.RESEND_API_KEY
        
        params = {
            "from": settings.SMTP_FROM or "Flume <onboarding@resend.dev>",
            "to": to,
            "subject": subject,
            "text": body,
        }
        
        if html:
            params["html"] = html
        
        response = resend.Emails.send(params)
        print(f"[EMAIL] Sent to {to}: {response}")
        return True
    except Exception as e:
        print(f"[EMAIL] Failed to send: {e}")
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
