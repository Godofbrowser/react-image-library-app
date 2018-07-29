import React from "react";
import { connect } from "react-redux";
import { Link as CustomLink } from "../lib/routes";
import { loginUser } from "../store";
import api from "../lib/api";
import serverApi from "../server/api";

import Layout from "../components/layout";
import SearchForm from "../components/Search";
import ImageGrid from "../components/ImageGrid";

const Home = props => {
  return (
    <Layout title={"Home"} pageId="page-home">
      <div>
        <div className="container mb-5">
          <div className="jumbotron">
            <h1 className="display-4">Image Library</h1>
            <p className="lead">
              A simple image library app built with nextjs and express
            </p>
            <hr className="my-5" />
            <SearchForm search={props.query.search} />
          </div>
        </div>

        <div className="container-fluid">
          <h3 className="display-5 text-center">Recent Uploads</h3>

          <ImageGrid images={props.images} />
        </div>

        <section className="tags-section">
          <div className="container">
            <hr className="my-5" />
            <h3 className="mb-4">Search by Tags</h3>
            <ul className="tags">
              {props.tags.map(tag => (
                <li className="tag text-capitalize" key={tag.slug}>
                  <CustomLink route={`/tag/${tag.slug}/images`}>
                    <a href={`/tag/${tag.slug}/images`}>{tag.name}</a>
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </Layout>
  );
};

Home.getInitialProps = async function({ reduxStore, pathname, query, req }) {
  const isServer = !!req;
  if (isServer && req.session.user) {
    await loginUser(
      reduxStore.dispatch,
      req.session.user.attributes,
      req.session.user.token
    );
  }

  let currentApi = isServer ? serverApi(reduxStore.getState().user.token) : api;

  let promises = [];

  promises.push(
    currentApi.images.getRecentUploads().then(resp => {
      return resp.data.data;
    })
  );

  promises.push(
    currentApi.tags.getAllTags().then(resp => {
      return resp.data.data;
    })
  );

  return Promise.all(promises).then(results => {
    return {
      images: results[0],
      tags: results[1],
      query
    };
  });
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(Home);
