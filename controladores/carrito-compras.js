function calcular() {
    /* Elementos DOM */
    const cantidades = document.getElementsByName('cantidad');
    const precios = document.querySelectorAll('[name="precio"]');
    const importes = document.querySelectorAll('[name="importe"]');

    /* Variables */
    let total = 0;

    /* Cálculos */
    for(let i=0; i < cantidades.length; i++) {
        const importe = Number(cantidades[i].value) * Number(precios[i].textContent);
        total += importe;

        /* Mostrar los importes */
        importes[i].textContent = importe;
    }


    document.querySelector('#total').textContent = total;

}