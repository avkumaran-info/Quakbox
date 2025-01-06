import React from "react";
import userImage from "../../assets/images/vector-users-icon.jpg";
import logo from "../../assets/images/quak_logo.png";
import imag3 from "../../assets/images/login-illustration .png";
const Feed = () => {
  return (
    <>
      <div class="col-md-6 bg-white mb-5 mt-5">
        {/* <h5 class="p-3">Feed</h5> */}
        <div class="container">
          <div class="card p-3">
            <div class="d-flex align-items-center">
              <img
                src={userImage}
                alt="Profile"
                class="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <input
                type="text"
                class="form-control"
                placeholder="What's on your mind?"
                style={{ fontSize: "16px" }}
              />
            </div>
            <div class="d-flex justify-content-between flex-wrap">
              <button class="btn btn-light d-flex align-items-center flex-grow-1 m-1">
                <i class="fa fa-video me-2 text-danger"></i> Live video
              </button>
              <button class="btn btn-light d-flex align-items-center flex-grow-1 m-1">
                <i class="fa fa-image me-2 text-success"></i> Photo/video
              </button>
              {/* <button class="btn btn-light d-flex align-items-center flex-grow-1 m-1">
                    <i class="fa fa-face-smile me-2 text-warning"></i>{" "}
                    Feeling/activity
                  </button> */}
            </div>
          </div>
        </div>

        <div class="container my-4">
          {/* <!-- Post Card --> */}
          <div class="card mx-auto" style={{ maxWidth: "300px;" }}>
            {/* <!-- Header --> */}
            <div class="card-header d-flex align-items-center bg-white border-0">
              <img
                src={userImage}
                alt="User Avatar"
                class="rounded-circle me-2"
                style={{ width: " 40px", height: "40px;" }}
              />
              <div>
                <h6 class="mb-0">Pream Ba</h6>
                <small class="text-muted">January 1 at 11:21 PM · 🌎</small>
              </div>
            </div>

            {/* <!-- Images --> */}
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-12">
                  <img
                    src={userImage}
                    alt="Post Image 1"
                    class="img-fluid w-100"
                  />
                </div>
              </div>
            </div>

            {/* <!-- Footer --> */}
            <div class="card-footer bg-white d-flex justify-content-between align-items-center border-0">
              <span class="text-muted">
                Prakash Uppur Prakash and 16 others
              </span>
              <div class="d-flex">
                <button class="btn btn-light btn-sm me-2">
                  <i class="bi bi-hand-thumbs-up"></i> Like
                </button>
                <button class="btn btn-light btn-sm me-2">
                  <i class="bi bi-chat"></i> Comment
                </button>
                <button class="btn btn-light btn-sm">
                  <i class="bi bi-share"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="container my-4">
          {/* <!-- Post Card --> */}
          <div class="card mx-auto" style={{ maxWidth: "300px;" }}>
            {/* <!-- Header --> */}
            <div class="card-header d-flex align-items-center bg-white border-0">
              <img
                src={userImage}
                alt="User Avatar"
                class="rounded-circle me-2"
                style={{ width: " 40px", height: "40px;" }}
              />
              <div>
                <h6 class="mb-0">Pream Ba</h6>
                <small class="text-muted">January 1 at 11:21 PM · 🌎</small>
              </div>
            </div>

            {/* <!-- Images --> */}
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-12">
                  <img src={logo} alt="Post Image 1" class="img-fluid w-100" />
                </div>
              </div>
            </div>

            {/* <!-- Footer --> */}
            <div class="card-footer bg-white d-flex justify-content-between align-items-center border-0">
              <span class="text-muted">
                Prakash Uppur Prakash and 16 others
              </span>
              <div class="d-flex">
                <button class="btn btn-light btn-sm me-2">
                  <i class="bi bi-hand-thumbs-up"></i> Like
                </button>
                <button class="btn btn-light btn-sm me-2">
                  <i class="bi bi-chat"></i> Comment
                </button>
                <button class="btn btn-light btn-sm">
                  <i class="bi bi-share"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="container my-4">
          {/* <!-- Post Card --> */}
          <div class="card mx-auto" style={{ maxWidth: "300px;" }}>
            {/* <!-- Header --> */}
            <div class="card-header d-flex align-items-center bg-white border-0">
              <img
                src={userImage}
                alt="User Avatar"
                class="rounded-circle me-2"
                style={{ width: " 40px", height: "40px;" }}
              />
              <div>
                <h6 class="mb-0">Pream Ba</h6>
                <small class="text-muted">January 1 at 11:21 PM · 🌎</small>
              </div>
            </div>

            {/* <!-- Images --> */}
            <div class="card-body p-0">
              <div class="row g-0">
                <div class="col-12">
                  <img src={imag3} alt="Post Image 1" class="img-fluid w-100" />
                </div>
              </div>
            </div>

            {/* <!-- Footer --> */}
            <div class="card-footer bg-white d-flex justify-content-between align-items-center border-0">
              <span class="text-muted">
                Prakash Uppur Prakash and 16 others
              </span>
              <div class="d-flex">
                <button class="btn btn-light btn-sm me-2">
                  <i class="bi bi-hand-thumbs-up"></i> Like
                </button>
                <button class="btn btn-light btn-sm me-2">
                  <i class="bi bi-chat"></i> Comment
                </button>
                <button class="btn btn-light btn-sm">
                  <i class="bi bi-share"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
