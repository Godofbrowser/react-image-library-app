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

    this.onSubmitRegister = this.onSubmitRegister.bind(this)
  }

  onSubmitRegister(e) {
    e.preventDefault()

    api.auth.register({
      email: e.target.querySelector('input[name=email]').value,
      name: e.target.querySelector('input[name=name]').value,
      password: e.target.querySelector('input[name=password]').value,
      password_confirmation: e.target.querySelector('input[name=password_confirmation]').value
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
      alert('register error: ' + message)
    })
  }

  render() {
    return (
      <Layout title={"Register"}>
        <div className="container">
        <div className="mb-5">
            <h1>Register</h1>
            <p>
              Already a registered user? &nbsp;
              <Link href={ROUTES.auth.login}>
                <a>Login here</a>
              </Link>
            </p>
          </div>
          <div className="" style={{ maxWidth: '600px' }}>
            <form onSubmit={this.onSubmitRegister}>
            <div className="form-group">
                <label htmlFor="exampleInputName">Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  id="exampleInputName"
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
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
              <div className="form-group">
                <label htmlFor="exampleInputPassword2">Confirm Password</label>
                <input
                  name="password_confirmation"
                  type="password"
                  className="form-control"
                  id="exampleInputPassword2"
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