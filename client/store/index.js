import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import axios from 'axios';


const LOAD_USERS = 'LOAD_USERS';

const users = (state = [], action)=> {
  if(action.type === LOAD_USERS){
    return action.users;
  }
  return state;
}

export const loadUsers = ()=> {
  return async(dispatch)=> {
    const response = await axios.get('/api/users');
    dispatch({ type: LOAD_USERS, users: response.data });
  }
};

const LOAD_MESSAGES = 'LOAD_MESSAGES';
const ADD_MESSAGE = 'ADD_MESSAGE'; 

const messages = (state = [], action)=> {
  if(action.type === LOAD_MESSAGES){
    return action.messages;
  }
  if(action.type === ADD_MESSAGE){
    //if the message was sent by this user, they have it already
    if(!state.find(message => message.id === action.message.id)){
      return [action.message, ...state];
    }
  }
  return state;
}

export const loadMessages = ()=> {
  return async(dispatch)=> {
    const response = await axios.get('/api/messages', {
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    dispatch({ type: LOAD_MESSAGES, messages: response.data });
  }
};

export const sendMessage = (message)=> {
  return async(dispatch)=> {
    const response = await axios.post('/api/messages', message, {
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });
    dispatch({ type: ADD_MESSAGE, message: response.data });
  }
};

const reducer = combineReducers({ auth, messages, users })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
