import { store } from './store.js';
import { setStart, setEnd } from './start.js';
import { formatWaypoint, formatearHoras } from './utils.js';
import { handleStatus } from './handler_v2.js';
import { calcularRuta, simularTramos } from './rutas.js';
import { sendCge } from './cge_2.js';
import { ajax } from './ajaxF.js';

const { dom: DOM, variables: VARIABLES } = store;
// Función que inicia los listeners de los campos del formulario, para que sean interactivos y dinámicos.
export function startListeners() {

    // Función para aportar un timeout a la función simularTramos, para que no se ejecute cada vez que se cambia el input de la hora de salida, en cambio, espera 700ms.
    // De esta forma se evita que se ejecute la función cada vez que se cambia el input, evitando la superposición de llamadas a la función.
    const debouncedSimularTramos = debounce((valor) => {
        VARIABLES.horaSalida = formatearHoras(valor);
        simularTramos(VARIABLES.routeWaypoints, VARIABLES.horaSalida);
    }, 700); // espera 500ms después del último input
 
    DOM.selects.origen.addEventListener("change", ev => {
        setStart(VARIABLES.start)
        calcularRuta()
    })
    DOM.selects.destino.addEventListener("change", ev => {
        setEnd(VARIABLES.end)
        calcularRuta()
    })

    DOM.inputs.horaSalida.addEventListener("input", ev => {
        console.log(ev.target.value)
        debouncedSimularTramos(ev.target.value);
    })

    DOM.selects.tiempo.addEventListener("change", ev => {
        VARIABLES.selects.forEach(el => {
            el.value = ev.target.value
        })
        calcularRuta();
    })

    // Gestiona la acción de guardar datos en la BBDD al pulsar el botón.
    DOM.buttons.guardar.addEventListener("click", async(ev) => {
        ev.preventDefault()
        let inputs = [DOM.inputs.nombreRuta, DOM.inputs.fecha, DOM.inputs.horaSalida]
        let tickets = [...VARIABLES.selected]
        // Es necesario tener todos los campos cubiertos.
        if (!inputs.every(el => el.value.length) || !tickets.length) {
            alert("Rellena todos los campos o selecciona una ubicación")
        } else if (!VARIABLES.posible) {
            alert("La ruta no es posible dados los horarios de atención")
        } else {
            if (VARIABLES.flag) {
                handleStatus(ev)
            } else {
                alert("Espera mientras se calcula la ruta")
            }
        }
            
    })
    // Gestiona el envío de datos a GLPI al pulsar el botón.
    DOM.buttons.glpi.addEventListener("click", async(ev) => {
        ev.preventDefault()
        if (VARIABLES.flag && confirm("¿Seguro que quieres enviar la ruta a GLPI?")) {
            try {
                let resp = await sendCge(VARIABLES.idRuta)
                alert("Datos enviados al GLPI")
                window.location.reload()
            } catch (error) {
                console.log("Error enviando la ruta a GLPI:", error)
            }
        } else {
            alert("Espera mientras se calcula la ruta")
        }
    })
    // Gestiona el evento de "check" de cada checkbox, añadiéndolos o quitándolos como seleccionados.
    DOM.availeable.addEventListener("click", ev => {
        if (ev.target.type=="checkbox" && VARIABLES.flag) {
            let waypoint = formatWaypoint(parseInt(ev.target.dataset.id))
            if (ev.target.checked == true) {
            VARIABLES.selected.push(waypoint)
            } else {
                let index = VARIABLES.selected.findIndex(el => el.id == waypoint.id)
                VARIABLES.selected.splice(index, 1)
            }
            calcularRuta()
        } else {
            ev.preventDefault()
        }
    })

    DOM.form.addEventListener("submit", ev => {
        ev.preventDefault()
    })
}
export function ticketListeners() {
    VARIABLES.selects = Array.from(DOM.availeable.querySelectorAll("select"))
    VARIABLES.selects.forEach(el => {
        let ticket = VARIABLES.ticketsMap.get(parseInt(el.dataset.id))
        el.value = ticket.intervencion ?? DOM.selects.tiempo.value
        el.addEventListener("input", ev => {
            if (!VARIABLES.global) {
                console.log("Entra en el listener de los selects")
                let x = VARIABLES.selected.find(sel => sel.ticket == el.dataset.id)
                x.estimado = el.value
                calcularRuta()
            }
        })
    })
    VARIABLES.popups = Array.from(DOM.availeable.querySelectorAll(".popup-content"))
    VARIABLES.popups = new Map(VARIABLES.popups.map(el => [el.dataset.id, el]))
    VARIABLES.btnsInfo = Array.from(DOM.availeable.querySelectorAll("button"))
    VARIABLES.btnsInfo.forEach(el => {
        el.addEventListener("click", ev => {    
            let target = ev.target.closest("button")
            ev.preventDefault()

            let popup = VARIABLES.popups.get(target.dataset.id)
                if (popup.style.display == "block") {
                    popup.style.display = "none"
                    target.innerHTML = '<i class="bi bi-info-circle"></i>'
                } else {
                    popup.style.display = "block"
                    target.innerHTML = '<i class="bi bi-x-circle"></i>'
                }
            
        })
    })
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}