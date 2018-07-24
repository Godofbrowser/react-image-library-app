import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { loginUser } from "../store";
import { ROUTES } from "../server/constants/routes";
import api from "../lib/api";
import serverApi from "../server/api";
import Gallery from "react-grid-gallery";
import imageMapper from "../lib/util/image-mapper";

import Layout from "../components/layout";
import SearchForm from '../components/Search'

const Images = props => {
  const title = !props.query.search
    ? "All Images"
    : `Search result for - ${decodeURIComponent(props.query.search)}`;
  return (
    <Layout title={title}>
      <div>
        <div className="container mb-5">
        <h1 className="display-4">Images</h1>
            <p className="lead">Filter: { title }</p>
            <hr className="my-5" />

          <div className="jumbotron bg-transparent">
            <SearchForm search={props.query.search} />
          </div>
        </div>

        <div className="container">

          <div
            style={{
              display: "block",
              minHeight: "1px",
              width: "100%",
              border: "1px solid #ddd",
              overflow: "auto",
              marginTop: "55px"
            }}
          >
            <Gallery 
              images={props.images.map(imageMapper)}
              enableImageSelection={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

Images.getInitialProps = async function({ reduxStore, pathname, query, req }) {
  const isServer = !!req;
  if (isServer && req.session.user) {
    await loginUser(
      reduxStore.dispatch,
      req.session.user.attributes,
      req.session.user.token
    );
  }

  let currentApi = isServer ? serverApi(reduxStore.getState().user.token) : api;

  let images = await currentApi.images.getAllUploads(1, 12, query.search)
  .then(resp => {
    return resp.data.data;
  });

  return { images, query };
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(Images);
