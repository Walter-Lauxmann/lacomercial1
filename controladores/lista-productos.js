import { productos } from "../modelos/productos.js";

// Elementos del DOM
const listaProductos = document.querySelector('#lista-productos');

document.addEventListener("DOMContentLoaded", ()=> {
    mostrarProductos();
})

/**
 * Muestra la lista de productos
 */
const mostrarProductos = () => {
    listaProductos.innerHTML = '';
    productos.map(producto => (
        listaProductos.innerHTML += `
            <article class="servicio">
                <h3><span name="codigo">${producto.codigo}</span> - <span name="nombre">${producto.nombre}</span></h3>
                <div class="servicio-icono">
                    <img src="./imagenes/productos/${producto.imagen}" alt="">
                </div>
                <p>
                    <img src="./imagenes/memory.svg" alt="">Procesador: ${producto.descripcion.procesador} <br>
                    <img src="./imagenes/storage.svg" alt="">Almacenamiento: ${producto.descripcion.almacenamiento} <br>
                    <img src="./imagenes/photo_camera.svg" alt="">Cámaras: ${producto.descripcion.camaras} <br>
                    <img src="./imagenes/aod.svg" alt="">Pantalla: ${producto.descripcion.pantalla}
                </p>
                <h4>$ <span name="precio">${producto.precio}</span>.-</h4>

                <button class="boton" onclick="agregar(this)">Comprar</button>
                
            </article>
        `
    ))
}