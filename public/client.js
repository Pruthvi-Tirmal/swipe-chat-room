
// io() is library just enhance by script tags that we have add in chat.html
const socket = io();
// client console will be in browser (understand)
// socket.on('message', (server) => {
//     console.log(server);
// })

// get Username and room Qs library
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// join chatroom
socket.emit('joinRoom', { username, room })

// get the room and users in room
socket.on('userRooms', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})


// utils files
// message to insert in the DOM
const textarea = document.querySelector('textarea');
const sendBtn = document.querySelector('.msg__btn');
const msgArea = document.querySelector('.msgArea');
const roomName = document.querySelector('#room');
const usersContainer = document.querySelector('.members');
const typing = document.querySelector('#typer');
const leave = document.querySelector('.leave_btn')
// leave button feature
leave.addEventListener('click', () => {
    window.location.href = "/";
})

// scroll down feature
const scrollBottom = () => {
    msgArea.scrollTop = msgArea.scrollHeight;
}
sendBtn.addEventListener('click', () => {
    sendMsg(textarea.value);
    textarea.value = "";
})
// Enter Send feature
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMsg(e.target.value, username);
        e.target.value = "";
    }
    // typing
    socket.emit('typing', username);
})

const sendMsg = (message) => {
    socket.emit('textMessage', message, username);
}
socket.on('recMessage', msg => {
    appendMsg(msg, 'outgoing');
    socket.emit('chatting', msg);
    scrollBottom();
})

const appendMsg = (msg, type) => {
    let mainDiv = document.createElement('div');
    mainDiv.classList.add(type, 'message')
    let markup = `<h5>${msg.username} <span>${msg.time}</span> </h5>
    <p>${msg.text}</p>
    `
    mainDiv.innerHTML = markup;
    msgArea.appendChild(mainDiv);
}

// output the room name

outputRoomName = (room) => {
    roomName.innerHTML = room;
}

// output the users
outputUsers = (users) => {
    usersContainer.innerHTML = `
${users.map(user => `<p>${user.username}</p>`).join('')}
`
}

// this very important to create the debounce
let timerId = null;

const debounce = (func, timer) => {
    if (timerId) {
        clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
        func();
    }, timer)
}

//typing status
socket.on('typing', (data) => {
    typing.innerHTML = `> ${data} is typing...`;
    debounce(() => {
        typing.innerHTML = " ";
    }, 1000)
})

// receiving msg 
socket.on('message', (msg) => {
    appendMsg(msg, 'incoming');
    scrollBottom();
})
