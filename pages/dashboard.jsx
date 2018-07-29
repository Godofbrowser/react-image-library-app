import React from "react";
import Router from "next/router";
import { loginUser } from "../store";
import { connect } from "react-redux";
import { ROUTES } from "../server/constants/routes";
import api from '../lib/api'
import serverApi from '../server/api'

import Layout from "../components/layout";
import ImageGrid from "../components/ImageGrid";


class Dashboard extends React.Component {
  static async getInitialProps({ reduxStore, pathname, query, req }) {
    const isServer = !!req;
    if (isServer && req.session.user) {
      await loginUser(
        reduxStore.dispatch,
        req.session.user.attributes,
        req.session.user.token
      );
    }

    if (!isServer && !reduxStore.getState().user.authenticated) {
      console.log("Not authenticated");
      Router.push(ROUTES.auth.login);
    }

    let currentApi = isServer ? serverApi(reduxStore.getState().user.token) : api

    let images = await currentApi.images.getUserUploads().then(resp => {
      return resp.data.data
    })
  
    return {images: images}
  }
  render() {
    const { user } = this.props

    return (
      <Layout title={"Dashboard"}>
        <div className="container">
          <div className="jumbotron">
            <h1>Dashboard</h1>
            <p>Hello {user.attributes.name}! Here you'll find all of your uploaded images</p>
          </div>

          <div className="container-fluid">
            <h3 className="display-5 text-center">My Images</h3>

            <ImageGrid images={this.props.images} showProperties={true} />
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(Dashboard);
