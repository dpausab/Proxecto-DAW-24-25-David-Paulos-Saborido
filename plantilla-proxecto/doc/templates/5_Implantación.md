# FASE DE IMPLANTACIÓN

- [FASE DE IMPLANTACIÓN](#fase-de-implantación)
  - [1- Manual técnico](#1--manual-técnico)
    - [1.1- Instalación](#11--instalación)
    - [1.2- Administración do sistema](#12--administración-do-sistema)
  - [2- Manual de usuario](#2--manual-de-usuario)
  - [3- Melloras futuras](#3--melloras-futuras)

## 1- Manual técnico

### 1.1- Instalación

> Para poder ter acceso ó código e traballar no desenvolvemento da aplicación, os pasos a seguir son sinxelos. Para desenvolver a nivel local, a aplicación funcionará perfectamente nun entorno XAMPP/LAMPP, no que únicamente se terá que instalar o programa correspondente (XAMPP en Windows, LAMPP en Linux) coas opcións de Apache e MySQL.

Posteriormente deberase abrir o programa, iniciar Apache e MySql, entrar ó navegador web preferido e buscar no navegador a ruta: "http://localhost/phpmyadmin/index.php", unha vez dentro terase acceso ó SGBD, haberá que importar o arquivo da base de datos que aparece no código na carpeta SQL.

Unha vez realizado, a aplicación debería funcionar correctamente en local, simplemente entrando en: "http://localhost". Necesitarase iniciar sesión co usuario por defecto, con acceso a todas as funcionalidades, incluídas crear novos usuarios.

As credenciais serán:
- Usuario: admin
- Contrasinail: abc123.

Para realizar calqueira cambio, o único necesario é ter un entorno de desevolvemento, recoméndase VSC (Visual Studio Code), e abrir a carpeta "routigal".

> A nivel de despregamento e posta en producción, haberá que ter acceso a unha plataforma de Hosting con soporte de PHP e MySql/MariaDB. Entrar no SGBD do hosting dende o panel de control. Normalmente todos os hostings teñen un panel de control explicativo no que existe a opción de ver as bases de datos ou acceder ó SGBD, moitas veces PhpMyAdmin.

Unha vez dentro, importar a BBDD (da mesma forma que en local) e subir os archivos, normalmente via FTP, ó servicio. Non debería resultar complicado xa que, similar ó punto anterior, no panel de control normalmente a opción de subir arquivos está visible e clara.

É importante destacar que para que todo funcione correctamente haberá que cambiar o nome da BBDD (se é necesario), hostname e password da conexión á BBDD. Esto será posible dende o arquivo "config.php" na carpeta config do código.

### 1.2- Administración do sistema

No apartado da administración do sistema, as prioridades do proxecto son manter copias actualizadas do código fonte. A ferramenta empregada para esta tarea é GitHub, xa que é unha forma de manter o código colaborativo, controlado e seguro.

A nivel de información, o plan sería facer unha copia de seguridad da base de datos cada día, extraendo a información e gardando os ficheiros, nominados por fecha nun entorno seguro, por exemplo un servidor externo.

## 2- Manual de usuario

A nivel usuario, un manual "per se" non é requerido, pero, os pasos a seguir para comprender a aplicación son os seguintes:

- Recíbese un usuario e contrasinal, co rol de "Administrador", é decir, ten permiso para todas as accións dentro da aplicación.
- Poderase cambiar o contrasinal e o usuario, para a privacidade do usuario.
- O usuario poderá comezar a realizar tarefas como engadir servizos, novos usuarios, tanto "Técnicos" coma "Administradores", e planificar as rutas cos servicios asignados. É importante destacar que para realizar rutas, necesítase polo menos un usuario "Técnico".
- Os usuarios con rol "Técnico", únicamente terán acceso a ver os seus servizos, as rutas asignadas e editar as mesmas para, por exemplo, modificar os tempos estimados dos servizos.

A nivel de comprensión a aplicación é intuitiva, cun menú sinxelo que deixa claro as funcionalidades e o fluxo dentro das mesmas.

## 3- Melloras futuras

No apartado de melloras futuras, o proxecto tería a capacidade de vincularse con sistemas como Google Maps para, además de ter a planificación cuberta, ter tamén a función GPS, para que o técnico que realice os servicios non teña que empregar outra ferramenta que non sexa Routigal.

Además, ter en conta que un dos grandes puntos do proxecto sería ter comunicación directa e automática cos clientes, mandando mensaxes cando o seu servizo sea asignado a unha ruta nunha fecha, ou horario estimado de chegada.

[**<-Anterior**](../../README.md)
