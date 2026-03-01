const pool = require('../db/pool');
const HttpError = require('../errors/httpError');

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

    console.log(resultCorso);
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
    if(!result || result.length == 0) return;

    return {
        type: "LOAD_COURSES_VISUAL",
        result: result
    };
}