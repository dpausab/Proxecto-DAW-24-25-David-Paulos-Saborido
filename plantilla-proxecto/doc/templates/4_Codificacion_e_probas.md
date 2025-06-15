# FASE DE CODIFICACIÓN E PROBAS

- [FASE DE CODIFICACIÓN E PROBAS](#fase-de-codificación-e-probas)
  - [1- Codificación](#1--codificación)
  - [2- Prototipos](#2--prototipos)
  - [3- Innovación](#3--innovación)
  - [4- Probas](#4--probas)


## 1- Codificación

A carpeta do código atópase na seguinte ligazón: [**Carpeta de Routigal**](../../../routigal)

*Comentario* Destacar que o obxectivo é modularizar o código para evitar a repetición de certos patróns.

## 2- Prototipos

[**Figma**](https://www.figma.com/design/JY1LzkEXCofDl6hho2BuxK/Routigal?node-id=0-1&t=LNzM97Vaou4aekGo-1)

## 3- Innovación

No meu caso eu vou empregar a Librería de JavaScript "Leaflet", que permite a integración de mapas interactivos e a capacidade, xunto con outra ferramenta, OSRM (Open Street Route Machine), a creación de rutas divididas en tramos para así poder ter a información precisa para a aplicación.

Cabe destacar que a dificultade de implementala é a necesidade de acomodarse ás funcionalidades da librería xa que son extensas pero, ten unha boa documentación, deixo por aquí o link: [**LEAFLET**](https://leafletjs.com/). É con diferencia o máis complicado xa que a páxina oficial é moi boa pero a documentación é, na miña opinión, densa. Co que as funcionalidades coma as dos tooltips, é decir as etiquetas enriba dos marcadores no mapa, levoume moito tempo dar cunha solución adaptada a coma estaba a realizar o flujo da APP.

Axudoume moito este canal de YouTube. [**GeoDev**](https://www.youtube.com/@geodev/search?query=leaflet)

De momento a forma máis sinxela de traballar con ela é mediante coordenadas, pero a experiencia de usuario non sería de todo boa co que teño que encontrar a forma de poder convertir as rutas "a man" a coordenadas para poderlle facer as peticións á API.

Para pulir un pouco a experiencia de usuario decidín empregar Sweet Alert, para ter de forma limpa e sinxela alertas estilizadas para darlle unha apariencia máis profesional. Para entender como funciona empreguei a información oficial [**SWEET ALERT**](https://sweetalert.js.org/guides/#getting-started).

## 4- Probas

As probas plantexadas no desenvolvemente foron básicamente primeiramente acadar a funcionalidade e despois pulir as funcións ata estar seguro de non romper nun uso habitual, tras bastantes probas o fluxo normal da app parece seguro e robusto.

[**<-Anterior**](../../../README.md)
