const express = require('express');
const cors = require('cors');
const url = require('url');
const port = 4500;
const app = express();

app.use(cors());
app.use(express.json());

var array = [];

app.get('/get', (req, res) => {
    var postscounter = req.query.posts;
    console.log(postscounter);

    var ToSendArray = [];

    console.log(array.length);
    var pc = array.length - 1 - postscounter
    for (var i = pc; i > pc - 2; i--) {
        if (i < 0) break;
        array[i];
        ToSendArray.unshift(array[i]);
    }


    if (ToSendArray.length <= 0) {
        res.sendStatus(204);
        console.log("Odrzucono");
    }
    else {
        var obj = {
            'object': ToSendArray
        }
        console.log(ToSendArray);
        res.send(obj);
    }
});

app.post('/post', (req, res) => {

    var dic = {
        username: req.body["username"],
        body: req.body["body"],
        date: req.body["date"],
        like_counter: 0,
        users: []
    }

    var date = new Date(dic["date"]).toUTCString();

    console.log(date);

    array.push(dic);
    console.log(array);
    res.sendStatus(200);
});

app.post('/post/like', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server is running...");
});