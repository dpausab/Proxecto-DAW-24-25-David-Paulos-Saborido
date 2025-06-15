<?php
  include_once('auth.php');
  include_once("../api/controller/AuthController.php");

  $user = AuthController::getSessionUser();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inicio - Routigal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/assets/css/dashboard.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/js/menu-hamburguesa.js" defer></script>
  <script type="module" src="/js/dashboard.js" defer></script>
  
</head>
<body>
  <?php include_once("header.php"); ?>

  <main>
    <h1>¡Bienvenido de nuevo, <?php echo $user->getNombre(); ?>!</h1>
    <section class="cards-servicios">
      <article class="card-servicio">
        <h2>Rutas</h2>
        <p id="totales"></p>
      </article>
      <article class="card-servicio">
        <h2>Completadas</h2>
        <p id="completados"></p>
      </article>
      <article class="card-servicio">
        <h2>Horas planificadas</h2>
        <p id="tiempo-total"></p>
      </article>
      <article class="card-servicio">
        <h2>Distancia planificada</h2>
        <p id="km_totales"></p>
      </article >
    </section>

    <section id="servicios-container">
      <h2>Agenda próxima</h2>
      <section class="list">
        <ul id="list-servicios">
          <li>No hay servicios.</li>
        </ul>
      </section>
    </section>
  </main>
  <?php include_once ('footer.php'); ?>
</body>
</html>
