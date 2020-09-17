class Spaceship {
    constructor(hull, firePower, accuracy){
        this.hull = hull;
        this.firePower = firePower;
        this.accuracy = accuracy;
    }
}

class USS_Assembly extends Spaceship {
    constructor(){
        super(20,5,.7);
    }
}

class Alien_Ship extends Spaceship {
    constructor(){
        super(randomInt(3,6),randomInt(2,4),randomFloat(.6,.8));
    }
}

function randomInt(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min,max) {
    return Number((Math.random() * (max - min) + min).toFixed(1));
}

you = new USS_Assembly();
enemy1 = new Alien_Ship();
enemy2 = new Alien_Ship();
console.log(you);
console.log(enemy1);
console.log(enemy2);