import { obtenerUsuarioActual, logout } from '../modelos/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const enlaceAutenticacion = document.querySelector('#enlace-autenticacion');
    const usuario = obtenerUsuarioActual();

    if (!enlaceAutenticacion || !usuario) return;

    enlaceAutenticacion.textContent = 'Cerrar sesión';
    enlaceAutenticacion.href = '#';
    enlaceAutenticacion.addEventListener('click', (evento) => {
        evento.preventDefault();
        logout();
    });
});