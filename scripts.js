    //CONFIGURACION GENERAL DEL PROYECTO

// Config del canvas
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1500;
canvas.height = 800;

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
    constructor({position, velocity, offset}){          // position y velocity se pasan como un solo parametro dentro de un objeto
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;

        // Ataque
        this.attackBox = {
            position:{
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.isAttacking;
    }

    // Dibujos del personaje principal
    draw(){
        // Contorno gatito
        c.fillStyle = 'grey';
        c.fillRect(this.position.x, this.position.y, this.width , this.height);

        // Ataque gatito
        if(this.isAttacking){       // Hace que la hitbox del ataque solo se dibuje si isAttacking es verdadero
            c.fillStyle = 'red';
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }    
    }


    update(){
        this.draw();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;    // La hitbox del ataque estara donde se encuentre el Gatito
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;          // Usar "numero += 1" es lo mismo que usar "numero = numero+1"
        this.position.x += this.velocity.x;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){       // Comprueba que cuando la entidad toque el piso, se quede quieto
            this.velocity.y = 0;
        }else{
            this.velocity.y += gravity;             // Efecto de gravedad para las caidas cuando salta
        }
    }

    attack(){
        this.isAttacking = true;        // Cuando el jugador emite un ataque, estara "atacando" durante 0.6 segundos, luego dejara de estar atacando
        setTimeout(()=>{
            this.isAttacking = false;
        }, 60);


    }
}
//

// Instancia personaje principal (Gatito)
const Gatito = new SpriteGatito({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
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
    },
    offset: {
        x: -50,
        y: 0
    }
 });
//

// Loop infinito, anima la escena frame por frame
function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';          // Selecciona el color black
    c.fillRect(0, 0, canvas.width, canvas.height);       // Rellena el bg de black

    Gatito.update();
    Enemigo.update();

    //Gatito.velocity.x = 0;

    // Movimiento del jugador derecha-izquierda, corrije un bug en el movimiento, se pueden presionar 'a' y 'd' a la vez sin problema
    if (keys.a.pressed && Gatito.lastKey === 'a'){         
        Gatito.velocity.x = -20;
    }else if(keys.d.pressed && Gatito.lastKey === 'd'){
        Gatito.velocity.x = 20;
    }

    // Efecto de salto para que no se quede quieto en el aire       (TERMINAR DE ARREGLAR)
    if(Gatito.position.y + Gatito.height == canvas.height){
        Gatito.velocity.x = 0;
    }else{

        switch(Gatito.lastKey){
            case 'a':
                Gatito.velocity.x = -4;
                break;
            case 'd': 
                Gatito.velocity.x = 4;
                break;
        }
    }


    // Deteccion de colision (Ataque) en X y en Y
    function rectangularCollision({rectangle1, rectangle2})         // rectangle1 es la hitbox del Gatito y rectangle2 es la del Enemigo
    {
        return (
            (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x)
            && 
            (rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width)
            &&
            (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y)
            &&
            (rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
        );
    }

    if(rectangularCollision({rectangle1: Gatito, rectangle2: Enemigo}) && Gatito.isAttacking){
        Gatito.isAttacking = false;
        document.querySelector('#enemyhp-bg').style.width = '95%';
        console.log("Gatito ataco a Enemigo");
    }

    // Deteccion de colision solo de Enemigo para tests
    if(rectangularCollision({rectangle1: Enemigo, rectangle2: Gatito})){
        console.log("Enemigo ataco a Gatito");
    }

    // Evita salto doble
    //while(Gatito.pressed.w){}
     
}
//




    // MAIN

animate();


// Movimiento del jugador
window.addEventListener('keydown', (event)=>{
    switch(event.key){
        case 'w': 
            Gatito.velocity.y = -15;
            keys.w.pressed = true;
        break;


        case 's': 

        break;


        case 'a': 
            Gatito.velocity.x = -20;
            keys.a.pressed = true;
            Gatito.lastKey = 'a';
        break;


        case 'd': 
            Gatito.velocity.x = 20;      // Si el jugador presiona 'd', en cada frame se va a mover 1 pixel hacia la derecha
            keys.d.pressed = true;
            Gatito.lastKey = 'd';
        break;

        case ' ': 
            Gatito.attack();
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
Enemigo.isAttacking = true;


