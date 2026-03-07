const pool = require('../db/pool');
const crypto = require('crypto');
require('dotenv').config();
const HttpError = require('../errors/httpError');
const adminRateLimiter = require('../middlewares/wsAdminRateLimiter');  

exports.fCheck2Ora = async (nomeCorso, idSelect, nomeNextCorso) => {
    const sql = "select n_ore from corso where nome = ?";
    const [result] = await pool.execute(sql, [nomeCorso]);
    if(result.length == 0 || Number(result[0].n_ore) == 1)
        {
        let [result2] = await pool.execute(sql, [nomeNextCorso]);
        if(result.length == 0 || nomeNextCorso == "")
            return {
                type: "RESULT_2ORE",
                success: false,
                id: idSelect
            };
        
        return {
            type: "RESULT_2ORE",
            success: false,
            id: idSelect,
            oreNext: result2[0].n_ore
        };
        }
    
    const result2ore = {
        type: "RESULT_2ORE",
        success: true,
        id: idSelect
    };
    
    return result2ore;
}

exports.fCheckSecQuartaOra = async (id, corso, corsoPrec) => {
    const sql = "select n_ore from corso where nome = ?";
    const [resultCorso] = await pool.execute(sql, [corso]);

    if(!resultCorso || Number(resultCorso[0].n_ore) == 1)
        {
        const [resultCorsoPrec] = await pool.execute(sql, [corsoPrec]);
        if(!resultCorsoPrec || resultCorsoPrec.length == 0 || Number(resultCorsoPrec[0].n_ore) == 1)
            return {type: "RETURN_SEC_QUARTA_ORA", success: false};
        return {
            type: "RETURN_SEC_QUARTA_ORA",
            success: "Change_corso_prec",
            idCorso: id
        }
        }
    if(Number(resultCorso[0].n_ore) == 2)
        {
        return checkSecQuaOra = {
            type: "RETURN_SEC_QUARTA_ORA",
            success: true,
            idCorso: id
        };
        }
}

exports.fGetCoursesPresent = async () => {
    let sql = "select nome from corso";
    const [result] = await pool.execute(sql);
    if(!result || result.length == 0) return;

    return {
        type: "LOAD_COURSES_PRESENT",
        result: result
    };
}

exports.fGetCoursesVisual = async () => {
    const sql = "select nome, descrizione, n_ore, giorno1, giorno2, nome_cognome_classe_ref1, nome_cognome_classe_ref2, nome_cognome_classe_ref3, nome_cognome_classe_ref4, nome_ref_esterni from corso";
    const [result] = await pool.execute(sql);
    if(!result || result.length == 0) return {};

    return {
        type: "LOAD_COURSES_VISUAL",
        result: result
    };
}

exports.fGetCoursesAdmin = async () => {
    const sql = "select nome, descrizione, n_ore, giorno1, giorno2, nome_cognome_classe_ref1, nome_cognome_classe_ref2, nome_cognome_classe_ref3, nome_cognome_classe_ref4, nome_ref_esterni, email_ref, posti_1_1, posti_1_2, posti_1_3, posti_1_4, posti_1_5, posti_2_1, posti_2_2, posti_2_3, posti_2_4, posti_2_5 from corso";
    const [result] = await pool.execute(sql);
    if(!result || result.length == 0) 
        return {type: "LOAD_COURSES_ADMIN"};

    return {
        type: "LOAD_COURSES_ADMIN",
        result: result
    };
}

exports.fGetRegistrationDataAdmin = async () => {
    let sql = "select nome, cognome, classe, email, prima_ora, seconda_ora, terza_ora, quarta_ora, quinta_ora from elenco_iscritti_giorno1";
    const [resultG1] = await pool.execute(sql);

    sql = "select nome, cognome, classe, email, prima_ora, seconda_ora, terza_ora, quarta_ora, quinta_ora from elenco_iscritti_giorno2";
    const [resultG2] = await pool.execute(sql);
    if(!resultG1 || resultG1.length == 0 || !resultG2 || resultG2.length == 0) 
        return {type: "LOAD_REGISTRATION_DATA_ADMIN"};

    return {
        type: "LOAD_REGISTRATION_DATA_ADMIN",
        resultG1: resultG1,
        resultG2: resultG2
    };
}

const { ADMIN_PASSWORD } = process.env;
const ADMIN_PASSWORD_LENGTH = Number(process.env.ADMIN_PASSWORD_LENGTH);

if(!ADMIN_PASSWORD || ADMIN_PASSWORD.length != ADMIN_PASSWORD_LENGTH)
    throw new HttpError("missing  or unvalid admin password", 500);

const HASHED_ADMIN_PASSWORD = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

exports.fVerifyAdminPassword = async (psw, ip) => {
    const rateLimitCheck = adminRateLimiter.check(ip);

    if(!rateLimitCheck.allowed)
        {
        const minutesLeft = Math.ceil((rateLimitCheck.resetAt - new Date()) / 60000);
        
        return {
            type: "RESPONSE_VERIFY_ADMIN_PASSWORD",
            success: false,
            minutesLeft: minutesLeft
        };
        }

    const hashedPsw = crypto.createHash('sha256').update(psw).digest('hex');

    if(hashedPsw != HASHED_ADMIN_PASSWORD)
        return {
            type: "RESPONSE_VERIFY_ADMIN_PASSWORD",
            success: false
        }
    else
        {
        adminRateLimiter.reset(ip);
        return {
            type: "RESPONSE_VERIFY_ADMIN_PASSWORD",
            success: true
        };
        }
}