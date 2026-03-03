const HttpError = require('../errors/httpError');
const { broadcast } = require('../ws/socket');

exports.insertRelatori = async (nome, cognome, classe, nomeCorso, conn) => {
    const sql = "insert into elenco_relatori (nome, cognome, classe, nome_corso) values(?, ?, ?, ?)";
    const relData = [nome, cognome, classe, nomeCorso];
    const [resultRel] = await conn.execute(sql, relData);
}

exports.updateSeatsAndCheck = async (conn, posti, data) => {
    const possibleFields = ["posti_1_1", "posti_1_2", "posti_1_3", "posti_1_4", "posti_1_5", "posti_2_1", "posti_2_2", "posti_2_3", "posti_2_4", "posti_2_5"];
    if(!possibleFields.includes(posti))
        throw new HttpError(`${posti} non è un valore valido`, 400);
    let sql = `update corso set ${posti} = ${posti} + 1 where nome = ? && ${posti} < 10`;
    let [updateRes] = await conn.execute(sql, [data]);
    if (updateRes.affectedRows === 0)
        throw new HttpError("Posti esauriti", 409);
}

exports.checkAndSendBroadcast = (postiPrima, day, hour, courseName) => {
    const MAX_POSTI = 10;
    if((postiPrima + 1) >= MAX_POSTI)
        broadcast({
            type: "COURSE_FULL",
            day: day,
            hour: hour,
            courseName: courseName
        });
}