const express = require('express');
const cors = require('cors');
const port = 4500;
const app = express();

app.use(cors());
app.use(express.json());

let posts = 1
let postsbody = { }

app.get('/', (req, res) => {
    res.send("Zinicjowany!");
});

app.get('/get', (req, res) =>{
    //console.log("1");
    postsbody["0"] = posts - 1;
    res.send(postsbody);
});

app.post('/post', (req, res) => {
    //console.log("2");
    postsbody[posts] = req.body["text"];
    console.log(postsbody[posts]);
    posts++;
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server is running...");
});