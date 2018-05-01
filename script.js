class Organism {
    constructor(strategy, size) {
        this.strategy = strategy;
        this.size = size;
    }
}

function init(strategy1, strategy2) {
    const populations = {
        titForTat: new Organism((history, enemyHistory) => {return history.length===0 ? true : enemyHistory[enemyHistory.length-1]}, 10),
        alwaysCooperate: new Organism(()=>true, 10),
        //neverCooperate: new Organism(()=>false, 10),
        holdGrudge: new Organism((history, enemyHistory)=>history.length === 0 ? true : !enemyHistory.some(action => !action), 10),
        titForDoubleTat: new Organism((history, enemyHistory)=> history.length === 0 ? true : enemyHistory[enemyHistory.length-1] || enemyHistory[enemyHistory.length-2], 10),
        //titForTripleTat: new Organism((history, enemyHistory)=> history.length === 0 ? true : enemyHistory[enemyHistory.length-1] || enemyHistory[enemyHistory.length-2] || enemyHistory[enemyHistory.length-3], 10),
        karmaIsABitch: new Organism((history, enemyHistory) => history.length === 0 ? true : probability(enemyHistory.filter(action=>action).length/enemyHistory.length), 10),
        tatForTit: new Organism((history, enemyHistory) => {return history.length===0 ? true : !enemyHistory[enemyHistory.length-1]}, 10),
        random: new Organism(()=>!!Math.round(Math.random()), 10),
        //tenPercent: new Organism(()=>probability(0.1), 10)
    }

    //console.log("Against a random strategy, the best strategy is "+vsRandom(populations));
    console.log(`Against the population, the best strategy is ${vsPopulation(populations)}`);
    
    return "There you go...";
}

function bestBet(history, enemyHistory) {

}

function vsRandom(populations) {
    let highestScore = 0;
    let bestStrategy;
    for (var population in populations) {
        let {strategy, size} = populations[population];
        let score = 0;
        for (let i = 0; i<size; i++) {
            score += play(strategy, populations["random"].strategy)[0];           
        }
        console.log(population+": "+score);
        bestStrategy = score > highestScore ? population : bestStrategy;
        highestScore = bestStrategy === population ? score : highestScore; 
    }
    return bestStrategy;
}

function vsPopulation(populations) {
    let highestScore = 0;
    let bestStrategy;
    for (var player in populations) {
        let score = 0;
        let {size} = populations[player];
        for (let i = 0; i<size; i++) {
            for (let rival in populations) {
                let rivalSize = populations[rival].size;
                for (let j = 0; j<rivalSize; j++) {
                    score+= play(populations[player].strategy, populations[rival].strategy)[0];
                }
            }
        }
        console.log(`${player}: ${score}`);
        bestStrategy = score > highestScore ? player : bestStrategy;
        highestScore = bestStrategy === player ? score : highestScore;
    }
    return bestStrategy;
}


function play(strategy1, strategy2) {
    const history1 = [];
    const history2 = [];
    const turns = Math.random()*100;
    let score1 = 0;
    let score2 = 0;
    const cheat = 10;
    const cheated = -10;
    const cooperate = 5;
    const compete = -5;
    for (var i = 0; i<turns; i++) {
        let action1 = strategy1(history1, history2);
        let action2 = strategy2(history2, history1);
        action1 = probability(.95)?action1:!action1;
        action2 = probability(.95)?action2:!action2;
        history1.push(action1);
        history2.push(action2);
        if(action1&&action2) {
            score1 +=cooperate;
            score2 +=cooperate;
        } else if(!action1&&!action2) {
            score1 +=compete;
            score2 +=compete;
        } else if(action1&&!action2) {
            score1 += cheated;
            score2 += cheat;
        } else if(!action1&&action2) {
            score1 += cheat;
            score2 += cheated;
        }
        //console.log(action1);
    }
    return [score1, score2];
}

function probability(chance) {
    return Math.random()<chance;
}


init();