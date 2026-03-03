const pool = require('../db/pool');
const HttpError = require('../errors/httpError');
const { broadcast } = require('../ws/socket');
require('dotenv').config();
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const buildEmailHtml = require('../middlewares/buildEmailHtml.function').buildEmailHtml;
const serviceFunctions = require('../middlewares/serviceFunctions');

exports.insering = async (courseData, nRel, elencoRelData) => {
    const conn = await pool.getConnection();
    try
        {
        await conn.beginTransaction();

        const data = [courseData.nomeCorso, courseData.descrizione, courseData.nome_cognome_classe_rel1, courseData.nome_cognome_classe_rel2, courseData.nome_cognome_classe_rel3, courseData.nome_cognome_classe_rel4, courseData.nOre, courseData.giorno1, courseData.giorno2, courseData.nome_ref_esterni, courseData.email];
        let sql = "insert into corso(nome, descrizione, nome_cognome_classe_ref1, nome_cognome_classe_ref2, nome_cognome_classe_ref3, nome_cognome_classe_ref4, n_ore, giorno1, giorno2, nome_ref_esterni, email_ref) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [resultCourse] = await conn.execute(sql, data);

        const nomiRel = [elencoRelData.nome_rel1, elencoRelData.nome_rel2, elencoRelData.nome_rel3, elencoRelData.nome_rel4];
        const cognomiRel = [elencoRelData.cognome_rel1, elencoRelData.cognome_rel2, elencoRelData.cognome_rel3, elencoRelData.cognome_rel4];
        const classiRel = [elencoRelData.classe_rel1, elencoRelData.classe_rel2, elencoRelData.classe_rel3, elencoRelData.classe_rel4];

        for(let i=0;i<nRel;i++)
            await serviceFunctions.insertRelatori(nomiRel[i], cognomiRel[i], classiRel[i], elencoRelData.nomeCorso, conn);

        sql = "select nome from corso";
        const [courses] = await conn.execute(sql);
        if(!courses || courses.length == 0) return;
        broadcast({
            type: "LOAD_COURSES_PRESENT", 
            result: courses
        });

        await conn.commit();
        return resultCourse;
        }
    catch(err)
        {
        await conn.rollback();
        throw new HttpError(err.message, err.status ?? 500);
        }
    finally
        {
        conn.release();
        }
};

exports.registration = async (registrationData) => {
    const conn = await pool.getConnection();
    try
        {
        await conn.beginTransaction();
        let dataG1 = [registrationData.nome, registrationData.cognome, registrationData.classe, registrationData.email, registrationData.o1g1, registrationData.o2g1, registrationData.o3g1, registrationData.o4g1, registrationData.o5g1];
        let dataG2 = [registrationData.nome, registrationData.cognome, registrationData.classe, registrationData.email, registrationData.o1g2, registrationData.o2g2, registrationData.o3g2, registrationData.o4g2, registrationData.o5g2];
        
        let o1g1, o2g1, o3g1, o4g1, o5g1;
        if(registrationData.o1g1 != "relatore" && registrationData.o1g1 != "assente")
            {
            let sql = "select posti_1_1, n_ore from corso where nome = ? FOR UPDATE";
            [o1g1] = await conn.execute(sql, [registrationData.o1g1]);
            if(o1g1.length == 0)
                throw new HttpError("Corso non trovato!", 404);
            if(Number(o1g1[0].n_ore) == 2)
                dataG1[5] = dataG1[4];

            sql = "select posti_1_2 from corso where nome = ? FOR UPDATE";
            [o2g1] = await conn.execute(sql, [registrationData.o2g1]);
            if(o2g1.length == 0)
                throw new HttpError("Corso non trovato!", 404);

            sql = "select posti_1_3, n_ore from corso where nome = ? FOR UPDATE";
            [o3g1] = await conn.execute(sql, [registrationData.o3g1]);
            if(o3g1.length == 0)
                throw new HttpError("Corso non trovato!", 404);
            if(Number(o3g1[0].n_ore) == 2)
                dataG1[7] = dataG1[6];

            sql = "select posti_1_4 from corso where nome = ? FOR UPDATE";
            [o4g1] = await conn.execute(sql, [registrationData.o4g1]);
            if(o4g1.length == 0)
                throw new HttpError("Corso non trovato!", 404);

            sql = "select posti_1_5 from corso where nome = ? FOR UPDATE";
            [o5g1] = await conn.execute(sql, [registrationData.o5g1]);
            if(o5g1.length == 0)
                throw new HttpError("Corso non trovato!", 404);
            
            const posti = ["posti_1_1", "posti_1_2", "posti_1_3", "posti_1_4", "posti_1_5"];
            const datas = [registrationData.o1g1, registrationData.o2g1, registrationData.o3g1, registrationData.o4g1, registrationData.o5g1];
            for(let i=0;i<5;i++)
                await serviceFunctions.updateSeatsAndCheck(conn, posti[i], datas[i]);
            }

        sql = "insert into elenco_iscritti_giorno1 (nome, cognome, classe, email, prima_ora, seconda_ora, terza_ora, quarta_ora, quinta_ora) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [result1] = await conn.execute(sql, dataG1);
        
        if(registrationData.o1g1 != "relatore" && registrationData.o1g1 != "assente")
            {
            const datas = [registrationData.o1g1, registrationData.o2g1, registrationData.o3g1, registrationData.o4g1, registrationData.o5g1];
            const posti = [o1g1[0].posti_1_1, o2g1[0].posti_1_2, o3g1[0].posti_1_3, o4g1[0].posti_1_4, o5g1[0].posti_1_5];
            for(let i=0;i<5;i++)
                serviceFunctions.checkAndSendBroadcast(posti[i], 1, (i+1), datas[i]);
            }
        
        
        let o1g2, o2g2, o3g2, o4g2, o5g2;
        if(registrationData.o1g2 != "relatore" && registrationData.o1g2 != "assente")
            {
            sql = "select posti_2_1, n_ore from corso where nome = ? FOR UPDATE";
            [o1g2] = await conn.execute(sql, [registrationData.o1g2]);
            if(o1g2.length == 0)
                throw new HttpError("Corso non trovato!", 404);
            if(Number(o1g2[0].n_ore) == 2)
                dataG2[5] = dataG2[4];

            sql = "select posti_2_2 from corso where nome = ? FOR UPDATE";
            [o2g2] = await conn.execute(sql, [registrationData.o2g2]);
            if(o2g2.length == 0)
                throw new HttpError("Corso non trovato!", 404);

            sql = "select posti_2_3, n_ore from corso where nome = ? FOR UPDATE";
            [o3g2] = await conn.execute(sql, [registrationData.o3g2]);
            if(o3g2.length == 0)
                throw new HttpError("Corso non trovato!", 404);
            if(Number(o3g2[0].n_ore) == 2)
                dataG2[7] = dataG2[6];

            sql = "select posti_2_4 from corso where nome = ? FOR UPDATE";
            [o4g2] = await conn.execute(sql, [registrationData.o4g2]);
            if(o4g2.length == 0)
                throw new HttpError("Corso non trovato!", 404);

            sql = "select posti_2_5 from corso where nome = ? FOR UPDATE";
            [o5g2] = await conn.execute(sql, [registrationData.o5g2]);
            if(o5g2.length == 0)
                throw new HttpError("Corso non trovato!", 404);
            
            const posti = ["posti_2_1", "posti_2_2", "posti_2_3", "posti_2_4", "posti_2_5"];
            const datas = [registrationData.o1g2, registrationData.o2g2, registrationData.o3g2, registrationData.o4g2, registrationData.o5g2];
            for(let i=0;i<5;i++)
                await serviceFunctions.updateSeatsAndCheck(conn, posti[i], datas[i]);
            }

        sql = "insert into elenco_iscritti_giorno2 (nome, cognome, classe, email, prima_ora, seconda_ora, terza_ora, quarta_ora, quinta_ora) values(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const [result2] = await conn.execute(sql, dataG2);

        if(registrationData.o1g2 != "relatore" && registrationData.o1g2 != "assente")
            {
            const datas = [registrationData.o1g2, registrationData.o2g2, registrationData.o3g2, registrationData.o4g2, registrationData.o5g2];
            const posti = [o1g2[0].posti_2_1, o2g2[0].posti_2_2, o3g2[0].posti_2_3, o4g2[0].posti_2_4, o5g2[0].posti_2_5];
            for(let i=0;i<5;i++)
                serviceFunctions.checkAndSendBroadcast(posti[i], 2, (i+1), datas[i]);
            }
        
        await conn.commit();

        const emailData = {
            nome: registrationData.nome,
            cognome: registrationData.cognome,
            classe: registrationData.classe,
            email: registrationData.email,
            giorno1: [registrationData.o1g1, registrationData.o2g1, registrationData.o3g1, registrationData.o4g1, registrationData.o5g1],
            giorno2: [registrationData.o1g2, registrationData.o2g2, registrationData.o3g2, registrationData.o4g2, registrationData.o5g2]
            }
        
        for(let i=0;i<2;i++)
            {
            try 
                {
                sendMail(registrationData.email, emailData);
                break;
                } 
        catch (err) 
                {
                if(i==1)
                    logEmailError(registrationData.email, err);
                }
            }

        return {result1, result2};
        } 
    catch (err) 
        {
        await conn.rollback();
        throw err;
        }
    finally
        {
        conn.release();
        }
};

async function sendMail(to, emailData)
    {
    try
        {
        const htmlResponse = buildEmailHtml(emailData);
        const mailOptions = {
            from: 'School Event Days <onboarding@resend.dev>',
            to: to,
            subject: "I tuoi corsi - School Event Days",
            html: htmlResponse
        };
        await resend.emails.send(mailOptions);
        }
    catch(err)
        {
        throw new HttpError(err.message, err.status ?? 451)
        }
    }

function logEmailError(email, err) 
    {
    console.error(`
    [EMAIL ERROR]
    Destinatario: ${email}
    Data: ${new Date().toISOString()}
    Errore: ${err.message}
    `);
    }