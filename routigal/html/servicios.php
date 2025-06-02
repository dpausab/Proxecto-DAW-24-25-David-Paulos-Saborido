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
    <?php 
    if ($_SESSION['user']['rol'] === 1) {
      echo '<section id="form">
          <form class="routigal-form" id="form-servicios">
            <p class="id">
              <input type="text" name="id" id="id" hidden>
            </p>
            <p>
              <label for="nombre">Nombre</label>
              <input type="text" name="nombre" id="nombre" placeholder="Nombre" />
            </p>
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
              <label for="direccion">Direccion</label>
              <input type="text" name="direccion" id="direccion"/>
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
              <label for="estimado">T. Estimado</label>
              <input type="time" name="estimado" id="estimado">
            </p>
            <button type="submit">Guardar servicio</button>
          </form>
        </section>';
    }
    ?>

    <section class="table-container">
      <h2>Listado de servicios</h2>
      <form class="routigal-form" id="filtros">
        <p>
          <label for="cliente">Cliente</label>
          <input type="text" name="cliente_filtro" id="cliente_filtro" placeholder="Nombre del cliente" />
        </p>
        <p>
          <label for="fecha_filtro">Fecha</label>
          <input type="date" name="fecha_filtro" id="fecha_filtro" />
        </p>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cliente</th>
            <th>Dirección</th>
            <th>Duración estimada</th>
            <th>Fecha y hora</th>
            <?php if ($_SESSION['user']['rol'] === 1) {
              echo '<th>Acciones</th>';
            } ?>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </section>
  </main>
  <?php include_once ('footer.php'); ?>
</body>
</html>

