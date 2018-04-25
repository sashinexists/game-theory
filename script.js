"use strict";

function init(strategy1, strategy2) {
    const strategies = {
        titForTat: function(history, enemyHistory) {
                if(history.length===0){return true} 
                return enemyHistory[enemyHistory.length-1]
            },
        alwaysCooperate: function() {return true},
        alwaysAggress: function() {return false},
        holdGrudge: function(history, enemyHistory) {
            if(history.length===0) {
                return true;
            }
            return enemyHistory.every(function(action){
                return action;
            });
        },
        random: function() {return !Math.round(Math.random())}
    }
    //Vs Random
    /*
    for (var strategy in strategies) {
        console.log(strategy+": "+play(strategies[strategy], strategies["random"])[0]);
    }*/
    for (var player in strategies) {
        let score = 0;
        for (var rival in strategies) {
            score+= play(strategies[player], strategies[rival])[0];
        }
        console.log(player+": "+score);
    }
    //return play(strategies[strategy1], strategies[strategy2]);
    return "There you go...";
}

function play(strategy1, strategy2) {
    const history1 = [];
    const history2 = [];
    const turns = 1000; //change this to Math.random()*100
    let score1 = 0;
    let score2 = 0;
    const cheat = 10;
    const cheated = -5;
    const cooperate = 5;
    const compete = 0;
    for (var i = 0; i<turns; i++) {
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

init();