const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require("mongoose");

const port = "1212";
let docIds = [];

//Connecting with mongoDb
mongoose.connect('mongodb://localhost:27017/DocsCollab', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Connected to DB."))
.catch((err) => console.log(err));

const DocumentSchema = new mongoose.Schema({
    id: String,
    doc: String
}, {collection: "Document"});

const documentModel = mongoose.model('Document', DocumentSchema);

documentModel.find()
.then((data) => {
    docIds = data.map(function(obj){return obj.id});
})
.catch((err) => console.log(err));

//Creating Socket
io.on("connection", socket => {
    let prevId;

    const safeJoin = currId => {
        socket.leave(prevId);
        socket.join(currId, () => {console.log(`Socket ${socket.id} joind room ${currId}`)});
        prevId = currId;
    };

    socket.on("getDoc", currId => {
        safeJoin(currId);
        documentModel.find({id: currId})
        .then(data => {
            if (data != null && data.length != 0){
                console.log(data);
                socket.emit("document", data[0]);
            }        
        })
        
    });

    socket.on("addDoc", doc => {
        insertInMongoDb(doc);
        docIds.push(doc.id);
        safeJoin(doc.id);
        io.emit("documents", docIds);
        socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
        updateMongoDb(doc);
        socket.to(doc.id).emit("document", doc);
    });

    io.emit("documents", docIds);

    console.log(`Socket ${socket.id} connected the server`);
});

function insertInMongoDb(doc){
    const docModel = documentModel({id: doc.id, data: doc.data});
    docModel.save()
    .catch((err) => console.log(err));;
}

function updateMongoDb(doc){
    console.log(doc);
    documentModel.updateOne({id: doc.id}, doc)
    .catch((err) => console.log(err));;
}

http.listen(port, ()=>{
    console.log(`Server Listening at ${port} port`);
});