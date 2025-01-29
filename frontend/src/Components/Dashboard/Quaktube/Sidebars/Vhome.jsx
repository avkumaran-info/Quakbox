import React, { useState, useEffect } from 'react';
import profileImg from '../../../../assets/images/profiles/profile.jpg';
import video from '../../../../assets/images/leftside videos/v1.mp4';
import './vhome.css';

const Vhome = ({ isSidebarExpanded }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the start index of the visible cards
  const [sidebarWidth, setSidebarWidth] = useState(250); // Default sidebar width

  const categories = [
    { img: profileImg, title: 'Your Life', views: '74,853 views', verified: true },
    { img: profileImg, title: 'Unboxing Cool', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Service Reviewing', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Gaming', views: '74,853 views', verified: true },
    { img: profileImg, title: 'Singing', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Cooking', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Traveling', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Health', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Education', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Comedy', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Lifestyle', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Fashion', views: '74,853 views',verified: true },
    { img: profileImg, title: 'DIY', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Vlogs', views: '74,853 views',verified: true },
    { img: profileImg, title: 'Tech News', views: '74,853 views',verified: true },
  ];

  const channels = [
    { id: 's1', name: 'Channel 1', subscribers: '1.4M', followers: '23M' },
    { id: 's2', name: 'Channel 2', subscribers: '1.2M', followers: '15M' },
    { id: 's3', name: 'Channel 3', subscribers: '2.5M', followers: '50M' },
    { id: 's4', name: 'Channel 4', subscribers: '3.1M', followers: '30M' },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? categories.length - 6 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === categories.length - 6 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    setSidebarWidth(isSidebarExpanded ? 250 : 80);
  }, [isSidebarExpanded]);

  return (
    <div className="container-fluid py-4">
      {/* Category Section */}
      <div className="top-category mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Channels Categories</h4>
          <div className="dropdown">
            <button
              className="btn btn-link text-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fa fa-ellipsis-h"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
              <li><a className="dropdown-item" href="#"><i className="fas fa-star me-2"></i>Top Rated</a></li>
              <li><a className="dropdown-item" href="#"><i className="fas fa-signal me-2"></i>Viewed</a></li>
              <li><a className="dropdown-item" href="#"><i className="fas fa-times-circle me-2"></i>Close</a></li>
            </ul>
          </div>
        </div>

        {/* Category Row with Navigation */}
        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-outline-secondary" onClick={handlePrev}>
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="row g-3 justify-content-center">
            {/* Show 6 cards starting from the currentIndex */}
            {categories.slice(currentIndex, currentIndex + 6).map((category, index) => (
              <div className="col-2" key={index}>
                <div className="card category-item text-center shadow-sm">
                  <img
                    src={category.img}
                    className="card-img-top img-fluid rounded-3"
                    alt={category.title}
                  />
                  <div className="card-body p-2">
                    <h6 className="card-title mb-1">{category.title}</h6>
                    {category.verified && <i className="fas fa-check-circle text-success ms-2" title="Verified"></i>}
                    <p className="card-text small text-muted">{category.views}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-outline-secondary" onClick={handleNext}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Featured Video Section */}
      <hr className="mt-0" />
      <div className="video-block section-padding">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>Featured Videos</h6>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort by <i className="fa fa-caret-down" aria-hidden="true"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#"><i className="fas fa-fw fa-star"></i>Top Rated</a></li>
              <li><a className="dropdown-item" href="#"><i className="fas fa-fw fa-signal"></i>Viewed</a></li>
              <li><a className="dropdown-item" href="#"><i className="fas fa-fw fa-times-circle"></i>Close</a></li>
            </ul>
          </div>
        </div>

        <div className="row">
          {Array(8).fill(null).map((_, index) => (
            <div className="col-xl-3 col-sm-6 mb-3" key={index}>
              <div className="card video-card shadow-sm rounded">
                <div className="video-card-image position-relative">
                    <video className="img-fluid rounded-3" controls>
                      <source src={video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  <div className="time">3:50</div>
                </div>
                <div className="card-body video-card-body">
                  <div className="video-title">
                    <a href="#">There are many variations of passages of Lorem</a>
                  </div>
                  <div className="video-page text-success">
                    Education <i className="fas fa-check-circle ms-2 text-success" title="Verified"></i>
                  </div>
                  <div className="video-view">
                    1.8M views &nbsp;<i className="fas fa-calendar-alt"></i> 11 Months ago
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Channels Section */}
      <div className="container mt-5">
        <hr className="mt-0" />
        <div className="video-block section-padding">
          <div className="row">
            <div className="col-md-12">
              <div className="main-title d-flex justify-content-between align-items-center mb-3">
                <h6>Popular Channels</h6>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline-secondary dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Sort by <i className="fa fa-caret-down" aria-hidden="true"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#"><i className="fas fa-fw fa-star"></i>Top Rated</a></li>
                    <li><a className="dropdown-item" href="#"><i className="fas fa-fw fa-signal"></i>Viewed</a></li>
                    <li><a className="dropdown-item" href="#"><i className="fas fa-fw fa-times-circle"></i>Close</a></li>
                  </ul>
                </div>
              </div>
            </div>
            {channels.map((channel) => (
              <div className="col-xl-3 col-md-4 col-sm-6 mb-3" key={channel.id}>
                <div className="channel-card card shadow-sm rounded">
                  <img
                    src={profileImg}
                    alt="Channel"
                    className="card-img-top img-fluid rounded"
                  />
                  <div className="card-body text-center">
                    <h5>{channel.name}</h5>
                    <p className="mb-0 text-muted">{channel.subscribers} subscribers</p>
                    <p className="text-muted">{channel.followers} followers</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vhome;
