import { seleccionarProductos, insertarProducto } from "../modelos/productos.js";

// Elementos del DOM
const alerta = document.querySelector('#alerta');
const listaProductos = document.querySelector('#lista-productos');
const btnNuevo = document.querySelector('#btn-nuevo-producto');
const dialogo = document.querySelector('#dialogo-producto');
const formProducto = document.querySelector('#form-producto');
const btnCancelar = document.querySelector('#btn-cancelar');
const dialogoTitulo = document.querySelector('#dialogo-titulo');
const inputCodigo = document.querySelector('#prod-codigo');
const inputModoEdicion = document.querySelector('#modo-edicion');

// Variables
let productos = [];
let producto = {};
let respuesta = {};

document.addEventListener("DOMContentLoaded", ()=> {
    mostrarProductos();
    inicializarEventos();
})

const inicializarEventos = () => {
    // Abrir el modal de creación
    btnNuevo.addEventListener('click', () => {
        dialogoTitulo.textContent = 'Cargar Producto';
        inputModoEdicion.value = 'false';
        inputCodigo.disabled = false;
        formProducto.reset();
        dialogo.showModal();
    });

    // Cerrar Modal
    btnCancelar.addEventListener('click', () => {
        dialogo.close();
    });

    // Envío del formulario
    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const codigo = Number(inputCodigo.value);
        const productoData = new FormData(formProducto);

        const esEdicion = inputModoEdicion.value === 'true';

        if (esEdicion) {
            respuesta = modificar(codigo, productoData);
        } else {
            respuesta = await insertarProducto(productoData);
        }

        if(respuesta.success) {
            insertarAlerta(respuesta.message, 'success');
            dialogo.close();
        } else {
            insertarAlerta(respuesta.message, 'warning');
            dialogo.close();
        }

    });
}

/**
 * Define el mensaje de alerta
 * @param {*} mensaje El mensaje a mostrar
 * @param {*} tipo El tipo de alerta (primary, secondary, success, warning, danger, ...)
 */
const insertarAlerta = (mensaje, tipo) => {
    const envoltorio = document.createElement('div');
    envoltorio.innerHTML = `
        <div class="alert alert-${tipo} alert-dismisible" role="alert">
            <div>${mensaje}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
        </div>
    `;
    alerta.append(envoltorio);
}

/**
 * Obtiene los productos de la API
 * @returns productos: array de los productos
 */
const obtenerProductos = async () => {
    productos = await seleccionarProductos();
    return productos;
}

/**
 * Muestra la lista de productos
 */
const mostrarProductos = async () => {
    listaProductos.innerHTML = '';
    productos = await obtenerProductos();
    productos.map(producto => (
        listaProductos.innerHTML += `
            <article class="servicio">
                <h3><span name="codigo">${producto.codigo}</span> - <span name="nombre">${producto.nombre}</span></h3>
                <div class="servicio-icono">
                    <img src="./imagenes/productos/${producto.imagen}" alt="">
                </div>
                <div style="text-align: center">
                    <img src="./imagenes/memory.svg" alt=""> | 
                    <img src="./imagenes/storage.svg" alt=""> | 
                    <img src="./imagenes/photo_camera.svg" alt=""> | 
                    <img src="./imagenes/aod.svg" alt="">
                    <p>${producto.descripcion}</p>
                </div>
                <h4>$ <span name="precio">${producto.precio}</span>.-</h4>
                <button class="boton" onclick="agregar(this)">Comprar</button>                
                <div class="admin-opciones">
                    <button class="boton-card-editar" data-codigo="${producto.codigo}">Editar</button>
                    <button class="boton-card-eliminar" data-codigo="${producto.codigo}">Eliminar</button>
                </div>
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

/**
 * Modifica un producto del localStorage y vuelve a renderizar
 * @param {*} codigo  - Código del producto a modificar
 * @param {Object} productoModificado - Objeto con los datos del producto modificado
 * @returns {boolean} - true si se modificó correctamente
 */
export const modificar = (codigo, productoModificado) => {
    const productos = obtenerProductos();
    const index = productos.findIndex(p => Number(p.codigo) === Number(codigo));

    if(index !== -1) {
        productos[index] = { ...productos[index], ...productoModificado };
        guardarProductos(productos);
        mostrarProductos();
        return true;
    }

    return false;
}

/**
 * 
 * @param {*} codigo - Código del producto a eliminar
 * @returns {boolean} - true si se eliminó correctamente
 */
export const eliminar = (codigo) => {
    if(confirm(`¿Está seguro que desea eliminar al producto código ${codigo}`)) {
        const productos = obtenerProductos();
        const filtrados = productos.filter(p => Number(p.codigo) !== Number(codigo));
        guardarProductos(filtrados);
        mostrarProductos();
        return true;
    }
    return false;
}

/**
 * Abre el formulario con los datos del producto
 * @param {*} codigo - Código del producto a modificar
 * @returns 
 */
const abrirModalModificar = (codigo) => {
    const productos = obtenerProductos();
    const producto = productos.find(p => Number(p.codigo) === Number(codigo));
    
    if(!producto) return;
    
    dialogoTitulo.textContent = 'Modificar Producto';
    inputModoEdicion.value = true;
    
    inputCodigo.value = producto.codigo;
    inputCodigo.disabled = true;
    
    document.getElementById('prod-nombre').value = producto.nombre;
    document.getElementById('prod-categoria').value = producto.categoria;
    document.getElementById('prod-precio').value = producto.precio;
    document.getElementById('prod-imagen').value = producto.imagen;
    document.getElementById('prod-procesador').value = producto.descripcion.procesador;
    document.getElementById('prod-almacenamiento').value = producto.descripcion.almacenamiento;
    document.getElementById('prod-camaras').value = producto.descripcion.camaras;
    document.getElementById('prod-pantalla').value = producto.descripcion.pantalla;
    
    dialogo.showModal();
}

// Delegación de eventos para los botones Editar y Eliminar
listaProductos.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('boton-card-editar')) {
        const codigo = target.dataset.codigo;
        abrirModalModificar(codigo);
    } else if(target.classList.contains('boton-card-eliminar')) {
        const codigo = target.dataset.codigo;
        eliminar(codigo);
    }
})