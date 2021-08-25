const express = require('express');
const cors = require('cors');
const url = require('url');
const port = 4500;
const app = express();

app.use(cors());
app.use(express.json());

var array = [];
var newuuid = 0;
const postsToShow = 2;

app.get('/get', (req, res) => {
    var lastuuid = req.query.posts;

    var ToSendArray = [];

    var counter = 0;

    if (lastuuid === "none")
        if (array.length > 0) lastuuid = array[0]["uuid"] + 1;
        else lastuuid = 0;

    for (var element of array) {
        if (counter >= postsToShow) break;
        else if (element["uuid"] < lastuuid) {
            lastuuid=element["uuid"];
            ToSendArray.unshift(element);
            counter += 1;
        }
    };

    if (ToSendArray.length <= 0) {
        res.sendStatus(204);
    }
    else {
        var obj = {
            'object': ToSendArray
        }
        res.send(obj);
    }
});

app.post('/post', (req, res) => {

    var dic = {
        uuid: newuuid,
        date: req.body["date"],
        username: req.body["username"],
        body: req.body["body"],
        like_counter: 0,
        users: []
    }

    newuuid += 1;

    array.unshift(dic);
});

app.post('/post/like', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server is running...");
});