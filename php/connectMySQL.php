<?php
    $DATABASE_HOST = 'localhost';
    $DATABASE_USER = 'root';
    $DATABASE_PASS = '';
    $DATABASE_NAME = 'legend_of_pirok';

    $mysqli = new mysqli($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);

    //check connection
    if ( mysqli_connect_errno() ) {
        printf("Connection to MySQL failed: %s\n", mysqli_connect_error());
        exit;
    }
?>