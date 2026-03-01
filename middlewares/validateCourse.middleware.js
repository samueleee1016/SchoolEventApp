const HttpError = require('../errors/httpError');
const check = require('./nomeCognomeClasseEmail');

function fGetWordFromSecondChar(string)
    {
    let a = "";
    const DIM = string.length;
    for(let i=1;i<DIM;i++)
        a += string[i];
    return a.toLowerCase();
    }

exports.validateCourse = (req, res, next) => {
    if (!req.body || typeof req.body !== "object")
        return next(new HttpError("Body mancante o non valido", 400));

    const nRel = Number(req.body.n_relatori);
    if(!Number.isInteger(nRel) || nRel < 1 || nRel > 4)
        throw new HttpError("Unvalid numero relatori", 400);

    const safeTrim = value => (typeof value === "string" ? value.trim() : null);

    const nomeCorso = safeTrim(req.body.nome_corso);
    const descrizione = safeTrim(req.body.descrizione);
    if(!nomeCorso || !descrizione || typeof(nomeCorso) != "string" || typeof(descrizione) != "string" || descrizione.length < 30 || nomeCorso.length < 2)
        throw new HttpError("Unvalid nome corso or descrizione corso", 400);

    const nOre = Number(req.body.n_ore);
    if(!Number.isInteger(nOre) || nOre < 1 || nOre > 2)
        throw new HttpError("Unvalid numero ore corso", 400);

    const giorno1 = req.body.giorno1;
    const giorno2 = req.body.giorno2;
    if(!giorno1 || !giorno2 || (giorno1 !== "si" && giorno1 !== "no") || (giorno2 !== "si" && giorno2 !== "no"))
        throw new HttpError("Unvalid giorno 1 or giorno2 value", 400);
    
    let emailCheck = safeTrim(req.body.email_rel);
    check.checkEmail(emailCheck);
    const email = emailCheck.toLowerCase();

    let nomeCheck = safeTrim(req.body.nome_rel_1);
    let cognomeCheck = safeTrim(req.body.cognome_rel_1);
    let classeCheck = safeTrim(req.body.classe_rel_1);

    let a = fGetWordFromSecondChar(nomeCheck);
    const nome_rel1 = nomeCheck[0].toUpperCase() + a;
    a = fGetWordFromSecondChar(cognomeCheck);
    const cognome_rel1= cognomeCheck[0].toUpperCase() + a;
    a = fGetWordFromSecondChar(classeCheck);
    a = a.toUpperCase();
    const classe_rel1 = classeCheck[0] + a;
    const nome_cognome_classe_rel1 = check.checkNomeCognomeClasse(nome_rel1, cognome_rel1, classe_rel1);

    nomeCheck = safeTrim(req.body.nome_rel_2);
    cognomeCheck = safeTrim(req.body.cognome_rel_2);
    classeCheck = safeTrim(req.body.classe_rel_2);

    let nome_cognome_classe_rel2 = null;
    let nome_rel2 = null, cognome_rel2 = null, classe_rel2 = null;
    if(nomeCheck && cognomeCheck && classeCheck)
        {
        a = fGetWordFromSecondChar(nomeCheck);
        nome_rel2 = nomeCheck[0].toUpperCase() + a;
        a = fGetWordFromSecondChar(cognomeCheck);
        cognome_rel2= cognomeCheck[0].toUpperCase() + a;
        a = fGetWordFromSecondChar(classeCheck);
        a = a.toUpperCase();
        classe_rel2 = classeCheck[0] + a;
        nome_cognome_classe_rel2 = check.checkNomeCognomeClasse(nome_rel2, cognome_rel2, classe_rel2);
        }

    nomeCheck = safeTrim(req.body.nome_rel_3);
    cognomeCheck = safeTrim(req.body.cognome_rel_3);
    classeCheck = safeTrim(req.body.classe_rel_3);

    let nome_cognome_classe_rel3 = null;
    let nome_rel3 = null, cognome_rel3 = null, classe_rel3 = null;
    if(nomeCheck && cognomeCheck && classeCheck)
        {
        a = fGetWordFromSecondChar(nomeCheck);
        nome_rel3 = nomeCheck[0].toUpperCase() + a;
        a = fGetWordFromSecondChar(cognomeCheck);
        cognome_rel3= cognomeCheck[0].toUpperCase() + a;
        a = fGetWordFromSecondChar(classeCheck);
        a = a.toUpperCase();
        classe_rel3 = classeCheck[0] + a;
        nome_cognome_classe_rel3 = check.checkNomeCognomeClasse(nome_rel3, cognome_rel3, classe_rel3);
        }

    nomeCheck = safeTrim(req.body.nome_rel_4);
    cognomeCheck = safeTrim(req.body.cognome_rel_4);
    classeCheck = safeTrim(req.body.classe_rel_4);

    let nome_cognome_classe_rel4 = null;
    let nome_rel4 = null, cognome_rel4 = null, classe_rel4 = null;
    if(nomeCheck && cognomeCheck && classeCheck)
        {
        a = fGetWordFromSecondChar(nomeCheck);
        nome_rel4 = nomeCheck[0].toUpperCase() + a;
        a = fGetWordFromSecondChar(cognomeCheck);
        cognome_rel4= cognomeCheck[0].toUpperCase() + a;
        a = fGetWordFromSecondChar(classeCheck);
        a = a.toUpperCase();
        classe_rel4 = classeCheck[0] + a;
        nome_cognome_classe_rel4 = check.checkNomeCognomeClasse(nome_rel4, cognome_rel4, classe_rel4);
        }

    const relEsterni = req.body.rel_esterni;
    if(!relEsterni || (relEsterni !== "si" && relEsterni !== "no"))
        throw new HttpError("Unvalid rel esterni value", 400);
    if(relEsterni == "si")
        {
        const nomeEst1 = safeTrim(req.body.nome_rel_esterno_1);
        const cognomeEst1 = safeTrim(req.body.cognome_rel_esterno_1);
        let nome_ref_esterni = nomeEst1 + " " + cognomeEst1;
        const nomeEst2 = safeTrim(req.body.nome_rel_esterno_2);
        const cognomeEst2 = safeTrim(req.body.cognome_rel_esterno_2);
        if(nomeEst2 && cognomeEst2)
            nome_ref_esterni += ", " + nomeEst2 + " " + cognomeEst2;
        const nomeEst3 = safeTrim(req.body.nome_rel_esterno_3);
        const cognomeEst3 = safeTrim(req.body.cognome_rel_esterno_3);
        if(nomeEst3 && cognomeEst3)
            nome_ref_esterni += ", " + nomeEst3 + " " + cognomeEst3;
        req.courseData = {nomeCorso, descrizione, nome_cognome_classe_rel1, nome_cognome_classe_rel2, nome_cognome_classe_rel3, nome_cognome_classe_rel4, nOre, giorno1, giorno2, nome_ref_esterni, email}
        req.nRel = nRel;
        req.elencoRelData = {nome_rel1, nome_rel2, nome_rel3, nome_rel4, cognome_rel1, cognome_rel2, cognome_rel3, cognome_rel4, classe_rel1, classe_rel2, classe_rel3, classe_rel4, nomeCorso};
        next();
        }
    else if(relEsterni == "no")
        {
        const nome_ref_esterni = "";
        req.courseData = {nomeCorso, descrizione, nome_cognome_classe_rel1, nome_cognome_classe_rel2, nome_cognome_classe_rel3, nome_cognome_classe_rel4, nOre, giorno1, giorno2, nome_ref_esterni, email}
        req.nRel = nRel;
        req.elencoRelData = {nome_rel1, nome_rel2, nome_rel3, nome_rel4, cognome_rel1, cognome_rel2, cognome_rel3, cognome_rel4, classe_rel1, classe_rel2, classe_rel3, classe_rel4, nomeCorso};
        next();
        }
};