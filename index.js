let cors = require('cors')
// import  ALLOWED_ORIGIN  from './config.js'

const express = require('express');
const { socket } = require('server/router');
const app = express();

const http = require('http').createServer(app);
const io = require("socket.io")(http);

const PORT = 3000

app.get('/', (req, res) => {
    res.send('hekkoofdg')
})

let messages = []

io.on('connect', (socket) => {
    console.log('client connected')

    // socket.on('addMe', (data) => {
    //     this.users.push(data)
    //     console.log(data)
    // })
    
    socket.emit('connected', messages)

    socket.on('message', (data) => {
        console.log(data.user + " " + data.message)
        messages.push(data)
        io.emit('message', {
            user: data.user,
            message: data.message
        })
    })
})

http.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`)
})