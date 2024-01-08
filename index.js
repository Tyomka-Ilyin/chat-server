let cors = require('cors')

const express = require('express');
const { emit } = require('process');
const { socket } = require('server/router');

const app = express();
app.set('view engine', 'ejs')

const http = require('http').createServer(app);
const io = require("socket.io")(http);

const PORT = 3000

let users = []
let messages = []

app.get('/', (req, res) => {
    res.render('index', {users: users, messages: messages});
})

io.on('connect', (socket) => {
    console.log('client connected')
    
    var data = {
        "users": users,
        "messages": messages
    }

    socket.emit('connected', data)

    socket.on('message', (data) => {
        console.log(data.user + " " + data.message)
        data.id = messages.length
        messages.push(data)
        io.emit('message', {
            user: data.user,
            message: data.message
        })
    })

    socket.on('addUser', (data) => {
            var user = {
                id: users.length,
                userName: data.userName
            }

            users.push(user)
            console.log("user added")

            io.emit('newUser', user)
    })

    socket.on('removeClient', (data) => {
        console.log("removeClient")
        console.log(data.userName)

        if(data.userName == ""){
            return
        }

        for(var i = 0; i < users.length; i++){
            if(users[i].userName == data.userName){
                users.splice(i, 1)
                console.log(data.userName + " deleted")

                io.emit('removeUser', {id: i, userName: data.userName})
            }
        }
    })
})

http.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`)
})