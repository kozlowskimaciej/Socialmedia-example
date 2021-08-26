const username = document.getElementById("header-username").innerText;
const counter = document.getElementById("newpost-counter");
const textArea = document.getElementById("newpost-text");
const postArea = document.getElementById("posts");
const userAvatar = document.getElementById("header-useravatarimage").getAttribute("src");
const language = 'pl';
counter.innerText = "0/200";

var lastpost = "none";
var posts = [];

moment.locale(language);

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([crd.longitude, crd.latitude]),
          zoom: 17
        })
    });

    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([crd.longitude, crd.latitude]))
                })
            ]
        })
    });
    map.addLayer(layer);
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

navigator.geolocation.getCurrentPosition(success, error, options);



function checkForBottom(){
    setInterval( ()=>{if(window.innerHeight+window.scrollY>document.body.clientHeight-50)GetPosts();}, 1000);
}

document.addEventListener('scroll',checkForBottom);

function DrawPost(postbody = "", postcreator = username, postdate = "", postavatar = userAvatar, type = 0) {
    var timeFromNow = moment(postdate).fromNow();
    console.log(postcreator + " " + postavatar + timeFromNow);

    //TWORZYMY OPAKUNEK POSTA
    newpostWrapper = document.createElement("div");
    newpostWrapper.classList.add("post-wrapper");

    //TWORZYMY NAGŁÓWEK POSTA
    newpostInfo = document.createElement("div");
    newpostInfo.classList.add("post-info");
    newpostInfo.setAttribute("postcreationdate", timeFromNow);

    //DODAJEMY AWATAR DO NAGŁÓWKA
    newpostAvatar = document.createElement("img");
    newpostAvatar.setAttribute("src", postavatar);

    newpostNickname = document.createElement("div");
    newpostNickname.classList.add("post-postcreator");
    newpostNickname.innerText = postcreator;
    
    //TWORZYMY GŁÓWNĄ CZĘŚĆ POSTA
    newpostBody = document.createElement("div");
    newpostBody.classList.add("post-body");
    newpostBody.innerText = postbody;


    newpostWrapper.append(newpostBody);

    newpostWrapper.prepend(newpostInfo);
    newpostInfo.append(newpostAvatar);
    newpostInfo.append(newpostNickname);
    
    if(type)document.getElementById('posts').prepend(newpostWrapper);
    else document.getElementById('posts').append(newpostWrapper);
}

async function SendNewPost() {

    const postCreationDate = moment.utc().format();
    //utctime = utctime.format("DD.MM.Y HH:mm:ss")

    DrawPost(textArea.value, username, postCreationDate, userAvatar, 1);

    var post = {
        username: username,
        body: textArea.value,
    }

    const response = await fetch("http://localhost:4500/post", {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    return response.json();
}

async function GetPosts() {
    if (posts.length !== 0) lastpost = posts[0]['uuid'];

    await fetch(`http://localhost:4500/get?posts=${lastpost}`)
        .then(res => res.text())
        .then(res => {
            if (res !== "")
            {
                posts = JSON.parse(res)["postsArray"];
                DisplayPosts();
            } else{
                document.removeEventListener('scroll',checkForBottom);
                document.getElementById('posts-loading').innerText = "Koniec strony";
            }
        })
        .catch(error => console.log("Błąd: ", error));
}

async function DisplayPosts() {
    try {
        for (var i = posts.length - 1; i >= 0; i--) {
            DrawPost(posts[i]['body'], posts[i]['username'], posts[i]['date']);
        }
    }
    catch (err) {
        console.log(err);
    }
}

GetPosts();

// LICZNIK ILOŚCI ZNAKÓW
textArea.addEventListener("input", () => {
    let numberoftext = textArea.value.length;
    counter.innerText = numberoftext + "/200";
    if (numberoftext > 200) counter.style.color = "#6e56bd";
    else counter.style.color = "#8E929D";
});