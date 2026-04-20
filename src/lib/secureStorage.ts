/**
 * Secure Storage Wrapper
 * Provides encrypted localStorage with automatic encryption/decryption
 */

import CryptoJS from 'crypto-js';

// Get encryption key from environment, with fallback (not recommended for production)
const ENCRYPTION_KEY = import.meta.env.VITE_STORAGE_KEY || 'default-key-change-in-production';

if (ENCRYPTION_KEY === 'default-key-change-in-production') {
    console.warn('⚠️ Using default encryption key. Set VITE_STORAGE_KEY in your .env file for production!');
}

/**
 * Secure Storage class with encryption
 */
class SecureStorage {
    /**
     * Encrypts and stores data in localStorage
     */
    static setItem(key: string, value: any): void {
        try {
            const stringValue = JSON.stringify(value);
            const encrypted = CryptoJS.AES.encrypt(stringValue, ENCRYPTION_KEY).toString();
            localStorage.setItem(key, encrypted);
        } catch (error) {
            console.error('SecureStorage.setItem error:', error);
            throw new Error('Failed to encrypt and store data');
        }
    }

    /**
     * Retrieves and decrypts data from localStorage
     */
    static getItem<T = any>(key: string): T | null {
        try {
            const encrypted = localStorage.getItem(key);
            if (!encrypted) return null;

            const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
            const stringValue = decrypted.toString(CryptoJS.enc.Utf8);

            if (!stringValue) {
                console.warn(`Failed to decrypt ${key} - possibly wrong encryption key`);
                return null;
            }

            return JSON.parse(stringValue) as T;
        } catch (error) {
            console.error('SecureStorage.getItem error:', error);
            // Return null instead of throwing to prevent app crashes
            return null;
        }
    }

    /**
     * Removes an item from localStorage
     */
    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Clears all encrypted storage
     */
    static clear(): void {
        localStorage.clear();
    }

    /**
     * Checks if a key exists in storage
     */
    static hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    /**
     * Gets all keys from storage
     */
    static keys(): string[] {
        return Object.keys(localStorage);
    }

    /**
     * Migrates existing unencrypted data to encrypted format
     * Use this to upgrade existing localStorage data
     */
    static migrateItem(key: string): boolean {
        try {
            const existing = localStorage.getItem(key);
            if (!existing) return false;

            // Try to parse as JSON - if it works, it's probably unencrypted
            try {
                const parsed = JSON.parse(existing);
                // Re-save with encryption
                this.setItem(key, parsed);
                console.log(`✅ Migrated ${key} to encrypted storage`);
                return true;
            } catch {
                // Already encrypted or invalid JSON, skip
                return false;
            }
        } catch (error) {
            console.error(`Failed to migrate ${key}:`, error);
            return false;
        }
    }

    /**
     * Migrates all known app keys to encrypted storage
     */
    static migrateAll(): void {
        const knownKeys = [
            'playbook_user',
            'playbook_theme',
            'playbook_playbooks',
            'playbook_teams',
            'playbook_team_members',
            'playbook_current_team_id',
            'playbook_analytics_events'
        ];

        console.log('🔐 Starting storage migration to encrypted format...');
        let migrated = 0;

        knownKeys.forEach(key => {
            if (this.migrateItem(key)) {
                migrated++;
            }
        });

        console.log(`✅ Migration complete: ${migrated} items encrypted`);
    }
}

/**
 * Session Storage with automatic timeout
 */
class SessionManager {
    private static readonly SESSION_KEY = 'playbook_session';
    private static readonly LAST_ACTIVITY_KEY = 'playbook_last_activity';
    private static timeoutMs: number = parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '1800000'); // 30 min default

    /**
     * Initializes session with timeout monitoring
     */
    static init(): void {
        this.updateActivity();
        this.startTimeoutMonitor();
    }

    /**
     * Updates last activity timestamp
     */
    static updateActivity(): void {
        const now = Date.now();
        localStorage.setItem(this.LAST_ACTIVITY_KEY, now.toString());
    }

    /**
     * Checks if session is still valid
     */
    static isSessionValid(): boolean {
        const lastActivity = localStorage.getItem(this.LAST_ACTIVITY_KEY);
        if (!lastActivity) return false;

        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        return timeSinceActivity < this.timeoutMs;
    }

    /**
     * Starts monitoring for session timeout
     */
    private static startTimeoutMonitor(): void {
        // Check every minute
        setInterval(() => {
            if (!this.isSessionValid()) {
                this.handleTimeout();
            }
        }, 60000); // 1 minute

        // Update activity on user interactions
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.updateActivity(), { passive: true });
        });
    }

    /**
     * Handles session timeout
     */
    private static handleTimeout(): void {
        console.log('⏱️ Session timeout - logging out');

        // Dispatch custom event that AuthContext can listen to
        window.dispatchEvent(new CustomEvent('session-timeout'));

        // Clear session data
        this.clearSession();
    }

    /**
     * Clears session data
     */
    static clearSession(): void {
        localStorage.removeItem(this.SESSION_KEY);
        localStorage.removeItem(this.LAST_ACTIVITY_KEY);
    }

    /**
     * Gets remaining session time in milliseconds
     */
    static getRemainingTime(): number {
        const lastActivity = localStorage.getItem(this.LAST_ACTIVITY_KEY);
        if (!lastActivity) return 0;

        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        return Math.max(0, this.timeoutMs - timeSinceActivity);
    }
}

// Auto-initialize session manager
if (typeof window !== 'undefined') {
    SessionManager.init();
}

export { SecureStorage, SessionManager };
export default SecureStorage;
