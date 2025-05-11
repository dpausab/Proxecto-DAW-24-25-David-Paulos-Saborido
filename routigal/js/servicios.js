import { ajax } from "./ajaxF.js"

const $d = document,
            $servicios = $d.querySelector(".servicios")

const estados = {
    1: 'Nuevo',
    2: 'En curso',
    3: 'Acabado'
}
$d.addEventListener("DOMContentLoaded", async () => {
    let datos  = await ajax({
        url: "../api/servicios"
    })

    datos.forEach(element => {
        $servicios.innerHTML = datos.map(el => 
            `<tr>
                <td>${element.id}</td>
                <td>${element.ruta}</td>
                <td>${element.cliente}</td>
                <td>${element.longitud}</td>
                <td>${element.latitud}</td>
                <td>${estados[element.estado]}</td>
                <td>${element.descripcion}</td>
                <td>${element.tiempoEstimado}</td>
            </tr>`
        ).join('')
    });
})