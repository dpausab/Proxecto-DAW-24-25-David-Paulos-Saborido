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
        url: 'http://localhost/api/auth/login',
        method: 'POST',
        data: {
            user,
            pwd
        }
      });

      if (resp.respuesta===false) {
        alert("Datos no correctos")
      } else {
        window.location.href="dashboard.php"
      }
      
    } catch (error) {
      alert('Error al intentar logear' + error);
      console.log(error)
      window.location.reload()
    }
})