import { ajax } from "./ajaxF.js"

const $d = document,
            $usuarios = $d.querySelector("tbody"),
            $filtros = $d.querySelector("#filtros"),
            $nombreF = $filtros.querySelector("#nombre_filtro"),
            $rolF = $filtros.querySelector("#rol_filtro"),
            $tabla = $d.querySelector("table"),
            $crear = $d.querySelector("#crear") ?? null

let usuarios = []
let roles = []
let next = null;

const page = new URLSearchParams(window.location.search).get("page") ?? 1;
let user = null

$d.addEventListener("DOMContentLoaded", async () => {
    user = await ajax({url:"http://localhost/api/auth/getLoggedUser"})
   
    await getUsuarios()
    await getRoles()
    renderUsuarios(usuarios)
    renderRoles(roles)
    renderPaginacion()
    
})
async function getUsuarios() {
    let datos  = await ajax({
        url: `http://localhost/api/usuarios/getAll/${parseInt(page)}`
    })

    usuarios = datos.datos
    console.log(usuarios)
    next = datos.next
}

async function getRoles() {
    let datos  = await ajax({
        url: `http://localhost/api/roles/getAll`
    })

    roles = datos
    console.log(roles)
}

function renderUsuarios(usuarios) {
    if (usuarios.length) {
        $usuarios.innerHTML = usuarios.map(el => {
            let rol = roles.find(rol => rol.id === el.rol).nombre
           
            return `<tr>
                <td>${el.nombre}</td>
                <td>${rol}</td>
                <td>
                    <button id="borrar" data-id="${el.id}">Borrar</button>
                </tr>`
            }).join('')
    } else {
        $usuarios.innerHTML = "<tr>No hay usuarios.</tr>"
    }
}

function renderRoles(roles) {
    if (roles.length) {
        $rolF.innerHTML = roles.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $rolF.innerHTML = 'option value="">Rol</option>'
    }
}

function renderPaginacion() {
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
}


async function deleteUsuario(id) {
    try {
        let datos  = await ajax({
                    url: `http://localhost/api/usuarios/delete/${id}`,
                    method: 'DELETE'
                })

        if(datos.respuesta) {
            await getUsuarios()
            renderUsuarios(usuarios)
        }
    } catch (error) {
        throw new Error()
    }
}

$usuarios.addEventListener("click", async(ev) => {
    ev.preventDefault()

    if (ev.target.id === "borrar" && ev.target.dataset.id) {
        await deleteUsuario(ev.target.dataset.id)
        
    }
})

if ($crear) {
    $crear.addEventListener("click", ev => {
        ev.preventDefault()
        window.location.href = "register.php"
    })
}

$nombreF.addEventListener("input", ev => {
    ev.preventDefault()
    let filtrados = usuarios.filter(el => el.nombre.toLowerCase().includes(ev.target.value.toLowerCase()))
    console.log(filtrados)
    renderUsuarios(filtrados)
})

$rolF.addEventListener("change", ev => {
    ev.preventDefault()
    let filtrados = usuarios.filter(el => el.rol == $rolF.value)
    renderUsuarios(filtrados)
})
