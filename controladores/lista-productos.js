import { productos as productosIniciales } from "../modelos/productos.js";

// Elementos del DOM
const listaProductos = document.querySelector('#lista-productos');
const btnNuevo = document.querySelector('#btn-nuevo-producto');
const dialogo = document.querySelector('#dialogo-producto');
const formProducto = document.querySelector('#form-producto');
const btnCancelar = document.querySelector('#btn-cancelar');
const dialogoTitulo = document.querySelector('#dialogo-titulo');
const inputCodigo = document.querySelector('#prod-codigo');

document.addEventListener("DOMContentLoaded", ()=> {
    mostrarProductos();
    inicializarEventos();
})

const inicializarEventos = () => {
    // Abrir el modal de creación
    btnNuevo.addEventListener('click', () => {
        dialogoTitulo.textContent = 'Cargar Producto';
        formProducto.reset();
        dialogo.showModal();
    });

    // Cerrar Modal
    btnCancelar.addEventListener('click', () => {
        dialogo.close();
    });

    // Envío del formulario
    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const codigo = Number(inputCodigo.value);
        const productoData = {
            codigo,
            nombre: document.getElementById('prod-nombre').value,
            categoria: document.getElementById('prod-categoria').value,
            precio: Number(document.getElementById('prod-precio').value),
            imagen: document.getElementById('prod-imagen').value || 'nodisponible.png',
            descripcion: {
                procesador: document.getElementById('prod-procesador').value,
                almacenamiento: document.getElementById('prod-almacenamiento').value,
                camaras: document.getElementById('prod-camaras').value,
                pantalla: document.getElementById('prod-pantalla').value
            }
        };
       
        insertar(productoData);
        dialogo.close();

    });
}

const obtenerProductos = () => {
    const prodStr = localStorage.getItem('productos');
    if(!prodStr) {
        localStorage.setItem('productos', JSON.stringify(productosIniciales));
        return productosIniciales;
    }
    return JSON.parse(prodStr);
}

/**
 * Muestra la lista de productos
 */
const mostrarProductos = () => {
    listaProductos.innerHTML = '';
    const productos = obtenerProductos();
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

// Guardar productos en localStorage
const guardarProductos = (lista) => {
    localStorage.setItem('productos', JSON.stringify(lista));
};

/**
 * Agrega un nuevo producto a localStorage y vuelve a renderizar
 * @param {Object} productoNuevo - Objeto con los datos del nuevo producto
 * @returns {boolean} - true si se insertó correctamente, false si ya existe
 */
export const insertar = (productoNuevo) => {
    const productos = obtenerProductos();
    const existe = productos.some(p => Number(p.codigo) === Number(productoNuevo.codigo));
    if (existe) {
        alert('Ya existe un producto con el código ' + productoNuevo.codigo);
        return false;
    }
    productos.push(productoNuevo);
    guardarProductos(productos);
    mostrarProductos();
    return true;
};