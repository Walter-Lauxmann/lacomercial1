// URL para acceder a la API
const URL = './api/datos.php?tabla=productos';
/**
* Selecciona los productos de la BD
*/
export async function seleccionarProductos() {
    let res = await fetch(URL);
    let datos = await res.json();
    if(res.status !== 200) {
        throw Error('Los datos no se encontraron');
    }
    return datos;
}