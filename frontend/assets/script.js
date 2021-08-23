const counter = document.getElementById("newpost-counter");
const textArea = document.getElementById("newpost-text");
const postArea = document.getElementById("posts");
counter.innerText = "0/200";
var postscounter = 0;
const username = document.getElementById("header-account").innerText;
var posts = [];

//moment.locale('pl');
//console.log(moment().format("[Utworzono: ]dddd, MMMM Do YYYY, h:mm"));

GetTime();

async function SendNewPost() {

    postArea.innerHTML = `<div class = "posttext">${textArea.value}<div class = "postdate">${localDate}</div></div>` + postArea.innerHTML;

    var item = {
        username: username,
        body: textArea.value,
        date: Date.now()
    }

    console.log(item);

    const response = await fetch("http://localhost:4500/post", {
        method: "POST",
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json'
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

async function GetTime() {
    await fetch(`http://worldtimeapi.org/api/ip`)
        .then(res => res.text())
        .then(res => {
            console.log(res);
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
    if (numberoftext > 200) counter.style.color = "red";
    else counter.style.color = "black";
});