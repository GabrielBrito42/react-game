const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3001',
    credentials: true,
  },
})
const fs = require('fs')
const appRoot = require('app-root-path')
const path = require('path')

const socketManager = require('./api/socketManager/SocketManager')
socketManager.open(io)

const directory =  '/api/users/'
const users = {users:[]}
userToWrite = JSON.stringify(users)
fs.writeFileSync(path.join(appRoot + directory + 'users.json'), userToWrite)

http.listen(3000, () => {
  console.log('server listen on port 3000')
})