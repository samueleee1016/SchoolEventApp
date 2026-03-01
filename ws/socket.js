const WebSocket = require('ws');
const pool = require('../db/pool');
const check = require('../middlewares/nomeCognomeClasseEmail');
const {randomUUID} = require('crypto');
require('dotenv').config();
const nodemailer = require('nodemailer');
const HttpError = require('../errors/httpError');
const socketFunctions = require('../middlewares/webSocketFunctions');

let wss;

exports.initWebSocket = (server) => {
    wss = new WebSocket.Server({server});

    wss.on('connection', (ws) => {
        ws.on('message', async (msg) => {
            const data = JSON.parse(msg.toString());
            switch (data.type) {
                case "GET_CORSI":
                    let sql = "select nome from corso where posti_1_1 < 10 && giorno1 = 'si'";
                    let [rows] = await pool.execute(sql);
                    const o1g1 = rows;
                    sql = "select nome from corso where posti_1_2 < 10 && giorno1 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o2g1 = rows;
                    sql = "select nome from corso where posti_1_3 < 10 && giorno1 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o3g1 = rows;
                    sql = "select nome from corso where posti_1_4 < 10 && giorno1 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o4g1 = rows;
                    sql = "select nome from corso where posti_1_5 < 10 && giorno1 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o5g1 = rows;

                    sql = "select nome from corso where posti_2_1 < 10 && giorno2 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o1g2 = rows;
                    sql = "select nome from corso where posti_2_2 < 10 && giorno2 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o2g2 = rows;
                    sql = "select nome from corso where posti_2_3 < 10 && giorno2 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o3g2 = rows;
                    sql = "select nome from corso where posti_2_4 < 10 && giorno2 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o4g2 = rows;
                    sql = "select nome from corso where posti_2_5 < 10 && giorno2 = 'si'";
                    [rows] = await pool.execute(sql);
                    const o5g2 = rows;

                    const sendingData = {
                        type: "CREATE_LIST",
                        o1g1: o1g1,
                        o2g1: o2g1,
                        o3g1: o3g1,
                        o4g1: o4g1,
                        o5g1: o5g1,
                        o1g2: o1g2,
                        o2g2: o2g2,
                        o3g2: o3g2,
                        o4g2: o4g2,
                        o5g2: o5g2
                    };
                    ws.send(JSON.stringify(sendingData));
                    break;
                case "CHECK_2ORE":
                    const result2ore = await socketFunctions.fCheck2Ora(data.nomeCorso, data.id, data.nomeNextCorso);
                    ws.send(JSON.stringify(result2ore));
                    break;
                case "CHECK_SEC_QUART_ORA":
                    const checkSecQuaOra = await socketFunctions.fCheckSecQuartaOra(data.id, data.corso, data.corsoPrec);
                    ws.send(JSON.stringify(checkSecQuaOra));
                    break;
                case "GET_COURSES_PRESENT":
                    const coursesPresent = await socketFunctions.fGetCoursesPresent();
                    ws.send(JSON.stringify(coursesPresent));
                    break;
                case "GET_COURSES_VISUAL":
                    const visualResult = await socketFunctions.fGetCoursesVisual();
                    ws.send(JSON.stringify(visualResult));
                    break;
                case "VERIFY_EMAIL":
                    const verifyEmailData = await fVerifyEmail(data.email);
                    ws.send(JSON.stringify(verifyEmailData));
                    break;
                case "VERIFY_CODE":
                    const result = await fVerifyCode(data.code, data.email);
                    ws.send(JSON.stringify(result));
                    break;
                default:
                    break;
            } 
        });
    });
};

async function fVerifyCode(code, email)
    {
    let sql = "select * from emails_for_verify where email = ? and status = 'pending' order by expires_at desc limit 1";
    const [result] = await pool.execute(sql, [email]);
    if(result.length == 0)
        {
        return {
                type: "RESPONSE_VERIFY_CODE",
                success: false,
                msg: "error"
            };
        }

    if(Date.now() > result[0].expires_at)
        {
        sql = "update emails_for_verify set status = 'expired' where verificationId = ?";
        await pool.execute(sql, [result[0].verificationId]);
        return {
                type: "RESPONSE_VERIFY_CODE",
                success: false,
                msg: "code expired"
            };
        }
    if(code != result[0].codice)
        {
        return {
                type: "RESPONSE_VERIFY_CODE",
                success: false,
                msg: "unvalid code"
            };
        }
    else
        {
        sql = "update emails_for_verify set status = 'verified' where verificationId = ?";
        await pool.execute(sql, [result[0].verificationId]);
        return {
                type: "RESPONSE_VERIFY_CODE",
                success: true
            };
        }
    }

function generateNumber()
    {
    return Math.floor(100000 + Math.random() * 900000);
    }

const { MAIL_USER, MAIL_PASS } = process.env;
if(!MAIL_USER || !MAIL_PASS)
    throw new HttpError("Missing email credentials");

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
   auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
   } 
});

async function sendMail(to, code)
    {
    try
        {
        const mailOptions = {
            from: 'School Event Days',
            to: to,
            subject: "codice di accesso - School Event Days",
            text: `Il tuo codice è: ${code}
                    sarà valido per 5 minuti`,
            html: `<p>Il tuo codice di accesso è: </p>
                    <h2>${code}</h2>
                    <p>Sarà valido per 5 minuti</p>`
        };
        await transporter.sendMail(mailOptions);
        }
    catch(err)
        {
        throw new HttpError(err.message, err.status ?? 451)
        }
    }


async function fVerifyEmail(email)
    {
    check.checkEmail(email);
    const verificationId = randomUUID();
    const verificationCode = generateNumber();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    let sql = "insert into emails_for_verify (verificationId, email, codice, expires_at) values(?, ?, ?, ?)";
    let data = [verificationId, email, verificationCode, expiresAt];
    const [result] = await pool.execute(sql, data);

    await sendMail(email, verificationCode);
    return {
        type: "CODE_SENT",
        email: email,
        verificationId: verificationId
    };
    }

exports.broadcast = (data) => {
    if(!wss) return;

    const message = JSON.stringify(data);

    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN)
            client.send(message);
    });
};