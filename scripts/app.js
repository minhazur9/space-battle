// Classes


//Generic Ship
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
        if (this.hull <= 0) {
            return;
        }
        if (Math.random(1) > this.accuracy) {
            console.log(`The ${this.name} missed`);
            return;
        }
        // Losing Health
        target.hull -= this.firePower;
        damageCap(target);
        // Log
        console.log(`%cThe ${this.name} attacks the ${target.name} for ${this.firePower} damage\n${target.name} HP: ${target.hull}`, `color:red`);
        if (target.hull <= 0) {
            console.log(`%cThe ${target.name} is destroyed`, `color: firebrick`);
        }
        return "ok";
    }
}


// Player Ship
class USS_Assembly extends Spaceship {
    constructor(missles = 3) {
        super("US Assembly", 20, 5, .7);
        this.missles = missles;
    }

    // Missles
    useMissiles(target) {
        if (this.missles <= 0) {
            console.log("All out of missiles");
            return "NULL";
        }
        target.hull -= 10;
        damageCap(target);
        this.missles -= 1;
        console.log(`%c${target.name} got obliterated by the missles for 10 damage\n${target.name} HP: ${target.hull}`, `color:blue`);
        if (target.hull <= 0) {
            destroyed(target);
        }
        return "OK";
    }
}


// Alien Ship
class Alien_Ship extends Spaceship {
    constructor() {
        super("Alien Ship", randomInt(3, 6), randomInt(2, 4), randomFloat(.6, .8));
    }

    // Second Attack
    secondAttack(target) {
        const second = Math.floor(this.firePower) / 2; // Second attack damage
        console.log(`%cOh no, ${this.name} attacked again for ${second} extra damage`, `color:red`);
        target.hull -= second;
    }
    // Ship ID
    static id = 1;
}

class Mega_Ship extends Spaceship {
    constructor(pods = 4) {
        super("Mega Ship", 40, 3, .4);
        this.pods = pods;
    }


    // Attack hits multiple times, chances of hitting get lower the more hits
    multiHit(target) {
        let hits = 1;
        let rng = Math.random(1); //determines how many hits
        if (rng <= .6 && this.pods >= 2) { //2nd hit
            hits++;
            if (rng <= .3 && this.pods >= 3) { //3rd hit
                hits++;
                if (rng <= .1 && this.pods >= 4) { //4th hit
                    hits++;
                }
            }
        }
        else {
            this.attack(target);
        }
        let value = 2 * hits;
        if (Math.random() > .9) {
            console.log(`%cThe ${this.name} used its multi missles to hit you ${hits} time(s) for ${value} damage\nBut it missed!`, `color:blue`);
            return;
        }
        target.hull -= value;
        console.log(`%cThe ${this.name} used its multi missles to hit you ${hits} time(s) for ${value} damage\n${target.name} HP: ${target.hull}`, `color:blue`);
    }

}


// Weapon Pod
class Weapon_Pod extends Spaceship {
    constructor() {
        super('Weapon Pod', 5, 1, .9);
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


// Prompt player
function commands() {
    let command = "null";
    do {
        command = prompt("Attack, Missiles, Retreat?") || "null";
        command = command.toUpperCase();
        switch (command) {
            case "ATTACK": battle(enemyArr[selectEnemy(enemyArr) - 1]);
                break;
            case "MISSILES":
                command = player.useMissiles(enemyArr[selectEnemy(enemyArr) - 1]);
                break;
            case "RETREAT": retreat();
                break;
            default: command = "NULL";
                console.log("Invalid Command");
        }
    } while (command === "NULL");
    return command;
}

// Retreat
function retreat() {
    console.log("You have retreated\nGAME OVER");
    return "run";
}

// Commands specifically for the boss
function bossFightCommands() {
    let command = "null";
    do {
        command = prompt("Attack, Missiles, Retreat?") || "null";
        command = command.toUpperCase();
        switch (command) {
            case "ATTACK":
                if (boss.pods >= 1) command = player.attack(podArr[0]);
                else player.attack(boss);
                if (boss.pods >= 1 && command === "ok") removePod();
                break;
            case "MISSILES":
                if (boss.pods >= 1) command = player.useMissiles(podArr[0]);
                else command = player.useMissiles(boss)
                console.log(`%cMega Ship HP: ${boss.hull}`, `color:red`);
                if (boss.pods >= 1) removePod();
                else command = "NULL";
                break;
            case "RETREAT": retreat();
                break;
            default: command = "NULL";
                console.log("Invalid Command");
        }
    } while (command === "NULL");
    return command;
}

// Remove a weapon pod
function removePod() {
    if (podArr[0].hull <= 0) podArr.shift();
    boss.pods--;
    console.log(`Weapon Pods Remaining: ${boss.pods}`);

}

// Set minimum health to 0
function damageCap(target) {
    if (target.hull < 0) {
        target.hull = 0;
    }
}

// Select who to target
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


// The battle when you choose to attack 
function battle(enemy) {
    console.clear();
    while (player.hull > 0 && enemy.hull > 0) {
        player.attack(enemy);
        if (enemy.hull <= 0) break;
        enemy.attack(player);
        if (Math.random(1) > 0.8) enemy.secondAttack(player);
    }
    repairShields();
}

// Generating Alien Ships
function generateShips(amount) {
    for (let i = 0; i < amount; i++) {
        enemyArr[i] = new Alien_Ship();
        enemyArr[i].name += " #" + Alien_Ship.id
        Alien_Ship.id++;
    }
}

// Shows HP and Firepower of ships
function showStats() {
    for (let i = 0; i < enemyArr.length; i++) {
        let line = "";
        if (enemyArr[i].hull === 0) {
            line = "text-decoration: line-through";
        }
        console.log(`%c${i + 1}.\n Enemy HP: ${enemyArr[i].hull}\n Enemy Fire Power: ${enemyArr[i].firePower}`, `color:red; ${line}`);
    }
    console.log(`%cUSS Assembly HP: ${player.hull}\nUSS Assembly Fire Power: ${player.firePower}`, `color:blue`);
}

// Repair player ship HP 
function repairShields() {
    const repair = randomInt(1, 5);
    player.hull += repair;
    console.log(`%cHull repaired by ${repair} HP`, `color: green`);
    if (player.hull > 20) {
        player.hull = 20;
    }
}

// The boss battle 
function bossFight(player, boss) {
    player.hull = 20;
    player.missles = 3;
    console.log(`%cThe ${boss.name} approaches`, `color:red`);
    for (let i = 0; i < 4; i++) {
        pod = new Weapon_Pod();
        podArr[i] = pod;
    }
    console.log(`%cThe ${boss.name} HP: ${boss.hull}\nWeapon Pods: ${boss.pods}`, `color:red`)
    console.log(`We have to destroy the weapon pods first if we want any hope in winning!!!!`);
    while (player.hull > 0 && boss.hull > 0) {
        if (bossFightCommands() === "RETREAT") return;
        let attack = Math.random(1);
        if (boss.hull >= 0) {
            if (boss.pods >= 1) {
                boss.multiHit(player);
                destroyed(player);
                if (checkGameOver()) return;
            }
            else if (attack <= .75) {
                boss.attack(player);
                if (checkGameOver()) return;
            }

        }
    }
    if (boss.hull <= 0) {
        console.log("%c----------------------Congratulations----------------------", "color:green");
    }
}

// Checks if ship is destroyed
function destroyed(target) {
    if (target.hull <= 0) {
        console.log(`%cThe ${target.name} is destroyed`, `color: firebrick`);
    }
}
//Checks the players health if its 0 
function checkGameOver() {
    if (player.hull <= 0) {
        console.log("%cGAME OVER", "color: red");
        return true;
    }
}

// Main function to start the game
function startGame() {
    for (let i = 0; i < enemyArr.length; i++) {
        console.log(`%c/////////////////////////////////////  Round ${i + 1}`, `color: green`); // Prints Round Number
        showStats();
        if (commands() === "RETREAT") return;
        if (checkGameOver()) return;
    }
    console.log("%c ---------------YOU WIN---------------", "color: green");
    bossFight(player, boss);
}


$('button').on("click", function () {
    player = new USS_Assembly(); // Player ship
    enemyArr = []; // Enemies
    generateShips(randomInt(5, 10)); //Generating enemy ships
    podArr = [];
    boss = new Mega_Ship();
    startGame(); // Starts the game
});





