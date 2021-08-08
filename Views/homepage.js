
let U = require('./utilities');
var out;

async function displayHomePage(res) {
    
    out = ``;
    console.log('> displayHomePage: method entered...');
    
    out = await U.addHeaderHTML(out);

    out = await U.openingHtmlElements(out);

    out += `<div class="row">`;
    
                //LHS of page
    out +=      `<div class="col s12 l10">`;

            //spacer rows
            out += '    <div class="row"></div>';
            out += '    <div class="row"></div>';
            out += '    <div class="row"></div>';

            out += '    <div class="row">';
            out =           await U.addSpacerColumn(4, out);
            out =           await U.displaySymbolLogo( 12, 4, out );
            out =           await U.addSpacerColumn(4, out);
            out += '    </div>';

            //spacer row
            out += `    <div class="row">
                            
                        </div>`;


            out += '    <div class="row">';
            out += '    </div>';


    out +=      `</div>`;

                //RHS login column of page
    out +=      `<div class="col s12 l2">`;
    
    out =           await U.loginCard(out);
    out +=      `</div>`;


    out +=  `</div>`;

    out = await U.closingHtmlElements(out);
    
    out = await U.addFooterHTML(out);
    
    res.send(out);
}

module.exports = {
    displayHomePage
}
