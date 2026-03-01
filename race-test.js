const axios = require('axios');

const URL = 'http://localhost:3000/gda/registration';
const TOTAL_REQUESTS = 20;

const basePayload = {
  nome: "Test",
  cognome: "User",
  classe: "3A",
  email: "", // poichè verrà sovrascritto
  relatore_g1: "no",
  assente_g1: "no",
  relatore_g2: "si",
  assente_g2: "no",

  prima_ora_g1: "prova",
  seconda_ora_g1: "prova",
  terza_ora_g1: "prova",
  quarta_ora_g1: "prova",
  quinta_ora_g1: "prova",

  prima_ora_g2: "relatore",
  seconda_ora_g2: "relatore",
  terza_ora_g2: "relatore",
  quarta_ora_g2: "relatore",
  quinta_ora_g2: "relatore"
};

async function sendRequest(i) {
  try {
    const payload = {
      ...basePayload,
      email: `test${i}@liceovolterra.edu.it`
    };

    const res = await axios.post(URL, payload);
    console.log(`✅ [${i}] OK -> ${res.status}`);
  } catch (err) {
    if (err.response) {
      console.log(`❌ [${i}] FAIL -> ${err.response.status}`);
    } else {
      console.log(`❌ [${i}] ERROR -> ${err.message}`);
    }
  }
}

async function runTest() {
  const promises = [];

  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    promises.push(sendRequest(i));
  }

  await Promise.all(promises);
  console.log("🏁 Test completato");
}

runTest();
