<?php
// Requerimos el archivo modelos.php
require_once 'modelos.php';
// Si hay en parámetro tabla
if(isset($_GET['tabla'])) { // Si está seteado el parámetro tabla
    $tabla = new Modelo($_GET['tabla']); // Creamos el objeto tabla
    $datos = $tabla->seleccionar(); // Ejecutamos el método seleccionar

    echo $datos; // Mostramos los datos

}
?>