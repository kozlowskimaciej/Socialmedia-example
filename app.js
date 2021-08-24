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
    console.log("\nLast UUID: " + lastuuid);

    var ToSendArray = [];

    var counter = 0;
    const tempArray = array
    var revArray = tempArray;
    revArray.reverse();

    console.log(array);
    console.log(revArray);

    console.log("Array length: " + revArray.length);
    console.log("Counter: " + counter);

    if (lastuuid === "none")
        if (revArray.length > 0) lastuuid = revArray[0]["uuid"] + 1;
        else lastuuid = 0;

    for (var element of revArray) {
        if (counter >= postsToShow) break;
        else if (element["uuid"] < lastuuid) {
            ToSendArray.unshift(element);
            counter += 1;
        }
    };

    //var counter = 0;

    if (ToSendArray.length <= 0) {
        res.sendStatus(204);
        console.log("Odrzucono");
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
        username: req.body["username"],
        body: req.body["body"],
        date: req.body["date"],
        like_counter: 0,
        users: []
    }

    newuuid += 1;

    array.push(dic);
    //console.log(array);
    res.sendStatus(200);
});

app.post('/post/like', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log("Server is running...");
});