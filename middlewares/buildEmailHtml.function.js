exports.buildEmailHtml = (data) => {
  const renderRow = (arr) =>
    arr.map(c => `
      <td style="border:1px solid #cce0ff;padding:8px;text-align:center;font-size:14px;">
        ${c}
      </td>
    `).join("");

  return `
  <html>
    <body style="font-family:Arial,sans-serif;background:#f4f8ff;padding:20px;color:#003366;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">

            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:20px;">
              
              <tr>
                <td style="text-align:center;font-size:22px;font-weight:bold;padding-bottom:10px;">
                  Conferma iscrizione corsi
                </td>
              </tr>

              <tr>
                <td style="padding-bottom:15px;font-size:14px;">
                  <strong>Studente:</strong> ${data.nome} ${data.cognome}<br>
                  <strong>Classe:</strong> ${data.classe}<br>
                  <strong>Email:</strong> ${data.email}
                </td>
              </tr>

              <tr>
                <td style="font-weight:bold;padding-top:10px;">Giorno 1</td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:5px;">
                    <tr style="background:#e0ecff;">
                      <th style="border:1px solid #cce0ff;padding:6px;">8-9</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">9-10</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">10-11</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">11-12</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">12-13</th>
                    </tr>
                    <tr>
                      ${renderRow(data.giorno1)}
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="font-weight:bold;padding-top:15px;">Giorno 2</td>
              </tr>
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:5px;">
                    <tr style="background:#e0ecff;">
                      <th style="border:1px solid #cce0ff;padding:6px;">8-9</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">9-10</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">10-11</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">11-12</th>
                      <th style="border:1px solid #cce0ff;padding:6px;">12-13</th>
                    </tr>
                    <tr>
                      ${renderRow(data.giorno2)}
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding-top:20px;font-size:12px;color:#666;">
                  Questa email è una conferma ufficiale dell’iscrizione ai corsi.<br>
                  Non rispondere a questo messaggio.
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    </body>
  </html>`;
}
