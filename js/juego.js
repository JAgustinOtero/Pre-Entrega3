/*************************************************************************DOM*******************************************************************/
let header = document.querySelector("header")
let header_botonera = header.querySelector(".header-botonera")

let main = document.querySelector("main")
let intento = main.querySelector(".pad-numerico-display-input-numero")
let historial = main.querySelector(".historial")

let historial_partidas = main.querySelector(".partidas")

let p = document.createElement("p")



/*************************************************************************CLASES*******************************************************************/
class Partida {
  constructor(cant_numeros, intentos, nro_partida, cant_pistas) {
    this.cant_numeros = cant_numeros;
    this.intentos = intentos;
    this.nro_partida = nro_partida;
    this.pistas = cant_pistas
    this.rendicion = false
  }
}




/*************************************************************************VARIABLES*******************************************************************/
let cant_numeros = 0;
let cant_intentos = 0;
let respuesta = 0;
let nro_partida = Number(localStorage.getItem("nro_partida")) + 1;
let partidas = []
let partidasLS = []
let cant_pistas = 0






/*************************************************************************MAIN*******************************************************************/
enfoqueDisplay();
intento.value = "";
header_botonera.style.display = "flex"
historial_partidas.querySelector(".rendirse-boton").style.display = "none"
historial_partidas.querySelector(".pista-boton").style.display = "none"
nro_partida ||= 1
if(nro_partida == 1)
  historial_partidas.querySelector(".borrar-historial-boton").style.display = "none"
mostrarPartidas(partidas,nro_partida-1)
intento.disabled = true



/*************************************************************************LISTENERS*******************************************************************/
for (let i = 0; i < 9; i++) {
  main.getElementsByClassName("pad-numerico-row-boton")[i].addEventListener("click", () => {
    setnumber(i + 1);
  });
  header.getElementsByTagName("button")[i].addEventListener("click", () => {
    setCantNumber(i + 1);
    respuesta = generarNumeroAleatorio(cant_numeros, false, false); //genero un numero random con la cantidad de numeros elegidos
    console.log(respuesta);
  });
}
intento.addEventListener("keypress", keypad);
main.querySelector(".pad-numerico-submit-boton").addEventListener("click", esCorrecto);
main.querySelector(".pad-numerico-clean-boton").addEventListener("click", ()=>{
  intento.value = ""
})

historial_partidas.querySelector(".borrar-historial-boton").addEventListener("click", ()=>{
  nro_partida = 0
  mostrarPartidas(partidas,nro_partida)
  reset()
  localStorage.clear()
  localStorage.setItem("nro_partida",0)
})

historial_partidas.querySelector(".rendirse-boton").addEventListener("click", ()=>{
  if(confirm("Estas Seguro que deseas Rendirte?"))
  {
    let partida_rendida = new Partida(cant_numeros,cant_intentos,nro_partida,cant_pistas)
    partida_rendida.rendicion = true
    localStorage.setItem(`partida${nro_partida}`,JSON.stringify(partida_rendida))
    mostrarPartidas(partidas,nro_partida)
    reset()
  }
})

historial_partidas.querySelector(".pista-boton").addEventListener("click", ()=>{
  if(cant_pistas < cant_numeros - 1)
  {
    mostrarDiv(historial ,"historial-template", 'prepend' , `el numero en la posiscion ${cant_pistas+1} es ${respuesta[cant_pistas]} `)
    cant_pistas++
  }
  else if (confirm("Si pedis esta ultima pista, vas a perder automaticamente"))
  {
    let partida_rendida = new Partida(cant_numeros,cant_intentos,nro_partida,cant_pistas)
    partida_rendida.rendicion = true
    localStorage.setItem(`partida${nro_partida}`,JSON.stringify(partida_rendida))
    mostrarPartidas(partidas,nro_partida)
    reset()
  }
})





/*************************************************************************FUNCIONES*******************************************************************/

function setnumber(numero) {
  if(cant_numeros != 0)
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
  console.log(intento.value)
  let comprobacion = verificacion(intento.value);

  cant_intentos++;
  if (comprobacion == "99"){
      mostrarDiv(historial,"historial-template",'prepend',`${intento.value}, la cantidad de numeros es incorrecta o sus numero se repiten, por favor, ingrese un numero valido`)
  }
  else if (comprobacion[0] == 0 && comprobacion[1] == 0) {
    mostrarDiv(historial,"historial-template",'prepend',`${intento.value}, todos los numeros son incorrectos`)
  }
  else if (comprobacion[0] == cant_numeros) {
    localStorage.setItem(`partida${nro_partida}`,JSON.stringify(new Partida(cant_numeros,cant_intentos,nro_partida,cant_pistas)))
    mostrarPartidas(partidas, nro_partida)
    reset()
  }
  else {
    mostrarDiv(historial ,"historial-template",'prepend', `${intento.value}, hay ${comprobacion[0]} numeros correctos en su posicion y hay ${comprobacion[1]} numeros correctos que no estan en su posicion`)
  }

  enfoqueDisplay();
  intento.value = "";
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
  historial_partidas.querySelector(".rendirse-boton").style.display = "block"
  historial_partidas.querySelector(".pista-boton").style.display = "block"
  main.style.display = "flex"; //muestro el pad-numerico
  intento.disabled = false 
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
  const TEXTO_VICTORIA = `Felicidades Ganaste!!! el numero era ${intento.value} y lo adivinaste en solo ${cant_intentos} ${cant_intentos == 1 ? "intento": "intentos"}
  Elija la cantidad de numeros con la que va a jugar (del 1 al 9):`
  const TEXTO_BORRAR_HISTORIAL = `Borraste el historial, listo para empezar denuevo?
  Elija la cantidad de numeros con la que va a jugar (del 1 al 9):`
  
  if(localStorage.getItem(`partida${nro_partida}`) != null)
  {
    if (JSON.parse(localStorage.getItem(`partida${nro_partida}`)).rendicion)
    {
      const TEXTO_DERROTA = `Que lastima perdiste!!! el numero era ${Number(respuesta.join(''))} y no lo adivinaste ni en ${cant_intentos} ${cant_intentos == 1 ? "intento": "intentos"}
      Elija la cantidad de numeros con la que va a jugar (del 1 al 9):`
      
      header.querySelector("h1").innerText = TEXTO_DERROTA
    }
    else
    header.querySelector("h1").innerText = TEXTO_VICTORIA
  } 
  else
  {
    header.querySelector("h1").innerText = TEXTO_BORRAR_HISTORIAL
  }
  
    // reinicio las variables
  intento.value = "";
  cant_numeros = 0
  cant_intentos = 0
  cant_pistas = 0
  //muestro la botonera del header y oculto los botones de rendicion y de pistas y bloque el input
  header_botonera.style.display = "flex"
  historial_partidas.querySelector(".rendirse-boton").style.display = "none"
  historial_partidas.querySelector(".pista-boton").style.display = "none"
  
  intento.disabled = true

  localStorage.setItem("nro_partida",nro_partida)
  nro_partida++

  if(nro_partida == 1) historial_partidas.querySelector(".borrar-historial-boton").style.display = "none"
  else historial_partidas.querySelector(".borrar-historial-boton").style.display = "block"

  while(historial.childElementCount > 1)
    historial.querySelector("div").remove()
}

function mostrarPartidas ( partidas, nro_partida )
{
  let perdidas = 0
  let record = [0]
  let mayor_num = [0]

  while(historial_partidas.querySelector(".partidas-historial").childElementCount > 1)
    historial_partidas.querySelector(".div-template").remove()

  for(let i=1; i <= nro_partida; i++)
    {
      partidas[i] = JSON.parse(localStorage.getItem(`partida${i}`))

      if(partidas[i] != null)
      { 
        if (partidas[i].rendicion)
        {
          mostrarDiv(historial_partidas.querySelector(".partidas-historial") ,"partidas-template",'append', `partida Nro ${partidas[i].nro_partida}: Jugaste con ${partidas[i].cant_numeros} numeros y luego de ${partidas[i].intentos} ${partidas[i].intentos == 1 ? "intento": "intentos"} te rendiste aun habiendo utilizado ${partidas[i].pistas} ${partidas[i].pistas == 1 ? "pista": "pistas"} `)
          perdidas++
          mayor_num[i-1] = 0
          record[i-1] = 10000000
        }
        else
        {
          mostrarDiv(historial_partidas.querySelector(".partidas-historial") ,"partidas-template",'append', `partida Nro ${partidas[i].nro_partida}: Jugaste con ${partidas[i].cant_numeros} numeros, te tomo ${partidas[i].intentos} ${partidas[i].intentos == 1 ? "intento": "intentos"} y utilizaste ${partidas[i].pistas} ${partidas[i].pistas == 1 ? "pista": "pistas"}`)
          record[i-1] = partidas[i].intentos
          mayor_num[i-1] = partidas[i].cant_numeros
        }
      }
    }
    mostrarEstadisticas(record,mayor_num,perdidas)
}

function mostrarDiv(nodo ,templatename, modo, texto)
{
  let template = getTemplate(templatename)
  template.querySelector('p').innerText = texto
  if (modo == 'append') nodo.append(template)
  else if (modo == 'prepend') nodo.prepend(template)
}

function mostrarEstadisticas(record,mayor_num,perdidas)
{
    record.sort()
    mayor_num.sort()
    historial_partidas.querySelector(".info-record").querySelector("p").innerText = `record de intentos: ${record[0]} ${record[0] == 1 ? "intento": "intentos"}`
    historial_partidas.querySelector(".info-numero").querySelector("p").innerText = `Partida ganada con mayor cant. de numeros: ${mayor_num[mayor_num.length-1]}`
    historial_partidas.querySelector(".info-rendicion").querySelector("p").innerText = `Veces que te rendiste: ${perdidas}`
}