import { ajax } from "./ajaxF.js"

const $d = document,
            $usuarios = $d.querySelector("tbody"),
            $filtros = $d.querySelector("#filtros"),
            $nombreF = $filtros.querySelector("#nombre_filtro"),
            $rolF = $filtros.querySelector("#rol_filtro"),
            $paginacion = $d.querySelector("#paginacion"),
            $tabla = $d.querySelector("table"),
            $crear = $d.querySelector("#crear") ?? null

let usuarios = []
let roles = []
let next = null;
let actualPage = 1


$d.addEventListener("DOMContentLoaded", async () => {
   
    await getUsuarios()
    await getRoles()
    renderUsuarios(usuarios)
    renderRoles(roles)
    renderPaginacion()
    
})

/**
 * Recupera los datos de los usuarios de la BBDD
 */
async function getUsuarios(nombre=null, rol=null, page=actualPage) {
    let datos  = await ajax({
        url: `/api/usuarios/getAll/${parseInt(page)}?nombre=${nombre}&rol=${rol}`
    })

    usuarios = datos.datos
    next = datos.next
}

 /**
 * Recupera los datos de los roles de la BBDD
 */
async function getRoles() {
    let datos  = await ajax({
        url: `/api/roles/getAll`
    })

    roles = datos
}

/**
 * Renderiza los usuarios como registros en la tabla.
 * @param {*} usuarios 
 */
function renderUsuarios(usuarios) {
    if (usuarios.length) {
        $usuarios.innerHTML = usuarios.map(el => {
            let rol = roles.find(rol => rol.id === el.rol).nombre
           
            return `<tr>
                <td>${el.nombre}</td>
                <td>${rol}</td>
                <td>
                    <div class="acciones">
                        <button id="editar" data-id="${el.id}">
                            <a href="register.php?usuario=${el.id}">Editar</a>
                        </button>
                        <button id="borrar" data-id="${el.id}">Borrar</button>
                    </div>
                </tr>`
            }).join('')
    } else {
        $usuarios.innerHTML = "<tr>No hay usuarios.</tr>"
    }
}

/**
 * Renderiza los roles como opciones del select de roles.
 * @param {*} roles 
 */
function renderRoles(roles) {
    if (roles.length) {
        $rolF.innerHTML = `<option value="">Rol</option>`
        $rolF.innerHTML += roles.map(el => 
            `<option value="${el.id}">${el.nombre}</option>`
        ).join('')
    } else {
        $rolF.innerHTML = 'option value="">Rol</option>'
    }
}

/**
 * Renderiza los botones de paginación según los datos existentes en la BBDD.
 */
function renderPaginacion() {
    $paginacion.innerHTML = ""

    if (actualPage>1) {
        $paginacion.innerHTML += 
        `<button class="paginacion" id="anterior">
            <- Anterior
        </button>`

        let botonAnterior = $paginacion.querySelector("#anterior")
        botonAnterior.addEventListener("click", async(ev) => {
            ev.preventDefault()
            let anterior = parseInt(actualPage)-1
            actualPage = anterior
            await filtrar($nombreF.value, $rolF.value, actualPage)
        })
    }
    if (next) {
        $paginacion.innerHTML += 
        `<button class="paginacion" id="siguiente">
            Siguiente ->
        </button>`

        let botonSiguiente = $paginacion.querySelector("#siguiente")
        botonSiguiente.addEventListener("click", async(ev) => {
            ev.preventDefault()
            let siguiente = parseInt(actualPage)+1
            actualPage = siguiente
            await filtrar($nombreF.value, $rolF.value, actualPage)
        })
    }
}

/**
 * Recupera los datos filtrados de la BBDD y los renderiza
 * @param {*} nombre 
 * @param {*} rol 
 */
async function filtrar(nombre=null, rol=null) {
    await getUsuarios(nombre, rol)
    renderUsuarios(usuarios)
}

/**
 * Función que gestiona la llamada a la API para el borrado de usuarios.
 * @param {*} id 
 */
async function deleteUsuario(id) {
    try {
        let rutasUsuario = await ajax({
            url: `/api/rutas/getByUser/${id}`
        })

        let ruta = rutasUsuario
        if (ruta) {
            throw new Error("No se puede borrar el usuario, tiene rutas asignadas.")
        } else {
            console.log("CHILL")
        }
        let datos  = await ajax({
                    url: `/api/usuarios/delete/${id}`,
                    method: 'DELETE'
                })

        if(datos.respuesta) {
            swal.fire({
                title: 'Usuario borrado',
                icon: 'success'
            })

            await getUsuarios()
            renderUsuarios(usuarios)
        }
    } catch (error) {
        swal.fire({
            title: error.message,
            icon: 'error'
        })
    }
}

// Gestiona el evento de borrado.
$usuarios.addEventListener("click", async(ev) => {

    if (ev.target.id === "borrar" && ev.target.dataset.id) {
        try {
            await swal.fire({
                    title: '¿Seguro que quieres borrar el usuario?',
                    icon: 'info',
                    showCancelButton: true
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        await deleteUsuario(ev.target.dataset.id)  
                    } else {
                        return
                    }
                })
        } catch (error) {
            swal.fire({
                title: 'Algo ha fallado',
                icon: 'success'
            })
        }

    }
})

// Si existe el botón de crear, redirige a la pantalla de registro.
if ($crear) {
    $crear.addEventListener("click", ev => {
        ev.preventDefault()
        window.location.href = "register.php"
    })
}

// Inicialización de los listeners para el filtrado.
$nombreF.addEventListener("input", async(ev) => {
    ev.preventDefault()
    await filtrar($nombreF.value, $rolF.value, actualPage)
})

$rolF.addEventListener("change", async(ev) => {
    ev.preventDefault()
    await filtrar($nombreF.value, $rolF.value, actualPage)
})
