import React from "react";

const LeftSidebar = () => {
  return (
    <div class="col-md-3 bg-light sidebar d-none d-md-block">
        <h5 class="p-3">Left Sidebar</h5>
        <ul class="nav flex-column">
          <li class="nav-item"><a class="nav-link" href="#">Link 1</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Link 2</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Link 3</a></li>
        </ul>
      </div>
  );
};

export default LeftSidebar;
