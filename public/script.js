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

//greynoise
async function getGrey(){
    const ip = document.getElementById('ip_value').value;
    console.log(ip);
    const response = await fetch(grey_url + ip);
    const data = await response.json();
    console.log(data)
    // Create a new table
    table("grey_table",data);
}

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
    table("ip_table",data);
    marker.setLatLng([data.lat, data.lon]);
    marker.bindPopup("<b>Hello world!</b><br>I am a popup .").openPopup();
    getGrey();
}

function table(div_name,data){
    var table = document.getElementById(div_name);

// Add the table header
var tr = document.createElement('tr');
var leftRow = document.createElement('td');
leftRow.innerHTML = "Name";
tr.appendChild(leftRow);
var rightRow = document.createElement('td');
rightRow.innerHTML = "Value";
tr.appendChild(rightRow);
table.appendChild(tr);

// Add the table rows
for (var name in data) {
    var value = data[name];
    var tr = document.createElement('tr');
    var leftRow = document.createElement('td');
    leftRow.innerHTML = name;
    tr.appendChild(leftRow);
    var rightRow = document.createElement('td');
    rightRow.innerHTML = value;
    tr.appendChild(rightRow);
    table.appendChild(tr);
}

// Add the created table to the HTML page
document.body.appendChild(table);
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