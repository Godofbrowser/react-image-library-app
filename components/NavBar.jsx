import React from "react"
import classNames from 'classnames'
import { connect } from "react-redux"
import Link from "next/link"
import { ROUTES } from "../server/constants/routes"

class NavBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
        isOpen: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { user } = this.props;
    const { isOpen } = this.state

    return (
      <nav className={classNames('navbar fixed-top navbar-expand-sm navbar-dark bg-primary')}>
        <Link href={ROUTES.home}>
          <a className="navbar-brand">Image Library</a>
        </Link>
        <Link href={ROUTES.app.upload}>
          <a className="btn btn-light my-2 my-sm-0 d-none-md">Upload</a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={this.toggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={ isOpen ? 'true' : 'false' }
          aria-label="Toggle navigation"npm li
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={classNames("collapse navbar-collapse", {show: isOpen})} id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link href={ROUTES.home}>
                <a className="nav-link">Home</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href={ROUTES.app.images}>
                <a className="nav-link">Images</a>
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Tags
              </a>
            </li>
            <li className="d-none d-sm-inline">
              <span className="text-light mx-3"> | </span>
            </li>
            <li className="nav-item mr-sm-auto">
              {user.authenticated ? (
                <span>
                  <Link href={ROUTES.app.dashboard}>
                    <a className="nav-link d-block d-sm-inline-block">Dashboard</a>
                  </Link>
                  <Link href={ROUTES.auth.logout}>
                    <a className="nav-link d-block d-sm-inline-block">Logout</a>
                  </Link>
                </span>
              ) : (
                <span>
                  <Link href={ROUTES.auth.login}>
                    <a className="nav-link d-block d-sm-inline-block">Login</a>
                  </Link>
                  <Link href={ROUTES.auth.register}>
                    <a className="nav-link d-block d-sm-inline-block">Register</a>
                  </Link>
                </span>
              )}
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(NavBar);
