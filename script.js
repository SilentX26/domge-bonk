"use strict"

const gameDuration = 30; // in seconds
const domgeSpeed = 1; // in seconds

const imgDomgeName = "domge.png";
const imgBonkName = "domge-bonk.png";

const backsound = new Audio('assets/backsound.mp3');
const sfxBonk = new Audio('assets/sfx-bonk.mp3');

const $gameTimer = $("#timer");
const $gameScore = $("#score");
const $gameController = $(".controller i");

var currentDuration = gameDuration;
var intervalGame = null;
var intervalDomge = null;

const _randomNumberRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min; 
}

const addScore = () => {
    var _currentScore = parseInt( $gameScore.html() );
    _currentScore++;

    $gameScore.html(_currentScore);
}

const hideDomge = (domgeNo) => {
    setTimeout(() => {
        $(`#domge-${domgeNo} div`).attr({
            style: "",
            class: ""
        });
    }, (domgeSpeed * 1000));
}

const showDomge = () => {
    var domgeNo = _randomNumberRange(1, 8);
    $(`#domge-${domgeNo} div`).attr({
        style: `background-image: url('assets/${imgDomgeName}');`,
        class: "show"
    });

    hideDomge(domgeNo);
}

const setGameController = (mode) => {
    var _icon = (mode == "stop") ? "play" : "pause";

    $gameController.attr("class", `fas fa-${_icon}-circle fa-2x`);
    $gameController.attr("title", _icon);
}

const resetGame = () => {
    $gameScore.html('0');
    $gameTimer.html(gameDuration);
    currentDuration = gameDuration;
    backsound.currentTime = 0;
    startGame();
}

const stopGame = () => {
    backsound.pause();
    clearInterval(intervalGame);
    clearInterval(intervalDomge);
    setGameController("stop");
    $("body").removeClass("is-play");
}

const runGame = () => {
    if(currentDuration <= 0) {
        stopGame();
    }
    
    $gameTimer.html(currentDuration);
    currentDuration--;
}

const startGame = () => {
    $("body").addClass("is-play");
    setGameController("play");
    backsound.play();
    
    intervalGame = setInterval(runGame, 1000);
    intervalDomge = setInterval(showDomge, (domgeSpeed * 1000));
}

const getGameMode = () => {
    if( parseInt($gameTimer.html()) <= 0 ) {
        return 'reset';
    } else if( $gameController.attr("title") == "play" || $gameController.attr("title") == "resume"  ) {
        return 'start';
    } else if( $gameController.attr("title")  == "pause" ) {
        return 'stop';
    } else {
        return false;
    }
}

const prepareGame = () => {
    $gameTimer.html(gameDuration);
}

$( function() {
    prepareGame();

    $gameController.click( function() {
        var gameMode = getGameMode();
        switch(gameMode) {
            case 'start':
                startGame();
                break;
            case 'stop':
                stopGame();
                break;
            case 'reset':
                resetGame();
                break;

            default:
                return false;
        }
    });

    $(document).on("click", ".domge", function() {
        const $this = $(this);
        const $div = $this.find("div");

        if( !$div.hasClass("show") ) {
            return false;
        }

        
        $div.attr({
            style: `background-image: url('assets/${imgBonkName}');`,
            class: "show bonk"
        });

        // if(sfxBonk.paused) {
            sfxBonk.currentTime = 4;
            sfxBonk.play();
        // }

        addScore();
        hideDomge($this.attr("id"));
    });
});