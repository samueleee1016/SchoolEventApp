const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

exports.globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 1500,
    validate: { xForwardedForHeader: false },
    handler: (req, res) => {
        console.log("Troppe richieste in questo minuto. Orario: ", new Date());

        return res.status(429).sendFile(path.join(__dirname, '../public/limiterResponse/rispostaGlobalLimiter.html'));
    }
});