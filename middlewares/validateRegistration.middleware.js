const HttpError = require('../errors/httpError');

function fGetWordFromSecondChar(string)
    {
    let a = "";
    const DIM = string.length;
    for(let i=1;i<DIM;i++)
        a += string[i];
    return a.toLowerCase();
    }

exports.validateRegistration = (req, res, next) => {
    if (!req.body || typeof req.body !== "object")
        return next(new HttpError("Body mancante o non valido", 400));

    let nomeCheck = req.body.nome;
    let cognomeCheck = req.body.cognome;
    let classeCheck = req.body.classe;
    let emailCheck = req.body.email;

    if(!nomeCheck || typeof(nomeCheck) != "string" || !cognomeCheck || typeof(cognomeCheck) != "string")
        throw new HttpError("Unvalid nome or cognome", 400);
    if(!classeCheck || typeof(classeCheck) != "string" || classeCheck.length > 5 || isNaN(Number(classeCheck[0])) || Number(classeCheck[0]) > 5)
        throw new HttpError("Unvalid classe", 400);
    if(!emailCheck || typeof(emailCheck) != "string" || !emailCheck.includes('@'))
        throw new HttpError("Unvali email", 400);

    let a = fGetWordFromSecondChar(nomeCheck);
    const nome = nomeCheck[0].toUpperCase() + a;
    a = fGetWordFromSecondChar(cognomeCheck);
    const cognome= cognomeCheck[0].toUpperCase() + a;
    a = fGetWordFromSecondChar(classeCheck);
    a = a.toUpperCase();
    const classe = classeCheck[0] + a;
    const email= emailCheck.toLowerCase();

    const relatoreG1 = req.body.relatore_g1;
    const assenteG1 = req.body.assente_g1;
    const relatoreG2 = req.body.relatore_g2;
    const assenteG2 = req.body.assente_g2;

    let o1g1, o2g1, o3g1, o4g1, o5g1;
    let o1g2, o2g2, o3g2, o4g2, o5g2;


    if(relatoreG1 == "si" && assenteG1 == "si")
        throw new HttpError("you can not be relator and absent at the same time", 400);
    else if(relatoreG1 == "si" || assenteG1 == "si")
        {
        if(relatoreG1 == "si")
            {
            o1g1 = "relatore";
            o2g1 = "relatore";
            o3g1 = "relatore";
            o4g1 = "relatore";
            o5g1 = "relatore";
            }
        else
            {
            o1g1 = "assente";
            o2g1 = "assente";
            o3g1 = "assente";
            o4g1 = "assente";
            o5g1 = "assente";
            }
        }
    else
        {
        o1g1 = req.body.prima_ora_g1;
        o2g1 = req.body.seconda_ora_g1;
        o3g1 = req.body.terza_ora_g1;
        o4g1 = req.body.quarta_ora_g1;
        o5g1 = req.body.quinta_ora_g1;
        }

    if(relatoreG2 == "si" && assenteG2 == "si")
        throw new HttpError("you can not be relator and absent at the same time", 400);
    else if(relatoreG2 == "si" || assenteG2 == "si")
        {
        if(relatoreG2 == "si")
            {
            o1g2 = "relatore";
            o2g2 = "relatore";
            o3g2 = "relatore";
            o4g2 = "relatore";
            o5g2 = "relatore";
            }
        else
            {
            o1g2 = "assente";
            o2g2 = "assente";
            o3g2 = "assente";
            o4g2 = "assente";
            o5g2 = "assente";
            }
        }
    else
        {
        o1g2 = req.body.prima_ora_g2;
        o2g2 = req.body.seconda_ora_g2;
        o3g2 = req.body.terza_ora_g2;
        o4g2 = req.body.quarta_ora_g2;
        o5g2 = req.body.quinta_ora_g2;
        }
    
    req.registrationData = {nome, cognome, classe, email, o1g1, o2g1, o3g1, o4g1, o5g1, o1g2, o2g2, o3g2, o4g2, o5g2};
    next();
};