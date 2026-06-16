import { productos as productosIniciales } from "../modelos/productos.js";

// Elementos del DOM
const listaProductos = document.querySelector('#lista-productos');
const btnNuevo = document.querySelector('#btn-nuevo-producto');
const dialogo = document.querySelector('#dialogo-producto');
const formProducto = document.querySelector('#form-producto');
const btnCancelar = document.querySelector('#btn-cancelar');
const dialogoTitulo = document.querySelector('#dialogo-titulo');
const inputCodigo = document.querySelector('#prod-codigo');
const inputModoEdicion = document.querySelector('#modo-edicion');

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

        const esEdicion = inputModoEdicion.value === 'true';
        let exito = false;

        if (esEdicion) {
            exito = modificar(codigo, productoData);
        } else {
            exito = insertar(productoData);
        }

        if(exito) {
            dialogo.close();
        }

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
 * @param {number} codigo  - Código del producto a modificar
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
 * @param {number} codigo - Código del producto a eliminar
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