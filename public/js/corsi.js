const ws = new WebSocket('ws://localhost:3000');
const table = document.querySelector('#courses');
ws.onopen = () => {
    ws.send(JSON.stringify({type: "GET_COURSES_VISUAL"}));
}
ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    switch (data.type) {
        case "LOAD_COURSES_VISUAL":
            fLoadCoursesVisual(data.result);
            break;
        default:
            break;
    }
}

function fLoadCoursesVisual(result)
    {
    const DIM = result.length;
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

        let relatoriEst = document.createElement('td');
        relatoriEst.value = result[i].nome_ref_esterni;
        relatoriEst.innerHTML = result[i].nome_ref_esterni;
        row.appendChild(relatoriEst);
        }
    }