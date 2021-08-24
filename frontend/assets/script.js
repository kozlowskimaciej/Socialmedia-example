const counter = document.getElementById("newpost-counter");
const textArea = document.getElementById("newpost-text");
const postArea = document.getElementById("posts");
counter.innerText = "0/200";
var postscounter = 0;
const username = document.getElementById("header-username").innerText;
var posts = [];
const language = 'pl';

moment.locale(language);
//console.log(moment().format("[Utworzono: ]dddd, MMMM Do YYYY, h:mm"));

async function SendNewPost() {

    var utctime = moment.utc().subtract(5, 'seconds');
    var localtime = moment(utctime).fromNow();

    utctime = utctime.format("DD.MM.Y HH:mm");
    //localtime = localtime.format("D.M.Y  H:mm");
    
    console.log(localtime);

    postArea.innerHTML = `<div class = "posttext">${textArea.value}<div class = "postdate">${localtime}</div></div>` + postArea.innerHTML;

    var item = {
        username: username,
        body: textArea.value,
        date: utctime
    }

    const response = await fetch("http://localhost:4500/post", {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    return response.json();
}

async function GetPosts() {
    await fetch(`http://localhost:4500/get?posts=${postscounter}`)
        .then(res => res.text())
        .then(res => {
            posts = JSON.parse(res)["object"];
            DisplayPosts();
        })
        .catch(error => console.log("Błąd: ", error));
}

async function DisplayPosts() {
    try {
        for (var i = posts.length - 1; i >= 0; i--) {
            postArea.innerHTML += `<div class = "posttext">${posts[i]['body']}</div>`;
            postscounter++;
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