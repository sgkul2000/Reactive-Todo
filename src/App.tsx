import React from 'react'
import './assets/css/App.css'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import User from './entity/User'

interface AppState{
  isAuthenticated: boolean,
  uid: string,
  user: User | null
}

class App extends React.Component<{}, AppState> {
  constructor(props: any){
    super(props)
    this.state={
      isAuthenticated: false,
      uid: "",
      user: null
    }
  }
  componentDidMount(){
    try{
      let loggedTemp : string | null = localStorage.getItem('logged')
      var logged : boolean = JSON.parse(loggedTemp || "false")
      console.log(logged)
      if(logged){
        let userTemp: string | null = localStorage.getItem('user')
        let user: User = JSON.parse(userTemp || "")
        let uid : string | null = localStorage.getItem('uid')
        uid = JSON.parse(uid || "")
        this.setState({
          user,
          uid: uid ? uid : "",
          isAuthenticated: true
        }, () => {})
  
      }
    } catch(err){
      console.log({err})
    }

  }
  successfullLogin = (user: User, uid: string) => {
    console.log("helloworld")
    this.setState({
      user,
      isAuthenticated: true,
      uid
    }, () => {
      console.log(this.state)
      window.location.href = '/'
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <main className="App-body">
            <Switch>
            <Route path="/login" render={(props:any) => <Login {...props} loginCallback={this.successfullLogin}/>}  />
            {
              this.state.isAuthenticated ? 
              <>
                <Route path="/" render={(props: any) => <Home {...props} uid={this.state.uid}/>}  />
              </> : <Route path="/" render={(props:any) => <Login {...props} loginCallback={this.successfullLogin}/>}  />
            }
            <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
          </main>
        </div>
      </Router>
    )
  }
}

export default App
