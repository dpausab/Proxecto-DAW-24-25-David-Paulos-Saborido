<?php
    include_once("auth.php");
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Rutas - Routigal</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css"/>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <link rel="stylesheet" href="../css/rutas.css">

  <script src="../js/menu-hamburguesa.js" defer></script>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <script type="module" src="/js/rutas.js" defer></script>
</head>
<body>
  <?php include_once("header.php"); ?>

  <main>
    <h1>Planificador de ruta</h1>
    <section id="form">
      <form class="routigal-form">
          <p>
            <label for="nombre">Nombre de la ruta</label>
            <input type="text" name="nombre" id="nombre" placeholder="Ej: Ruta_01">
          </p>
          <p>
            <label for="punto-partida">Punto de partida</label>
            <select name="punto-partida" id="punto-partida"></select>
          </p>
          <p>
            <label>Técnico</label>
            <select name="tecnico" id="tecnico">
            </select>
          </p>
          <p>
            <label>Hora de salida</label>
            <input type="time" name="hora-salida" id="hora-salida">
          </p>
          <p>
            <label for="fecha-ruta">Fecha</label>
            <input type="date" name="fecha-ruta" id="fecha-ruta">
          </p>
          <button id="calcular">Recalcular</button>
          <button id="guardar">Guardar</button>
        </form>
    </section>

    <div class="ruta-cards">
      <div class="card">
        <h3>Distancia total</h3>
        <p id="distancia-total">0 km</p>
      </div>
      <div class="card">
        <h3>Tiempo estimado</h3>
        <p id="tiempo-total">0 min</p>
      </div>
    </div>

    <div class="ruta-panel">
      <div class="ruta-servicios">
        <div class="ruta-servicios-column">
          <h3>Servicios disponibles</h4>
          <div class="servicios-disponibles"></div>
          </div>

          <div class="ruta-servicios-column">
            <h3>Servicios asignados</h4>
            <div class="servicios-seleccionados"></div>
          </div>
        </div>
      <div id="map"></div>
    </div>
  </main>
  <?php include_once ('footer.php'); ?>
</html>
