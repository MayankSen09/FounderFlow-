# Security Implementation Guide

This document outlines the security measures implemented in FounderFlow.

## 🔐 Security Features Implemented

### 1. Input Validation & Sanitization
- **Module**: `src/lib/validation.ts`
- **Features**:
  - XSS pattern detection and removal
  - Prompt injection prevention
  - HTML/JavaScript sanitization
  - Field-level validation with custom rules

### 2. Secure Storage
- **Module**: `src/lib/secureStorage.ts`
- **Features**:
  - AES encryption for localStorage
  - Automatic session timeout (30 minutes)
  - Session activity monitoring
  - Data migration utilities

### 3. Secure Logging
- **Module**: `src/lib/logger.ts`
- **Features**:
  - Automatic redaction of API keys, tokens, passwords
  - Production vs development log levels
  - Error sanitization
  - Safe error reporting

### 4. Rate Limiting
- **Module**: `src/lib/rateLimit.ts`
- **Features**:
  - Per-user rate limiting
  - Configurable time windows
  - AI API request throttling (10/min, 50/hour)

### 5. XSS Prevention
- **Implementation**: DOMPurify in EmailCampaignBuilder
- **Protection**: Sanitizes all HTML content before rendering

### 6. Security Headers
- **File**: `vercel.json`
- **Headers**:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Content-Security-Policy
  - Referrer-Policy
  - Permissions-Policy

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```bash
# Critical - Get from Google Makersuite
VITE_GEMINI_API_KEY=your_api_key_here

# Security - Generate with: openssl rand -base64 32
VITE_STORAGE_KEY=your_32_char_encryption_key

# Optional
VITE_SESSION_TIMEOUT=1800000  # 30 minutes in ms
VITE_MAX_AI_REQUESTS_PER_MINUTE=10
VITE_MAX_AI_REQUESTS_PER_HOUR=50
```

## 🚀 Usage Examples

### Input Validation

```typescript
import { validatePlaybookTitle, sanitizePromptInput } from './lib/validation';

// Validate title
const { valid, error } = validatePlaybookTitle(userInput);
if (!valid) {
  showError(error);
}

// Sanitize AI prompts
const safePrompt = sanitizePromptInput(userInput, 5000);
```

### Secure Storage

```typescript
import SecureStorage from './lib/secureStorage';

// Store encrypted data
SecureStorage.setItem('user_data', { name: 'John', role: 'Admin' });

// Retrieve and decrypt
const userData = SecureStorage.getItem('user_data');

// Migration (one-time, for existing users)
SecureStorage.migrateAll();
```

### Secure Logging

```typescript
import SecureLogger from './lib/logger';

// Automatically redacts sensitive data
SecureLogger.info('User logged in', { user, token }); // token will be [REDACTED]
SecureLogger.error('API error', error);
```

### Rate Limiting

```typescript
import { aiRateLimiter } from './lib/rateLimit';

// Check before API call
const rateCheck = aiRateLimiter.checkGeneration(userId);
if (!rateCheck.allowed) {
  showError(`Rate limit exceeded. Try again in ${rateCheck.resetIn}s`);
  return;
}

// Record successful call
aiRateLimiter.recordGeneration(userId);
```

## ⚠️ Security Best Practices

### For Developers

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Always validate user inputs** - Use validation utilities before processing
3. **Sanitize AI prompts** - Prevent prompt injection attacks
4. **Use SecureLogger** - Prevents accidental exposure of sensitive data
5. **Check rate limits** - Protect AI API from abuse

### For Deployment

1. **Set strong encryption key** - Generate with `openssl rand -base64 32`
2. **Enable security headers** - Deploy `vercel.json` configuration
3. **Monitor logs** - Watch for suspicious patterns
4. **Regular dependency updates** - Run `npm audit` weekly
5. **Review API usage** - Monitor for unusual spikes

## 🔍 Security Audit Checklist

- [x] API keys protected (not in console logs)
- [x] Input validation implemented
- [x] XSS prevention (DOMPurify)
- [x] Secure storage with encryption
- [x] Session timeout
- [x] Rate limiting
- [x] Security headers configured
- [x] Sensitive data logging prevented
- [ ] Backend API proxy (recommended for production)
- [ ] Real authentication system (future enhancement)

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Web Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/Security)

## 🆘 Incident Response

If you discover a security vulnerability:

1. **Do not** disclose publicly
2. Contact the development team immediately
3. Provide details: steps to reproduce, impact, suggested fix
4. Allow time for fix before disclosure

---

**Last Updated**: 2026-02-01  
**Security Version**: 1.0
