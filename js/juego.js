/*************************************************************************DOM*******************************************************************/
let header = document.querySelector("header")
let header_botonera = header.querySelector(".header-botonera")
let main = document.querySelector("main")
let intento = main.querySelector(".pad-numerico-display-input-numero")
let historial = main.querySelector(".historial")
let div_historial

let historial_partidas = main.querySelector(".partidas")
let borrar_historial_boton = historial_partidas.querySelector(".borrar-historial-boton")
let info = historial_partidas.querySelector(".info")




/*************************************************************************CLASES*******************************************************************/
/** 
 * Partida con todas sus indicaciones correspondientes
*
 * @param cant_numeros Number: cantidad de numeros con los que se jugo la partida
 * @param intentos Number: cantidad de intentos realizados
 * @param nro_partida Number: numero de la partida jugada
 * @param cant_pistas Number: cantidad de pistas utilizadas durante la partida
 * @param rendicion boolean: 
 * true: se rindio
 * false: no se rindio
 */
class Partida {
  constructor(cant_numeros, intentos, nro_partida, cant_pistas, rendicion) {
    this.cant_numeros = cant_numeros;
    this.intentos = intentos;
    this.nro_partida = nro_partida;
    this.pistas = cant_pistas
    this.rendicion = rendicion
  }
}
/** 
 * Partida con todas sus indicaciones correspondientes
*
* @param titulo String: Titulo que se le pondra a la card de la estadistica
* @param valor Number: valor de la misma
* @param array_aux array: un array auxiliar que sea necesario para cada estadistica (opcional) 
*/
class Estadistica {
  constructor(titulo, valor, array_aux = [])
  {
    this.titulo = titulo
    this.valor = valor
    this.array_aux = array_aux
  }
}



/*************************************************************************VARIABLES*******************************************************************/
let cant_numeros = 0;
let cant_intentos = 0;
let respuesta = 0;
let nro_partida = (Number(localStorage.getItem("nro_partida")) || 1)
let partidas = []
let cant_pistas = 0
let intento_anterior = 0
let modo = localStorage.getItem("modo")



/*************************************************************************MAIN*******************************************************************/
reset()
setModo()




/*************************************************************************LISTENERS*******************************************************************/
//Listeners Botones

for (let i = 0; i < 9; i++) {
  //Listener Botones Main
  main.getElementsByClassName("pad-numerico-row-boton")[i].addEventListener("click", () => {
    setnumber(i + 1);
  });
  
  //Listeners Botones Header
}
for (let i = 1; i < 10; i++){

  header.getElementsByTagName("button")[i].addEventListener("click", () => {
    setCantNumber(i);
    respuesta = generarNumeroAleatorio(cant_numeros, false, false); //genero un numero random con la cantidad de numeros elegidos
    console.log(respuesta);
  });
}

//Listener Boton SUBMIT
main.querySelector(".pad-numerico-submit-boton").addEventListener("click", esCorrecto);
//Listener Boton C
main.querySelector(".pad-numerico-clean-boton").addEventListener("click", ()=>{
  intento.value = ""
})

//Listener Boton Borrar Historial
historial_partidas.querySelector(".borrar-historial-boton").addEventListener("click", ()=>{
  const TEXTO_BORRAR_HISTORIAL = `El Historial esta vacio, listo para empezar denuevo?
  Elija la cantidad de numeros con la que va a jugar (del 1 al 9):`
  nro_partida = 0
  localStorage.clear()
  almacenarPartida(false)
  reset()
  header.querySelector("h1").innerText = TEXTO_BORRAR_HISTORIAL
})

//Listener Boton Rendirse
historial_partidas.querySelector(".rendirse-boton").addEventListener("click", ()=>{

  if (modo == "dark"){
    Swal.fire({
      title: "Estas seguro que quieres rendirte?",
      icon: "warning",
      iconColor: "white",
      background: "#0B2447",
      color: "white",
      showDenyButton: true,
      confirmButtonText: "No rendirse",
      confirmButtonColor: "#4E9F3D",
      denyButtonText: `Rendirse`,
      denyButtonColor: "#950101",
      backdrop: "rgba(123,0,0,0.4)",
      inputAutoFocus :false,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then((result) => {result.isDenied && Rendirse()})
  }
  else{
    Swal.fire({
      title: "Estas seguro que quieres rendirte?",
      icon: "warning",
      iconColor: "black",
      background: "#D0E8F2",
      color: "black",
      showDenyButton: true,
      confirmButtonText: "No rendirse",
      confirmButtonColor: "#228B22",
      denyButtonText: `Rendirse`,
      denyButtonColor: "#d33",
      backdrop: "rgba(123,0,0,0.4)",
      inputAutoFocus :false,
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      }
    }).then((result) => {result.isDenied && Rendirse()})
  }

  
})

//Listener Boton Pista
historial_partidas.querySelector(".pista-boton").addEventListener("click", ()=>{
  let muestra = []

  if(cant_pistas++ < cant_numeros - 1)
  {
    if (modo == "dark"){
      Swal.fire({
        title: `el numero en la posiscion ${cant_pistas} es ${respuesta[cant_pistas-1]} `,
        icon: "info",
        iconColor: "white",
        background: "#0B2447",
        color: "white",
        confirmButtonText: "OK",
      confirmButtonColor: "#4E9F3D",
        backdrop: "rgba(0,0,123,0.4)",
        inputAutoFocus :false,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      }).then(()=>{
        enfoqueDisplay()
      })
    }
    else{
      Swal.fire({
        title: `el numero en la posiscion ${cant_pistas} es ${respuesta[cant_pistas-1]} `,
        icon: "info",
        iconColor: "black",
        background: "#D0E8F2",
        color: "black",
        confirmButtonText: "OK",
        confirmButtonColor: "#228B22",
        backdrop: "rgba(0,0,123,0.4)",
        inputAutoFocus :false,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      }).then(()=>{
        enfoqueDisplay()
      })
    }



    for(let i = 0; i < cant_numeros; i++)
    {
      muestra += cant_pistas > i? `${respuesta[i]} `: `_ `
      
    }
    historial.querySelectorAll('h1')[1].innerText = muestra
  }
    //mostrarDiv(historial.querySelector(".historial-div") ,"historial-template", 'prepend' , `el numero en la posiscion ${cant_pistas} es ${respuesta[cant_pistas-1]} `)
  else
  {
    if (modo == "dark"){
      Swal.fire({
        title: "Si utilizas esta pista perderas automaticamente",
        icon: "warning",
        iconColor: "white",
        background: "#0B2447",
        color: "white",
        showDenyButton: true,
        confirmButtonText: "No rendirse",
        confirmButtonColor: "#4E9F3D",
        denyButtonText: `Rendirse`,
        denyButtonColor: "#950101",
        backdrop: "rgba(123,0,0,0.4)",
        inputAutoFocus :false,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      }).then((result) => {result.isDenied && Rendirse()})
    }
    else{
      Swal.fire({
        title: "Si utilizas esta pista perderas automaticamente",
        icon: "warning",
        iconColor: "black",
        background: "#D0E8F2",
        color: "black",
        showDenyButton: true,
        confirmButtonText: "No rendirse",
        confirmButtonColor: "#228B22",
        denyButtonText: `Rendirse`,
        denyButtonColor: "#d33",
        backdrop: "rgba(123,0,0,0.4)",
        inputAutoFocus :false,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      }).then((result) => {result.isDenied && Rendirse()})
    }
  }
  
  })

  header.querySelector("button").addEventListener("click",cambiarModo)

//Listener Keypad
intento.addEventListener("keypress", (e)=>{
  
  e.key == "Enter" && esCorrecto()
  e.keyCode == 38 && e.preventDefault()
});

document.onkeydown = (e)=>{
  if(e.keyCode == 38)
  {
    e.preventDefault()
    intento.value = cant_intentos != 0 ? intento_anterior: intento.value

  } 
}



/*************************************************************************FUNCIONES*******************************************************************/


/** 
 * Esta funcion analiza si hay numeros repetidos dentro de un mismo numero
 *
 * @param numero numero a analizar
 * @return boolean:
 * true: se repiten
 * false: no se repiten
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

/** 
 * Esta funcion retorna un numero aleatorio entre los valores indicados
 *
 * @param max number: numero maximo que devolvera
   @param min number: min: numero minimo que devolvera
 * @return number: numero aleatorio
 */
function rand(max, min) {
  return Math.floor(Math.random() * max + min);
}

/** 
 * Esta funcion retorna un numero aleatorio y lo devuelve como string
 *
 * Esta funcion genera un numero random de la cantidad de numeros que se le especifiquen y tambien tiene en cuenta si se desea que los numero que estan dentro se repitan o no
  tambien podes elegir si el numero tiene ceros o no
 * 
 * @param cantDigitos number: cantidad de digitos deseada
   @param repeticion boolean: si esos numero se pueden repetir o no (entre digitos) 
   @param con_ceros boolean: si desea que esos digitos puedan tomar el valor de 0 o no
 * @return string: numero generado
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

/** 
 * indica si el resultado igresado es correcto
 *
 * Esta funcion indica si el resultado igresado es correcto e informa cuantos numeros estan en su lugar,
 * cuantos son parte del numero pero no estan en su lugar y cuantos no son parte del numero.
 * a su vez indica si el numero ingresado cumple con los parametros requeridos
 * 
 * @return boolean: 
 * true: es correcto
 * false: no es correcto
 */
function esCorrecto() {
  
  let comprobacion = verificacion(intento.value)

  
  if (comprobacion == "99"){
    cant_intentos--
    Toastify({
      text: `${intento.value} no es un numero valido`,
      className: "info",
      style: {
        background: "radial-gradient(circle, rgba(238,14,14,1) 64%, rgba(171,30,16,1) 96%)"
      }
    }).showToast();
  }
  else if (comprobacion[0] == 0 && comprobacion[1] == 0){
    mostrarDiv(historial.querySelector(".historial-div"),"historial-template",'prepend',`${intento.value}: todos los numeros son incorrectos`)
    aplicarEstilos(0 + Number(modo == "dark" && 4))
  }
  else if (comprobacion[0] == cant_numeros) { 
    almacenarPartida(false)
    reset()
  }
  else {
    mostrarDiv(historial.querySelector(".historial-div") ,"historial-template",'prepend', `${intento.value}: hay ${comprobacion[0]} numeros correctos en su posicion y hay ${comprobacion[1]} numeros correctos que no estan en su posicion`)
    aplicarEstilos(Math.floor(comprobacion[0] / cant_numeros * 3) + 1 + Number(modo == "dark" && 4))
  }
  
  resetIntento()

}

/** 
 * Esta funcion analiza numero a numero si el numero ingresado es igual a la respuesta, y devuelve un valor asociado:
 * 
 * @param numero string: numero a analizar
 * @return string
 * Esta funcion analiza numero a numero si el numero ingresado es igual a la respuesta, y devuelve un valor asociado:
 * el numero es parte de la respuesta y esta en el lugar correcto: salida[0]++
 * el numero es parte de la respuesta pero no esta en el lugar indicado: salida[1]++
 * el numero no forma parte de la respuesta: no cambia nada
 * el numero no es valido: salida = 99
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

/** 
 * Setea la cantidad de numeros con la que se jugara
 * 
 * @param numero number: numero ingresado por la botonera
 */
function setCantNumber(numero) {
  let muestra = ""
  
  cant_numeros = numero;

  header.querySelector("h1").innerText = `  Ha elegido jugar con ${cant_numeros} numeros, coloque su intento sin repetir numeros`; //modifico el header y oculto los botones
  header_botonera.style.display = "none"
  historial_partidas.querySelector(".rendirse-boton").style.display = "block"
  historial_partidas.querySelector(".pista-boton").style.display = "block"
  historial.querySelector('h1').style.display = "block"
  historial.querySelector('h1').innerText = "CANTIDAD DE INTENTOS: 0"
  historial.querySelectorAll('h1')[1].style.display = "block"
  for(let i = 0 ; i < cant_numeros ; i++)
  {
    muestra += '_ '
  }
  historial.querySelectorAll('h1')[1].innerText = muestra
  

  intento.disabled = false
  intento.maxLength = cant_numeros
  intento.placeholder = `ej: ${Math.floor(0.123456789 * Math.pow(10, cant_numeros))}`
  enfoqueDisplay();

}

 /** 
 * muestra el numero indicado en el display
 * 
 * Esta funcion toma el numero elegido con el boton correspondiente y lo muestra en el display
 * luego devuelve el foco al display para que se puedan ingresar numeros con el teclado o con los botones indiscriminadamente
 *
 * @param numero numero mostrar en el display
 * @return 
 */
 function setnumber( numero ) {
  if(cant_numeros != 0)
    intento.value += `${numero}`;
  enfoqueDisplay();
}

/** 
 * Esta funcion devuelve el foco al display. Se creo para simplificar sintaxis y aclarar codigo
 * 
 */
function enfoqueDisplay() {
  intento.focus();
  
}

/** 
 * Esta funcion valida si lo ingresado por el usuario es un numero valido o no, esta para limpiar el codigo principal
 * y facilitar el hecho de agregar condiciones a esta entrada
 * 
 * @param numero number: numero a comprobar
 * @return boolean: 
 * true: es valido
 * false: no es valido
 */
function esValido(numero) {
  let valido = true;

  if ((Math.floor(Number(numero)).toString().length - respuesta.length != 0) || seRepite(numero) || (numero >= Math.pow(10, cant_numeros)) || (numero[0] == 0)) {
    valido = false;
  }
  return valido;
}

/** 
 * resetea las variables y el IU como si recien se abriera la pagina
 * 
 * Esta funcion resetea las variables que se utilizan durante el juego mismo, ademas de el interfaz usuario (botones e input) para evitar que se utilizen
 * en caso de que no sean necesarios
 * ademas borra el historial de intentos y muestra el historial de partidas en caso de que lo haya
 * 
 */
function reset()
{
  const TEXTO_INICIO = `Elija la cantidad de numeros con la que va a jugar (del 1 al 9):`
  let partida = JSON.parse(localStorage.getItem(`partida${nro_partida-1}`))

  mostrarPartidas()

  header.querySelector("h1").innerText = localStorage.getItem(`partida${nro_partida-1}`) != null?
  (partida.rendicion ?
  `Que lastima perdiste!!! no adivinaste el numero ni en ${partida.intentos} ${partida.intentos == 1 ? "intento": "intentos"}
  ` + TEXTO_INICIO
  : `Felicidades Ganaste!!! y lo adivinaste en solo ${partida.intentos} ${partida.intentos == 1 ? "intento": "intentos"}
  ` + TEXTO_INICIO)
  : (TEXTO_INICIO)
  
  
  // reinicio las variables
  intento.value = "";
  cant_numeros = 0
  cant_intentos = 0
  cant_pistas = 0
  //muestro la botonera del header y oculto los botones de rendicion y de pistas y bloque el input
  header_botonera.style.display = "flex"
  historial_partidas.querySelector(".rendirse-boton").style.display = "none"
  historial_partidas.querySelector(".pista-boton").style.display = "none"
  historial.querySelector('h1').style.display = "none"
  historial.querySelectorAll('h1')[1].style.display = "none"
  intento.disabled = true

  nro_partida <= 1? borrar_historial_boton.style.display = "none" : borrar_historial_boton.style.display = "block"

  borrarElementos(historial.querySelector(".historial-div"), "div", 1)
}

function resetIntento()
{
  intento_anterior = intento.value
  cant_intentos++
  historial.querySelector('h1').innerText = `CANTIDAD DE INTENTOS: ${cant_intentos}`
  intento.value = ""
  if(cant_intentos > 1)
  {
    div_historial = historial.querySelector(".historial-div").querySelectorAll("div")
    div_historial[1].style.fontSize = "1rem"
    div_historial[1].style.height = "5vh"
    div_historial[1].style.width = "90%"
  }
}

/** 
 * Limpia y vuelve a completar el historial de partidas y estadisticas
 */
function mostrarPartidas ()
{
  let partidas = []
  
  borrarElementos(historial_partidas.querySelector(".partidas-historial"), ".div-template", 1)

  for(let i=1; i < nro_partida; i++)
  {
    partidas[i] = JSON.parse(localStorage.getItem(`partida${i}`))
  }
  evaluarPartidas(partidas)
}

/** 
 * coloca un template en un nodo indicado
 * 
 * Esta funcion busca un template y modifica el innertext de su etiqueta p por el valor que se le ingrese en textop
 * en caso de tener una etiqueta h1, se puede modificar colocarndo true en el parametro h1 e ingresando el texto por el cual se quiere modificar
 * luego se coloca en el nodo indicado
 * 
 * 
 * @param nodo : Node: nodo sobre el cual se buscara e copiara el template
 * @param templatename : String: nombre de la clase de la etiqueta <template>
 * @param modo : String: 
 * 
 * append : el template se ubicara a continuacion de los existentes
 * 
 * prepend : el template se colocara antes de los existentes
 * @param textop : String: Texto que se colocara en la etiqueta p
 * @param h1 : boolean: 
 * false (default): no se modificara la etiqueta <h1> en caso de que exista
 * true: se modificara la etiqueta h1
 * @param textoh1 : String: texto por el cual se reemplazara el texto del h1
 */
function mostrarDiv(nodo, templatename, modo, textop, h1 = false, textoh1 = '')
{
  let template = document.getElementsByClassName(templatename)[0].content.cloneNode(true)
  template.querySelector('p').innerText = textop
  h1 && ( template.querySelector('h1').innerText = textoh1 )
  modo == 'append' && nodo.append(template)
  modo == 'prepend' && nodo.prepend(template)
}

function modificarDiv(data, caso)
{
  div_historial = historial.querySelector(".historial-div").querySelectorAll("div")
  Object.keys(data[caso]).forEach((elm)=> div_historial[0].style[data[caso][elm].split(";")[0]] = data[caso][elm].split(";")[1] )
  
}

function aplicarEstilos(caso){
  fetch("estilos.json")
  .then(response => response.json())
  .then(data => {
    modificarDiv(data,caso)
  })
}

/** 
 * coloca un template en un nodo indicado
 * 
 * Esta funcion busca un template y modifica el innertext de su etiqueta p por el valor que se le ingrese en textop
 * en caso de tener una etiqueta h1, se puede modificar colocarndo true en el parametro h1 e ingresando el texto por el cual se quiere modificar
 * luego se coloca en el nodo indicado
 * 
 * 
 * @param estadisticas: array class Estadistica
 * @param resultado String:
 * 'victoria'
 * 'derrota'
 * @param orden 
 * @param record_intentos
 * @param record_cant_numeros
 */
function modificarEstadisticas( estadisticas, resultado, orden, record_intentos = 9999999999, record_cant_numeros = 0)
{
  const record = 0
  const mayor_num = 1
  const partidas_perdidas = 2
  const partidas_jugadas = 3

    estadisticas[record].array_aux[orden-1] = record_intentos
    estadisticas[mayor_num].array_aux[orden-1] = record_cant_numeros
    estadisticas[partidas_perdidas].valor += resultado == 'derrota' && 1
    estadisticas[partidas_jugadas].valor++
}

/** 
 * muestra las estadisticas recompiladas
 * 
 * @param estadisticas: class Estadistica: estadistica recompilada con un tituilo y un valor numerico
 * 
 */
function mostrarEstadisticas(estadisticas)
{
  const record = 0
  const mayor_num = 1

  estadisticas[record].valor = estadisticas[record].array_aux.sort((a,b) => {return a-b}).find((element)=> element != false) || 0
  estadisticas[mayor_num].valor = estadisticas[mayor_num].array_aux.sort()[estadisticas[mayor_num].array_aux.length-1]
  
  borrarElementos(info, ".info-div", 1)
  estadisticas.forEach((val)=> {
    mostrarDiv(info,'estadisticas-template','append', `${val.valor || 0}`,true,`${val.titulo}`)
  })
}

/** 
 * muestra las estadisticas recompiladas
 * 
 * 
 * 
 */
function Rendirse()
{
  almacenarPartida(true)
  reset()
}

/** 
 * almacena los datos de la partida en el localStorage
 * 
 * @param rendicion: boolean:
 * true: se rindio
 * false: no se rindio
 * 
 */
function almacenarPartida(rendicion)
{
  localStorage.setItem(`partida${nro_partida}`,JSON.stringify(new Partida(cant_numeros,cant_intentos,nro_partida,cant_pistas,rendicion)))
  nro_partida++
  localStorage.setItem("nro_partida",nro_partida)
}

/** 
 * almacena los datos de la partida en el localStorage
 * 
 * @param rendicion: Node: nodo sobre el que se eliminara
 * @param elemento: String: nombre del elemento que se desea eliminar
 * @param cant_sobrante: Number: la cantidad de elementos de ese tipo que se desean conservar
 * 
 */
function borrarElementos(nodo, elemento, cant_sobrante)
{
  while(nodo.childElementCount > cant_sobrante)
    nodo.querySelector(elemento).remove()
}

/** 
 * almacena los datos de la partida en el localStorage
 * 
 * @param partidas: array class Partida: partidas almacenadas en localStorage
 * 
 */
function evaluarPartidas(partidas){
  
  let estadisticas = [
    new Estadistica("RECORD DE INTENTOS",0,[]),
    new Estadistica("MAYOR NUMERO",0,[]),
    new Estadistica("PARTIDAS PERDIDAS",0),
    new Estadistica("CANTIDAD DE PARTIDAS",0)
  ]
  

  for(let i = 1; i < partidas.length; i++)
  {
    const TEXTO_DERRORTA = `partida Nro ${partidas[i].nro_partida}: Jugaste con ${partidas[i].cant_numeros} numeros y luego de ${partidas[i].intentos} ${partidas[i].intentos == 1 ? "intento": "intentos"} te rendiste aun habiendo utilizado ${partidas[i].pistas} ${partidas[i].pistas == 1 ? "pista": "pistas"} `
    const TEXTO_VICTORIA = `partida Nro ${partidas[i].nro_partida}: Jugaste con ${partidas[i].cant_numeros} numeros, te tomo ${partidas[i].intentos} ${partidas[i].intentos == 1 ? "intento": "intentos"} y utilizaste ${partidas[i].pistas} ${partidas[i].pistas == 1 ? "pista": "pistas"}`
    mostrarDiv(historial_partidas.querySelector(".partidas-historial") ,"partidas-template",'append', partidas[i].rendicion? TEXTO_DERRORTA : TEXTO_VICTORIA )
    modificarEstadisticas( estadisticas, partidas[i].rendicion? 'derrota': 'victoria',i, partidas[i].rendicion == false && Number(partidas[i].intentos), partidas[i].rendicion == false ? partidas[i].cant_numeros : 0 )
  }
  mostrarEstadisticas(estadisticas)
}


function cambiarModo()
{
  let const_modo = Number(modo == "dark" ? 4:0)
  if(cant_numeros != 0)
  {

    if(cant_intentos > 0)
    {
      fetch("estilos.json")
      .then(response => response.json())
      .then(data => {
        div_historial = historial.querySelector(".historial-div").querySelectorAll("div")
        div_historial.forEach((elm =>{
          for (let i = 0 + const_modo; i <= 3 + const_modo; i++)
          {
            //console.log(elm.style.backgroundColor, data[i].backgroundColor.split(";")[1])
            if(elm.style.backgroundColor == data[i].backgroundColor.split(";")[1])
            {
              if(i >= 4) elm.style.backgroundColor = data[i-4].backgroundColor.split(";")[1]
              else elm.style.backgroundColor = data[i+4].backgroundColor.split(";")[1]
            }
          }
        }))
      })  
    }
    if(modo == "light") modo = "dark"
    else modo = "light"
  
    localStorage.setItem("modo", modo)
    setModo() 
    }

  else{
    if(modo == "light")
        modo = "dark"
    else
      modo = "light"
  
    localStorage.setItem("modo", modo)
    setModo()
  }
}


function setModo()
{
  if( modo == "light")
    {
      if(document.body.classList.contains("bg-color-dark"))
        document.body.classList.remove("bg-color-dark")
      document.body.classList.add("bg-color-light")
      modo = "light"
      header.querySelector("button").innerText = "Dark mode"
    }
    else{
      document.body.classList.add("bg-color-dark")
      if(document.body.classList.contains("bg-color-light"))
      document.body.classList.remove("bg-color-light")
      modo = "dark"
      header.querySelector("button").innerText = "Light mode"
    } 
}
