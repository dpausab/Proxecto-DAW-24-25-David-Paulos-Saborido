import { ajax } from "./ajaxF.js"

const $d = document,
            $nombre = $d.querySelector("#nombre"),
            $user = $d.querySelector("#user"),
            $pwd = $d.querySelector("#pwd"),
            $form = $d.querySelector("form"),
            $rol = $d.querySelector("#rol"),
            $register = $d.querySelector("#register")

let roles = []

$d.addEventListener("DOMContentLoaded", async(ev) => {
  let resp = await ajax({
        url: 'http://localhost/api/roles/getAll'
      });
  roles = resp

  $rol.innerHTML = roles.map(el => `<option value="${el.id}">${el.nombre}</option>`)
})

$form.addEventListener("submit", async(ev) => {
    ev.preventDefault()

    await insertUser()
})

async function insertUser() {
  try {
      let nombre = $nombre.value
      let usuario = $user.value
      let pwd = $pwd.value
      let rol = $rol.value

      let resp = await ajax({
        url: 'http://localhost/api/usuarios/insert',
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
        window.location.href = "login.php"
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