const ws = new WebSocket(`${WS_BASE}`);
const tableG1 = document.querySelector('#giorno1');
const tableG2 = document.querySelector('#giorno2');
const nIscritti = document.querySelector('#nIscritti');
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
        case "LOAD_REGISTRATION_DATA_ADMIN":
            console.log("ws recived");
            fLoadCoursesVisual(data.resultG1, data.resultG2);
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
        ws.send(JSON.stringify({type: "GET_REGISTRATION_DATA_ADMIN"}));
        container.removeAttribute('hidden');
        console.log("ws sent");
        }
    else if(minutesLeft)
        {
        rateLimitPar.innerHTML = "Hai superato il limite di tentativi! Riprova tra " + minutesLeft.toString() + " minuti";
        rateLimitPar.removeAttribute('hidden');
        }
    else
        error.removeAttribute('hidden');
    }

function fLoadCoursesVisual(resultG1, resultG2)
    {
    console.log(resultG1, resultG2);
    if(!resultG1 )
        {
        tableG1.innerHTML = "non sono ancora presenti corsi";
        tableG2.innerHTML = "";
        nIscritti.innerHTML = 0;
        return;
        }
    
    if(resultG1.length != resultG2.length)
        console.error("error in admin_registrazione_js: unvalid DIM");
    nIscritti.innerHTML = resultG1.length;
    
    fAddDatas(resultG1, tableG1);
    fAddDatas(resultG2, tableG2);
    }

function fAddDatas(result, table)
    {
    const DIM = result.length;
    for(let i=0;i<DIM;i++)
        {
        let row = document.createElement('tr');
        table.appendChild(row);

        let nome = document.createElement('td');
        nome.innerHTML = result[i].nome;
        row.appendChild(nome);

        let cognome = document.createElement('td');
        cognome.innerHTML = result[i].cognome;
        row.appendChild(cognome);

        let classe = document.createElement('td');
        classe.innerHTML = result[i].classe;
        row.appendChild(classe);

        let email = document.createElement('td');
        email.innerHTML = result[i].email;
        row.appendChild(email);

        let primaOra = document.createElement('td');
        primaOra.innerHTML = result[i].prima_ora;
        row.appendChild(primaOra);

        let secondaOra = document.createElement('td');
        secondaOra.innerHTML = result[i].seconda_ora;
        row.appendChild(secondaOra);

        let terzaOra = document.createElement('td');
        terzaOra.innerHTML = result[i].terza_ora;
        row.appendChild(terzaOra);

        let quartaOra = document.createElement('td');
        quartaOra.innerHTML = result[i].quarta_ora;
        row.appendChild(quartaOra);

        let quintaOra = document.createElement('td');
        quintaOra.innerHTML = result[i].quinta_ora;
        row.appendChild(quintaOra);
        }
    }