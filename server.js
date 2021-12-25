const express = require('express');
const path = require('path');
const http = require('http');

// input messages
const { formatMessage } = require('./public/utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./public/utils/user')
const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);
// set the static files
app.use(express.static(path.join(__dirname + '/public/')))
// get 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/login.html"));
})
// get 
app.get('/chat', (req, res) => {

    res.sendFile(path.join(__dirname + "/chat.html"))
})

const botName = "SwipeBot"
// socket.io 
// we have to inside the connection function (on) only 
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        socket.emit('message', formatMessage(botName, 'Welcome to Swipe Chat Room'));
        // socket.broadcast.emit() ==> broadcast the message to the rest of the connections.
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the ${user.room} room 🤘`));

        //send user to room info
        io.to(user.room).emit('userRooms', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    // console.log('New WS connection');

    socket.on('typing', username => {
        socket.broadcast.emit('typing', username);
    });

    socket.on('textMessage', (message, username) => {
        socket.emit('recMessage', formatMessage(username, message));
    })
    //listening chat msg
    socket.on('chatting', msg => {
        const user = getCurrentUser(socket.id);
        // console.log(user);

        socket.broadcast.to(user.room ? user.room : 'swipeBotRoom').emit('message', formatMessage(user.username, msg.text));  //send to client
    })

    // Runs when the client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        // will emit or broadcast to all the user unlike the broadcast.emit()
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the ${user.room} room 😕`))

            //send user to room info
            io.to(user.room).emit('userRooms', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})


// PORT
const PORT = process.env.PORT || 3000;

// listening to server
server.listen(PORT, () => {
    console.log(`Listening at ${PORT}`)
})