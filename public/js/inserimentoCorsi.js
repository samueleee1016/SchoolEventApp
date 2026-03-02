const ws = new WebSocket(`${WS_BASE}`);
const interni = document.querySelector('#div_interni');
const esterni_1 = document.querySelector('#div_esterni');
const esterni_2 = document.querySelector('#div_esterni_n_rel');
const esterni_3 = document.querySelector('#div_esterni_campi');
const n_rel = document.querySelector('#n_relatori');
const btnSubmit = document.querySelector('#invia');
const info = document.querySelector('.info');
const tableCorsi = document.querySelector('#corsiPresenti');
const nCorsi = document.querySelector('#nCorsi');
var emailChecked = false;
const popup = document.querySelector('#popup');
const popupBtn = document.querySelector('#btn');
const overlay = document.querySelector('#overlay');
const popupEmailBtn = document.querySelector('#emailBtn');
const formDati = document.querySelector('#form1');
formDati.setAttribute('action', `${HTTP_BASE}/createCourse`);

ws.onopen = () => {
    ws.send(JSON.stringify({type: "GET_COURSES_PRESENT"}));
};
ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    switch (data.type) {
        case "LOAD_COURSES_PRESENT":
            fLoadCoursesPresent(data.result);
            break;
        case "CODE_SENT":
            fCodeEvent();
            break;
        case "RESPONSE_VERIFY_CODE":
            fResponseVerifyCode(data.success, data.msg);
            break;
        default:
            break;
    }
};

function fLoadCoursesPresent(result)
    {
    tableCorsi.innerHTML = "";
    let th = document.createElement('th');
    th.innerHTML = "Nome corso";
    tableCorsi.appendChild(th);

    info.removeAttribute('hidden');
    const DIM = result.length;
    nCorsi.innerHTML = DIM;
    for(let i=0;i<DIM;i++)
        {
        let row = document.createElement('tr');
        tableCorsi.appendChild(row);
        let column = document.createElement('td');
        column.value = result[i].nome;
        column.innerHTML = result[i].nome;
        row.appendChild(column);
        }
    }

function fCreateInt(key)
    {
    if(key == 'Backspace')
        interni.innerHTML = "";
    else if(!n_rel.value) return;
    else if(n_rel.value < 1 || n_rel.value >4)
        {
        alert('Il numero di relatori deve essere compreso tra 1 e 4!');
        return;
        }
    
    var dim = n_rel.value;
    if(!dim)
        {
        alert("Devi inserire il numero di relatori!");
        }
    
    interni.innerHTML = "Dati relatori: <br> ";
    for (let i=1;i<=dim;i++)
        {
        interni.innerHTML += `<input type='text' name='nome_rel_${i}' id='nome_rel_${i}' placeholder='nome relatore ${i}' onkeyup='fValidateForm()'> <br> 
        <input type='text' name='cognome_rel_${i}' id='cognome_rel_${i}' placeholder='cognome relatore ${i}' onkeyup='fValidateForm()'> <br>  
        <input type='text' name='classe_rel_${i}' id='classe_rel_${i}' placeholder='classe relatore ${i}' maxlength='5' onkeyup='fValidateForm()'> <br><br>`;
        }
    
    interni.innerHTML += `Inserisci un email di riferimento per tutti i relatori: <br>
                        <input type='text' name='email_rel' id='email_rel' placeholder='email' onkeyup='fValidateForm()'> <br>`;
    
    fValidateForm();
    }

function fCreateEst()
    {
    esterni_3.innerHTML = "";
    var dimRE = document.getElementById('n_rel_esterni').value;
    if(!dimRE) return;
    else if(dimRE < 1 || dimRE > 3)
        {
        alert('I relatori esterni se ci sono possono essere massimo 3 e minimo 1!');
        return;
        }
    for(let i=1;i<=dimRE;i++)
        {
        esterni_3.innerHTML += `<input type='text' name='nome_rel_esterno_${i}' id='nome_rel_esterno_${i}' placeholder='nome relatore esterno ${i}' onkeyup='fValidateForm()'> <br> <input type='text' name='cognome_rel_esterno_${i}' id='cognome_rel_esterno_${i}' placeholder='cognome relatore esterno ${i}' onkeyup='fValidateForm()'> <br><br>`;
        }
                
    fValidateForm();
    }

function RelEstNo()
    {
    esterni_2.innerHTML = "";
    esterni_3.innerHTML = "";
    fValidateForm();
    }

function RelEstSi()
    {
    esterni_2.innerHTML += `Numero di relatori esterni: <input type="number" name="n_rel_esterni" id="n_rel_esterni" min="1" max="3" oninput="fCreateEst()" value='1'> <br>`;
    fValidateForm();
    }

function fCheckInt()
    {
    dim=n_rel.value;
    if(!dim) return false;

    for(let i=1;i<=dim;i++)
        {
        let nome = document.getElementById(`nome_rel_${i}`).value.trim();
        let cognome = document.getElementById(`cognome_rel_${i}`).value.trim();
        let classe = document.getElementById(`classe_rel_${i}`).value.trim();

        if(nome === "" || cognome === "" || classe === "")
            return false;
        if(isNaN(Number(classe[0])) || Number(classe[0]) > 5 || classe.length < 2)
            return false;
        }
    
    let email = document.getElementById(`email_rel`).value.trim();
    // let checkemail = email.slice(0, -domain.length);
    if(email === "" || !email.includes('@')) 
        return false;

    return true;
    }

function fCheckEst()
    {
    let estNoCheck = document.getElementById('rel_esterni_no');
    if(estNoCheck.checked) return true;
    if(!document.getElementById('n_rel_esterni')) return false;

    var dim = document.getElementById('n_rel_esterni').value;

    for(let i=1;i<=dim;i++)
        {
        let nome = document.getElementById(`nome_rel_esterno_${i}`);
        let cognome = document.getElementById(`cognome_rel_esterno_${i}`);

        if(!nome || !cognome) return false;
        if(nome.value.trim() === "" || cognome.value.trim() === "") return false;
        }
    
    return true;
    }

function fCheckCorso(giorno1, giorno2)
    {
    let giorno1Check = document.getElementById('giorno1_no');
    let giorno2Check = document.getElementById('giorno2_no');
    if(giorno1Check.checked && giorno2Check.checked)
        return false;

    let n_ore = document.getElementById('n_ore');
    if (!Number(n_ore.value)) return false;

    let nome = document.getElementById('nome_corso').value.trim();
    let descrizione = document.getElementById('descrizione').value.trim();
    if(nome === "" || descrizione === "")
            return false;
    else
        return true;
    }

function fValidateForm()
    {
    if(fCheckCorso() && fCheckEst() && fCheckInt())
        btnSubmit.disabled = false;
    else
        btnSubmit.disabled = true;
    }

function fCheckNore()
    {
    let n_ore = document.getElementById('n_ore').value;
    if(n_ore < 1 || n_ore > 2)
        alert('Il corso può durare solo 1 o 2 ore!');
    else
        return true;
    }

function fCheckForm(e)
    {
    let email= document.querySelector('#email_rel').value.trim();
    let check = email.includes('@');
    if(!check)
        {
        e.preventDefault();
        alert('Controlla che tutte le email siano valide!');
        return;
        }

    if(!emailChecked)
        {
        e.preventDefault();
        fEmailPopup();
        }
    }

function fEmailPopup()
    {
    popupBtn.setAttribute('hidden', 'yes');
    popupEmailBtn.removeAttribute('hidden');
    popupBtn.addEventListener('click', function(){
        popup.classList.remove("open-popup");
        overlay.style.display = 'none';
    });
    popupEmailBtn.addEventListener('click', function(){
        popup.classList.remove("open-popup");
        overlay.style.display = 'none';
    });

    let pResult = document.querySelector('#result');
    let code = document.querySelector('#emailCode');
    let par = document.querySelector('#par');

    pResult.innerHTML = "";
    code.value = "";
    code.removeAttribute('hidden');
    par.removeAttribute('hidden');

    popup.classList.add("open-popup");
    overlay.style.display = 'block';
    let email = document.querySelector('#email_rel').value;
    ws.send(JSON.stringify({
        type: "VERIFY_EMAIL",
        email: email
    }));
    }

function fCodeEvent()
    {
    const code = document.querySelector('#emailCode');
    code.removeEventListener('keyup', fVerifyCode);
    code.addEventListener('keyup', fVerifyCode);
    }

function fVerifyCode()
    {
    const code = document.querySelector('#emailCode').value;
    const email = document.querySelector('#email_rel').value;
    if(code.length != 6) return;
    ws.send(JSON.stringify({
        type: "VERIFY_CODE",
        code: code,
        email: email
    }));
    }

function fResponseVerifyCode(success, msg)
    {
    let pResult = document.querySelector('#result');
    let code = document.querySelector('#emailCode');
    let par = document.querySelector('#par');
    if(!success)
        {
        switch (msg) {
            case "error":
                code.setAttribute('hidden', 'yes');
                par.setAttribute('hidden', 'yes');
                pResult.innerHTML = "Errore nel controllo dell'email, premi ok e riprova";
                popupBtn.removeAttribute('hidden');
                popupEmailBtn.setAttribute('hidden', 'yes');
                break;
            case "unvalid code":
                pResult.innerHTML = "Codice non valido, riprova";
                break;
            case "code expired":
                code.setAttribute('hidden', 'yes');
                par.setAttribute('hidden', 'yes');
                pResult.innerHTML = "Codice scaduto, clicca 'chiudi' e premi nuovamente invio per ricevere una nuova email";
                popupBtn.removeAttribute('hidden');
                popupEmailBtn.setAttribute('hidden', 'yes');
                break;
            default:
                break;
        }
        return;
        }
    emailChecked = true;
    let email = document.querySelector('#email_rel');
    email.setAttribute('readonly', 'yes');
    popup.classList.remove("open-popup");
    overlay.style.display = 'none';
    }