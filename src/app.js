import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './container/login/login'
import Register from './container/register/register'
import HrInfo from './container/hrinfo/hrinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import AuthRoute from './component/authroute/authroute'
import Dashboard from './component/dashboard/dashboard'
import Chat from './component/chat/chat'

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            hasError: false
        }
    }
    componentDidCatch(err, info){
        console.log(err, info)
        this.setState({
            hasError: true
        })
    }
    render(){
        return this.state.hasError ? <img className="error-container" src="require('./error.png)" alt="error" /> : (
            <div>
                <AuthRoute></AuthRoute>
                <Switch>
                    <Route path='/hrinfo' component={HrInfo}></Route>
                    <Route path='/geniusinfo' component={GeniusInfo}></Route>
                    <Route path='/login' component={Login}></Route>
                    <Route path='/register' component={Register}></Route>
                    <Route path='/chat/:user' component={Chat}></Route>
                    <Route component={Dashboard}></Route>
                </Switch>
            </div>
        )
    }
}

export default App