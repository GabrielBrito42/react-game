import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from './Message'
import './Messages.scss'
import { map } from 'lodash'

const Messages = ({messages, name}) => (
  <ScrollToBottom className="scroll">
    {map(messages, (message, i) => 
      <div className="messages" key={i}>
        <Message message={message} userName={name}/>
      </div>
    )}
  </ScrollToBottom>
)

export default Messages