FROM php:8.1-apache

# Install required PHP extensions
RUN docker-php-ext-install pdo_mysql

# Install required packages
RUN apt-get update && \
    apt-get install -y git zip unzip && \
    rm -rf /var/lib/apt/lists/*\
    apt-get install sudo && \
    apt update -y && apt install -y nano



# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


# Copy Laravel files to container
COPY . /var/www/html

# Set up Apache virtual host
COPY apache-site.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite


# Enable Apache rewrite module and set document root to /app/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Redirect from / to /public
RUN echo "RewriteEngine On" >> /etc/apache2/apache2.conf && \
    echo "RewriteRule ^/$ /public [L,R=301]" >> /etc/apache2/apache2.conf


# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

RUN service apache2 restart

# Expose port 80
EXPOSE 8088

# Start Apache
CMD ["apache2-foreground"]