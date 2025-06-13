<?php
    include_once("auth.php");
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Servicios - Routigal</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <link rel="stylesheet" href="/assets/css/servicios.css">
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="/js/menu-hamburguesa.js" defer></script>
  <script type="module" src="/js/listado_rutas.js" defer></script>
</head>
<body>
  <?php include_once("header.php"); ?>

  <main>
    <h1>Gestión de rutas</h1>
    <section class="table-container">
      <h2>Listado de rutas</h2>
      <form class="routigal-form" id="filtros">
        <p>
          <label for="nombre_filtro">Nombre</label>
          <input type="text" name="nombre_filtro" id="nombre_filtro" placeholder="Nombre de la ruta" />
        </p>
        <p>
          <label for="fecha_filtro">Fecha</label>
          <input type="date" name="fecha_filtro" id="fecha_filtro" />
        </p>
        <?php if ($_SESSION['user']['rol'] === 1) {
                  echo '<p>
                    <label for="tecnico_filtro">Técnico</label>
                    <select name="tecnico_filtro" id="tecnico_filtro"></select>
                  </p>';
              }
        ?>
        <p>
          <label for="estado_filtro">Estado</label>
          <select name="estado_filtro" id="estado_filtro">
            <option value="">Todos</option>
          </select>
        </p>
        <?php if ($_SESSION['user']['rol'] === 1) {
                  echo '<p>
                      <button>
                        <a href="/html/rutas.php">Crear</a>
                      </button>
                    </p>';
              }
        ?>
      </form>
      <div id="paginacion"></div>
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
  <?php include_once ('footer.php'); ?>
</body>
</html>

