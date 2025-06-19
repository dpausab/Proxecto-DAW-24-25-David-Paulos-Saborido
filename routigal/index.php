<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Routigal</title>
  <link rel="stylesheet" href="assets/css/landing.css">
  <script src="js/menu-hamburguesa.js" defer></script>
</head>
<body>
  <header>
    <figure class="logo">
      <a href="index.php">Routigal</a>
    </figure>
    <button id="boton-hamburguesa" class="hamburger">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <nav>
      <ul>
        <li>
          <a href="html/login.php" class="btn-yellow">¡Iniciar sesión!</a>
        </li>
      </ul>
    </nav>
  </header>

  <main>
    <section class="portada" aria-label="Frase de presentación">
      <article class="portada-text">
        <p><strong>Tenlo todo bajo</strong></p>
        <p><span>CONTROL</span></p>
      </article>
      <article class="portada-text">
        <p><strong>Porque el tiempo es</strong></p>
        <p><span>ORO</span></p>
      </article>
    </section>

    <section id="funcionamos" aria-label="Explicación Routigal">
      <h2>¿<span>Cómo</span> funcionamos?</h2>
      <article class="caracteristicas">
        <p>Desde <span>Routigal</span>, nos gusta que nuestros usuarios tengan a su disposición todas las herramientas necesarias para gestionar lo más importante, el tiempo</p>
        <section class="cards">
          <article class="card">
            <section class="info-text">
              <h3><span>Puntualidad</span></h3>
              <p>Sabes cuándo llegas y cuándo sales.</p>
            </section>
            <figure><img src="assets/imagenes/hourglass_3073484.png" alt="Icono de reloj de arena representando la puntualidad"></figure>
          </article>
          <article class="card">
            <section class="info-text">
              <h3><span>Optimiza rutas y genera más</span></h3>
              <p>Menos tiempo perdido, más visitas útiles.</p>
            </section>
            <figure><img src="assets/imagenes/money-bag_2953423(1).png" alt="Icono de saco de dinero representando la mejora en la aconomía"></figure>
          </article>
          <article class="card">
            <section class="info-text">
              <h3><span>Control centralizado</span></h3>
              <p>Todo en un solo panel, sin complicaciones.</p>
            </section>
            <figure><img src="assets/imagenes/statistics_18273718.png" alt="Icono de estadísticas representando control centralizado"></figure>
          </article>
        </section>
      </article>
    </section>

    <section id="como" aria-label="Funciones">
      <h2>¿<span>Cómo</span> lo hacemos?</h2>
      <section class="how">
        <article class="card info">
          <figure><img src="assets/imagenes/estee-janssens-zni0zgb3bkQ-unsplash.jpg" alt="Cuaderno y bolígrafo sobre mesa"></figure>
          <section class="info-text">
            <h3>Gestión por pasos</h3>
            <p>Desde que creas el servicio hasta que lo completas.</p>
          </section>
        </article>
        <article class="card info">
          <figure><img src="assets/imagenes/absolutvision-82TpEld0_e4-unsplash.jpg" alt="Cuaderno abierto con notas"></figure>
          <section class="info-text">
            <h3>Información detallada</h3>
            <p>Datos clave: dirección, horario, cliente y observaciones.</p>
          </section>
        </article>
        <article class="card info">
          <figure><img src="assets/imagenes/anastasiya-badun-EK6J3PLsndY-unsplash.jpg" alt="Planificador con agenda horaria"></figure>
          <section class="info-text">
            <h3>Llegas siempre a la hora</h3>
            <p>Con planificación, alertas y optimización automática.</p>
          </section>
        </article>
      </section>
    </section>

    <section id="why" aria-label="Breve explicación">
      <h2>¿<span>Por qué</span> nosotros?</h2>
      <p>Te proporcionamos todas las herramientas necesarias para que gestiones tus servicios a domicilio con eficiencia y sin estrés.</p>
      <p>Ahorras tiempo, reduces desplazamientos y aumentas la rentabilidad. Todo bajo control.</p>
      <div class="highlight">25 euros/mes</div>
      <a href="/html/login.php" class="btn-yellow">Iniciar sesión</a>
    </section>
  </main>

  <?php include_once("html/footer.php"); ?>
</body>
</html>
