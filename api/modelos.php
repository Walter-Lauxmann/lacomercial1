<?php
    require_once 'config.php';

    class Conexion {
        // Propiedades
        protected $db;

        // Método constructor
        public function __construct() {
           $this->db = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);

           if( $this->db->connect_errno ) {
             echo 'Fallo al conectar a MySQL: ' . $this->db->connect_error;
             return;
           }

           $this->db->set_charset(DB_CHARSET);
           $this->db->query("SET NAMES 'utf8'");
        }
    }

/**
* Clase Modelo basada en la clase Conexion
*/
class Modelo extends Conexion {
    // Propiedades
    private $tabla; // Nombre de la tabla
    private $id = 0; // id del registro
    private $criterio = ''; // Criterio para las consultas
    private $campos = '*'; // Lista de campos
    private $orden = 'id'; // Campos de ordenamiento
    private $limite = 0; // Cantidad de registros
    
    public function __construct($tabla) {
        parent::__construct(); // Ejecuta el constructor padre
        $this->tabla = $tabla; // Guardamos en la propiedad tabla el valor del argumento $tabla
    }

    // Métodos Getter y Setter
    public function getId() {
        return $this->id;
    }
    public function setId($id) {
        $this->id = $id;
    }
    public function getCriterio() {
        return $this->criterio;
    }
    public function setCriterio($criterio) {
        $this->criterio = $criterio;
    }
    public function getCampos() {
        return $this->campos;
    }
    public function setCampos($campos) {
        $this->campos = $campos;
    }
    public function getOrden() {
        return $this->orden;
    }
    public function setOrden($orden) {
        $this->orden = $orden;
    }
    public function getLimite() {
        return $this->limite;
    }
    public function setLimite($limite) {
        $this->limite = $limite;
    }

    /**
    * Método de selección
    * Permite seleccionar registros de una tabla de BD
    * @return $datos
    */
    public function seleccionar() {
        // SELECT * FROM productos WHERE id='10' ORDER BY id LIMIT 10
        $sql = "SELECT $this->campos FROM $this->tabla";
        // Si hay un criterio, lo agregamos
        if($this->criterio != '') {
            $sql .= " WHERE $this->criterio";
        }
        // Agregamos el orden
        $sql .= " ORDER BY $this->orden";
        // Si el $limite es > que 0, agregamos el limite
        if($this->limite > 0) {
            $sql .= " LIMIT $this->limite";
        }
        // echo $sql; // Mostramos la instrucción SQL
        // Ejecutamos la instrucción SQL
        $resultado = $this->db->query($sql);
        $datos = $resultado->fetch_all(MYSQLI_ASSOC); // Guardamos los datos en un Array asociativo
        $datos = json_encode($datos); // Convertimos los datos a JSON
        // Devolvemos los datos
        return $datos;
    }

     /**
     * Inserta un registro en la BD
     * @param $datos: los datos a insertar
     * @return $id: el id del registro insertado
     */
    public function insertar($datos) {
        // INSERT INTO productos (codigo, nombre, descripcion, precio, stock, imagen)
        // VALUES ('201', 'Motorola G9', 'Un gran teléfono', '450000', '30', 'motorola.jpg')
        unset($datos->id); // Eliminamos el valor de id
        $campos = implode(",",array_keys($datos)); // Separar las claves del array
        $valores = implode("','", array_values($datos)); // Separamos los valores del array

        // Guardamos la instrucción SQL
        $sql ="INSERT INTO $this->tabla ($campos) VALUES ('$valores')";
        //echo $sql; // Mostramos la instrucción SQL

        // Ejecutamos la instrucción SQL y devolvemos el id
        if ($this->db->query($sql)) {
            // Si la consulta fue exitosa, devolvemos el ID autoincremental
            return $this->db->insert_id;
        } else {
            // Si hubo un error, devolvemos 0 o false
            return 0; 
        }
    }
}
?>
