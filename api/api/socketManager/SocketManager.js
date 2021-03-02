const userService = require('../users/UserService')
const { get, set, filter, map } = require('lodash')
const { modifyUsers, getUser, prepareGetUser, getUsersInRoom, verifyWinner } = require('../users/UserService')

module.exports = {
  open: (io) => {
    io.on('connection', (socket) => {
      socket.on('join', async({name, room}, callback) => {
        const id = socket.id
        let symbol = ''
        let phase = false
        const usersInRoom = await getUsersInRoom(room)
        usersInRoom.length === 1 ? (symbol = 'X', phase = true) : symbol = 'O'  

        const createUser = userService.mountUser(id, name, room, symbol, phase)
        const user = await userService.addUser(createUser)

        socket.join(user.room)
		    io.to(user.room).emit('roomData', {user: user})

        callback()
      })

      socket.on('send message', ({room, message, name}, callback) => {
        name = name.trim().toLowerCase()
        io.to(room).emit('message', {name: name, text: message})
        callback()
      })

      socket.on('make move', async({name, room, board, id}, callback) => {
        name = name.trim().toLowerCase()
        const names = await getUsersInRoom(room)
        const otherUserName = filter(names, (value) => value !== name)

        const userQuery = prepareGetUser(name)
        const otherUserQuery = prepareGetUser(otherUserName[0])
        const usersQuery =  prepareGetUser(names)

        await modifyUsers(usersQuery)
        const user = await getUser(userQuery)
        const otherUser = await getUser(otherUserQuery)
        set(board, [`${id}`], get(user, 'symbol', ''))
        let boardPlays = []
        map(board, (values) =>  {
          values === 'X'||values === 'O' ? boardPlays.push(values) : ''
        })
        const end = verifyWinner(board, get(user, 'symbol', ''))
        io.to(room).emit('move',  {board: board})
        io.to(room).emit('otherUserData', {user: otherUser})
        io.to(room).emit('roomData', {user: user})
        if(boardPlays.length === 9){io.to(room).emit('draw')}
        if(end){io.to(room).emit('end',  user)}
        callback()
      })

      socket.on('restart', async({name, room}, callback) => {
        name = name.trim().toLowerCase()
        
        const board = ['', '', '', '', '', '', '', '', '']

        const names = await getUsersInRoom(room)
        const otherUserName = filter(names, (value) => value !== name)
        const usersQuery = prepareGetUser(names)
        const otherUserQuery = prepareGetUser(otherUserName[0])
        const userQuery = prepareGetUser(name)

        modifyUsers(usersQuery)
        const user = await getUser(userQuery)
        const otherUser = await getUser(otherUserQuery)

        io.to(room).emit('restartGame', {board: board, end: false, draw: false})
        io.to(room).emit('roomData', {user: user})
        io.to(room).emit('otherUserData', {user: otherUser})
        callback()
      })
    })
  }
}