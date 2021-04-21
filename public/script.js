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
    const selector = document.querySelector('#prettyprint');
    const textarea = document.createElement('div');
    textarea.className ="text";
    selector.appendChild(textarea);
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
  getAPI('https://jolly-breeze-1568.bitserver.workers.dev/?http://ip-api.com/json/',ip).then(x =>{ map(x);});   

    apiurls.forEach(element => {
        const article = document.createElement('div');
        getAPI(element.api,ip).then(x =>{ prettyOutput(x, element.header,article,textarea);});     
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

async function getAPI(url, param){   
    const response = await fetch(url + param);
    const json = await response.json();
    console.log(json);
    return json;
}

function map(data){
    const selector = document.querySelector('#prettyprint');
    const rand = Math.random().toString(16).substr(2, 8);
    const textarea = document.createElement('div');
    textarea.className = "mapip";
    textarea.id =rand;
    selector.appendChild(textarea);
    const mymap = L.map(textarea).setView([0, 0], 1);
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl,{attribution});
    const marker = L.marker([0, 0]).addTo(mymap);
    tiles.addTo(mymap);
    marker.setLatLng([data.lat, data.lon]);
    marker.bindPopup(`
        <b>${data.isp} </br> ${data.as}</b> </br>
        City: ${data.city}</br>
        Region: ${data.region}</br>
        Country: ${data.country}</br>
        Lat: ${data.lat} Lon: ${data.lon}
        `).openPopup();
}

function prettyOutput(json, html_element, article, textarea){
    if(html_element == "Shodan"){
        try{
            switch (json.error){
                case 'No information available for that IP.':
                    console.log('errors yall');
                    article.innerHTML =`
                    <h3>${html_element}</h3>
                    <p>No information avalible from Shodan</p>
                    `;
                    break;
                case undefined:
                    console.log('woo');
                    article.innerHTML = `
                    <h3>${html_element}</h3>
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
                    break;
                }          
            }
        catch{
            article.innerHTML = `<H2>eRrOr</H2>`
        }
    }
    if(html_element == "Greynoise"){
        try{
            switch (json.seen){
                case false:
                    article.innerHTML =`
                    <h3>${html_element}</h3>
                    <p>No information avalible from Greynoise</p>
                    `;
                    break;
                case true:
                    article.innerHTML = `
                    <h3>${html_element}</h3>
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
            }
        catch{
            article.innerHTML = `<H2>eRrOr</H2>`
        }
    }
        if(html_element == "Virustotal"){
            try{
                article.innerHTML = `
                <h3>${html_element}</h3>
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

    textarea.appendChild(article);
    }
