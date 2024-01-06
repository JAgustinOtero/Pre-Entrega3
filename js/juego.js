/*************************************************************************DOM*******************************************************************/
let header = document.querySelector("header");
let header_botonera = header.querySelector(".header-botonera")
let boton_cant_numeros = header.getElementsByTagName("button");


let main = document.querySelector("main");
let intento = main.querySelector(".pad-numerico-display-input-numero");
let boton_numeral = main.getElementsByClassName("pad-numerico-row-boton");
let boton_submit = main.querySelector(".pad-numerico-submit-boton");
let historial = main.querySelector(".historial");

let historial_partidas = main.querySelector(".partidas");

let p = document.createElement("p");



/*************************************************************************CLASES*******************************************************************/
class Partida {
  constructor(cant_numeros, intentos, nro_partida) {
    this.cant_numeros = cant_numeros;
    this.intentos = intentos;
    this.nro_partida = nro_partida;
  }
}




/*************************************************************************VARIABLES*******************************************************************/
let cant_numeros = 0;
let cant_intentos = 0;
let respuesta = 0;
let nro_partida = Number(localStorage.getItem("nro_partida")) ;
let partidas = []
let partidasLS = []




/*************************************************************************MAIN*******************************************************************/
enfoqueDisplay();
intento.value = "";
intento.ariaReadOnly = "readonly"
header_botonera.style.display = "flex"
nro_partida ||= 1
mostrarPartidas(partidas)



/*************************************************************************LISTENERS*******************************************************************/
for (let i = 0; i < 9; i++) {
  boton_numeral[i].addEventListener("click", () => {
    setnumber(i + 1);
  });
  boton_cant_numeros[i].addEventListener("click", () => {
    setCantNumber(i + 1);
    respuesta = generarNumeroAleatorio(cant_numeros, false, false); //genero un numero random con la cantidad de numeros elegidos
    console.log(respuesta);
  });
}
intento.addEventListener("keypress", keypad);
boton_submit.addEventListener("click", esCorrecto);





/*************************************************************************FUNCIONES*******************************************************************/

function setnumber(numero) {
  intento.value += `${numero}`;
  enfoqueDisplay();
}

function keypad(e) {
  if (e.key == "Enter") esCorrecto();
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

/*
function esCorrecto( numero )
entrada: 
number: numero a comprobar
return: boolean
Esta funcion indica si el resultado igresado es correcto e informa cuantos numeros estan en su lugar,
cuantos son parte del numero pero no estan en su lugar y cuantos no son parte del numero.
a su vez indica si el numero ingresado cumple con los parametros requeridos
*/
function esCorrecto() {
  let salida = false;
  console.log(intento.value)
  let comprobacion = verificacion(intento.value);

  cant_intentos++;
  if (comprobacion == "99") {
      let template = getTemplate("historial-template")
      template.querySelector('p').innerText = `${intento.value}, la cantidad de numeros es incorrecta o sus numero se repiten, por favor, ingrese un numero valido`
      historial.append(template)
  } else if (comprobacion[0] == 0 && comprobacion[1] == 0) {
    let tempalte = document.getElementsByClassName("historial-template")[0].content.cloneNode(true)
    tempalte.querySelector('p').innerText = `${intento.value}, todos los numeros son incorrectos`
    historial.append(tempalte)
  } else if (comprobacion[0] == cant_numeros) {
    localStorage.setItem(`partida${nro_partida}`,JSON.stringify(new Partida(cant_numeros,cant_intentos,nro_partida)))
    mostrarPartidas(partidas)
    salida = true;
    reset()
  } else {
    let tempalte = document.getElementsByClassName("historial-template")[0].content.cloneNode(true)
    tempalte.querySelector('p').innerText = `${intento.value}, hay ${comprobacion[0]} numeros correctos en su posicion y hay ${comprobacion[1]} numeros correctos que no estan en su posicion`
    historial.append(tempalte)
  }

  enfoqueDisplay();
  intento.value = "";
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
el numero no es valido: salida = 99
  */
function verificacion(numero) {
  let salida = [0, 0];
  if (!esValido(numero)) {
    //analiza si el numero cumple con la condicion de la cantidad y repeticion de los digitos
    salida = "99";
  } else {
    for (let j = 0; j < numero.length; j++) {
      for (let i = 0; i < numero.length; i++) {
        if (numero[i] == respuesta[j] && j == i) salida[0]++;
        else if (numero[i] == respuesta[j]) salida[1]++;
      }
    }
  }
  return salida;
}

/*
function setCantNumber(numero)
entrada: 
number: numero ingresado por la botonera
return: none
Esta funcion setea la cantidad de numeros con los que se jugara y modifica el header para dar nuevas indicaciones
*/
function setCantNumber(numero) {
  cant_numeros = numero;

  header.querySelector("h1").innerText = `  Ha elegido jugar con ${cant_numeros} numeros, coloque su intento sin repetir numeros`; //modifico el header y oculto los botones
  header_botonera.style.display = "none"
  main.style.display = "flex"; //muestro el pad-numerico
  enfoqueDisplay();
}

/*
function enfoqueDisplay()
entrada: none
return: none
Esta funcion devuelve el foco al display. Se creo para simplificar sintaxis y aclarar codigo
*/
function enfoqueDisplay() {
  intento.focus();
}

/*
function esValido( numero )
entrada: 
        number: numero a comprobar
return: boolean
Esta funcion valida si lo ingresado por el usuario es un numero valido o no, esta para limpiar el codigo principal y facilitar el hecho de agregar condiciones a esta entrada
*/
function esValido(numero) {
  let valido = true;

  if ((Math.floor(Number(numero)).toString().length - respuesta.length != 0) || seRepite(numero) || (numero >= Math.pow(10, cant_numeros)) || (numero[0] == 0)) {
    valido = false;
    console.log(numero)
  }
  return valido;
}

function getTemplate( templateName )
{
  let template = document.getElementsByClassName(templateName)[0].content.cloneNode(true)
  return template
}

function reset()
{
  header.querySelector("h1").innerText = `Felicidades Ganaste!!! el numero era ${intento.value} y lo adivinaste en solo ${cant_intentos} ${cant_intentos == 1 ? "intento": "intentos"}
    Elija la cantidad de numeros con la que va a jugar (del 1 al 9):`; //modifico el header y muestro los botones
  intento.value = "";
  //main.style.display = "none";
  cant_numeros = 0
  cant_intentos = 0
  header_botonera.style.display = "flex"
  localStorage.setItem("nro_partida",nro_partida)
  nro_partida++

  while(historial.childElementCount > 1)
  historial.querySelector("div").remove()

}

function mostrarPartidas ( partidas )
{
  for(let i=1; i <= nro_partida; i++)
    {
      partidas[i] = JSON.parse(localStorage.getItem(`partida${i}`))
    }
  while(historial_partidas.childElementCount > 1)
    historial_partidas.querySelector("div").remove()
    partidas.forEach( (Partida)=>
  {
    let template = getTemplate("partidas-template")
    template.querySelector('p').innerText = `partida Nro ${Partida.nro_partida}: Jugaste con ${Partida.cant_numeros} numeros y te tomo ${Partida.intentos} ${Partida.intentos == 1 ? "intento": "intentos"}`
    historial_partidas.append(template)
  })
}
