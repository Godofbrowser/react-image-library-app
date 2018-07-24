import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Layout from '../../components/layout'
import api from '../../lib/api'
import { ROUTES } from '../../server/constants/routes'

import { connect } from 'react-redux'
import store, { loginUser } from '../../store'

class LoginPage extends Component {
  static getInitialProps({reduxStore, pathname, query, req}) {
    const isServer = !!req
    if (isServer && req.session.user) {
      loginUser(reduxStore.dispatch)
    }

    if (reduxStore.getState().user.authenticated) {
      console.log('not autcated')
      Router.push(ROUTES.auth.dashboard)
    }

    return {  }
  }

  constructor(props) {
    super(props);

    this.state = {
      forms: {
        login: {
          email: '',
          password: ''
        }
      }
    }

    this.onSubmitLogin = this.onSubmitLogin.bind(this)
  }

  onSubmitLogin(e) {
    e.preventDefault()

    api.auth.login({
      email: e.target.querySelector('input[name=email]').value,
      password: e.target.querySelector('input[name=password]').value
    }).then(resp => {
      setTimeout(() => {
        loginUser(
          this.props.dispatch,
          resp.data.data.user.attributes,
          resp.data.data.user.token
        )
        Router.push(ROUTES.app.dashboard)
        console.log('Logged in: ' + resp.data.data.user.attributes.name)
      }, 100) // delay for testing
    }).catch(err => {
      console.error(err.toString())
      let message = err.response.data.error || err.toString()
      alert('login error: ' + message)
    })
  }

  render() {
    return (
      <Layout title={"Login"}>
        <div className="container">
          <div className="mb-5">
            <h1>Login</h1>
            <p>
              Don't have an account yet? &nbsp;
              <Link href={ROUTES.auth.register}>
                <a>Register here</a>
              </Link>
            </p>
          </div>
          <div className="" style={{ maxWidth: '600px' }}>
            <form onSubmit={this.onSubmitLogin}>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Submit
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps (state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(LoginPage)