//PUBLIC CONSTANT
const Express = require('express');
const Cors = require('cors');
const Url = require('url');
const Moment = require('moment');
const Port = 4500;
const App = Express();
const NumberPostsToShow = 5;

//USES
Moment().format(); 
App.use(Cors());
App.use(Express.json());

//PUBLIC VARIABLES
var PostsArray = [];
var NextUuidToAssign = 0;

//SENDING POSTS
App.get('/get', (req, res) => {
    var lastSendUuid = req.query.posts;
    var toSendArray = [];
    var postsCounter = 0;

    if (lastSendUuid === "none")
        if (PostsArray.length > 0) lastSendUuid = PostsArray[0]["uuid"] + 1;
        else lastSendUuid = 0;

    for (var element of PostsArray) {
        if (postsCounter >= NumberPostsToShow) break;
        else if (element["uuid"] < lastSendUuid) {
            lastSendUuid=element["uuid"];
            toSendArray.unshift(element);
            postsCounter += 1;
        }
    };

    if (toSendArray.length <= 0) res.sendStatus(204);
    else {
        var packedPosts = {
            'postsArray': toSendArray
        }
        res.send(packedPosts);
        console.log(packedPosts);
    }
});

//RECEIVING POSTS
App.post('/post', (req, res) => {
    const postCreationDate = Moment.utc().format();

    var postProperties = {
        uuid: NextUuidToAssign,
        date: postCreationDate,
        username: req.body["username"],
        body: req.body["body"],
        pos_longitude: req.body["pos_longitude"],
        pos_latitude: req.body["pos_latitude"],
        like_counter: 0,
        users: []
    }
    NextUuidToAssign += 1;
    PostsArray.unshift(postProperties);
});

//START OF THE APPLICATION
App.listen(Port, () => {
    console.log("Server is running...");
});