var tablero, tifiDibujo ;
var direccion = 0;

var teclas = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,
	KEY_X: 88
};

var fondo = {
	imagenURL: "fondo.png",
	imagenOK: false,
	limiteTop: 0,
	limiteBottom: 450,
	limiteLeft: -10,
	limiteRight: 460,
};


var obj1 = {
	disTop: 158,
	disBottom: 248,
	disLeft: -40,
	disRight: 133
};


var obj2 = {
	disTop: -50,
	disBottom: 250,
	disLeft: 160,
	disRight: 235
};

var obj3 = {
	disTop: 300,
	disBottom: 395,
	disLeft: 110,
	disRight: 500
};

var tifis = {
	x: 100,
	y: 100,
	frenteURL: "diana-frente.png",
	frenteOK: false,

	atrasURL: "diana-atras.png",
	atrasOK: false,

	izqURL: "diana-izq.png",
	izqOK: false,

	derURL: "diana-der.png",
	derOK: false,
	velocidad: 10
};

var bala = {
	x: tifis.x,
	y: tifis.y,
	balaURL: "energia-der.png",
	balaOK: false,
	velocidad: 1
};

var liz = {
	lizURL: "liz.png",
	lizOK: false,
	x: 400,
	y: 200,
	disTop: 150,
	disBottom: 250,
	disLeft: 370,
	disRight: 430
};

function inicio ()
{
	var canvas = document.getElementById("campo");
	tablero = canvas.getContext("2d");

	fondo.imagen = new Image();
	fondo.imagen.src = fondo.imagenURL;
	fondo.imagen.onload = confirmarFondo;

	tifis.frente = new Image();
	tifis.frente.src = tifis.frenteURL;
	tifis.frente.onload = confirmarFrente;

	tifis.atras = new Image();
	tifis.atras.src = tifis.atrasURL;
	tifis.atras.onload = confirmarAtras;

	tifis.der = new Image();
	tifis.der.src = tifis.derURL;
	tifis.der.onload = confirmarDer;

	tifis.izq = new Image();
	tifis.izq.src = tifis.izqURL;
	tifis.izq.onload = confirmarIzq;

	liz.lizy = new Image();
	liz.lizy.src = liz.lizURL;
	liz.lizy.onload = confirmarLiz;
	document.addEventListener("keydown", teclado);
}

function teclado(datos)
{
	codigo = datos.keyCode;

	//determinar si disparar en sentido hacia la derecha
	if (codigo == teclas.KEY_X && direccion == teclas.RIGHT) {
		direccion = teclas.RIGHT;
		disparar(25, "energia-der.png", "der");
	};
	//determinar si disparar en sentido hacia la izquierda
	if (codigo == teclas.KEY_X && direccion == teclas.LEFT) {
		direccion = teclas.LEFT;
		disparar(-25, "energia-izq.png", "izq");
	};

	//evitando los objetos en el eje y
	if (codigo == teclas.UP)
	{
		tifis.y -= tifis.velocidad;
		evitarObjetosY("arriba");
	}
	//evitando los objetos en el eje y
	else if (codigo == teclas.DOWN)
	{
		tifis.y += tifis.velocidad;
		evitarObjetosY("abajo");
	}
	//evitando los objetos en el eje x
	else if (codigo == teclas.RIGHT)
	{
		tifis.x += tifis.velocidad;
		evitarObjetosX("derecha");
	}
	//evitando los objetos en el eje x
	else if (codigo == teclas.LEFT)
	{
		tifis.x -= tifis.velocidad;
		evitarObjetosX("izquierda");
	}

	console.log("posicion de tifis en x: "+tifis.x+", en y: "+tifis.y);
	dibujar();

}

function confirmarFondo()
{
	fondo.imagenOK = true;
	dibujar();
}

function confirmarFrente()
{
	tifis.frenteOK = true;
	dibujar();
}

function confirmarAtras()
{
	tifis.atrasOK = true;
	dibujar();
}

function confirmarDer()
{
	tifis.derOK = true;
	dibujar();
}

function confirmarIzq()
{
	tifis.izqOK = true;
	dibujar();
}

function confirmarLiz()
{
	liz.lizOK = true;
	dibujar();
}

function confirmarBala()
{
	bala.balaOK = true;
	dibujar();
}

function dibujar ()
{
	//capa 1
	if (fondo.imagenOK == true)
	{
		tablero.drawImage(fondo.imagen, 0, 0);
	};

	//capa 2
	if (liz.lizOK == true)
	{
		tablero.drawImage(liz.lizy, liz.x, liz.y);
	};

	//capa 3
	if (bala.balaOK == true)
	{
		tablero.drawImage(bala.imagen, bala.x, bala.y);
	};

	//capa 4
	tifiDibujo = tifis.frente;
	if (tifis.frenteOK && tifis.atrasOK && tifis.izqOK && tifis.derOK)
	{
		if (direccion == teclas.UP) {
			tifiDibujo = tifis.atras;
		}else if (direccion == teclas.DOWN) {
			tifiDibujo = tifis.frente;
		}else if (direccion == teclas.RIGHT) {
			tifiDibujo = tifis.der;
		}else if (direccion == teclas.LEFT) {
			tifiDibujo = tifis.izq;
		};
		tablero.drawImage(tifiDibujo, tifis.x, tifis.y);
	};
}

//aviso que se mostrara cuando el jugador gane o pierda
function aviso(titulo, mensaje) {
	var modal = document.getElementById("modal");
	var tituloModal = document.getElementById("titulo-modal");
	var mensajeModal = document.getElementById("mensaje-modal");

	tituloModal.innerHTML = titulo;
	mensajeModal.innerHTML = mensaje;
	modal.style.display = "block";

	//deshabilitar las teclas en el juego
	teclas.DOWN = 0;
	teclas.UP = 0;
	teclas.LEFT = 0;
	teclas.RIGHT = 0;
	teclas.KEY_X = 0;

}

//Esta funcion hace que Tifis pueda disparar

function disparar(valorResta, URLimagen, sentido)
{
	bala.x = tifis.x+valorResta;
	bala.y = tifis.y;
	bala.balaURL = URLimagen;
	bala.imagen = new Image();
	bala.imagen.src = bala.balaURL;
	bala.imagen.onload = confirmarBala;
	//con este for hago que la bala se mueva en direcion horizontal
	for(var i = 1; i <= 500; i++){
	    (function(i){
	        setTimeout(function(){
	        	if (sentido=="der") {
	            	bala.x += bala.velocidad;
	            }else if(sentido=="izq"){
	            	bala.x -= bala.velocidad;
	            }
				if (liz.disLeft<bala.x && liz.disRight>bala.x && liz.disTop<bala.y && liz.disBottom>bala.y ) {
					liz.lizURL = 'explosion.png';
					aviso("Ganastes!!!", "Felicidades has derrotado a la malévola Liz ");
				};
				inicio();
	        }, 5 * i);
	    }(i));
	}
}

function evitarObjetosY(sentido)
{
	//evitando obstaculo numero 1
	if (tifis.y>obj1.disTop && tifis.y<obj1.disBottom  && tifis.x<obj1.disRight && tifis.x>obj1.disLeft) {
		if (sentido == "arriba") {
			tifis.y += tifis.velocidad;
		}else if(sentido == "abajo"){
			tifis.y -= tifis.velocidad;
		}
	};
	//evitando obstaculo numero 2
	if (tifis.y>obj2.disTop && tifis.y<obj2.disBottom  && tifis.x<obj2.disRight && tifis.x>obj2.disLeft) {
		if (sentido == "arriba") {
			tifis.y += tifis.velocidad;
		}else if(sentido == "abajo"){
			tifis.y -= tifis.velocidad;
		}
	};
	//evitando obstaculo numero 3
	if (tifis.y>obj3.disTop && tifis.y<obj3.disBottom  && tifis.x<obj3.disRight && tifis.x>obj3.disLeft) {
		if (sentido == "arriba") {
			tifis.y += tifis.velocidad;
		}else if(sentido == "abajo"){
			tifis.y -= tifis.velocidad;
		}
	};
	//evitando que tifis se salga del cuadro de canvas en eje y
	if (tifis.y>fondo.limiteBottom || tifis.y<fondo.limiteTop) {
		if (sentido == "arriba") {
			tifis.y += tifis.velocidad;
		}else if(sentido == "abajo"){
			tifis.y -= tifis.velocidad;
		}
	};

	//si diana entra en el espacio personal liz hace que diana explote
	if (tifis.y>liz.disTop && tifis.y<liz.disBottom  && tifis.x<liz.disRight && tifis.x>liz.disLeft) {
		tifis.frenteURL = 'explosion.png';
		tifis.atrasURL = 'explosion.png';
		tifis.derURL = 'explosion.png';
		tifis.izqURL = 'explosion.png';
		inicio ();
		aviso("Perdiste!!!", "No contabas con que Liz tiene el poder de hacer explotar con solo tocarte, LOL");
	};

	direccion = codigo;
}

function evitarObjetosX (sentido)
{
	//evitando obstaculo numero 1
	if (tifis.x>obj1.disLeft && tifis.x<obj1.disRight && tifis.y>obj1.disTop && tifis.y<obj1.disBottom) {
		if (sentido == "derecha") {
			tifis.x -= tifis.velocidad;
		}else if (sentido == "izquierda") {
			tifis.x += tifis.velocidad;
		};
	};
	//evitando obstaculo numero 2
	if (tifis.x>obj2.disLeft && tifis.x<obj2.disRight && tifis.y>obj2.disTop && tifis.y<obj2.disBottom) {
		if (sentido == "derecha") {
			tifis.x -= tifis.velocidad;
		}else if (sentido == "izquierda") {
			tifis.x += tifis.velocidad;
		};
	};
	//evitando obstaculo numero 3
	if (tifis.x>obj3.disLeft && tifis.x<obj3.disRight && tifis.y>obj3.disTop && tifis.y<obj3.disBottom) {
		if (sentido == "derecha") {
			tifis.x -= tifis.velocidad;
		}else if (sentido == "izquierda") {
			tifis.x += tifis.velocidad;
		};
	};
	//evitando que tifis se salga del cuadro de canvas en eje x
	if (tifis.x>fondo.limiteRight || tifis.x<fondo.limiteLeft) {
		if (sentido == "derecha") {
			tifis.x -= tifis.velocidad;
		}else if (sentido == "izquierda") {
			tifis.x += tifis.velocidad;
		};
	};
	//si diana entra en el espacio personal liz hace que diana explote
	if (tifis.x>liz.disLeft && tifis.x<liz.disRight && tifis.y>liz.disTop && tifis.y<liz.disBottom) {
		tifis.frenteURL = 'explosion.png';
		tifis.atrasURL = 'explosion.png';
		tifis.derURL = 'explosion.png';
		tifis.izqURL = 'explosion.png';
		inicio ();
		aviso("Perdiste!!!", "No contabas con que Liz tiene el poder de hacer explotar con solo tocarte, LOL");
	};

	direccion = codigo;
}