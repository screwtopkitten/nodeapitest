//Global Variables
const mymap = L.map('mapip').setView([0, 0], 1);
const api_url = 'https://jolly-breeze-1568.bitserver.workers.dev/?http://ip-api.com/json/';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl,{attribution});
const marker = L.marker([0, 0]).addTo(mymap);
tiles.addTo(mymap);

function validate(){
    const ip = document.getElementById('ip_value').value;
    const pattern = /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/ig;
    if(pattern.test(ip))
    {
        getIP(ip);
    } else{
        alert("This is not an IP please enter an IP address");
    }
}


//Get IP geo location Function
async function getIP(ip){   
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
    
    apiurls = [
        {
            "header": "Shodan",
            "api":'/ip/'
        },
        {
            "header": "Greynoise",
            "api": '/greynoise/'
        },
        {
            "header": "Virustotal",
            "api": '/vtip/'
        }
    ];
    apiurls.forEach(element => {
        getAPI(element.api,ip,element.header);
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
    rawJson(json, html_element);
    prettyOutput(json, html_element);
}

function rawJson(json, html_element){
    const textarea = document.querySelector('#rawoutput');
    textupdate = JSON.stringify(json, null, 4);
    let header =  document.createElement('div');
    let article = document.createElement('div');
    header.className = 'grid-item grid-header';
    header.innerHTML = `<h2>${html_element}</h2>`;
    article.className = 'grid-item grid-output';
    article.innerText = textupdate;
    textarea.appendChild(header);
    textarea.appendChild(article);
}

function prettyOutput(json, html_element){
    const textarea = document.querySelector('#prettyprint');
    let header =  document.createElement('div');
    let article = document.createElement('div');
    header.innerHTML = `<h3>${html_element}</h3>`;
    if(html_element == "Shodan"){
        try{
            article.innerHTML = `
                    Last Updated: ${json.last_update}</br>
                <p>
                    IP: ${json.ip_str}</br>
                    Ports: ${json.ports}</br>               
                </p>
                <p>
                    Hostname: ${json.hostnames}</br>
                    City: ${json.city}</br>
                    Country: ${json.country_name}</br>
                    Org: ${json.org}</br>
                    ISP: ${json.isp}</br>
                    ASN: ${json.asn}</br>
                    Domains: ${json.domains}</br>
                </p>
           
            `;
            }
        catch{
            article.innerHTML = `<H2>eRrOr</H2>`
        }
    }
    if(html_element == "Greynoise"){
        try{
            article.innerHTML = `
                    First Seen: ${json.first_seen}</br>
                    Last Seen:  ${json.last_seen}</br>
                <p>
                    IP: ${json.ip}</br>
                    Classification: ${json.classification}</br>
                    Tags: ${json.tags}</br>
                    CVE: ${json.cve}</br>        
                </p>
                <p>
                    Orginisation: ${json.metadata.organization}</br>  
                    Category: ${json.metadata.category}</br> 
                    City: ${json.metadata.city}</br>
                    Region: ${json.metadata.region}</br>
                    Country: ${json.metadata.country}</br>    
                </p>
                <p>
                    Actor: ${json.actor}</br>
                    Bot: ${json.bot}</br>
                    Tor: ${json.metadata.tor}</br>
                    VPN: ${json.vpn}</br>
                    VPN Service: ${json.vpn_service}</br> 
                </p>
           
            `;
            }
        catch{
            article.innerHTML = `<H2>eRrOr</H2>`
        }
    }
        if(html_element == "Virustotal"){
            try{
                article.innerHTML = `
                <p>
                    IP: ${json.data.id}</br>
                    ASN: ${json.data.attributes.asn}</br>
                    AS Owner: ${json.data.attributes.as_owner}</br>
                </p>
                <p><b>Last Analysis Stats</b></br>
                    Harmless: ${json.data.attributes.last_analysis_stats.harmless}</br>
                    Malicious: ${json.data.attributes.last_analysis_stats.malicious}</br>
                    Suspicious: ${json.data.attributes.last_analysis_stats.suspicious}</br>
                    Timeout: ${json.data.attributes.last_analysis_stats.timeout}</br>
                    Undetected: ${json.data.attributes.last_analysis_stats.undetected}</br>
                </p>
                <p>
                    Link: ${json.data.links.self}</br>
                </p>    
                `;
                }
            catch{
                article.innerHTML = `<H2>eRrOr</H2>`
            }
    }
    
    textarea.appendChild(header);
    textarea.appendChild(article);
    }
