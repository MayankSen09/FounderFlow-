/**
 * Input Validation Utilities
 * Provides comprehensive validation for user inputs to prevent security vulnerabilities
 */

// Validation error types
export class ValidationError extends Error {
    field?: string;

    constructor(message: string, field?: string) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

// Common validation patterns
const PATTERNS = {
    // Alphanumeric with spaces, hyphens, underscores
    title: /^[a-zA-Z0-9\s\-_.,!?()]+$/,

    // Email validation
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // URL validation
    url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,

    // Alphanumeric only
    alphanumeric: /^[a-zA-Z0-9]+$/,
};

// Dangerous patterns that might indicate injection attempts
const DANGEROUS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,  // Script tags
    /javascript:/gi,                  // JavaScript protocol
    /on\w+\s*=/gi,                   // Event handlers (onclick, onload, etc.)
    /eval\s*\(/gi,                   // Eval function
    /expression\s*\(/gi,             // CSS expressions
    /<iframe[^>]*>/gi,               // iFrames
    /<object[^>]*>/gi,               // Object embeds
    /<embed[^>]*>/gi,                // Embed tags
    /data:text\/html/gi,             // Data URIs
    /vbscript:/gi,                   // VBScript protocol
];

// Prompt injection patterns
const PROMPT_INJECTION_PATTERNS = [
    /ignore\s+(previous|above|all|everything)/gi,
    /system\s*:/gi,
    /###\s*system/gi,
    /\[system\]/gi,
    /forget\s+(previous|all|everything)/gi,
    /disregard\s+(previous|above)/gi,
    /new\s+instructions/gi,
];

interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => boolean;
    errorMessage?: string;
}

/**
 * Validates a string input against specified rules
 */
export function validateInput(
    value: string,
    fieldName: string,
    rules: ValidationRule
): { valid: boolean; error?: string } {

    // Check required
    if (rules.required && (!value || value.trim().length === 0)) {
        return {
            valid: false,
            error: rules.errorMessage || `${fieldName} is required`
        };
    }

    // Skip further checks if not required and empty
    if (!value || value.trim().length === 0) {
        return { valid: true };
    }

    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
        return {
            valid: false,
            error: rules.errorMessage || `${fieldName} must be at least ${rules.minLength} characters`
        };
    }

    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
        return {
            valid: false,
            error: rules.errorMessage || `${fieldName} must not exceed ${rules.maxLength} characters`
        };
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
        return {
            valid: false,
            error: rules.errorMessage || `${fieldName} contains invalid characters`
        };
    }

    // Custom validator
    if (rules.customValidator && !rules.customValidator(value)) {
        return {
            valid: false,
            error: rules.errorMessage || `${fieldName} is invalid`
        };
    }

    return { valid: true };
}

/**
 * Sanitizes input by removing dangerous patterns
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    let sanitized = input;

    // Remove dangerous HTML/JavaScript patterns
    DANGEROUS_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });

    return sanitized.trim();
}

/**
 * Checks for potential prompt injection attacks
 */
export function detectPromptInjection(input: string): boolean {
    if (!input) return false;

    return PROMPT_INJECTION_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Sanitizes prompt input for AI APIs
 */
export function sanitizePromptInput(input: string, maxLength: number = 10000): string {
    if (!input) return '';

    // Check for injection attempts
    if (detectPromptInjection(input)) {
        console.warn('⚠️ Potential prompt injection detected and sanitized');
    }

    let sanitized = input;

    // Remove prompt injection patterns
    PROMPT_INJECTION_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '[removed]');
    });

    // Remove dangerous HTML/JS
    sanitized = sanitizeInput(sanitized);

    // Trim to max length
    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized.trim();
}

/**
 * Validates email address
 */
export function validateEmail(email: string): boolean {
    return PATTERNS.email.test(email);
}

/**
 * Validates URL
 */
export function validateUrl(url: string): boolean {
    return PATTERNS.url.test(url);
}

/**
 * Validates Playbook title
 */
export function validatePlaybookTitle(title: string): { valid: boolean; error?: string } {
    return validateInput(title, 'Title', {
        required: true,
        minLength: 3,
        maxLength: 200,
        pattern: PATTERNS.title,
        errorMessage: 'Title must be 3-200 characters and contain only letters, numbers, and basic punctuation'
    });
}

/**
 * Validates Playbook purpose/description
 */
export function validatePlaybookPurpose(purpose: string): { valid: boolean; error?: string } {
    const sanitized = sanitizePromptInput(purpose, 2000);

    return validateInput(sanitized, 'Purpose', {
        required: true,
        minLength: 10,
        maxLength: 2000,
        customValidator: (value) => !detectPromptInjection(value),
        errorMessage: 'Purpose must be 10-2000 characters and cannot contain suspicious patterns'
    });
}

/**
 * Validates Playbook steps/content
 */
export function validatePlaybookSteps(steps: string): { valid: boolean; error?: string } {
    const sanitized = sanitizePromptInput(steps, 10000);

    return validateInput(sanitized, 'Steps', {
        required: true,
        minLength: 20,
        maxLength: 10000,
        customValidator: (value) => !detectPromptInjection(value),
        errorMessage: 'Steps must be 20-10000 characters and cannot contain suspicious patterns'
    });
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Validates and sanitizes form data
 */
export function validateFormData(
    data: Record<string, any>,
    schema: Record<string, ValidationRule>
): { valid: boolean; errors: Record<string, string>; sanitized: Record<string, any> } {

    const errors: Record<string, string> = {};
    const sanitized: Record<string, any> = {};

    for (const [field, rules] of Object.entries(schema)) {
        const value = data[field];

        if (typeof value === 'string') {
            const validation = validateInput(value, field, rules);

            if (!validation.valid && validation.error) {
                errors[field] = validation.error;
            } else {
                sanitized[field] = sanitizeInput(value);
            }
        } else {
            sanitized[field] = value;
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        sanitized
    };
}

// Export patterns for custom use
export { PATTERNS, DANGEROUS_PATTERNS, PROMPT_INJECTION_PATTERNS };
