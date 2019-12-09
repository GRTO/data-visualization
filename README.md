# Diplomado - Visualización de los datos

En esta documentación se encuentra los pasos para poder levantar el backend y frontend. Además se brinda una opción para no levantar el backend y realizar llamadas desde el frontend a un servicio desplegado en AWS.

# Paso 1: Levantar la BD
Crear la BD

    CREATE DATABASE transacciones
        WITH 
        OWNER = postgres
        ENCODING = 'UTF8'
        LC_COLLATE = 'Spanish_Peru.1252'
        LC_CTYPE = 'Spanish_Peru.1252'
        TABLESPACE = pg_default
        CONNECTION LIMIT = -1;

Crear la tabla

    CREATE TABLE public.transa
    (
        client_id character varying(250) COLLATE pg_catalog."default",
        date timestamp without time zone,
        mcc character varying(250) COLLATE pg_catalog."default",
        country_code character varying(20) COLLATE pg_catalog."default",
        amount_sol real,
        amount_usd real,
        nb_transaction integer,
        client_age real,
        client_gender character varying(25) COLLATE pg_catalog."default",
        debit_type character varying(25) COLLATE pg_catalog."default",
        merchant_id character varying(25) COLLATE pg_catalog."default",
        merchant_name character varying(250) COLLATE pg_catalog."default",
        merchant_type character varying(250) COLLATE pg_catalog."default",
        merchant_geoid character varying(250) COLLATE pg_catalog."default",
        merchant_departement character varying(250) COLLATE pg_catalog."default",
        merchant_province character varying(250) COLLATE pg_catalog."default",
        merchant_district character varying(250) COLLATE pg_catalog."default",
        merchant_lon real,
        merchant_lat real
    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE public.transa
        OWNER to postgres;

Cargar los datos

    COPY transa FROM 'ruta_del_csv.csv' CSV HEADER DELIMITER ';';

# Paso 2: Levantar el backend
En la ruta data-visualization\flask\flask2deploy entrar al archivo app.py

Modificar la cadena de conexión con los parámetros de la BD creada anteriormente

P.e: app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:admin@localhost:5432/transacciones'

Entrar con la línea de comandos a la ruta data-visualization\flask\flask2deploy y poner lo siguiente:

    python -m flask run

# Paso 3: Levantar el frontend

Se debe instalar node.js, aqui esta la ruta de descarga https://nodejs.org/en/ y descargar la versión que es mas usada por los usuarios ya que es la mas estable.

* Nota: Sin embargo, antes de correr el frontend deberá descargar alguna herramienta para desactivar CORS. En esta ocasión el código fue ejecutado en google chrome y se descargó la siguiente extensión https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en, alli solo se debe dar click en el icono C para poder desactivar los CORS.

Luego desde terminal ingresar a la ruta:

    cd [PATH_TO_OUR_PROJECT]/system/frontend

En esta ruta ejecutar lo siguiente, lo que ejcutará la instalación de todas las librerias que el frontend neceista:

    npm install

Luego correr el front utilizando la ruta a continuación:

    npm start

Finalmente, nuestro proyecto correrá en el puerto:

    http://localhost:4200/

# Nota

Si llegó hasta aqui, el proyecto esta corriendo con la BD de AWS, si desea consultar los datos de manera local, tendra que entrar a este archivo del frontend:

    cd [PATH_TO_OUR_PROJECT]/system/frontend/src/app/shared/services/filter.service.ts

y Aquí modificar la línea de código número 17 y se deberá modifcar la variable `baseurl` indicando el puerto donde se ejecuta su backend de manera local

    baseUrl = http://localhost:5000

En caso no se realice ninguna llamada al backend puede contactar con el grupo al siguiente correo gerson.toribio@pucp.pe