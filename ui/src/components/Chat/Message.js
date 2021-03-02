import React from 'react'
import ReactEmoji from 'react-emoji'
import './Message.scss'

const Message = ({ message: { name, text }, userName }) => {
  let isSentByCurrentUser = false
  const trimmedName = userName.trim().toLowerCase()

  if(name === trimmedName){isSentByCurrentUser = true}

  return(
    isSentByCurrentUser ? 
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimmedName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
      </div>
    </div>
    :
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
      <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
      </div>
      <p className="sentText pl-10">{name}</p>
    </div>
  )
}

export default Message