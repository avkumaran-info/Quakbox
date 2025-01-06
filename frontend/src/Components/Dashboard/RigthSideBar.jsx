import React from "react";

const RigthSideBar = () => {
  return (
    <>
      <div class="col-md-3 bg-light sidebar d-none d-md-block mt-5">
        <h5 class="p-3">Right Sidebar</h5>
        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link A
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link B
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Link C
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default RigthSideBar;
