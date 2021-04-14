//Global Variables
const mymap = L.map('mapip').setView([0, 0], 1);
const api_url = 'https://jolly-breeze-1568.bitserver.workers.dev/?http://ip-api.com/json/';
const grey_url = 'https://jolly-breeze-1568.bitserver.workers.dev/?https://api.greynoise.io/v3/community/';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ip = document.getElementById('ip_value').value;
const tiles = L.tileLayer(tileUrl,{attribution});
const marker = L.marker([0, 0]).addTo(mymap);
tiles.addTo(mymap);


async function postAPI(){
    const data ={ip};
    console.log(data);
    const options = {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const json = await response.json();
    console.log(json);
    
}

//Get IP geo location Function
async function getIP(){   
    console.log(ip);
    const response = await fetch(api_url + ip);
    const data = await response.json();
    console.log(data)
    marker.setLatLng([data.lat, data.lon]);
    marker.bindPopup(`
        <b>${data.isp} </br> ${data.as}</b> </br>
        City: ${data.city}</br>
        Region: ${data.region}</br>
        Country: ${data.country}</br>
        Lat: ${data.lat} Lon: ${data.lon}
        `).openPopup();
    
    apiurls = ['/ip/', '/greynoise/' , '/vtip/' ];
    apiurls.forEach(element => {
        getAPI(element,ip,'#shodan');
    });
}

async function getDB(){
    const response = await fetch('/api');
    const data = await response.json();
    for (item of data){
        const root = document.createElement('div');
        const address = document.createElement('div');
        const date = document.createElement('div');
        

        address.textContent = `ip: ${item.ip}`;
        const dateString = new Date(item.timestamp).toLocaleString();
        date.textContent = `date: ${dateString}`;

        root.append(address,date);
        document.body.append(root);
    }
    console.log(data);

}

async function getAPI(url, param, html_element){   
    const response = await fetch(url + param);
    const json = await response.json();
    console.log(json);
    updateText(json, html_element);
}

function updateText(json, html_element){
    const textarea = document.querySelector(html_element);
    textupdate = JSON.stringify(json, null, 4);
    let header =  document.createElement('div');
    let article = document.createElement('div');
    header.className = 'grid-item grid-header';
    header.innerHTML = `<h2>${html_element}</h2>`;
    article.className = 'grid-item grid-footer';
    article.innerText = textupdate;
    textarea.appendChild(header);
    textarea.appendChild(article);
}