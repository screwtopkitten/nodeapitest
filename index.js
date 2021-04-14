const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

console.log(process.env);
const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json()); 

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({},(err,data) =>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});


app.post('/api', (request,response) => {
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

app.get('/ip/:address', async (request,response) =>{
    const address = request.params.address;
    const api_key = process.env.SHODAN_API_KEY;
    console.log(address);
    const shodan_url = `https://api.shodan.io/shodan/host/${address}?key=${api_key}`;


    console.log(shodan_url);
    const fetch_response = await fetch(shodan_url);
    const json =  await fetch_response.json();
    response.json(json);
});


app.get('/greynoise/:address', async (request,response) =>{
    const address = request.params.address;
    const api_key = process.env.GREYNOISE_API_KEY;
    const greynoise_url = `https://api.greynoise.io/v2/noise/context/${address}`;
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        key: api_key
        }
    }
    const fetch_response = await fetch(greynoise_url,options);
    const json =  await fetch_response.json();
    response.json(json);

});

app.get('/vtip/:address', async (request,response) =>{
    const address = request.params.address;
    const api_key = process.env.VIRUSTOTAL_API_KEY;
    const virustotal_url = `https://www.virustotal.com/api/v3/ip_addresses/${address}`;
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        'x-apikey': api_key
        }
    }
    const fetch_response = await fetch(virustotal_url,options);
    const json =  await fetch_response.json();
    response.json(json);

});