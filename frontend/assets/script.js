const username = document.getElementById("header-username").innerText;
const counter = document.getElementById("newpost-counter");
const textArea = document.getElementById("newpost-text");
const postArea = document.getElementById("posts");
const userAvatar = document.getElementById("header-useravatarimage").getAttribute("src");
const locationButton = document.getElementById('newpost_loc_button_wrapper');
const language = 'pl';
var userLatitude = undefined;
var userLongitude = undefined;
counter.innerText = "0/200";

var mapAdded = false;
var lastpost = "none";
var posts = [];
var addedPostsCounter = 0;

moment.locale(language);

function drawMap(userLongitude, userLatitude, mapname){
    var min = ol.proj.fromLonLat([userLongitude-0.03, userLatitude-0.02]);
    
    //var max = ol.proj.fromLonLat([userLongitude+0.03, userLatitude+0.02]);

    var map = new ol.Map({
        target: mapname,
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([userLongitude, userLatitude]),
          zoom: 17,
          extent: [min[0], min[1], min[0]+6679.169447597, min[1]+7424.1713883],
        })
    });

    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [
                new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([userLongitude, userLatitude]))
                })
            ]
        })
    });
    map.addLayer(layer);
    
    // POBIERANIE WSPÓŁRZĘDNYCH PUNKTU ŚRODKOWEGO
    
    document.addEventListener('mouseup',()=>console.log(ol.proj.toLonLat(map.getView().getCenter())));
    // setInterval(() => {
    //     console.log(ol.proj.toLonLat(map.getView().getCenter()));
    // }, 2000);
}



var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    var mapWrapper = document.createElement("div");
    mapWrapper.classList.add("map");
    mapWrapper.setAttribute('id', 'map');
    var postBody = document.getElementById("newpost-body");
    postBody.append(mapWrapper);
    var mapCenterPoint = document.createElement("div");
    mapCenterPoint.setAttribute('id', 'center');
    mapWrapper.append(mapCenterPoint);
    locationButton.removeEventListener('click',createMapPreview);
    locationButton.remove();

    var crd = pos.coords;
  
    userLatitude = crd.latitude;
    userLongitude = crd.longitude;
    console.log(`More or less ${crd.accuracy} meters.`);

    drawMap(crd.longitude, crd.latitude, "map");
    mapAdded = true;
};

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
};

function createMapPreview(){
    navigator.geolocation.getCurrentPosition(success, error, options);
};


locationButton.addEventListener('click',createMapPreview);

function checkIfBottom(){
    // trzeba ograniczyć sprawdzanie np. co 1s
    if(window.innerHeight+window.scrollY>document.body.clientHeight-50)GetPosts();
    console.log("a");
}

document.addEventListener('scroll',checkIfBottom);

function DrawPost(postbody = "", postcreator = username, postdate = "", postavatar = userAvatar, type = 0, postuuid = "front", postlongitude=undefined, postlatitude=undefined) {
    var timeFromNow = moment(postdate).fromNow();
    console.log(postcreator + " " + postavatar + timeFromNow);

    //TWORZYMY OPAKUNEK POSTA
    var newpostWrapper = document.createElement("div");
    newpostWrapper.classList.add("post-wrapper");
    newpostWrapper.setAttribute("id", `post-${postuuid}`)

    //TWORZYMY NAGŁÓWEK POSTA
    var newpostInfo = document.createElement("div");
    newpostInfo.classList.add("post-info");
    newpostInfo.setAttribute("postcreationdate", timeFromNow);

    //DODAJEMY AWATAR DO NAGŁÓWKA
    var newpostAvatar = document.createElement("img");
    newpostAvatar.setAttribute("src", postavatar);

    var newpostNickname = document.createElement("div");
    newpostNickname.classList.add("post-postcreator");
    newpostNickname.innerText = postcreator;
    
    //TWORZYMY GŁÓWNĄ CZĘŚĆ POSTA
    var newpostBody = document.createElement("div");
    newpostBody.classList.add("post-body");
    newpostBody.innerText = postbody;


    newpostWrapper.append(newpostBody);

    newpostWrapper.prepend(newpostInfo);
    newpostInfo.append(newpostAvatar);
    newpostInfo.append(newpostNickname);

    if(postlatitude!==undefined && postlongitude!==undefined){
        var newpostMapWrapper = document.createElement("div");
        newpostMapWrapper.classList.add(`map`);
        newpostMapWrapper.setAttribute(`id`, `map-${postuuid}`);

        setTimeout(()=>{
            newpostBody.append(newpostMapWrapper);

            console.log(postlatitude +" "+ postlongitude);
    
            drawMap(postlongitude, postlatitude, `map-${postuuid}`);
        },100);
    }
    
    if(type)document.getElementById('posts').prepend(newpostWrapper);
    else document.getElementById('posts').append(newpostWrapper);
}

async function SendNewPost() {

    const postCreationDate = moment.utc().format();
    //utctime = utctime.format("DD.MM.Y HH:mm:ss")

    DrawPost(textArea.value, username, postCreationDate, userAvatar, 1, "fn-"+addedPostsCounter, userLongitude, userLatitude);

    addedPostsCounter++;

    var post = {
        username: username,
        body: textArea.value,
        pos_longitude: userLongitude,
        pos_latitude: userLatitude
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

function stopGettingPosts(){
    document.removeEventListener('scroll',checkIfBottom);
                document.getElementById('page-bottom-loading').remove();
                var pageBottomText = document.getElementById('page-bottom');
                pageBottomText.innerText = "Brak więcej postów do wyświetlenia.";
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

                if(posts.length<5)stopGettingPosts();
            }else{
                stopGettingPosts();
            }
        })
        .catch(error => console.log("Błąd: ", error));
}

async function DisplayPosts() {
    try {
        for (var i = posts.length - 1; i >= 0; i--) {
            DrawPost(posts[i]['body'], posts[i]['username'], posts[i]['date'], userAvatar, 0, posts[i]['uuid'], posts[i]['pos_longitude'], posts[i]['pos_latitude']);
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