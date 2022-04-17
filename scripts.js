    //CONFIGURACION GENERAL DEL PROYECTO
// Config del canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
//

const gravity = 0.5;        // Gravedad dentro del juego

const keys = {          // Detector de tecla pulsada
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

let lastKey;        // Variable para guardar la ultima tecla pulsada
//

// Clase personaje principal
class SpriteGatito{
    constructor({position, velocity}){          // position y velocity se pasan como un solo parametro dentro de un objeto
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;

        // Ataque
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        }
    }

    // Dibujos del personaje principal
    draw(){
        // Contorno gatito
        c.fillStyle = 'grey';
        c.fillRect(this.position.x, this.position.y, this.width , this.height);

        // Ataque gatito
        c.fillStyle = 'red';
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }


    update(){
        this.draw();

        this.position.y += this.velocity.y;          // Usar "numero += 1" es lo mismo que usar "numero = numero+1"
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){       // Comprueba que cuando la entidad toque el piso, se quede quieto
            this.velocity.y = 0;
        }else{
            this.velocity.y += gravity;             // Efecto de gravedad para las caidas cuando salta
        }
    }
}
//

// Instancia personaje principal
const Gatito = new SpriteGatito({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    }
 });
//

//Instancia enemigo
const Enemigo = new SpriteGatito({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
 });
//

// Loop infinito, permite que el juego tenga animaciones
function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';          // Rellena el background de black
    c.fillRect(0, 0, canvas.width, canvas.height);       // Crea un rectangulo, simulando una entidad 
    Gatito.update();
    Enemigo.update();

    Gatito.velocity.x = 0;

    // Movimiento del jugador derecha-izquierda, corrije un bug en el movimiento, se pueden presionar 'a' y 'd' a la vez sin problema
    if (keys.a.pressed && Gatito.lastKey === 'a'){         
        Gatito.velocity.x = -5;
    }else if(keys.d.pressed && Gatito.lastKey === 'd'){
        Gatito.velocity.x = 5;
    }

    // Deteccion de colision (Ataque)
    if((Gatito.attackBox.position.x + Gatito.attackBox.position.x >= Enemigo.position.x) && (Gatito.attackBox.position.x <= Enemigo.position.x + Enemigo.width)){
        console.log("Colision");
    }
     
}
//




    // MAIN
animate();


// Movimiento del jugador
window.addEventListener('keydown', (event)=>{
    switch(event.key){
        case 'w': 
            Gatito.velocity.y = -15;
        break;


        case 's': 

        break;


        case 'a': 
            Gatito.velocity.x = -5;
            keys.a.pressed = true;
            Gatito.lastKey = 'a';
        break;


        case 'd': 
            Gatito.velocity.x = 5;      // Si el jugador presiona 'd', en cada frame se va a mover 1 pixel hacia la derecha
            keys.d.pressed = true;
            Gatito.lastKey = 'd';
        break;
    }
})

window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'w': 
            keys.w.pressed = false;
        break;


        case 's': 

        break;


        case 'a': 
            keys.a.pressed = false;
        break;


        case 'd': 
            keys.d.pressed = false;
        break;
    }
})
Gatito.draw();


