import React, { Component } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import Config from './config'

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  constructor(props) {
    super(props)
    let localtoken = localStorage.getItem('token')
    if (localtoken === 'null') localtoken = null
    this.state = {
      token: localtoken,
      info: {},
      ping: 0
    }
    console.log(this.state.token)
    this.updateInfo()
  }
  updateInfo() {
    fetch(Config.API_URL + 'info', {
      headers: {
        'Authorization': 'Bearer ' + this.state.token, 
      }
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      if (json.error == null) {
        this.setState({info: json.responce})
      }
      else {
        this.setState({token: null})
        localStorage.setItem('token', null)  
      }
    })
    .catch((e) => {
      this.setState({token: null})
      localStorage.setItem('token', null)
    })
  }
  onPassToken(token) {
    console.log('auth form, new token')
    this.setState({ token: token })
    localStorage.setItem('token', token)
    this.updateInfo()
  }
  pingGoogle() {
    fetch(Config.API_URL + 'latency', {
      headers: {
        'Authorization': 'Bearer ' + this.state.token, 
      }
    })
    .then(res => res.json())
    .then(json => {
      console.log(json)
      if (json.error == null) {
        this.setState({ping: json.responce})
      }
      else {
        this.setState({token: null})
        localStorage.setItem('token', null)  
      }
    })
    .catch((e) => {
      this.setState({token: null})
      localStorage.setItem('token', null)
    })
  }
  logOut(all) {
    if (all) all = 'true'
    else all = 'false'
    fetch(Config.API_URL + 'logout?all=' + all, {
      headers: {
        'Authorization': 'Bearer ' + this.state.token, 
      }
    })
    .then(res => res.json())
    .then(json => {
      this.setState({token: null})
      localStorage.setItem('token', null) 
    })
    .catch((e) => {
      this.setState({token: null})
      localStorage.setItem('token', null)
    })
  }
  render() {
    let form = (<LoginForm onGetToken={(token) => this.onPassToken(token)}></LoginForm>)
    let page = (
      <div>
        <div className="card mt-3">
          <div className="card-header">
            ping google.com
          </div>
          <div className="card-body text-center">
            <span>{this.state.ping}</span><br></br>
            <button className="btn btn-primary" onClick={() => this.pingGoogle()}>ping</button>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header">
            О пользователе
          </div>
          <div className="card-body">
            <b>ID: </b><span>{this.state.info.id}</span>
            <br></br>
            <b>Тип ID: </b><span>{this.state.info.id_type}</span>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header">
            Авторизация
          </div>
          <div className="card-body text-center">
            <button className="btn btn-primary" onClick={() => this.logOut(false)}>Выйти</button>
            <br></br>
            <button className="btn btn-primary mt-3" onClick={() => this.logOut(true)}>Выйти со всех устройств</button>
          </div>
        </div>
      </div>
    )
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-4"></div>
            <div className="col-lg-4 col-sm-12">
              {this.state.token == null ? form : page}
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
