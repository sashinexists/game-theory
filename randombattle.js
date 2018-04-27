"use strict";

function init(strategy1, strategy2) {
    const strategies = {
        /*titForTat: function(history, enemyHistory) { 
            return history.length===0 ? true : enemyHistory[enemyHistory.length-1];
            },*/
        //alwaysCooperate: function() {return true},
        //neverCooperate: function() {return false},
        /*holdGrudge: function(history, enemyHistory) {
            return history.length === 0 ? true : !enemyHistory.some(function(action){return !action});
        },*/
        //random: function() {return !!Math.round(Math.random())},
        probability0: function() {return probability(0)},
        probability10: function() {return probability(0.1)},
        probability20: function() {return probability(0.2)},
        probability30: function() {return probability(0.3)},
        probability40: function() {return probability(0.4)},
        probability50: function() {return probability(0.5)},
        probability60: function() {return probability(0.6)},
        probability70: function() {return probability(0.7)},
        probability80: function() {return probability(0.8)},
        probability90: function() {return probability(0.9)},
        probability100: function() {return probability(1)}
    }

    //console.log("Against a random strategy, the best strategy is "+vsRandom(strategies));
    //console.log("Against the population, the best strategy is "+vsPopulation(strategies));
    
    /*
    */
    //return play(strategies[strategy1], strategies[strategy2]);
    return vsPopulation(strategies);
}

function probability(chance) {
    return Math.random()<chance;
}

function vsRandom(strategies) {
    let highestScore = 0;
    let bestStrategy;
    for (var strategy in strategies) {
        let score = play(strategies[strategy], strategies["random"])[0];
        console.log(strategy+": "+score);
        bestStrategy = score > highestScore ? strategy : bestStrategy;
        highestScore = bestStrategy === strategy ? score : highestScore; 
    }
    return bestStrategy;
}

function vsPopulation(strategies) {
    let highestScore = 0;
    let bestStrategy;
    for (var player in strategies) {
        let score = 0;
        for (let rival in strategies) {
            score+= play(strategies[player], strategies[rival])[0];
        }
        console.log(player+": "+score);
        bestStrategy = score > highestScore ? player : bestStrategy;
        highestScore = bestStrategy === player ? score : highestScore;
    }
    return bestStrategy;
}

function compareProbabilities(strategies) {
    const history1 = [];
    const history2 = [];
    const chances = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1];
    const turns = 100; //change this to Math.random()*1000
    let score1 = 0;
    let score2 = 0;
    const cheat = 3;
    const cheated = 0;
    const cooperate = 2;
    const compete = 1;
    chances.forEach(function(chance1) {
        chances.forEach(function(chance2) {
            for (let i = 0; i<turns; i++) {
                let action1 = strategies.probability(chance1);
                let action2 = strategies.probability(chance2);
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
            }
        });
        console.log("Score of probability "+chance1+" is "+score1);
        score1 = 0;
        score2 = 0;
    });
}

function play(strategy1, strategy2) {
    const history1 = [];
    const history2 = [];
    const turns = 20; //change this to Math.random()*1000
    let score1 = 0;
    let score2 = 0;
    const cheat = 3;
    const cheated = 0;
    const cooperate = 2;
    const compete = 1;
    for (let i = 0; i<turns; i++) {
        let action1 = strategy1(history1, history2);
        let action2 = strategy2(history2, history1);
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

console.log(init());