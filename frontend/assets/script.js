const counter = document.getElementById("newpost-counter");
const textArea = document.getElementById("newpost-text");
const postArea = document.getElementById("posts");
counter.innerText = "0/200";
var lastpost = "none";
const username = document.getElementById("header-username").innerText;
var posts = [];
const language = 'pl';

moment.locale(language);

async function SendNewPost() {

    var utctime = moment.utc().subtract(5, 'seconds');
    var localtime = moment(utctime).fromNow();

    utctime = utctime.format("DD.MM.Y HH:mm:ss");

    postArea.innerHTML = `<div class = "posttext">${textArea.value}<div class = "postdate">${localtime}</div></div>` + postArea.innerHTML;

    var post = {
        username: username,
        body: textArea.value,
        date: utctime
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
                posts = JSON.parse(res)["object"];
                DisplayPosts();
            }
        })
        .catch(error => console.log("Błąd: ", error));
}

async function DisplayPosts() {
    try {
        for (var i = posts.length - 1; i >= 0; i--) {
            postArea.innerHTML += `<div class = "posttext">${posts[i]['body']}</div>`;
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