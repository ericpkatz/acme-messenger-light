import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch, Redirect} from 'react-router-dom'
import { Login, Signup } from './components/AuthForm';
import Home from './components/Home';
import Messages from './components/Messages';
import {me, loadMessages, loadUsers } from './store'

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidUpdate(prevProps){
    if(!prevProps.isLoggedIn && this.props.isLoggedIn){
      this.props.loadMessages();
      this.props.loadUsers();
      window.socket = new WebSocket(window.location.origin.replace('http', 'ws'));
      window.socket.addEventListener('message', (ev)=> {
        const obj = JSON.parse(ev.data);
        if(obj.type){
          this.props.dispatchMessage(obj);
        }
      });
    }
  }
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props

    return (
      <div>
        {isLoggedIn ? (
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/messages" component={Messages} />
            <Redirect to="/home" />
          </Switch>
        ) : (
          <Switch>
            <Route path='/' exact component={ Login } />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        )}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    },
    loadMessages: ()=> {
      dispatch(loadMessages())
    },
    loadUsers: ()=> {
      dispatch(loadUsers())
    },
    dispatchMessage: (action)=> {
      dispatch(action);
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))
