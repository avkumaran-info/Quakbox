<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Quakbox</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Charisma, a fully featured, responsive, HTML5, Bootstrap admin template.">
	<meta name="author" content="Muhammad Usman">

	<!-- The styles -->
	<style type="text/css">
	  body {
		padding-bottom: 40px;
	  }
	  .sidebar-nav {
		padding: 9px 0;
	  }
	</style>

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

	<!-- The fav icon -->
	<link href="{{ asset('favicon.ico') }}" rel="shortcut icon">
		
</head>

<body>
		<div class="container-fluid">
		<div class="row-fluid">
		
			<div class="row-fluid">
				<div class="span12 center login-header">
					<h2>Welcome to QuakBox</h2>
				</div><!--/span-->
			</div><!--/row-->
			
			<div class="row-fluid">
				<div class="well span5 center login-box">
					@error('email')
			            <div class="alert alert-danger">{{ $message }}</div>
			        @else
			        	<div class="alert alert-info">
							Please login with your Username and Password.
						</div>
			        @enderror
					<form class="form-horizontal" action="{{ route('login') }}" method="post">
						@csrf
						<fieldset>
							<div class="input-prepend" title="Username" data-rel="tooltip">
								<span class="add-on"><i class="icon-user"></i></span><input autofocus class="input-large span10" name="email" id="email" type="text" placeholder="email" />
							</div>
							<div class="clearfix"></div>

							<div class="input-prepend" title="Password" data-rel="tooltip">
								<span class="add-on"><i class="icon-lock"></i></span><input class="input-large span10" name="password" id="password" type="password" placeholder="Password" />
							</div>
							<div class="clearfix"></div>

							<div class="input-prepend">
							<label class="remember" for="remember"><input type="checkbox" id="remember" />Remember me</label>
							</div>
							<div class="clearfix"></div>

							<p class="center span5">
							<button type="submit" name="submit" class="btn btn-primary">Login</button>
							</p>
						</fieldset>
					</form>
				</div><!--/span-->
			</div><!--/row-->
				</div><!--/fluid-row-->
		
	</div><!--/.fluid-container-->

	<!-- external javascript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
    
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