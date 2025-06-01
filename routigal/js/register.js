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
        window.location.href = "login.php"
      } else {
        alert("Ha ocurrido un error.")
      }
      
    } catch (error) {
      alert('Error al intentar registrarse' + error);
      console.log(resp)
      window.location.reload()
    }
})