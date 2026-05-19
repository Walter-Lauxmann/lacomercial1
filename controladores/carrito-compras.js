function calcular() {
    /* Elementos DOM */
    const cantidad1 = document.getElementById('cantidad1').value;
    const cantidad2 = document.getElementById('cantidad2').value;
    const cantidad3 = document.getElementById('cantidad3').value;

    const precio1 = document.querySelector('#precio1').textContent;
    const precio2 = document.querySelector('#precio2').textContent;
    const precio3 = document.querySelector('#precio3').textContent;

    /* Variables */
    let importe1;
    let importe2;
    let importe3;

    let total;

    /* Cálculos */

    importe1 = cantidad1 * precio1;
    importe2 = cantidad2 * precio2;
    importe3 = cantidad3 * precio3;

    total = importe1 + importe2 + importe3;

    /* Mostrar los resultados */
    document.querySelector('#importe1').textContent = importe1;
    document.querySelector('#importe2').textContent = importe2;
    document.querySelector('#importe3').textContent = importe3;

    document.querySelector('#total').textContent = total;

}