const fs = require('fs');
const express = require('express');


const app = express();
const port = 3000;

/*CORS isn’t enabled on the server, this is due to security reasons by default,
so no one else but the webserver itself can make requests to the server.*/
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    // Pass to next layer of middleware
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET-metodi hakuun
app.get('/sanakirja/:sana', (req, res) => {
    const sana = req.params.sana;
    const sanakirja = fs.readFileSync('sanakirja.txt', 'utf8').split('\n');
    for (let i = 0; i < sanakirja.length; i++) {
        const pair = sanakirja[i].split(' ');
        if (pair[0] === sana) {
            return res.send({ suomi: pair[0], englanti: pair[1] });
        }
    }
  
    return res.status(404).send({ error: 'Sanaa ei löytynyt' });
});

// POST-metodi sanojen lisäämiseen
app.post('/sanakirja', (req, res) => {
    const { suomi, englanti } = req.body;
  
    if (!suomi || !englanti) {
        return res.status(400).send({ error: 'Lisättävissä sanoissa on puutteita' });
    }
  
    const sanakirja = fs.readFileSync('sanakirja.txt', 'utf8');
    const kaannos = `${suomi} ${englanti}\n`;
  
    fs.writeFileSync('sanakirja.txt', sanakirja + kaannos, 'utf8');
  
    return res.send({ success: 'Sana lisätty' });
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});