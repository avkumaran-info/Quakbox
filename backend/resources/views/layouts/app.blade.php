<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <!-- Add your CSS files here -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/bootstrap-cerulean.css') }}" rel="stylesheet">
    <link href="{{ asset('css/bootstrap-responsive.css') }}" rel="stylesheet">
    <link href="{{ asset('css/charisma-app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/jquery-ui-1.8.21.custom.css') }}" rel="stylesheet">
    <link href="{{ asset('css/fullcalendar.css') }}" rel="stylesheet">
    <link href="{{ asset('css/fullcalendar.print.css') }}" rel="stylesheet">
    <link href="{{ asset('css/chosen.css') }}" rel="stylesheet">
    <link href="{{ asset('css/uniform.default.css') }}" rel="stylesheet">
    <link href="{{ asset('css/colorbox.css') }}" rel="stylesheet">
    <link href="{{ asset('css/jquery.cleditor.css') }}" rel="stylesheet">
    <link href="{{ asset('css/jquery.noty.css') }}" rel="stylesheet">
    <link href="{{ asset('css/noty_theme_default.css') }}" rel="stylesheet">
    <link href="{{ asset('css/elfinder.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/elfinder.theme.css') }}" rel="stylesheet">
    <link href="{{ asset('css/jquery.iphone.toggle.css') }}" rel="stylesheet">
    <link href="{{ asset('css/opa-icons.css') }}" rel="stylesheet">
    <link href="{{ asset('css/uploadify.css') }}" rel="stylesheet">
</head>
<body>
    <header>
        <div class="navbar">
            <div class="navbar-inner">
                <div class="container-fluid">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".top-nav.nav-collapse,.sidebar-nav.nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="brand" href="{{ route('home') }}"> <img alt="quakbox Logo" src="{{ asset('img/quaklogo.png') }}" /> <span>Quakbox</span></a>
                    
                    <!-- theme selector starts -->
                    <div class="btn-group pull-right theme-container" >
                        <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="icon-tint"></i><span class="hidden-phone"> Change Theme / Skin</span>
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" id="themes">
                            <li><a data-value="classic" href="#"><i class="icon-blank"></i> Classic</a></li>
                            <li><a data-value="cerulean" href="#"><i class="icon-blank"></i> Cerulean</a></li>
                            <li><a data-value="cyborg" href="#"><i class="icon-blank"></i> Cyborg</a></li>
                            <li><a data-value="redy" href="#"><i class="icon-blank"></i> Redy</a></li>
                            <li><a data-value="journal" href="#"><i class="icon-blank"></i> Journal</a></li>
                            <li><a data-value="simplex" href="#"><i class="icon-blank"></i> Simplex</a></li>
                            <li><a data-value="slate" href="#"><i class="icon-blank"></i> Slate</a></li>
                            <li><a data-value="spacelab" href="#"><i class="icon-blank"></i> Spacelab</a></li>
                            <li><a data-value="united" href="#"><i class="icon-blank"></i> United</a></li>
                        </ul>
                    </div>
                    <!-- theme selector ends -->
                    
                    <!-- user dropdown starts -->
                    <div class="btn-group pull-right" >
                        <a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
                            <i class="icon-user"></i><span class="hidden-phone">admin</span>
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu">
                            <!--<li><a href="#">Profile</a></li>
                            <li class="divider"></li>-->
                            <li><a href="logout.php">Logout</a></li>
                        </ul>
                    </div>
                    <!-- user dropdown ends -->
                    
                    <div class="top-nav nav-collapse">
                        <ul class="nav">
                            <li><a href="../home.php">Visit Site</a></li>
                            <li>
                            <!--    <form class="navbar-search pull-left">
                                    <input placeholder="Search" class="search-query span2" name="query" type="text">

                                </form>-->
                            </li> 

                            <li>
                                <form class="navbar-search pull-left" style="padding-top: 5px;">
                                    <label for="email"> Welcome userxxx</label>
                                </form>
                            </li>
                        </ul>
                    </div><!--/.nav-collapse -->
                </div>
            </div>
        </div>
    </header>

    <main>
        @yield('content')  <!-- This is where the content of each individual view will be injected -->
    </main>

    <!-- Add your JavaScript files here -->
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/jquery-1.7.2.min.js') }}"></script>
    <script src="{{ asset('js/jquery-ui-1.8.21.custom.min.js') }}"></script>
    <script src="{{ asset('js/bootstrap-transition.js') }}"></script>
    <script src="{{ asset('js/bootstrap-alert.js') }}"></script>
    <script src="{{ asset('js/bootstrap-modal.js') }}"></script>
    <script src="{{ asset('js/bootstrap-dropdown.js') }}"></script>
    <script src="{{ asset('js/bootstrap-scrollspy.js') }}"></script>
    <script src="{{ asset('js/bootstrap-tab.js') }}"></script>
    <script src="{{ asset('js/bootstrap-tooltip.js') }}"></script>
    <script src="{{ asset('js/bootstrap-popover.js') }}"></script>
    <script src="{{ asset('js/bootstrap-button.js') }}"></script>
    <script src="{{ asset('js/bootstrap-collapse.js') }}"></script>
    <script src="{{ asset('js/bootstrap-carousel.js') }}"></script>
    <script src="{{ asset('js/bootstrap-typeahead.js') }}"></script>
    <script src="{{ asset('js/bootstrap-tour.js') }}"></script>
    <script src="{{ asset('js/jquery.cookie.js') }}"></script>
    <script src="{{ asset('js/fullcalendar.min.js') }}"></script>
    <script src="{{ asset('js/jquery.dataTables.min.js') }}"></script>
    <script src="{{ asset('js/excanvas.js') }}"></script>
    <script src="{{ asset('js/jquery.flot.min.js') }}"></script>
    <script src="{{ asset('js/jquery.flot.pie.min.js') }}"></script>
    <script src="{{ asset('js/jquery.flot.stack.js') }}"></script>
    <script src="{{ asset('js/jquery.flot.resize.min.js') }}"></script>
    <script src="{{ asset('js/jquery.chosen.min.js') }}"></script>
    <script src="{{ asset('js/jquery.uniform.min.js') }}"></script>
    <script src="{{ asset('js/jquery.colorbox.min.js') }}"></script>
    <script src="{{ asset('js/jquery.cleditor.min.js') }}"></script>
    <script src="{{ asset('js/jquery.noty.js') }}"></script>
    <script src="{{ asset('js/jquery.elfinder.min.js') }}"></script>
    <script src="{{ asset('js/jquery.raty.min.js') }}"></script>
    <script src="{{ asset('js/jquery.iphone.toggle.js') }}"></script>
    <script src="{{ asset('js/jquery.autogrow-textarea.js') }}"></script>
    <script src="{{ asset('js/jquery.history.js') }}"></script>
    <script src="{{ asset('js/charisma.js') }}"></script>
</body>
</html>
