import React from "react";

const RightSidebar = () => {
  return (
    <div class="col-md-3 bg-light sidebar d-none d-md-block">
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
  );
};

export default RightSidebar;
