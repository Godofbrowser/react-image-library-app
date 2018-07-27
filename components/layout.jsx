import { connect } from "react-redux"
import Head from "next/head"
import NavBar from './NavBar'
import { ToastContainer } from 'react-toastify'

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
      {/* TODO:: set base */}
    </Head>

    <header className="main-header">
      <NavBar/>
    </header>

    <main
      style={{ paddingBottom: "75px", paddingTop: "75px", minHeight: "95vh" }}
    >
      {children}
    </main>
    
    <ToastContainer/>

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
