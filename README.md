# Proxecto fin de ciclo

- [Proxecto fin de ciclo](#proxecto-fin-de-ciclo)
  - [Taboleiro do proyecto](#taboleiro-do-proyecto)
  - [Descrición](#descrición)
  - [Instalación / Posta en marcha](#instalación--posta-en-marcha)
  - [Uso](#uso)
  - [Sobre o autor](#sobre-o-autor)
  - [Licenza](#licenza)
  - [Índice](#índice)
  - [Guía de contribución](#guía-de-contribución)
  - [Links](#links)

## Taboleiro do proyecto

> Proxecto rematado, á espera de implementar novas funcionalidades.

## Descrición

O proxecto *Routigal* consiste no desenvolvemento dunha aplicación de xestión de rutas, principalmente enfocado en pequenos negocios, que necesiten unha orientación rápida e interactiva do tempo e distancia que lles levará realizar unha ruta de servizos, sendo asignados a un perfil "técnico", que no caso de autónomos pode ser o propio administrador da aplicación ou, no caso de empresas con varios traballadores, usuarios cun perfil especializado na aplicación. A aplicación permitirá visualizar os servizos pendentes de asignar, tendo cada entrega unha ubicación, que será representada como punto na ruta, de forma dinámica, á sua vez, a aplicación contará que o punto de saída e de regreso é o mesmo.

Para conseguir que sexa máis visual, a web contará cun mapa interactivo, no que mostrará a ruta de forma visual e coloreada, con indicacións do orde dos servizos nun "popup" que aparecerá no mapa.

Empregará as tecnoloxías web recoñecidas, PHP, JavaScript (con Leaflet), HTML5 e CSS para acadar unha interfaz intuitiva e sinxela pero completa e agradable e será despregado nun servidor XAMPP.

É importante destacar que é un proxecto que focaliza completamente a independencia e prosperidade dos pequenos negocios, aportando unha solución de cara á loxística personalizable e cotiá, nace da falta de proxectos non globais e de auto-xestión das entregas ou repartos de pequenas empresas.

## Instalación / Posta en marcha

A instalación en local do proxecto é bastante sinxela, simplemente requírese o programa XAMPP e realizar os seguintes pasos:

> 1.- Clonar ou descargar o repositorio.

2.- Copiar os ficheiros no directorio htdocs de XAMPP.

3.- Importar o ficheiro routigal.sql na base de datos usando phpMyAdmin.

4.- Configurar config.php coas credenciais da túa base de datos.

5.- Incluir o arquivo myapp.conf, que se atopa na carpeta apache-vhost, en "xampp/apache/conf/extra".

6.- Abrir o arquivo de configuración "httpd.conf" de Apache no XAMPP e engadir a liña: "Include conf/extra/myapp.conf".

7.- Iniciar Apache e MySQL dende o panel de control de XAMPP.

8.- Acceder á app desde o navegador: http://localhost/routigal.

## Uso

*Routigal* permite de forma sinxela realizar accións divididas en roles, que son "Administrador" e "Técnico". Os adminsitradores poderán realizar todas as funcións, nas que destacan crear novos servizos, planificar as rutas asignándoas a un "Técnico", administrar as ubicacións da empresa para xestionar os puntos de saída/retorno e xestionar os usuarios.

Os servizos contan con información coma a dirección, o nome do cliente, o tempo estimado de execución do mesmo, a fecha e o horario acordado polo cliente.

Os usuarios técnicos, poderán ver os servizos que teñen asignados, á vez que poder ver e editar as rutas asignadas, nas que poderán editar a orde das ubicacións e o tempo estimado dos servizos según propio criterio.

## Sobre o autor

Son David Paulos Saborido, estudiante de 2º de DAW. Decido realizar este proxecto xa que como TFC non quería resolver o típico CRUD básico dunha interfaz sinxela, gústame explorar novas ideas, se son complexas mellor, xa que na miña opinión é o bonito do código.

Gústame pensar que destaco no desenvolvemento en PHP e na miña lóxica á hora de programar. Por eso decidín realizar o proxecto *Routigal*, centrado na implementación dun mapa dinámico, empregando a librería de JS chamada Leaflet para aportar unha solución real para a loxística das PYMES.

Para contactar conmigo, pode ser dende o mesmo Github ou mediante o correo: *davidpaulosdaw1999@gmail.com*

## Licenza

O proxecto de *Routigal* (código e documentación) está licenciado baixo GNU GPL v3.

Pódese consultar no apartado [LICENSE](license).

## Índice


1. [Anteproyecto](plantilla-proxecto/doc/templates/1_Anteproxecto.md)
2. [Análise](plantilla-proxecto/doc/templates/2_Analise.md)
3. [Deseño](plantilla-proxecto/doc/templates/3_Deseño.md)
4. [Codificación e probas](plantilla-proxecto/doc/templates/4_Codificacion_e_probas.md)
5. [Implantación](plantilla-proxecto/doc/templates/5_Implantación.md)
6. [Referencias](plantilla-proxecto/doc/templates/6_Referencias.md)
7. [Incidencias](plantilla-proxecto/doc/templates/7_Incidencias.md)

## Guía de contribución

Toda colaboración neste proxecto será benvida, dende recomendacións á hora de modificar algún funcionamento, interface, novas funcionalidades... O que se che ocurra!

Se crees que tes algunha boa idea, podes enviar unha *pull request* a través de Github, contacta conmigo e poderemos discutir os cambios.

## Links

> EXPLICACIÓN*: Ligazóns externas e descipciones destas ligazóns que creas conveniente indicar aquí. Xeralmente xa van estar integrados coa túa documentación, pero se requires realizar unha listaxe deles, leste é o lugar.
>
