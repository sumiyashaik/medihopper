
async function addHeaderHTML(out) {
    
    out += '<html>';
	out += '    <head>';
    out += '        <!-- Compiled and minified CSS -->';
    out += '        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">';
    out += '        <link rel="stylesheet" href="/style.css">';
    out += '        <!-- Compiled and minified JavaScript -->';
    out += '        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>';            
	out += '    </head>';
	out += '    <body>';
	out += '    	  <nav>';
	out += '    		<div class="nav-wrapper brown lighten-4">';
	out += '    		  <a href="#" class="brand-logo"><img src="/logo.png" width="120px"/></a>';
	out += '    		  <ul id="nav-mobile" class="right hide-on-med-and-down">';
	out += '    			<li><a href="/">Home</a></li>';
	out += '    			<li><a href="/about">About</a></li>';
	out += '    			<li><a href="/contact">Contact</a></li>';
	out += '    		  </ul>';
	out += '    		</div>';
	out += '    	  </nav>';
    
    return out;
}

async function addFooterHTML(out) {

    out += `<footer class="page-footer brown darken-4 grey-text text-lighten-5">
              <div class="container">
                <div class="row">
                  <div class="col l6 s12">
                    <h5 class="white-text">MediHopper</h5>
                    <p class="grey-text text-lighten-4">Improving the experience of booking a GP visit.</p>
                  </div>
                  <div class="col l4 offset-l2 s12">
                    <h5 class="white-text">Links</h5>
                    <ul>
                      <li><a class="grey-text text-lighten-3" href="#!">Partner link 1</a></li>
                      <li><a class="grey-text text-lighten-3" href="#!">Partner link 2</a></li>
                      <li><a class="grey-text text-lighten-3" href="#!">Partner link 3</a></li>
                      <li><a class="grey-text text-lighten-3" href="#!">Partner link 4</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="footer-copyright brown darken-3 grey-text text-lighten-5">
                <div class="container">
                    © 2021 Copyright MediHopper
                    
                </div>
              </div>
            </footer>

               </body>
            </html>`;
    return out;
}

async function openingHtmlElements(out) {
    out += `<main>`;
    //            <div class="container">`;
    return out;
}

async function closingHtmlElements(out) {
    //out += `    </div>`;
    out += `        </main>`;
    return out;
}

async function addSpacerColumn(dividingSpace, out) {
    out += `<div class="col s${dividingSpace} l${dividingSpace}">
            </div>`;
    return out;
}

async function addPageTitle(sColSpan, lColSpan, pageTitle, out) {
    out += `<div class="row">
                <div class="col s1 l1"></div>
                <div class="col s1 l1" id="greenblock">
                    <p><br><br><br></p>
                </div>
                <div class="col s10 l10 white-text"><h1>${pageTitle}</h1></div>
            </div>`;

    return out;
}

async function displaySymbolLogo(sColSpan, lColSpan, out) {    
    out += `<div class="col s${sColSpan} l${lColSpan}">
                <img src="/logo-reverse.png" width="250px"/>
                <p class="logo">Hop to your next GP visit</p>
            </div>`;
    return out;
}

async function loginCard(out) {
    out += `<div class="col s12 l12 grey lighten-5 z-depth-1">
    			<p>Already a member? Then sign in below.</p>
				<h4>Login</h4></p>
				<form method="POST" action="/user/auth">
                    username: <input type="text" name="username" /><br>
                    password: <input type="password" name="password" /><br>
                    <button class="btn waves-effect waves-light light-green darken-1" type="submit" name="action">Submit</button>
				</form>
            </div>`;
    return out;
}

module.exports = {
    addHeaderHTML,
    addFooterHTML,
    openingHtmlElements,
    closingHtmlElements,
    addSpacerColumn,
    addPageTitle,
    displaySymbolLogo,
    loginCard
};