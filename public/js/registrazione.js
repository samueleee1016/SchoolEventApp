const ws = new WebSocket(`${WS_BASE}`);
const o1g1 = document.querySelector('#prima_ora_g1');
const o2g1 = document.querySelector('#seconda_ora_g1');
const o3g1 = document.querySelector('#terza_ora_g1');
const o4g1 = document.querySelector('#quarta_ora_g1');
const o5g1 = document.querySelector('#quinta_ora_g1');
const o1g2 = document.querySelector('#prima_ora_g2');
const o2g2 = document.querySelector('#seconda_ora_g2');
const o3g2 = document.querySelector('#terza_ora_g2');
const o4g2 = document.querySelector('#quarta_ora_g2');
const o5g2 = document.querySelector('#quinta_ora_g2');
const btn = document.querySelector('#invia');
const divGiorno1 = document.querySelector('#giorno1_corsi');
const divGiorno2 = document.querySelector('#giorno2_corsi');
var emailChecked = false;
const finalPar = document.querySelector('#finalPar');
const popup = document.querySelector('#popup');
const popupBtn = document.querySelector('#btn');
const overlay = document.querySelector('#overlay');
const popupEmailBtn = document.querySelector('#emailBtn');
const formDati = document.querySelector('#formDati');
formDati.setAttribute('action', `${HTTP_BASE}/validateRegistration`);
const linkOtherCourses = document.querySelector('#linkOtherCourses');
linkOtherCourses.setAttribute('href', `${HTTP_BASE}/courses`);

ws.onopen = () => {
    ws.send(JSON.stringify({type: "GET_CORSI"}));
};
ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    switch (data.type) {
        case "CREATE_LIST":
            fCreateLists(data);
            break;
        case "COURSE_FULL":
            fDeleteCourseFull(data.day, data.hour, data.courseName);
            break;
        case "RESULT_2ORE":
            fCheck2oraGet(data.success, data.id, data.oreNext);
            break;
        case "RETURN_SEC_QUARTA_ORA":
            fResultSecondaQuartaOra(data.success, data.idCorso);
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

function fCreateOption(parent, options)
    {
    const DIM = options.length;
    for(let i=0;i<DIM;i++)
        {
        let option = document.createElement('option');
        option.value = options[i].nome;
        option.innerHTML = options[i].nome;
        parent.appendChild(option);
        }
    }

function fCreateLists(data)
    {
    fCreateOption(o1g1, data.o1g1);
    fCreateOption(o2g1, data.o2g1);
    fCreateOption(o3g1, data.o3g1);
    fCreateOption(o4g1, data.o4g1);
    fCreateOption(o5g1, data.o5g1);
    
    fCreateOption(o1g2, data.o1g2);
    fCreateOption(o2g2, data.o2g2);
    fCreateOption(o3g2, data.o3g2);
    fCreateOption(o4g2, data.o4g2);
    fCreateOption(o5g2, data.o5g2);
    };

function deleteCourse(day, courseName)
    {
    const options = Array.from(day);
    const dim = options.length;
    for(let i=0;i<dim;i++)
        {
        if(options[i].value == courseName)
            {
            options[i].remove();
            return;
            }
        }
    }
 
function fDeleteCourseFull(day, hour, courseName)
    {
    const hoursDay1 = [o1g1.options, o2g1.options, o3g1.options, o4g1.options, o5g1.options];
    const hoursDay2 = [o1g2.options, o2g2.options, o3g2.options, o4g2.options, o5g2.options];
    if(Number(day) === 1)
        deleteCourse(hoursDay1[Number(hour-1)], courseName)
    else if(Number(day) === 2)
        deleteCourse(hoursDay2[Number(hour-1)], courseName)
    }

function fCheck2ora(corso, nextCorso)
    {
    ws.send(JSON.stringify({
        type: "CHECK_2ORE",
        nomeCorso: corso.value,
        id: corso.id,
        nomeNextCorso: nextCorso.value
    }));
    }
function fCheck2oraGet(success, id, oreNext)
    {
    if(!success)
        {
        switch (id) {
        case "prima_ora_g1":
            if(Number(oreNext) == 2)
                o2g1.value = "";
            break;
        case "terza_ora_g1":
            if(Number(oreNext) == 2)
                o4g1.value = "";
            break;
        case "prima_ora_g2":
            if(Number(oreNext) == 2)
                o2g2.value = "";
            break;
        case "terza_ora_g2":
            if(Number(oreNext) == 2)
                o4g2.value = "";
            break;
        default:
            break;
        }
        return;
        }
    
    switch (id) {
        case "prima_ora_g1":
            o2g1.value = o1g1.value;
            break;
        case "terza_ora_g1":
            o4g1.value = o3g1.value;
            break;
        case "prima_ora_g2":
            o2g2.value = o1g2.value;
            break;
        case "terza_ora_g2":
            o4g2.value = o3g2.value;
            break;
        default:
            break;
    }
    }

function fCheckSecondaQuartaOra(corso, corsoPrec)
    {
    ws.send(JSON.stringify({
        type: "CHECK_SEC_QUART_ORA",
        corso: corso.value,
        id: corso.id,
        corsoPrec: corsoPrec.value
    }));
    }
function fResultSecondaQuartaOra(success, id)
    {
    if(!success) return;
    else if(success == "Change_corso_prec")
        {
        switch (id) {
            case "seconda_ora_g1":
                o1g1.value = "";
                break;
            case "quarta_ora_g1":
                o3g1.value = "";
                break;
            case "seconda_ora_g2":
                o1g2.value = "";
                break;
            case "quarta_ora_g2":
                o3g2.value = ""
                break;
            default:
                break;
        }
        return;
        }

    switch (id) {
        case "seconda_ora_g1":
            o1g1.value = o2g1.value;
            break;
        case "quarta_ora_g1":
            o3g1.value = o4g1.value;
            break;
        case "seconda_ora_g2":
            o1g2.value = o2g2.value;
            break;
        case "quarta_ora_g2":
            o3g2.value = o4g2.value;
            break;
        default:
            break;
    }
    }

function fValidateForm()
    {
    let nome = document.getElementById('nome').value.trim();
    let cognome = document.getElementById('cognome').value.trim();
    let classe = document.getElementById('classe').value.trim();
    let email = document.getElementById('email').value.trim();
    let assenteG1 = document.querySelector('input[name="assente_g1"]:checked')?.value;
    let relatoreG1 = document.querySelector('input[name="relatore_g1"]:checked')?.value;
    let assenteG2 = document.querySelector('input[name="assente_g2"]:checked')?.value;
    let relatoreG2 = document.querySelector('input[name="relatore_g2"]:checked')?.value;
    
    if((assenteG1 == "si" && relatoreG1 == "si") || (assenteG2 == "si" && relatoreG2 == "si"))
        {
        btn.disabled = true;
        return;
        }
    if(!nome || !cognome || !classe || !email || typeof(nome) != "string" || typeof(cognome) != "string" || typeof(classe) != "string" || typeof(email) != "string" || !email.includes('@') || classe.length > 5)
        {
        btn.disabled = true;
        return;
        }
    if(isNaN(Number(classe[0])) || Number(classe[0]) > 5 || classe.length < 2)
        {
        btn.disabled = true;
        return;
        }
    if(assenteG1 == "no" && relatoreG1 == "no")
        if(!o1g1 || o1g1.value === "" || !o2g1 || o2g1.value === "" || !o3g1 || o3g1.value === "" || !o4g1 || o4g1.value === "" || !o5g1 || o5g1.value === "")
        {
        btn.disabled = true;
        return;
        }
    
    if(assenteG2 == "no" && relatoreG2 == "no")
        if(!o1g2 || o1g2.value === "" || !o2g2 || o2g2.value === "" || !o3g2 || o3g2.value === "" || !o4g2 || o4g2.value === "" || !o5g2 || o5g2.value === "")
        {
        btn.disabled = true;
        return;
        }

    btn.disabled = false;
    }

function fAssentiRelatori() 
    {
    const assenteG1 = document.querySelector('input[name="assente_g1"]:checked')?.value;
    const relatoreG1 = document.querySelector('input[name="relatore_g1"]:checked')?.value;
    const assenteG2 = document.querySelector('input[name="assente_g2"]:checked')?.value;
    const relatoreG2 = document.querySelector('input[name="relatore_g2"]:checked')?.value;

    if (assenteG1 === "si" || relatoreG1 === "si")
        divGiorno1.hidden = true;
    else
        divGiorno1.hidden = false;

    if (assenteG2 === "si" || relatoreG2 === "si")
        divGiorno2.hidden = true;
    else
        divGiorno2.hidden = false;
    }

function fCheckEmail(e)
    {
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
    let email = document.querySelector('#email').value;
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
    const email = document.querySelector('#email').value;
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
    let email = document.querySelector('#email');
    email.setAttribute('readonly', 'yes');
    popup.classList.remove("open-popup");
    overlay.style.display = 'none';
    }
