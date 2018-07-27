import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import { toast } from "react-toastify";
import { WithContext as ReactTags } from 'react-tag-input';
import { loginUser } from "../store";
import api from "../lib/api";
import { ROUTES } from "../server/constants/routes";
import { readFileDataUrl } from "../lib/util";

import Layout from "../components/layout";

const TAB_UPLOAD = "upload";
const TAB_FINALIZE = "finalize";
const VISIBILITY_PRIVATE = "private";
const VISIBILITY_PUBLIC = "public";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const getToastProps = (sticky = false) => {
  return {
    autoClose: sticky ? false : null,
    hideProgressBar: sticky ? true : null,
    closeButton: sticky ? false : null,
    closeOnClick: sticky ? false : null,
    draggable: sticky ? false : null,
    draggablePercent: sticky ? null : "50"
  };
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
      filename: null,
      uploadedFileId: null,
      visibility: VISIBILITY_PRIVATE,
      tags: [],
      suggestions: [{ id: 'Nature', text: 'Nature' }],
      isUploading: false,
      tab: TAB_UPLOAD
    };

    this.refDropzone = React.createRef();

    this.handleTagDelete = this.handleTagDelete.bind(this);
    this.handleTagAddition = this.handleTagAddition.bind(this);
    this.handleTagDrag = this.handleTagDrag.bind(this);
    this.handleTagClick = this.handleTagClick.bind(this);
  }

  componentDidMount() {
    if (this.state.tab === TAB_UPLOAD) {
      this.initializeDropzone();
    }
  }

  componentWillUnmount() {
    // Destroy listeners is the section is visible
    // and it's waiting for file
    if (this.state.tab === TAB_UPLOAD && !this.state.file) {
      this.initializeDropzone(true);
    }
  }

  initializeDropzone(unbind = false) {
    const bindActionMethod = unbind
      ? "removeEventListener"
      : "addEventListener";

    let dropzone = this.refDropzone.current;
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
    // Destroy listeners as the section will not be visible
    this.initializeDropzone(true);

    readFileDataUrl(file).then(url => {
      this.setState({
        file,
        fileDataUrl: url
      });
    });
  }

  onRemoveFileHandler(e) {
    e.preventDefault();
    this.resetData().then(() => {
      // Enable listeners again
      this.initializeDropzone();
    });
  }

  resetData() {
    return new Promise(res => {
      this.setState(
        {
          file: null,
          fileDataUrl: null,
          uploadedFileId: null,
          tags: [],
          visibility: VISIBILITY_PRIVATE
        },
        () => res()
      );
    });
  }


  handleTagDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleTagAddition(tag) {
   this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleTagDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  handleTagClick(index) {
    console.log('The tag at index ' + index + ' was clicked');
  }

  onClickUpload() {
    if (this.state.isUploading) return;
    if (!this.state.file) return;

    let toastId = toast.info("Upload started...", getToastProps(true));

    this.setState({
      isUploading: true,
      tab: TAB_FINALIZE
    });

    let payload = {
      image: this.state.file,
      name: this.state.filename,
      progressCallback(percentage) {
        console.log("Percentage uploaded: ", percentage);
        toast.update(toastId, {
          render: `uploading ${percentage}% ...`
        });
      }
    };

    api.images
      .upload(payload)
      .then(resp => {
        // Router.push(ROUTES.app.dashboard);
        // alert(resp.data.info || "success");
        toast.update(toastId, {
          ...getToastProps(),
          render: resp.data.info || "Success!",
          type: toast.TYPE.SUCCESS
        });

        this.setState({
          uploadedFileId: resp.data.data.id
        });
      })
      .catch(err => {
        toast.update(toastId, {
          ...getToastProps(),
          render: `Upload failed with error "${err.toString()}", retry?`,
          type: toast.TYPE.ERROR
        });

        // if (confirm(`Upload failed with error "${err.toString()}", retry?`)) {
        //   this.onClickUpload();
        // }
      })
      .then(() => {
        this.setState({
          isUploading: false
        });
      });
  }

  onClickFinalize() {
    if (!this.state.filename) {
      return toast.warn(
        "The name field is empty"
      )
    }

    if (this.state.isUploading) {
      return toast.warn(
        "Upload is in progress! you'll be able to save once completed"
      );
    }

    if (this.state.isFinalizing) return;
    if (!this.state.uploadedFileId){
      return toast.warn(
        "Ops! seems you're yet to upload an image or upload was not successful"
      );
    }

    this.setState({
      isFinalizing: true
    });

    let payload = {
      name: this.state.filename,
      visibility: this.state.visibility,
      tags: this.state.tags
    };

    api.images
      .updateImage(this.state.uploadedFileId, payload)
      .then(resp => {
        this.resetData();
        toast.success(resp.data.info || "Success!");
        Router.push(ROUTES.app.dashboard)
      })
      .catch(err => {})
      .then(() => {
        this.setState({
          isFinalizing: false
        });
      });
  }

  renderUploadTab() {
    return (
      <div>
        {this.state.file == null ? (
          <section className="upload-section section--elevated mb-4">
            <input
              id="upload-input-fallback"
              type="file"
              name="image"
              accept="image/png,image/jpg"
              className="d-none"
            />
            <div ref={this.refDropzone} className="upload-section__dropzone">
              <span className="text-center">
                <strong>Drag and Drop</strong>
                <br />
                or <br />
                <strong>Click to select</strong> an image
              </span>
            </div>
          </section>
        ) : (
          <section
            id="preview"
            className="preview-section section--elevated mb-4"
          >
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
            className="btn btn-outline-dark btn-lg"
            disabled={!this.state.file}
            onClick={this.onRemoveFileHandler.bind(this)}
          >
            Remove
          </button>
          <button
            className="btn btn-primary btn-lg"
            disabled={!this.state.file}
            onClick={this.onClickUpload.bind(this)}
          >
            Upload
          </button>
        </div>
      </div>
    );
  }

  renderFinalizeTab() {
    return (
      <div>
        <section className="finalize-section mb-4">
          <div className="section-content p-3">
            <h3 className="display-5 mt-2 mb-4">
              Complete your uploaded process
            </h3>

              <div className="section-content-inner pb-4">
                <div className="form-group">
                  <label htmlFor="displayName">Display name</label>
                  <input
                    type="email"
                    className="form-control"
                    id="displayName"
                    aria-describedby="nameHelp"
                    placeholder="Enter image name"
                    onChange={e => this.setState({filename: e.target.value})}
                  />
                  <small id="nameHelp" className="form-text text-muted">
                    This will be the display name of the image
                  </small>
                </div>

                <h6 className="display-6 mt-4">Image visibility</h6>
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="visibility"
                    value={VISIBILITY_PRIVATE}
                    checked={this.state.visibility === VISIBILITY_PRIVATE}
                    onChange={() => this.setState({visibility: VISIBILITY_PRIVATE})}
                  />
                    Private
                  </label>
                </div>
                <div className="form-check form-check-inline mb-4">
                  <label className="form-check-label">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="visibility"
                    value={VISIBILITY_PUBLIC}
                    checked={this.state.visibility === VISIBILITY_PUBLIC}
                    onChange={() => this.setState({visibility: VISIBILITY_PUBLIC})}
                  />
                    Public
                  </label>
                </div>

                  <div className="form-group">
                  <label>Add Tag(s)</label>
                  <ReactTags tags={this.state.tags}
                    suggestions={this.state.suggestions}
                    handleDelete={this.handleTagDelete}
                    handleAddition={this.handleTagAddition}
                    handleDrag={this.handletagDrag}
                    delimiters={delimiters} />
                </div>
              </div>

              

              <div className="d-flex align-contents-center justify-content-between">
                <button
                  className="btn btn-outline-dark btn-lg"
                  disabled={this.state.isUploading}
                  onClick={() => {
                    !this.state.isUploading &&
                      this.setState({ tab: TAB_UPLOAD });
                  }}
                >
                  Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={this.onClickFinalize.bind(this)}
                >
                  Save
                </button>
              </div>
          </div>
        </section>
      </div>
    );
  }

  render() {
    return (
      <Layout title={"Upload"} pageId="page-upload">
        <div className="container">
          {this.state.tab === TAB_UPLOAD && this.renderUploadTab()}

          {this.state.tab === TAB_FINALIZE && this.renderFinalizeTab()}
        </div>
      </Layout>
    );
  }
}

export default UploadPage;
