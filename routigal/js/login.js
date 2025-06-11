import { ajax } from "./ajaxF.js"

const $d = document,
            $user = $d.querySelector("#user"),
            $pwd = $d.querySelector("#pwd"),
            $form = $d.querySelector("form")

$form.addEventListener("submit", async(ev) => {
    ev.preventDefault()

    try {
      let user = $user.value
      let pwd = $pwd.value

      let resp = await ajax({
        url: '/api/auth/login',
        method: 'POST',
        data: {
            user,
            pwd
        }
      });

      if (!resp.respuesta) {
        console.log("NO")
        throw new Error('Error al iniciar sesión');
      } else {
        window.location.href="dashboard.php"
      }
      
    } catch (error) {
      await swal.fire({
        title: error.message,
        icon: 'error'
      })
      $form.reset()
    }
})