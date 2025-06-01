import { ajax } from "./ajaxF.js"

const $d = document,
            $rutas = $d.querySelector("tbody"),
            $filtros = $d.querySelector("#filtros")

const estados = {
    1: 'Asignada',
    2: 'Finalizada'
}
let rutas = []
let next = null;

const page = new URLSearchParams(window.location.search).get("page") ?? 1;

$d.addEventListener("DOMContentLoaded", async () => {
    let datos  = await ajax({
        url: `http://localhost/api/rutas/getAll/${parseInt(page)}`
    })

    rutas = datos.datos
    console.log(rutas)
    next = datos.next
    $rutas.innerHTML = rutas.map(el => 
        `<tr>
            <td>${el.nombre}</td>
            <td>${el.tecnico}</td>
            <td>${el.origen}</td>
            <td>${el.fecha}</td>
            <td>${el.estado}</td>
            <td>${el.distanciaTotal}</td>
            <td>${el.tiempoTotal}</td>
            <td>
                <button>
                    <a href="../html/rutas.php?ruta=${el.id}">Editar</a>
                </button>
                <button id="borrar" data-id="${el.id}">Borrar</button>
            </td>
        </tr>`
    ).join('')
    
    if (page>1) {
        $filtros.innerHTML += 
        `<p>
            <a href="?page=${parseInt(page)-1}">Anterior</a>
        </p>`
    }
    if (next) {
        $filtros.innerHTML += 
        `<p>
            <a href="?page=${parseInt(page)+1}">Siguiente</a>
        </p>`
    }
})


// Función simple que formatea los segundos a horas y minutos.
export function formatearTiempo(segundos) {
    let horas = parseFloat(Math.floor(segundos/3600)).toString().padStart(2, "0")
    let minutos = parseFloat(Math.floor(((segundos) - (horas*3600)) / 60)).toString().padStart(2, "0")
    
    return `${horas}:${minutos}`.trim();
}
// Función simple de formateo de horas, para recoger las horas de la BBDD y la hora de inicio.
export function formatearHoras(hora) {
    let [horas, minutos] = hora.split(':').map(Number)
    return horas*3600+minutos*60
}
