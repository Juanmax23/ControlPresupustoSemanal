//Variables and Selectors
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
const total = document.querySelector('#total');
const restantee = document.querySelector('#restante');
//Events
eventsListeners();
function eventsListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuestos);
    formulario.addEventListener('submit', agreagarGasto);

}

//Classes
class Presupuesto {
    constructor(presupuesto,) {
        this.presupuesto = Number(presupuesto);// ya me lo deja como numero para cuando lo agreagren7
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto]  // tomo una copia de gastos y le agreago alfinal el gasto
        this.calcularRestante();
    }

    calcularRestante() { 
        //reduce: iterar sobre los gastos
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad , 0);
        this.restante = this.presupuesto - gastado;
        // console.log(gasto)

    }
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();

    }
}

//User Interface
class UI {

    //Method

    insertarPresupuesto(cantidad) { //cantidad is the whold objets
        const { presupuesto, restante } = cantidad; //destructuring.
        //add in the HTML
        total.textContent = presupuesto;
        restantee.textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }
        //massage to error
        divMensaje.textContent = mensaje;
        //insertar in the html                             //el que , el donde
        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        //delate the massage after a few seconds
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }

    agregarGastoListado(gastos) {

        this.limpiarHTML();

        //iterar sobre los gastos e ir agregandolos 
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;  //destructuring
            //crear el li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center ';
            // nuevoGasto.setAttribute('data-id',id); //forma mas actualizada para agregarle data-id es con dataset
            nuevoGasto.dataset.id = id;
            //agreagar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>`;
            //btn para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.textContent = "x";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //add to the html
            gastoListado.appendChild(nuevoGasto);

        });

    }

    //method

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        restantee.textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante')
        //comprobar 25%
        if((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
            //comprobar el 50%
        } else if(( presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success')

        }

        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se a ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }

        if(restante > 0) {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }

    }

}


// instanciar
const ui = new UI;
let presupuesto;

//functions

function preguntarPresupuestos() {
    const presupuestoUsuario = prompt('¿Cual es tu preupuesto?')
    //if you choose cancel in the prompt. the result is null
    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload(); // esto hace que se refresque la pagina para pedir devuelta el presupuesto
    }
    //if pase the validation. create the budget and save in a global variable
    presupuesto = new Presupuesto(presupuestoUsuario);
    //show in the HTML
    ui.insertarPresupuesto(presupuesto);

}


function agreagarGasto(e) {
    e.preventDefault();

    //read the dats of the  form
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    //validation
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta("ambos campos son obligatorios", "error");
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // generar un obejto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() } // opposite to destructuring, if is the same name in the objet, only one is necessary.

    //agreago el objeto gasto al arreglo de gastos
    presupuesto.nuevoGasto(gasto);

    //message all okey
    ui.imprimirAlerta('Correcto');

    //printing costs
    const { gastos, restante } = presupuesto; //destructuring
    console.log(gastos)
    console.log(restante)
    

    ui.agregarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto); //todo el objeto

    //restart the form 
    formulario.reset();


}


function eliminarGasto(id) {
    presupuesto.eliminarGasto(id)
    const {gastos,restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto); 

}