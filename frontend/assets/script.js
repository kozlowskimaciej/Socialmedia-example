const counter = document.getElementById("counter");
const textArea = document.getElementById("messagetext");
counter.innerText = "0/200";
let posts = { };

async function SendToBackend() {

    var item = {
        text: document.getElementById("messagetext").value
    }

    const response = await fetch("http://localhost:4500/post", {
        method: "POST",
        // mode: 'cors',
        // credentials: 'same-origin',
        body: JSON.stringify(item),
        headers: {
        'Content-Type': 'application/json'
        }
    }).then(GetFromBackend());

    return response.json();
}

// POBIERANIE OBIEKTU POSTS Z BACKEND
async function GetFromBackend(){
    await fetch("http://localhost:4500/get").then(res => res.text())
        .then(res => {
            (posts = JSON.parse(res)).then(GetPosts());
        })
        .catch(error => console.log("Błąd: ", error));
}

async function GetPosts(){
    console.log(posts["0"]);
    try{
        document.getElementById("messages").innerHTML = "";
        for(i = 1; i <= posts["0"]; i++){
            document.getElementById("messages").innerHTML +=`<div class = "posttext">${posts[i]}</div>`;
        }
    }
    catch(err){
        console.log(err);
    }
    
}

// LICZNIK ILOŚCI ZNAKÓW
textArea.addEventListener("input", ()=>{
    let numberoftext = textArea.value.length;
    counter.innerText = numberoftext + "/200";
    if(numberoftext>200)counter.style.color = "red";
    else counter.style.color = "black";
});