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
  <script type="module" src="/js/listado_rutas.js" defer></script>
  <link rel="stylesheet" href="../css/servicios.css">
</head>
<body>
  <?php include_once("header.php"); ?>

  <main>
    <h1>Gestión de servicios</h1>
    <section class="table-container">
      <h2>Listado de rutas</h2>
      <form class="routigal-form" id="filtros">
        <p>
          <label for="cliente">Nombre</label>
          <input type="text" name="cliente" id="cliente" placeholder="Nombre del cliente" />
        </p>
        <p>
          <label for="fecha">Fecha</label>
          <input type="date" name="fecha" id="fecha" />
        </p>
        <p>
          <button>
            <a href="/html/rutas.php">Crear</a>
          </button>
        </p>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tecnico</th>
            <th>Origen</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>KM estimados</th>
            <th>Tiempo estimado</th>
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

