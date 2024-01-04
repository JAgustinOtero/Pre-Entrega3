const SUBMIT = 0

/* NODOS */
let header = document.getElementsByTagName('header')
let boton_cant_numeros = header[0].getElementsByTagName("button")

let main = document.getElementsByTagName("main")
let intento = main[0].getElementsByClassName('pad-numerico-display-input-numero')
let boton_numeral = main[0].getElementsByClassName('pad-numerico-row-boton')
let boton_submit = main[0].getElementsByClassName('pad-numerico-submit-boton')
let historial = main[0].getElementsByClassName('historial')


let p = document.createElement('p')
historial[0].append(p)

intento[0].focus()
intento[0].value = ''

/* VARIABLES */
cant_numeros = 0
cant_intentos = 0
let respuesta = 0


/*MAIN */

main[0].style.display = "none"



/* LISTENERS */
for(let i = 0; i<9; i++)
{
    boton_numeral[i].addEventListener('click', ()=>{
        setnumber(i+1)
    })
    boton_cant_numeros[i].addEventListener('click', ()=>{
        setCantNumber(i+1)
    })
}
intento[0].addEventListener('keypress', keypad)
boton_submit[SUBMIT].addEventListener('click', enviar)



/* FUNCIONES */
function setnumber(numero)
{
    intento[0].value += `${numero}`
    intento[0].focus()
}

function enviar( e )
{
    if(cant_numeros == 0)
    {
        if((intento[0].value > 0) && (intento[0].value < 9))
        {
            
        }
    }
    else 
        esCorrecto(intento[0].value)

    intento[0].focus()
    intento[0].value = ''
}

function keypad(e)
{
    if(e.key == "Enter")
        enviar()
}

/*
function seRepite( numero )
entrada: 
        number: numero a comprobar
return: boolean
Esta funcion analiza si hay numeros repetidos dentro de un mismo numero
*/
function seRepite(numero) {
    let salida = false;
    if (numero.length > 2) {
    for (let i = 0; i < numero.length - 1; i++) {
        for (let j = 1 + i; j < numero.length; j++) {
        if (numero[i] == numero[j]) {
            salida = true;
        }
        }
    }
    } else {
    if (numero[0] == numero[1]) salida = true;
    }
    return salida;
}
/*
function rand(max, min)
entrada: 
        number: max: numero maximo que devolvera
        number: min: numero minimo que devolvera
return: number: numero aleatorio
Esta funcion retorna un numero aleatorio entre los valores indicados
*/
function rand(max, min) {
  return Math.floor(Math.random() * max + min);
}

/*
function generarNumeroAleatorio( cant_numeros, repeticion, con_ceros )
entradas:
        number: cantidad de digitos deseada
        boolen: si esos numero se pueden repetir o no (entre digitos)
        boolean: si desea que esos digitos puedan tomar el valor de 0 o no
return: boolean
Esta funcion genera un numero random de la cantidad de numeros que se le especifiquen y tambien tiene en cuenta si se desea que los numero que estan dentro se repitan o no
tambien podes elegir si el numero tiene ceros o no
*/
function generarNumeroAleatorio(cantDigitos, repeticion, con_ceros) {
    let respuesta = [];

    if (repeticion) {
        for (let i = 0; i < cantDigitos; i++) {
        if (con_ceros) respuesta[i] = rand(10, 0);
        else respuesta[i] = rand(9, 1);
    }
    } else {
    do {
        for (let i = 0; i < cantDigitos; i++) {
        if (con_ceros) respuesta[i] = rand(10, 0);
        else respuesta[i] = rand(9, 1);
        }
    } while (seRepite(respuesta));
    }

    return respuesta;
}

//FUNCIONES
/*
function esCorrecto( numero )
entrada: 
number: numero a comprobar
return: boolean
Esta funcion analiza si el resultado igresado es correcto e informa cuantos numeros estan en su lugar,
cuantos son parte del numero pero no estan en su lugar y cuantos no son parte del numero.
a su vez analiza el resultado devuelto por la funcion verificacion y le da una respuesta al usuario
*/
function esCorrecto(numero) {
    let salida = false;
    let comprobacion = verificacion(numero);
    
    cant_intentos++
    if (comprobacion == '99')
    {
        p.innerText = `${intento[0].value}, la cantidad de numeros es incorrecta

        ` + p.innerText
    }
    else if (comprobacion[0] == 0 && comprobacion[1] == 0) {
        p.innerText = `${intento[0].value}, todos los numeros son incorrectos

        ` + p.innerText
    } 
    else if (comprobacion[0] == cant_numeros) {
        document.location.href = "../pages/JuegoGanado.html"
        salida = true;
    } 
    else
    {
        p.innerText = `${intento[0].value}, hay ${comprobacion[0]} numeros correctos en su posicion y hay ${comprobacion[1]} numeros correctos que no estan en su posicion
        
        ` + p.innerText
    }
    console.log(
        ""
    );

    return salida;
}

/*
function verificacion( numero )
entrada: 
        array numerico: numero a desglosar
return: array numerico
Esta funcion analiza numero a numero si el numero ingresado es igual a la respuesta, y devuelve un valor asociado:
el numero es parte de la respuesta y esta en el lugar correcto: salida[0]++
el numero es parte de la respuesta pero no esta en el lugar indicado: salida[1]++
el numero no forma parte de la respuesta: no cambia nada
  */
function verificacion(numero) {
    let salida = [0, 0];
    if(numero.length - respuesta.length != 0)
    {
        salida = '99'
    }
    else
    {
        for (let j = 0; j < numero.length; j++)
        {
            for (let i = 0; i < numero.length; i++) 
            {
                if (numero[i] == respuesta[j] && j == i)    salida[0]++;
                else if (numero[i] == respuesta[j])   salida[1]++;
            }
        }
    }
    return salida;
}

function setCantNumber(numero)
{
    cant_numeros = numero
    header[0].getElementsByTagName("h1")[0].innerText = `ha elegido jugar con ${cant_numeros} numeros, coloque su intento sin repetir numeros`
    respuesta = generarNumeroAleatorio(cant_numeros,false,false)
    console.log(respuesta)
    for(let i = 0; i<9; i++)
    {
        boton_cant_numeros[i].hidden = "true"
    }
    main[0].style.display = "flex"
}