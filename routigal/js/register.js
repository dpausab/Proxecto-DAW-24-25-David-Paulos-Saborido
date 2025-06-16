import { ajax } from "./ajaxF.js"

const $d = document,
            $nombre = $d.querySelector("#nombre"),
            $user = $d.querySelector("#user"),
            $pwd = $d.querySelector("#pwd"),
            $form = $d.querySelector("form"),
            $rol = $d.querySelector("#rol"),
            $register = $d.querySelector("#register"),
            $old_container = $d.querySelector("#old"),
            $old = $d.querySelector("#old_pwd")


let roles = []
const usuario = new URLSearchParams(window.location.search).get("usuario") ?? null;

$d.addEventListener("DOMContentLoaded", async(ev) => {
  
  await getRoles()
  renderRoles(roles)

  if (!usuario) {
    $old_container.style.display = "none"
  } else {
    fillUser(usuario)
  }
})

// Gestión de evento, si hay ID update, si no ADD.
$form.addEventListener("submit", async(ev) => {
    ev.preventDefault()
    if (!validarForm()) return
    if (usuario) {
      await updateUser(usuario)
    } else {
      await insertUser()
    }
})

/**
 * Función que recupera los roles de la BBDD.
 */
async function getRoles() {
  try {
    let resp = await ajax({
        url: '/api/roles/getAll'
      });
      roles = resp
  } catch (error) {
    swal.fire({
      title: error.message,
      icon: 'error'
    });
  }
}

/**
 * Función que renderiza los roles como opción para registrar un nuevo usuario.
 * @param {Array} roles 
 */
function renderRoles(roles) {
  if (roles.length) {
    $rol.innerHTML += roles.map(el => 
      `<option value="${el.id}">${el.nombre}</option>`).join('')
  } 
}

/**
 * Función que realiza la llamada a la API para el registro del nuevo usuario.
 */
async function insertUser() {
  try {
      let nombre = $nombre.value
      let usuario = $user.value
      let pwd = $pwd.value
      let rol = $rol.value

      let resp = await ajax({
        url: '/api/usuarios/insert',
        method: 'POST',
        data: {
            nombre,
            usuario,
            pwd,
            rol
        }
      });
      if (resp.respuesta) {
        await swal.fire({
          title: 'Registro exitoso',
          icon: 'success',
          text: 'Usuario registrado correctamente.'
        })
        window.location.href = "usuarios.php"
      } 
    } catch (error) {
      await swal.fire({
          title: 'Ha ocurrido un error',
          icon: 'warning',
          text: error.message
        })
      $form.reset()
    }
}

/**
 * Función que realiza la llamada a la API para la edición del nuevo usuario.
 * @param {id} id
 */
async function updateUser(id) {
  try {
    let resp = await ajax({
      url: `/api/usuarios/update/${parseInt(id)}`,
      method: 'PUT',
      data: {
        nombre: $nombre.value,
        usuario: $user.value,
        old_pwd: $old.value,
        new_pwd: $pwd.value,
        rol: $rol.value
      }
    })
    swal.fire({
      title: 'Usuario editado correctamente',
      icon: 'success'
    })
  } catch (error) {
    swal.fire({
      title: error.message,
      icon: "error",
    })
  }
}

/**
 * Función simple que rellena el formulario con los campos del usuario.
 * @param {integer} id 
 */
async function fillUser(id) {
  let datos = await ajax({
    url: `/api/usuarios/get/${parseInt(id)}`
  })

  let user = datos ?? null
  if (user) {
    $nombre.value = user.nombre
    $user.value = user.usuario
    $rol.value = user.rol
    $register.textContent = "Actualizar Usuario"
  }
}

/**
 * Función que hace una validación básica de los datos enviados por el formulario.
 * @returns bool
 */
function validarForm() {
    let errores = []
    let [nombre, usuario, old_pwd, pwd, rol] = $form.querySelectorAll("input, select")
    

    if ($old_container.style.display != "none") {
      if (!old_pwd.value.trim().length) {
        errores.push("La contraseña es obligatoria")
      }
    }

    if (!nombre.value.trim().length || !usuario.value.trim().length || !pwd.value.trim().length || !rol.value.trim().length) {
        errores.push("Todos los campos son obligatorios")
    }

    if (errores.length){
        swal.fire({
            title: 'Error',
            icon: 'warning',
            html: errores.map(el => `<p>${el}</p>`).join('')
        })
        return false
    }

    return true
}