import React from 'react'
import Router from 'next/router'
import { ROUTES } from '../server/constants/routes'

class SearchForm extends React.Component {
    constructor(props) {
      super(props)
  
      this.state = {
          input: props.search || ''
      }

      this.onSubmitHandler = this.onSubmitHandler.bind(this)
    }
    onSubmitHandler(e) {
      e.preventDefault()

      if (this.state.input === '') return

      Router.push({
        pathname: ROUTES.app.images,
        query: {
          search: encodeURIComponent(this.state.input)
        }
      })
    }
    render() {
      return (
        <form className="row" onSubmit={this.onSubmitHandler}>
          <div className="col-md-8 mb-4">
            <input
              value={decodeURIComponent(this.state.input)}
              onChange={e => this.setState({input: e.target.value})}
              type="text"
              name="query"
              className="form-control form-control-lg mr-2"
              placeholder="Search image by name"
            />
          </div>
          <div className="col-md-4">
            <button type="submit" className="btn btn-primary btn-lg btn-block">Search</button>
          </div>
        </form>
      );
    }
  }

  export default SearchForm