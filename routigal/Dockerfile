FROM php:8.2-apache

# Instala las dependencias de la BBDD.
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copia todos los archivos en el /html/ para poder acceder a ellos.
COPY . /var/www/html/

RUN a2enmod rewrite
