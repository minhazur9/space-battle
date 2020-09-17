// Classes

class Spaceship {
    constructor(name, hull, firePower, accuracy) {
        this.hull = hull;
        this.firePower = firePower;
        this.accuracy = accuracy;
        this.name = name;
    }
    // Attack Commmnd
    attack(target) {
        // RNG
        if (Math.random(1) > this.accuracy) {
            console.log(`The ${this.name} missed`);
            return;
        }
        // Losing Health
        target.hull -= this.firePower;
        if (target.hull <= 0) {
            target.hull = 0;
        }
        // Log
        console.log(`The ${this.name} attacks the ${target.name} for ${this.firePower} damage\n${target.name} HP: ${target.hull}`);
        if (target.hull <= 0) {
            console.log(`The ${target.name} is destroyed`);
        }
    }
}

class USS_Assembly extends Spaceship {
    constructor() {
        super("US Assembly", 20, 5, .7);
    }
}

class Alien_Ship extends Spaceship {
    constructor() {
        super("Alien Ship", randomInt(3, 6), randomInt(2, 4), randomFloat(.6, .8));
    }
}

// Randomizers

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(1));
}

// Game functions

function commands(enemy) {
    let command = prompt("What is your order?") || "null";
    command = command.toUpperCase();
    switch (command) {
        case "ATTACK": battle(enemyArr[0]);
            break;
        case "RETREAT": retreat();
            break;
        default: commands(enemy);
    }
    return command;
}

function battle(enemy) {
    while (player.hull > 0 && enemy.hull > 0) {
        player.attack(enemy);
        if (enemy.hull <= 0) break;
        enemy.attack(player);
    }
}

function retreat() {
    console.log("You have retreated\nGAME OVER");
    return "run";
}

function generateShips(amount) {
    for (let i = 0; i < amount; i++) {
        enemyArr[i] = new Alien_Ship();
    }
}

function startGame() {
    for (let i = 0; i < enemyArr.length; i++) {
        console.log(`/////////////////////////////////////`);
        console.log(`${player.name} HP: ${player.hull}\n${enemyArr[i].name} HP: ${enemyArr[i].hull}`);
        if (commands(enemyArr[i]) === "RETREAT") return;
        battle(enemyArr[i]);
        if (player.hull <= 0) {
            console.log("GAME OVER");
            return;
        }
    }
    console.log("---------------YOU WIN---------------")
}


player = new USS_Assembly();
enemyArr = []; // Enemies
generateShips(6);
startGame();




