import { connect } from "react-redux";
import Link from "next/link";
import Head from "next/head";
import { ROUTES } from "../server/constants/routes";

// Theme
import "../scss/index.scss";

const TITLE = "Nextjs Image Library";

const Layout = ({ children, title = null, pageId = "", user }) => (
  <div id={pageId}>
    <Head>
      <title>{title ? `${title} | ${TITLE}` : TITLE}</title>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>

    <header className="main-header">
      <nav className="navbar fixed-top navbar-expand-md navbar-dark bg-primary">
        <Link href={ROUTES.home}>
          <a className="navbar-brand">Image Library</a>
        </Link>
        <Link href={ROUTES.app.upload}>
          <a className="btn btn-light my-2 my-sm-0 d-none-md">Upload</a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
            <li className="d-none d-md-inline">
              <span className="text-light mx-4"> | </span>
            </li>
            <li className="nav-item mr-4">
              {user.authenticated ? (
                  <span>
                    <Link href={ROUTES.app.dashboard}>
                        <a className="nav-link">Dashboard</a>
                    </Link>
                    <Link href={ROUTES.auth.logout}>
                        <a className="nav-link">Logout</a>
                    </Link>
                </span>
              ) : (
                <span>
                  <Link href={ROUTES.auth.login}>
                    <a className="nav-link">Login</a>
                  </Link>
                  <Link href={ROUTES.auth.register}>
                    <a className="nav-link">Register</a>
                  </Link>
                </span>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <main
      style={{ paddingBottom: "75px", paddingTop: "75px", minHeight: "95vh" }}
    >
      {children}
    </main>

    <footer className="main-footer">
      <div className="container">
        <p className="text-center">&copy; 2018 - godofbrowser</p>
      </div>
    </footer>

    <script src="/static/vendor/jquery/jquery.min.js" />
    <script src="/static/vendor/bootstrap/js/bootstrap.min.js" />
  </div>
);

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(Layout);
