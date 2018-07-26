import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import { loginUser } from "../store";
import api from "../lib/api";
import { ROUTES } from "../server/constants/routes";

import Layout from "../components/layout";

const readFileData = file => {
  return new Promise(function(res, rej) {
    var FR = new FileReader();
    FR.onload = function() {
      res(this.result);
    };
    FR.readAsDataURL(file);
  });
};

class UploadPage extends Component {
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
      Router.push(ROUTES.auth.login);
    }

    return {};
  }

  constructor(props) {
    super(props);
    this.state = {
      file: null,
      fileDataUrl: null,
      filename: "Demo"
    };

    this.refDropzone = React.createRef();
    this.refUploadSection = React.createRef();
  }

  componentDidMount() {
    this.initializeDropzone();
  }

  componentWillUnmount() {
    this.initializeDropzone(true);
  }

  initializeDropzone(unbind = false) {
    const bindActionMethod = unbind
      ? "removeEventListener"
      : "addEventListener";

    let dropzone = this.refDropzone.current;
    let uploadSection = this.refUploadSection.current;
    ["dragenter", "dragover"].forEach(eventName => {
      dropzone[bindActionMethod](eventName, this.highlight.bind(this), false);
    });
    ["dragleave", "drop"].forEach(eventName => {
      dropzone[bindActionMethod](eventName, this.unhighlight.bind(this), false);
    });

    dropzone[bindActionMethod]("drop", this.handleDrop.bind(this));

    const inputFallback = document.querySelector("input#upload-input-fallback");
    dropzone[bindActionMethod]("click", function() {
      inputFallback.click();
    });

    inputFallback[bindActionMethod](
      "change",
      this.handleInputChange.bind(this)
    );
  }

  highlight(e) {
    e.preventDefault();
    this.refDropzone.current.classList.add("active");
  }

  unhighlight(e) {
    e.preventDefault();
    this.refDropzone.current.classList.remove("active");
  }

  handleInputChange(e) {
    this.onSelectFileHandler(e.target.files[0]);
  }

  handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    let dt = e.dataTransfer;

    if (dt.files[0]) {
      this.onSelectFileHandler(dt.files[0]);
    }
  }

  onSelectFileHandler(file) {
    readFileData(file).then(url => {
      this.setState({
        file,
        fileDataUrl: url
      });
    });
  }

  onRemoveFileHandler(e) {
    e.preventDefault();
    this.setState(
      {
        file: null,
        fileDataUrl: null
      },
      () => {
        this.initializeDropzone();
      }
    );
  }

  onClickUpload(e) {
    let payload = {
      image: this.state.file,
      name: this.state.filename
    };

    api.images
      .upload(payload)
      .then(resp => {
        Router.push(ROUTES.app.dashboard);
        alert(resp.data.info || "success");
      })
      .catch(err => {
        console.log(err.toString());
      });
  }

  render() {
    return (
      <Layout title={"Upload"} pageId="page-upload">
        <div className="container">
          {this.state.file == null ? (
            <section
              ref={this.refUploadSection}
              className="upload-section section--elevated mb-4"
            >
              <input
                id="upload-input-fallback"
                type="file"
                name="image"
                accept="image/png,image/jpg"
                className="d-none"
              />
              <div ref={this.refDropzone} className="upload-section__dropzone">
                <span className="text-center">
                  <strong>Drag and Drop</strong><br/>
                 or <br/>
                 <strong>Click to select</strong> an image
                 </span>
              </div>
            </section>
          ) : (
            <section id="preview" className="preview-section section--elevated mb-4">
              <div className="preview-canvas mb-5">
                <div className="preview-img-cont">
                  <img
                    src={this.state.fileDataUrl}
                    id="preview-img"
                    className="preview-img"
                  />
                </div>
              </div>
            </section>
          )}

          <div className="d-flex align-contents-center justify-content-between">
            <button
              id="analyze-img"
              className="btn btn-outline-dark btn-lg"
              onClick={this.onRemoveFileHandler.bind(this)}
            >
              Remove
            </button>
            <button
              id="analyze-img"
              className="btn btn-primary btn-lg"
              onClick={this.onClickUpload.bind(this)}
            >
              Upload
            </button>
          </div>
        </div>
      </Layout>
    );
  }
}

export default UploadPage;
