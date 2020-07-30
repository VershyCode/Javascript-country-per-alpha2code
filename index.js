// API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>

const btnbuscar = document.querySelector('#search'); // Boton para buscar un pais.
let loadingIcon = false;

// Cargamos la respuesta de la API.
const getResponse = async ( request ) => {
    const resp = await fetch(request)
    const data = await resp.json();
    return data;
}

/**
 * 
 * @param key recibe un codigo alpha2 de 2 digitos de algun pais.
 * Por ejemplo: MX = 'Mexico', US = 'United states', TR = 'Turkey', BG = 'Bulgaria'.
 */
const getCountryPerCode = async ( key = '' ) => {
    key = key.toUpperCase(); // Convertimos lo que venga a mayusculas.
    let paisesPorClave = {
        // Aqui guardaremos todos los paises que recibamos de la API.
        // TODO: Refactorizar para solo buscar el pais pagina por pagina sin tener que obtener todos los paises.
        '': '',
    };
    // Hacemos el primer fetch fuera del loop para poder obtener el total de paginas a leer.
    let data = await getResponse(`https://jsonmock.hackerrank.com/api/countries?page=1`); 
    const total_pages = data.total_pages;
    for(let i = 1; i <= total_pages; i++){
        /**
         * Acorde @total_pages seran las iteraciones que haremos. 
         */
        data = await getResponse(`https://jsonmock.hackerrank.com/api/countries?page=${i}`);
        let paisesEnPagina = data.data; // Obtenemos la data que viene de la respuesta y se la asignamos a @paisesEnPagina.
        for(let pais of paisesEnPagina){
            // Por cada pais en @paisesEnPagina haremos un objeto temporal, donde la llave sera el @alpha2 del pais y su valor sera el nombre del pais.
            let tempObject = {
                [pais.alpha2Code]: [pais.name],
            };
            paisesPorClave = {...paisesPorClave, ...tempObject}; // Agregamos el nuevo objeto creado en esta pagina a @paisesPorClave.
        }
    }
    return paisesPorClave[key];
}

const loading = ( x ) => {
    /**
     *  Metodo para mostrar el icono de loading y deshabilitar boton.
     */
    const card = document.querySelector('#result');
    if(x){
        btnbuscar.disabled = true;
        const loadingImg = document.createElement('img');
        loadingImg.src = './assets/img/loading.gif';
        loadingImg.width = 60;
        loadingImg.height = 50;
        loadingImg.id = 'result';
        card.replaceWith(loadingImg);
    }else{
        btnbuscar.disabled = false;
        const paragraph = document.createElement('p');
        paragraph.value = '...';
        paragraph.id = 'result';
        card.replaceWith(paragraph);
    }
}

const init = async ( countryCode ) => {
    /**
     *  Metodo para obtener la respuesta de la API ya procesada con nuestros requerimentos.
     */
    loading(true);
    const pais = await getCountryPerCode( countryCode );
    loading(false);
    if(pais){
        document.querySelector('#result').innerHTML = `${pais}`;
    }else{
        document.querySelector('#result').innerHTML = `PAIS NO ENCONTRADO.`;
    }
}

btnbuscar.addEventListener('click', ( click ) => {
    const txtpais = document.querySelector('#txtpais').value;
    init( txtpais );
});