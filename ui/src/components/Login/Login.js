import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.scss'

const Login = () => {
  const[name, setName] = useState('')
  const[room, setRoom] = useState('')

  return(
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-2"></div>
          <div className="col-8">
            <h1>Escolha um Apelido e uma Sala</h1>
            <div><input placeholder="Nome" className="joinInput" type="text" onChange={(event) => setName(event.target.value)}/></div>
            <div><input placeholder="Sala" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)}/></div>
            <br/>
            <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/home/${name}/${room}`}>
              <button type="button" className="btn btn-primary">ENTRAR</button>
              <br/>
            </Link>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default Login