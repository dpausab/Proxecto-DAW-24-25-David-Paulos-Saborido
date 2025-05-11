import { ajax } from "./ajaxF.js"

const $d = document,
            $user = $d.querySelector("#user"),
            $pwd = $d.querySelector("#pwd"),
            $form = $d.querySelector("form"),
            $register = $d.querySelector("#register")

$form.addEventListener("submit", async(ev) => {
    ev.preventDefault()

    try {
      let user = $user.value
      let pwd = $pwd.value

      let resp = await ajax({
        url: '../api/auth',
        method: 'POST',
        data: {
            user,
            pwd
        }
      });

      if (resp.success){
        alert("Usuario registrado")
      }
      
    } catch (error) {
      alert('Error al intentar iniciar sesión' + error);
      window.location.reload()
    }
})