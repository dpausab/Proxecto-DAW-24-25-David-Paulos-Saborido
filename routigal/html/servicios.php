<?php
    include_once("auth.php");

?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Servicios - Routigal</title>
  <script src="/js/menu-hamburguesa.js" defer></script>
  <script type="module" src="/js/servicios.js" defer></script>
  <link rel="stylesheet" href="../css/servicios.css">
</head>
<body>
  <?php include_once('header.php'); ?>

  <main>
    <h1>Gestión de servicios</h1>
    <section id="form">
      <form class="routigal-form" id="form-servicios">
        <p>
          <label for="cliente">Cliente</label>
          <input type="text" name="cliente" id="cliente" placeholder="Nombre del cliente" />
        </p>
        <p>
          <label for="latitud">Latitud</label>
          <input type="text" name="latitud" id="latitud"/>
        </p>
        <p>
          <label for="longitud">Longitud</label>
          <input type="text" name="longitud" id="longitud"/>
        </p>
        <p>
          <label for="fecha">Fecha</label>
          <input type="date" name="fecha" id="fecha" />
        </p>
        <p>
          <label for="hora">Hora</label>
          <input type="time" name="hora" id="hora" />
        </p>
        <p>
          <label for="observaciones">Observaciones</label>
          <textarea name="observaciones" id="observaciones" rows="3" placeholder="Detalles adicionales..."></textarea>
        </p>
        <button type="submit">Guardar servicio</button>
      </form>
    </section>

    <section class="table-container">
      <h2>Listado de servicios</h2>
      <form class="routigal-form" id="filtros">
        <p>
          <label for="cliente">Cliente</label>
          <input type="text" name="cliente" id="cliente" placeholder="Nombre del cliente" />
        </p>
        <p>
          <label for="fecha_hora">Fecha y hora</label>
          <input type="datetime-local" name="fecha_hora" id="fecha_hora" />
        </p>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Duración estimada</th>
            <th>Descripción</th>
            <th>Fecha y hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </section>
  </main>
  <footer>
    ESTO ES EL FOOTER
  </footer>
</body>
</html>

