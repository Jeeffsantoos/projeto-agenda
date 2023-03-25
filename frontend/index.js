// import './assets/css/style.css';
// Importando o pacote core-js, que inclui polyfills para recursos de JavaScript modernos
import 'core-js/stable';

// Importando o pacote regenerator-runtime, que inclui o runtime necessário para suportar o recurso de async/await em JavaScript
import 'regenerator-runtime/runtime';

document.querySelector('.navbar-toggler').addEventListener('click', function () {

    document.querySelector('.navbar-collapse').classList.toggle('collapse');
});