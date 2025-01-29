import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './sidebar.css';

const Tsidebar = ({ sidebarOpen }) => {
  return (
    <ul className={`sidebar navbar-nav ${sidebarOpen ? "sidebar-visible" : "toggled"}`}>
      {/* Home Link */}
      <li className="nav-item active">
        <Link className="nav-link" to="/">
          <i className="fas fa-fw fa-home"></i>
          {sidebarOpen && <span>Home</span>}
        </Link>
      </li>

      {/* Channels Link */}
      <li className="nav-item">
        <Link className="nav-link" to="/channels">
          <i className="fas fa-fw fa-users"></i>
          {sidebarOpen && <span>Channels</span>}
        </Link>
      </li>

      {/* Single Channel Link */}
      <li className="nav-item">
        <Link className="nav-link" to="/singlechannel"> {/* Use Link instead of <a> */}
          <i className="fas fa-fw fa-user-alt"></i>
          {sidebarOpen && <span>Single Channel</span>}
        </Link>
      </li>

      {/* Video Page Link */}
      <li className="nav-item">
        <Link className="nav-link" to="/video-page">
          <i className="fas fa-fw fa-video"></i>
          {sidebarOpen && <span>Video Page</span>}
        </Link>
      </li>

      {/* Upload Video Link */}
      <li className="nav-item">
        <Link className="nav-link" to="/upload-video">
          <i className="fas fa-fw fa-cloud-upload-alt"></i>
          {sidebarOpen && <span>Upload Video</span>}
        </Link>
      </li>

      {/* Pages Dropdown */}
      <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="fas fa-fw fa-folder"></i>
          {sidebarOpen && <span>Pages</span>}
        </Link>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <h6 className="dropdown-header">Login Screens:</h6>
          <li><Link className="dropdown-item" to="/login">Login</Link></li>
          <li><Link className="dropdown-item" to="/register">Register</Link></li>
          <li><Link className="dropdown-item" to="/forgot-password">Forgot Password</Link></li>
          <div className="dropdown-divider"></div>
          <h6 className="dropdown-header">Other Pages:</h6>
          <li><Link className="dropdown-item" to="/404">404 Page</Link></li>
          <li><Link className="dropdown-item" to="/blank">Blank Page</Link></li>
        </ul>
      </li>

      {/* History Page Link */}
      <li className="nav-item">
        <Link className="nav-link" to="/history-page">
          <i className="fas fa-fw fa-history"></i>
          {sidebarOpen && <span>History Page</span>}
        </Link>
      </li>

      {/* Categories Dropdown */}
      <li className="nav-item dropdown">
        <Link className="nav-link dropdown-toggle" to="/categories" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i className="fas fa-fw fa-list-alt"></i>
          {sidebarOpen && <span>Categories</span>}
        </Link>
        <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
          <li><Link className="dropdown-item" to="/categories/movie">Movie</Link></li>
          <li><Link className="dropdown-item" to="/categories/music">Music</Link></li>
          <li><Link className="dropdown-item" to="/categories/television">Television</Link></li>
        </ul>
      </li>

      {/* Subscriptions */}
      <li className="nav-item channel-sidebar-list">
        <h6 style={{ fontSize: sidebarOpen ? '20px' : '8px' }}>
          {sidebarOpen && 'SUBSCRIPTIONS'}
        </h6>
        <ul>
          <li>
            <Link to="/subscriptions">
              <img className="img-fluid" alt="" src="#" /> {sidebarOpen && 'Your Life'}
            </Link>
          </li>
          <li>
            <Link to="/subscriptions">
              <img className="img-fluid" alt="" src="#" /> {sidebarOpen && 'Unboxing'} <span className="badge bg-warning">2</span>
            </Link>
          </li>
          <li>
            <Link to="/subscriptions">
              <img className="img-fluid" alt="" src="#" /> {sidebarOpen && 'Product / Service'}
            </Link>
          </li>
          <li>
            <Link to="/subscriptions">
              <img className="img-fluid" alt="" src="#" /> {sidebarOpen && 'Gaming'}
            </Link>
          </li>
        </ul>
      </li>
    </ul>
  );
};

export default Tsidebar;
