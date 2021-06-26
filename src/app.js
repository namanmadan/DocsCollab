const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = "1212";
const documents = {};

io.on("connection", socket => {
    let prevId;

    const safeJoin = currId => {
        socket.leave(prevId);
        socket.join(currId, () => {console.log(`Socket ${socket.id} joind room ${currId}`)});
        prevId = currId;
    };

    socket.on("getDoc", currId => {
        safeJoin(currId);
        socket.emit("document", documents[currId]);
    });

    socket.on("addDoc", doc => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("documents", Object.keys(documents));
        socket.emit("document", doc);
    });

    socket.on("editDoc", doc => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit("document", doc);
        console.log(doc);
    });

    io.emit("documents", Object.keys(documents));

    console.log(`Socket ${socket.id} connected the server`);
});

http.listen(port, ()=>{
    console.log(`Server Listening at ${port} port`);
})