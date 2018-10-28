import React, { Component } from 'react';

import Config from '../config'

import RegistrationForm from './RegistrationForm'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nowFormLock: false,
      error: null,
      mode: 'auth'
    }
  }
  onAuthSubmit(e) {
    this.setState({ nowFormLock: true })
    e.preventDefault()
    let data = {}
    data.id = e.target.userid.value
    data.password = e.target.password.value

    var queryString = Object.keys(data).map(key => key + '=' + data[key]).join('&');


    fetch(Config.API_URL + 'signin', {
      method: 'POST',
      body: queryString,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then(resp => resp.json())
      .then(data => {
        this.setState({ nowFormLock: false })
        if (data.error != null) {
          this.setState({ error: data.error })
        }
        else {
          this.setState({ error: null })
          this.props.onGetToken(data.responce)
        }
      })
      .catch(e => {
        this.setState({ error: e })
        console.log(e)
      })

    return false
  }
  render() {
    let auth = (
      <div>
        <div className="card mt-3">
          <div className="card-header">
            Авторизация
          </div>
          <div className="card-body">
            <form onSubmit={(e) => this.onAuthSubmit(e)}>
              <div className="form-group">
                <label htmlFor="userid">ID пользователя</label>
                <input type="text" className="form-control" id="userid" placeholder="Введите Ваш ID"></input>
              </div>
              <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input type="password" className="form-control" id="password" placeholder="Введите Ваш пароль"></input>
              </div>
              <button type="submit" className="btn btn-primary" disabled={this.state.nowFormLock}>Ввойти</button>
              <button className="btn btn-link" onClick={() => this.setState({ mode: 'reg' })}>Регистрация</button>
              <div style={{ height: '40px' }} className="mt-3">
                {this.state.nowFormLock &&
                  <div className="progress">
                    <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '100%' }}></div>
                  </div>}
                {!this.state.nowFormLock && this.state.error != null &&
                  <div className="alert alert-danger" role="alert">
                    {this.state.error}
                  </div>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    )
    return (this.state.mode === 'auth' ? auth : (<RegistrationForm onGetToken={(token) => this.props.onGetToken(token)} changeMode={(type) => this.setState({mode: type})}></RegistrationForm>))
  }
}

export default LoginForm;
