"use strict";

//tit for tat sometimes returns undefined, definitely look into this, also the speed problem. Also delete this comment ASAP.
class Organism {
    constructor(species) {
        this.species = species;
        this.strategy = this.species.strategy;
        this.history = [];
    }

    engage(rival) {
        const TURNS = Math.random()*10;
        for (let i=0; i<TURNS; i++) {
            this.interact(rival);
        }
    }

    interact(rival) {
        this.action = this.strategy(this.history, rival.history);
        this.blunder();
        this.updateHistory();
        if(this.history.length>rival.history.length) {rival.interact(this)};
    }

    blunder() {
        const CHANCE_OF_MISTAKE = .05;
        this.action = probability(1-CHANCE_OF_MISTAKE) ? this.action : !this.action;
    }

    updateHistory() {
        this.history.push(this.action);
    }

    struggle(populations) {
        let score = 0;
        for (let i=0; i<this.species.population; i++) {
            for (let species in populations) {
                const rival = new Organism(populations[species]);
                this.engage(rival);
                score += getRoundPayoff(this, rival);
            }
        }
        return score;
    }
}

class Species {
    constructor(strategy, population) {
        this.strategy = strategy;
        this.population = population;
    }

    growPopulation() {
        this.population *= 2;
    }

    declinePopulation() {
        this.population = Math.floor(this.population / 2);
    }

}

function init() {
    const POPULATIONS = {
        //titForTat: new Species((history, enemyHistory) => {return history.length===0 ? true : enemyHistory[enemyHistory.length-1]}, 10),
        alwaysCooperate: new Species(()=>true, 10),
        neverCooperate: new Species(()=>false, 10),
        holdGrudge: new Species((history, enemyHistory)=>history.length === 0 ? true : !enemyHistory.some(action => !action), 10),
        titForDoubleTat: new Species((history, enemyHistory)=> history.length === 0 ? true : enemyHistory[enemyHistory.length-1] || enemyHistory[enemyHistory.length-2], 10),
        titForTripleTat: new Species((history, enemyHistory)=> history.length === 0 ? true : enemyHistory[enemyHistory.length-1] || enemyHistory[enemyHistory.length-2] || enemyHistory[enemyHistory.length-3], 10),
        karmaIsABitch: new Species((history, enemyHistory) => history.length === 0 ? true : probability(enemyHistory.filter(action=>action).length/enemyHistory.length), 10),
        tatForTit: new Species((history, enemyHistory) => history.length===0 ? true : !enemyHistory[enemyHistory.length-1], 10),
        random: new Species(()=>probability(0.5), 10)
    }

    const ECOSYSTEM = {
        populations: POPULATIONS,

        evolve() {
            for (let generation=1; generation<101; generation++) {
                console.log(`\nGeneration ${generation}\n`);
                this.printStatus();
                const OUTCOME = getOutcome(this.compete());
                this.populations[OUTCOME.winner].growPopulation();
                this.populations[OUTCOME.loser].declinePopulation();
            }
        },

        compete() {
            const RESULTS = {};
            for (let species in this.populations) {
                const organism = new Organism(this.populations[species]);
                console.log(organism);
                console.log(`SPECIES STRATEGY: ${organism.species.strategy}`)
                RESULTS[species] = organism.struggle(this.populations);
            }
            return RESULTS;
        },

        printStatus() {
            for (let species in this.populations) {
                console.log(`${species}: ${this.populations[species].population}`);
            }
        }
    }

    return ECOSYSTEM.evolve();
}

function getOutcome(results) {
    const winner = getWinner(results);
    const loser = getLoser(results);
    return {winner, loser};
}

function getWinner(results) {
    let winner = Object.keys(results)[0];
    let highestScore = results[Object.keys(results)[0]];;
    for (let result in results) {
        if (results[result]>highestScore) {
            highestScore = results[result];
            winner = result;
        }
    }
    return winner;
}

function getLoser(results) {
    let loser = Object.keys(results)[0];
    let lowestScore = results[Object.keys(results)[0]];
    for (let result in results) {
        if (results[result]<lowestScore && results[result]!==0) {
            lowestScore = results[result];
            loser = result;
        }
    }
    return loser;
}

function getRoundPayoff(organism, rival) {
    const PAYOFFS = {cheat:10, cheated:-10, cooperate:5, compete:-5};
    const {cooperate, cheat, cheated, compete} = PAYOFFS;
    if (organism.action && rival.action) {
        return cooperate;
    } else if (organism.action && !rival.action) {
        return cheated;
    } else if (!organism.action && rival.action) {
        return cheat;
    } else if (!organism.action && !rival.action) {
        return compete;
    }
}


function probability(chance) {
    return Math.random()<chance;
}


console.log(init());