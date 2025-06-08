<?php
  include_once('auth.php');
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inicio - Routigal</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="/js/menu-hamburguesa.js" defer></script>
  <link rel="stylesheet" href="../css/dashboard.css">
  
</head>
<body>
  <?php include_once("header.php"); ?>

  <main>
    <h1>¡Bienvenido de nuevo, <?php echo $_SESSION['user']['nombre']; ?>!</h1>
    <h2>Esta sección está en pruebas, quería poner gráficas con chart.js</h2>
    <section class="cards">
      <div class="card">
        <h2>Servicios esta semana</h2>
        <p>24</p>
      </div>
      <div class="card">
        <h2>Completados</h2>
        <p>18</p>
      </div>
      <div class="card">
        <h2>Horas en ruta</h2>
        <p>14h 20min</p>
      </div>
      <div class="card">
        <h2>Pendientes</h2>
        <p>6</p>
      </div>
    </section>

    <section>
      <h2>Agenda próxima</h2>
      <div class="list">
        <ul>
          <li>23/05 - Visita a Jorge Gómez (Fontanería general)</li>
          <li>24/05 - Mantenimiento en Casa Lola</li>
          <li>25/05 - Instalación eléctrica en Bazar Marta</li>
        </ul>
      </div>
    </section>
  </main>
  <?php include_once ('footer.php'); ?>
</body>
</html>
