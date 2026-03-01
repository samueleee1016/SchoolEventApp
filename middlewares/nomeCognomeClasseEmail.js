const HttpError = require('../errors/httpError');

exports.checkNomeCognomeClasse = (nome, cognome, classe) => {
    if(!nome || !cognome || typeof(nome) != "string" || typeof(cognome) != "string")
        throw new HttpError("Unvalid nome or cognome of relatore", 400);
    if(!classe || typeof(classe) != "string" || classe.length > 5 || isNaN(Number(classe[0])) || Number(classe[0]) > 5)
        throw new HttpError("Unvalid classe of relatore", 400);
    const nome_cognome_classe = nome + " " + cognome + " " + classe;
    return nome_cognome_classe;
};

exports.checkEmail = (email) => {
    if(!email || typeof(email) != "string" || !email.includes('@'))
        throw new HttpError("Unvalid email", 400);
}