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
        console.log(`%cThe ${this.name} attacks the ${target.name} for ${this.firePower} damage\n${target.name} HP: ${target.hull}`, `color:red`);
        if (target.hull <= 0) {
            console.log(`%cThe ${target.name} is destroyed`, `color: firebrick`);
        }
    }
}

class USS_Assembly extends Spaceship {
    constructor(missles = 3) {
        super("US Assembly", 20, 5, .7);
        this.missles = missles;
    }

    useMissiles(target) {
        if (this.missles <= 0) {
            console.log("All out of missiles");
            return;
        }
        target.hull -= 10;
        this.missles -= 1;
        console.log(`${target.name} got obliterated by the missles`);
    }
}

class Alien_Ship extends Spaceship {
    constructor() {
        super("Alien Ship", randomInt(3, 6), randomInt(2, 4), randomFloat(.6, .8));
    }
    static id = 1;
}

// Randomizers

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFloat(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(1));
}

// Game functions

function commands() {
    let command = "null";
    do {
        command = prompt("What is your order?") || "null";
        command = command.toUpperCase();
        switch (command) {
            case "ATTACK": battle(enemyArr[selectEnemy(enemyArr) - 1]);
                break;
            case "MISSILES": player.useMissiles(enemyArr[selectEnemy(enemyArr) - 1]);
                break;
            case "RETREAT": retreat();
                break;
            default: command = "NULL";
        }
    } while (command === "NULL");
    return command;
}

function selectEnemy(enemyArr) {
    let choice = "null";
    do {
        choice = prompt("Which one to target?") || "null";
        if (choice < 1 || choice > enemyArr.length || !Number(choice)) {
            choice = "null";
        }
        else if (enemyArr[choice - 1].hull <= 0) {
            console.log(`Alien Ship #${choice} is already destroyed`);
            choice = "null";
        }
    } while (choice === "null")
    return Number(choice);
}

function battle(enemy) {
    while (player.hull > 0 && enemy.hull > 0) {
        player.attack(enemy);
        if (enemy.hull <= 0) break;
        enemy.attack(player);
    }
    repairShields();
}

function retreat() {
    console.log("You have retreated\nGAME OVER");
    return "run";
}

function generateShips(amount) {
    for (let i = 0; i < amount; i++) {
        enemyArr[i] = new Alien_Ship();
        enemyArr[i].name += " #" + Alien_Ship.id
        Alien_Ship.id++;
    }
}

function showStats() {
    for (let i = 0; i < enemyArr.length; i++) {
        console.log(`%c${i + 1}.\n Enemy HP: ${enemyArr[i].hull}\n Enemy Fire Power: ${enemyArr[i].firePower}`, `color:red`);
    }
    console.log(`%cUSS Assembly HP: ${player.hull}\nUSS Assembly Fire Power`, `color:blue`);
}

function repairShields() {
    const repair = randomInt(1, 5);
    player.hull += repair;
    console.log(`%cHull repaired by ${repair} HP`, `color: green`);
    if (player.hull > 20) {
        player.hull = 20;
    }
}


function startGame() {
    for (let i = 0; i < enemyArr.length; i++) {
        console.log(`%c/////////////////////////////////////  Round ${i + 1}`, `color: green`); // Prints Round Number
        showStats();
        // console.log(`%c${player.name} HP: ${player.hull}\n${enemyArr[i].name} HP: ${enemyArr[i].hull}`, `color: blue`); Prints HP
        if (commands(enemyArr[i]) === "RETREAT") return;
        if (player.hull <= 0) {     //Checks the players health if its 0 
            console.log("%c GAME OVER", "color: red"); // Game over
            return;
        }
    }
    console.log("%c ---------------YOU WIN---------------", "color: green")
}


player = new USS_Assembly(); // Player ship
enemyArr = []; // Enemies
generateShips(randomInt(5, 10)); //Generating enemy ships
console.log(enemyArr);
startGame();




