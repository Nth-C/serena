FROM php:8.5-apache
# Installation de l'extension PDO pour PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql
# Activation du mod_rewrite pour les routes propres
RUN a2enmod rewrite
COPY . /var/www/html/