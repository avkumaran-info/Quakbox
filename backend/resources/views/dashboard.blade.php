<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .sidebar {
            transition: width 0.3s ease;
        }

        .sidebar.collapsed {
            width: 80px;
        }

        .sidebar.collapsed .nav-link {
            justify-content: center;
        }

        .sidebar .nav-link span {
            display: inline-block;
            margin-left: 10px;
        }

        .sidebar.collapsed .nav-link span {
            display: none;
        }

        .sidebar.collapsed .nav-item {
            text-align: center;
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <header>    
    <nav class="navbar navbar-expand-lg bg-primary text-white">
        <div class="container-fluid">
            <!-- Left Side: Branding, Menu Icon, and Visit Site -->
            <div class="d-flex align-items-center">
                <!-- Branding -->
                <a class="navbar-brand text-white d-flex align-items-center" href="#">
                    <img src="{{ asset('img/qicon.png') }}" alt="Quakbox Icon"
                        style="height: 40px; width: 40px; border-radius: 50%; margin-right: 10px;">
                    <span style="font-family: 'Shojumaru', cursive, Arial, serif;">QUAKBOX</span>
                </a>
                <!-- Sidebar Toggle Button -->
                <button class="btn btn-light ms-3 me-2" id="sidebarToggleBtn">
                    <i class="fas fa-bars"></i>
                </button>
                  <!-- Visit Site Link -->
                  <a class="nav-link text-white" href="#">Visit Site</a>
              </div>
  
              <!-- Right Side: User Profile Dropdown -->
              <div class="d-flex align-items-center ms-auto">
                  <div class="dropdown">
                      <button class="btn btn-light dropdown-toggle" type="button" id="profileDropdown"
                          data-bs-toggle="dropdown" aria-expanded="false">
                          <span id="adminEmail">{{ $userEmail }}</span>
                      </button>
                      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                          <li>
                              <form action="{{ route('logout') }}" method="POST" id="logoutForm">
                                  @csrf
                                  <a class="dropdown-item" href="javascript:void(0);"
                                      onclick="document.getElementById('logoutForm').submit();">Logout</a>
                              </form>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </nav>  
    </header>
    <!-- Layout Structure -->
    <div class="container-fluid mt-4">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-2 bg-light sidebar py-3" id="sidebar">
                <h5 class="text-primary">
                    <span id="menuText">Menu</span>
                </h5>
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-home"></i><span> Home</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-users"></i><span> Members</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-user"></i><span> Users</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-newspaper"></i><span> News</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-chart-line"></i><span> Report</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-video"></i><span> Videos</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-ad"></i><span> Advertisement</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-image"></i><span> Image Ads</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-cogs"></i><span> Apps</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">
                            <i class="fas fa-chart-pie"></i><span> News Chart</span>
                        </a>
                    </li>
                </ul>                    
            </div>

            <!-- Main Content -->
            <div class="col-md-10">
                <!-- Summary Cards -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Total Users</h5>
                                <p class="card-text">15</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Total News</h5>
                                <p class="card-text">32</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Total Videos</h5>
                                <p class="card-text">145</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Total Ads</h5>
                                <p class="card-text">389</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Sections -->
                <div class="card mb-4">
                    <div class="card-header">
                        Introduction
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">Quakbox</h5>
                        <p class="card-text">Quakbox is a new kind of social networking site. In this site, you can experience lots of new and amazing features to use!</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        Weekly Stats
                    </div>
                    <div class="card-body">
                        <p class="card-text">Placeholder for weekly statistics content.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Toggle Sidebar Collapse
        document.getElementById('sidebarToggleBtn').addEventListener('click', function() {
            var sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('collapsed');
        });
    </script>
</body>   
</html>
