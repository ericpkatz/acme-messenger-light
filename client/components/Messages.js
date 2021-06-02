import React, { useState } from 'react'
import {connect} from 'react-redux'
import { sendMessage } from '../store';

/**
 * COMPONENT
 */
export const Messages = props => {
  const {messages, users} = props
  const [toId, setToId] = useState('');
  const [text, setText] = useState('');
  const sendMessage = (ev)=> {
    ev.preventDefault();
    props.sendMessage({ text, toId });
  };

  return (
    <div>
      <form className='messageForm' onSubmit={ sendMessage }>
        <select value={ toId } onChange={ ev => setToId(ev.target.value )}>
          <option value=''>-- choose a user --</option>
          {
            users.map( user => {
              return (
                <option key={ user.id } value={ user.id }>{ user.username }</option>
              );
            })
          }
        </select>
        <textarea value={ text } onChange={ ev => setText(ev.target.value)}></textarea>
        <button disabled={ !toId }>Send Message</button>
      </form>
      <ul>
        {
          messages.map( message => {
            return (
              <li key={ message.id } className='message'>
                <div>
                  <label>from:</label>
                  <div>
                    { message.from.username }
                  </div>
                </div>
                <div>
                  <label>to:</label>
                  <div>
                    { message.to.username }
                  </div>
                </div>
                <div className='text'>
                { message.text }
                </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = state => {
  //only show message for or to current user
  return {
    messages: state.messages.filter(message => message.toId === state.auth.id || message.fromId === state.auth.id),
    users: state.users
  }
}

const mapDispatch = dispatch => {
  return {
    sendMessage: (message)=> {
      dispatch(sendMessage(message))
    }
  };
};

export default connect(mapState, mapDispatch)(Messages)
