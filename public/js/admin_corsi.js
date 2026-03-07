const ws = new WebSocket(`${WS_BASE}`);
const table = document.querySelector('#courses');
const nCorsi = document.querySelector('#nCorsi');
const popup = document.querySelector('#popup');
const codPopup = document.querySelector('#codPopup');
const container = document.querySelector('#container');
const error = document.querySelector('#error');
const rateLimitPar = document.querySelector('#rateLimit');
const minutesLeft = document.querySelector('#minutesLeft');

codPopup.addEventListener('keyup', fVerifyCode);

ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    switch (data.type) {
        case "LOAD_COURSES_ADMIN":
            fLoadCoursesVisual(data.result);
            break;
        case "RESPONSE_VERIFY_ADMIN_PASSWORD":
            fVerifyCodeResponse(data.success, data.minutesLeft);
            break;
        default:
            break;
    }
}

function fVerifyCode()
    {
    if(codPopup.value.trim().length != 9) return;

    ws.send(JSON.stringify({
        type: "VERIFY_ADMIN_PASSWORD",
        psw: codPopup.value
    }));
    }

function fVerifyCodeResponse(success, minutesLeft)
    {
    if(success)
        {
        rateLimitPar.setAttribute('hidden', 'yes');
        error.setAttribute('hidden', 'yes');
        popup.setAttribute('hidden', 'yes');
        overlay.style.display = 'none';
        ws.send(JSON.stringify({type: "GET_COURSES_ADMIN"}));
        container.removeAttribute('hidden');
        }
    else if(minutesLeft)
        {
        rateLimitPar.innerHTML = "Hai superato il limite di tentativi! Riprova tra " + minutesLeft.toString() + " minuti";
        rateLimitPar.removeAttribute('hidden');
        }
    else
        error.removeAttribute('hidden');
    }

function fLoadCoursesVisual(result)
    {
    if(!result)
        {
        table.innerHTML = "non sono ancora presenti corsi";
        nCorsi.innerHTML = 0;
        return;
        }

    const DIM = result.length;
    nCorsi.innerHTML = DIM;
    const DIM_POSTI = 10;
    
    for(let i=0;i<DIM;i++)
        {
        let row = document.createElement('tr');
        table.appendChild(row);

        let nome = document.createElement('td');
        nome.value = result[i].nome;
        nome.innerHTML = result[i].nome;
        row.appendChild(nome);

        let descrizione = document.createElement('td');
        descrizione.value = result[i].descrizione;
        descrizione.innerHTML = result[i].descrizione;
        row.appendChild(descrizione);

        let n_ore = document.createElement('td');
        n_ore.value = result[i].n_ore;
        n_ore.innerHTML = result[i].n_ore;
        row.appendChild(n_ore);

        let giorno1 = document.createElement('td');
        giorno1.value = result[i].giorno1;
        giorno1.innerHTML = result[i].giorno1;
        row.appendChild(giorno1);

        let giorno2 = document.createElement('td');
        giorno2.value = result[i].giorno2;
        giorno2.innerHTML = result[i].giorno2;
        row.appendChild(giorno2);

        let relatori = document.createElement('td');
        let value = result[i].nome_cognome_classe_ref1;
        if(result[i].nome_cognome_classe_ref2)
            value = value + ", " + result[i].nome_cognome_classe_ref2;
        if(result[i].nome_cognome_classe_ref3)
            value = value + ", " + result[i].nome_cognome_classe_ref3;
        if(result[i].nome_cognome_classe_ref4)
            value = value + ", " + result[i].nome_cognome_classe_ref4;
        relatori.value = value;
        relatori.innerHTML = value;
        row.appendChild(relatori);

        let email = document.createElement('td');
        email.innerHTML = result[i].email_ref;
        row.appendChild(email)

        let relatoriEst = document.createElement('td');
        relatoriEst.value = result[i].nome_ref_esterni;
        relatoriEst.innerHTML = result[i].nome_ref_esterni;
        row.appendChild(relatoriEst);

        let postiArray = [result[i].posti_1_1, result[i].posti_1_2, result[i].posti_1_3, result[i].posti_1_4, result[i].posti_1_5, result[i].posti_2_1, result[i].posti_2_2, result[i].posti_2_3, result[i].posti_2_4, result[i].posti_2_5];
        for(let j=0;j<DIM_POSTI;j++)
            {
            let posti = document.createElement('td');
            posti.innerHTML = postiArray[j];
            row.appendChild(posti);
            }
        }
    }