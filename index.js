// Node Server which will handel socket io connections
// const io = require('socket.io')(8000)  //here we listen socket.io on port 8000
const io = require('socket.io')(8000, { // Writing this line of code because Your frontend
//  (index.html) is likely being served from a different port (e.g., 127.0.0.1:5500 or ), while your Socket.IO server runs on localhost:8000.
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const users = {};

io.on('connection', socket => { //io.on listen every connections 
    socket.on('new-user-joined', name => { // socket.on listen particular connections, when socket.on 
        //get user-joined event then it set name to the user
        // console.log("New user", name);
        users[ socket.id ] = name;
        socket.broadcast.emit('user-joined', name); //when user joined then it broadcast to everyone that 
        //user joined the chat except who joined the chat
    });
    socket.on('send', message => { //if anyone send message then broadcast this message to everyone
        socket.broadcast.emit('receive', { message: message, name: users[ socket.id ] }) // 'send' and 'receive' are 
        //user defined events
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
})

//index.js running when we write nodemon ./nodeserver/index.js
//because nodeserver and index.js are separate file