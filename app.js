const express = require('express');
const cors = require('cors');
const port = 4500;
const app = express();

app.use(cors());
app.use(express.json());

let temp = { }

app.get('/', (req, res) => {
    res.send("Zinicjowany!");
});

app.get('/get', (req, res) =>{
    //console.log("1");
    res.send(temp["text"]);
});

app.post('/post', (req, res) => {
    //console.log("2");
    temp = req.body;
    console.log(temp);
    res.status(200);
});

app.listen(port, () => {
    console.log("Server is running...");
});