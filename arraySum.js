// API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>
const fetch = require('node-fetch');

async function getResponse( request ) {
    const resp = await fetch(request)
    const data = await resp.json();
    return data;
}

async function getCountryPerCode( key ){
    let paisesPorClave = {
        '': '',
    };
    let data = await getResponse(`https://jsonmock.hackerrank.com/api/countries?page=1`);
    const total_pages = data.total_pages;
    for(let i = 1; i <= total_pages; i++){
        data = await getResponse(`https://jsonmock.hackerrank.com/api/countries?page=${i}`);
        let paisesEnPagina = data.data;
        for(let pais of paisesEnPagina){
            let tempObject = {
                [pais.alpha2Code]: [pais.name],
            };
            paisesPorClave = {...paisesPorClave, ...tempObject};
        }
    }
    return paisesPorClave[key];
}

async function init(){
    const pais = await getCountryPerCode('MX');
    console.log(pais); // output: MEXICO.
}

init();