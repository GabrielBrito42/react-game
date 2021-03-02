import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import io from 'socket.io-client'
import Messages from '../Chat/Messages'
import InfoBar from '../Chat/InfoBar'
import Input from '../Chat/Input'
import './Home.scss'
import { get } from 'lodash'
const ENDPOINT = 'http://localhost:3000/'

let socket
const Home = () => {
  const { name, room } = useParams()
  const[board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
  const[phase, setPhase] = useState(Boolean)
  const[winner, setWinner] = useState({
    end: false,
    name: ''
  })
  const[draw, setDraw] = useState(Boolean)
  const[message, setMessage] = useState('')
  const[messages, setMessages] = useState([])

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit('join', {name, room}, () => {})
  }, [name, room])

  useEffect(() => {
    socket.on('move', (values) => {
      setBoard(get(values, 'board', ''))
    })

    socket.on('restartGame', (game) => {
      setBoard(get(game, 'board', ''))
      setWinner({...winner, end: get(game, 'end', false), name: ''})
      setDraw(get(game, 'draw', false ))
    })

    socket.on('roomData', (data) => {
      if(name.trim().toLowerCase() === get(data, 'user.name', '')){
        setPhase(get(data, 'user.phase', ''))
      }
    })

    socket.on('otherUserData', (data) => {
      if(name.trim().toLowerCase() === get(data, 'user.name', '')){
        setPhase(get(data, 'user.phase', ''))
      }
    })

    socket.on('message', (message) => {
      setMessages([...messages, message])
    })

    socket.on('draw', () => {
      setDraw(true)
    })

    socket.on('end', (winner) => {
      setWinner({...winner, end: true, name: get(winner, 'name', '')})
      setPhase(false)
    })

    return()=>{
			socket.off()
		}
  }, [name, messages, winner])

  const makeMove = (e) => {
    e.preventDefault()
    socket.emit('make move', {name, room, board, id: e.target.id}, () => {})
  }

  const sendMessage = (e) => {
    e.preventDefault()
    
    if(message){
      socket.emit('send message', {room, message, name}, () => setMessage(''))
    }
  }

  const restart = () => {
    socket.emit('restart', {name, room}, () => '')
  }

  return(
    <div className="container">
      <br/>
      <br/>
      <div className="row">
        <div className="col-6">
            <div className="container">
              <InfoBar room={room}/>
              <Messages messages={messages} name={name}/>
              <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
        <div className="col-6">
          <table>
            <tbody>
              <tr>
                <td onClick={(e) => makeMove(e)} id="0" className={phase ? "" : "disabled"}>{board[0]}</td>
                <td className={phase ? "vert" : "vert disabled"} onClick={(e) => makeMove(e)} id="1">{board[1]}</td>
                <td onClick={(e) => makeMove(e)} id="2" className={phase ? "" : "disabled"}>{board[2]}</td>
              </tr>
              <tr>
                <td className={phase ? "hori" : "hori disabled"} onClick={(e) => makeMove(e)} id="3">{board[3]}</td>
                <td className={phase ? "vert hori" : "vert hori disabled"} onClick={(e) => makeMove(e)} id="4">{board[4]}</td>
                <td className={phase ? "hori" : "hori disabled"} onClick={(e) => makeMove(e)} id="5">{board[5]}</td>
              </tr>
              <tr>
                <td onClick={(e) => makeMove(e)} id="6" className={phase ? "" : "disabled"}>{board[6]}</td>
                <td className={phase ? "vert" : "vert disabled"} onClick={(e) => makeMove(e)} id="7">{board[7]}</td>
                <td onClick={(e) => makeMove(e)} id="8" className={phase ? "" : "disabled"}>{board[8]}</td>
              </tr>
            </tbody>
          </table>  
        </div>
        {winner.end ? 
          <div className="row">
            <div className="col-12">
              <h1>O {winner.name} Ganhou!!!</h1>
              <div>
                <button type="button" className="btn btn-primary reset-button" onClick={() => restart()}>Reiniciar</button>
              </div>
            </div>
          </div>
        : ''}
        {draw ? 
          <div className="row">
            <div className="col-12">
              <h1>Empatou!!!</h1>
              <div>
                <button type="button" className="btn btn-primary reset-button" onClick={() => restart()}>Reiniciar</button>
              </div>
            </div>
          </div>
        : ''}
      </div>
    </div>
  )
}

export default Home