const HttpError = require("../errors/httpError");

class adminLoginLimiter {
    constructor() {
        this.attempts = new Map();
        this.windowMs = 30 * 60 * 1000;
        this.maxAttempts = 3;

        setInterval(this.cleanup, (this.windowMs) * 2);
    }

    check(identifier)
        {
        if(!identifier || typeof(identifier) !== 'string')
            throw new HttpError("Identifier in admin login limiter must be a valid string");

        const now = Date.now();
        const record = this.attempts.get(identifier);

        if(!record || now > record.resetAt)
            {
            this.attempts.set(identifier, {
                count: 1,
                resetAt: now + this.windowMs
            });
            return {
                allowed: true,
                remaining: this.maxAttempts - 1,
                resetAt: new Date(now + this.windowMs)
            };
            }

        if(record.count < this.maxAttempts)
            {
            record.count ++;
            return {
                allowed: true,
                remaining: this.maxAttempts - record.count,
                resetAt: new Date(record.resetAt)
            };
            }
        
        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(record.resetAt)
        };
        }

    reset(identifier)
        {
        this.attempts.delete(identifier);
        }
    
    cleanup() 
        {
        const now = Date.now();
        let cleaned = 0;

        for(const [key, record] of this.attempts.entries())
            if(now > record.resetAt)
                {
                this.attempts.delete(key);
                cleaned++;
                } 
            
        if(cleaned > 0)
            console.log("Admin rate limit cleaned. Records cleaned:", cleaned);
        }
}

const adminRateLimiter = new adminLoginLimiter();

module.exports = adminRateLimiter;