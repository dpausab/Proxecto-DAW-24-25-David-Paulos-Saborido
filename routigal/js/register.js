import { ajax } from "./ajaxF.js"

const $d = document,
            $nombre = $d.querySelector("#nombre"),
            $user = $d.querySelector("#user"),
            $pwd = $d.querySelector("#pwd"),
            $form = $d.querySelector("form"),
            $rol = $d.querySelector("#rol"),
            $register = $d.querySelector("#register"),
            $old = $d.querySelector("#old_pwd")


let roles = []
const usuario = new URLSearchParams(window.location.search).get("usuario") ?? null;

$d.addEventListener("DOMContentLoaded", async(ev) => {
  
  await getRoles()
  renderRoles(roles)

  if (!usuario) {
    $old.style.display = "none"
  } else {
    fillUser(usuario)
  }
})

$form.addEventListener("submit", async(ev) => {
    ev.preventDefault()
    if (!validarForm()) return
    if (usuario) {
      await updateUser(usuario)
    } else {
      await insertUser()
    }
})

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

function renderRoles(roles) {
  if (roles.length) {
    $rol.innerHTML += roles.map(el => 
      `<option value="${el.id}">${el.nombre}</option>`).join('')
  } 
}

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
      } else {
        throw new Error(resp.mensaje)
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

function validarForm() {
    let errores = []
    let [nombre, usuario, pwd, rol] = $form.querySelectorAll("input")

    if (!nombre.value.length || !usuario.value.length || !pwd.value.length || !rol.value.length) {
        errores.push("Todos los campos son obligatorios")
    }

    if (isNaN(pwd.value)) {
      errores.push("El rol es inválido")
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