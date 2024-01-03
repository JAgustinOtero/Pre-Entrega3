//VARIABLES GLOBALES
let partidas = [];
let cant_intentos;
let jugar_denuevo;
let intento;
let historial_intentos;
let cant_numeros;
let respuesta = [];
let nro_partida = 0;

class Partida {
  constructor(cant_numeros, intentos, nro_partida) {
    this.cant_numeros = cant_numeros;
    this.intentos = intentos;
    this.nro_partida = nro_partida;
  }
}

//MAIN
do {
  //reinicio variables
  historial_intentos = [];
  cant_intentos = 0;
  cant_numeros = 0;

  let menu = Number(
    prompt(
      "ingrese 1 si quiere jugar \nIngrese 2 si quiere ver su historial\ningrese 3 si quiere salir"
    )
  );

  if (menu == 1) {
    cant_numeros = 0;
    while (cant_numeros < 1 || cant_numeros > 9)
      //se elije la cantidad de numeros con la que se quiere jugar
      cant_numeros = Math.floor(
        prompt(
          "elija la cantidad de numeros con los que quiere jugar, debe ser mayor a 0 y menor a 10 y debe ser un numero entero"
        )
      );
    alert(`ha decidido jugar con ${cant_numeros} numeros`);

    respuesta = generarNumeroAleatorio(cant_numeros, false, false); //se genera un numero aleatorio
    alert(respuesta);

    // se le pide al usuario que ingrese un numero de X digitos y se comprueba que sea valido
    do {
      intento = pedirNumero(false);
      while (!esValido(intento)) {
        pedirNumero(true);
      }
      historial_intentos[cant_intentos] = `${intento}: ${
        verificacion(intento)[0]
      } bien, ${verificacion(intento)[1]} fuera de lugar y ${
        cant_numeros - verificacion(intento)[1] - verificacion(intento)[0]
      } mal
`; //se agrega un historial de numeros para facilitar la resolucion
      cant_intentos++;
    } while (!esCorrecto(intento)); //se comprueba que el numero sea correcto y se le da una respuesta adecuada

    nro_partida++;
    partidas.push(new Partida(cant_numeros, cant_intentos, nro_partida));

    jugar_denuevo = confirm("Quiere volver a jugar?");
  }
  if (menu == 2) {
    mostrarHistorial(partidas);
    jugar_denuevo = 1;
  }
  if (menu == 3) {
    break;
  }
} while (jugar_denuevo);

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

  if (comprobacion[0] == 0 && comprobacion[1] == 0) {
    alert("todos los numeros son incorrectos");
  } else if (comprobacion[0] == cant_numeros) {
    alert(
      "FELICIDADES! Acertaste al numero!" +
        "\nY solo te tomo " +
        cant_intentos +
        " intentos"
    );
    salida = true;
  } else
    alert(
      "hay " +
        comprobacion[0] +
        " numeros correctos en su posicion y hay " +
        comprobacion[1] +
        " numeros correctos que no estan en su posicion"
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
  for (let j = 0; j < numero.length; j++) {
    for (let i = 0; i < numero.length; i++) {
      if (numero[i] == respuesta[j] && j == i) {
        salida[0]++;
      } else if (numero[i] == respuesta[j]) {
        salida[1]++;
      }
    }
  }
  return salida;
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
function esValido( numero )
entrada: 
        number: numero a comprobar
return: boolean
Esta funcion valida si lo ingresado por el usuario es un numero valido o no, esta para limpiar el codigo principal y facilitar el hecho de agregar condiciones a esta entrada
*/
function esValido(numero) {
  let valido = true;
  const NUMERO_MAX = 9999,
    NUMERO_MIN = 999;

  if (
    seRepite(numero) ||
    numero >= Math.pow(10, cant_numeros) ||
    numero[0] == 0
  ) {
    valido = false;
  }
  return valido;
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
function mostrarHistorial(partidas)
entrada: 
        array class Partida: array de objetos con sus propiedades
return: array numerico
Esta funcion analiza las propiedades de las diferentes partidas y genera un alert en base a eso
*/
function mostrarHistorial(partidas) {
  historial = [];
  for (let i = 2; i <= 9; i++) {
    let cant_partidas = 0;
    let record = 0;
    let aux = partidas.find((elm) => elm.cant_numeros == i);
    if (aux != undefined) {
      record = aux.intentos;
    }
    historial = ``;

    partidas
      .filter((elm) => elm.cant_numeros == i)
      .forEach((partida) => {
        if (partida.intentos < record) {
          record = partida.intentos;
        }
        cant_partidas++;
        historial =
          historial +
          `
partida nro ${partida.nro_partida}
cantidad de numeros: ${partida.cant_numeros}
intentos: ${partida.intentos}
`;
      });
    if (cant_partidas) {
      alert(
        `Jugando con ${i} numeros este es tu historial:
cantidad de partidas:${cant_partidas}
` +
          historial +
          `
y tu record es de ${record} intentos`
      );
    }
  }
}

/*
function mostrarHistorial(partidas)
entrada: 
        bollean: error: se indica si ya hubo un error en la entrada del usuario o no
return: array
Esta funcion pide un numero al usuario
*/
function pedirNumero(error) {
  if (error) {
    intento = prompt(
      `El numero ingresado no es valido. Por favor, ingrese un numero de ${cant_numeros} digitos (del 1 al 9)`
    );
    if (historial_intentos.find((elm) => elm == intento)) {
      alert("ESE NUMERO YA LO PROBASTE, INTENTA DE NUEVO");
      intento = [0, 0, 0, 0];
    }
  } else {
    intento = prompt(`${historial_intentos}
Elija un numero de ${cant_numeros} digitos (del 1 al 9)`);
    if (historial_intentos.find((elm) => elm == intento)) {
      alert("ESE NUMERO YA LO PROBASTE, INTENTA DE NUEVO");
      intento = [0, 0, 0, 0];
    }
  }

  return intento;
}
