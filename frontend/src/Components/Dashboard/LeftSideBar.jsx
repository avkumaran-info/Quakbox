import React from "react";

const LeftSideBar = () => {
  return (
    <>
      <nav class="col-md-3 bg-light sidebar d-none d-md-block mt-5">
        <h5 class="p-3">Left Sidebar</h5>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link 1
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link 2
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link 3
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default LeftSideBar;
