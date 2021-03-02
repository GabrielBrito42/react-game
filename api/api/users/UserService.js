const { find, map, filter, findIndex, set, get } = require('lodash')
const fs = require('fs')
const appRoot = require('app-root-path')
const path = require('path')

const UserService = {
  async addUser (user) {
    set(user, 'name', get(user, 'name', '').trim().toLowerCase())
    set(user, 'room', get(user, 'room', '').trim().toLowerCase())

    let users = fs.readFileSync(_getDirectory('users.json', 'utf8'))
    users = JSON.parse(users)

    const existingUser = find(users.users, {'name': get(user, 'name', '')})
    if(existingUser){return {error: 'Nome de usuário ja cadastrado'}}
    
    users.users.push(user)
    userToWrite = JSON.stringify(users)
    fs.writeFileSync(_getDirectory('users.json'), userToWrite)
    return user
  },

  async getUser (query) {
    let users = fs.readFileSync(_getDirectory('users.json', 'utf8'))
    users = JSON.parse(users)
    const user = find(users.users, [[query.key], query.value])
    return user
  },

  async getUsersInRoom (room) {
    room = room.trim().toLowerCase()
    let users = fs.readFileSync(_getDirectory('users.json', 'utf8'))
    users = JSON.parse(users)
    const usersInRoom = filter(users.users, ['room', room])
    let lista = []
    lista = map(usersInRoom, 'name')
    return lista
  },

  async modifyUsers (query) {
    let changePhase =  false
    let users = fs.readFileSync(_getDirectory('users.json', 'utf8'))
    users = JSON.parse(users)
    map(get(query, 'value', ''), (names) => {
      const user = find(users.users, [[query.key], names])
      get(user, 'phase', '') ? changePhase = false :  changePhase = true
      const index = findIndex(users.users, [[query.key], names])
      set(users.users, `[${index}].phase`, changePhase)
    })
    userToWrite = JSON.stringify(users)
    fs.writeFileSync(_getDirectory('users.json'), userToWrite)
  },

  prepareGetUser (name) {
    const query = {
      key: 'name',
      value: name
    }
    return query
  },

  verifyWinner (board, symbol) {
    let boardPlays = []
    let win = false

    map(board, (values, index) =>  {
      values === symbol ? boardPlays.push(index) : ''
    })

    const winnerCombs = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]

    map(winnerCombs, (values) => {
      boardPlays.toString() === values.toString() ? win = true : ''
    })
    return win
  },

  mountUser (id, name, room, symbol, phase) {
    const user = {
      id: id,
      name: name,
      room: room,
      symbol: symbol,
      phase: phase
    }
    return user
  }
}

function _getDirectory (fileName) {
  const directory =  '/api/users/'
  return path.join(appRoot + directory + fileName)
}

module.exports = UserService