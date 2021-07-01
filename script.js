"use strict"

const gameDuration = 30; // in seconds
const domgeSpeed = 1; // in seconds

const imgDomgeName = "domge.png";
const imgBonkName = "domge-bonk.png";

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
        $(`#domge-${domgeNo} img`).attr({
            src: "",
            class: ""
        });
    }, (domgeSpeed * 1000));
}

const showDomge = () => {
    var domgeNo = _randomNumberRange(1, 8);
    $(`#domge-${domgeNo} img`).attr({
        src: `assets/${imgDomgeName}`,
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
    startGame();
}

const stopGame = () => {
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

    runGame();
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
        console.log(gameMode);
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
        const $img = $this.find("img");

        if( !$img.hasClass("show") ) {
            return false;
        }

        $img.attr({
            src: `assets/${imgBonkName}`,
            class: "show bonk"
        });

        addScore();
        hideDomge($this.attr("id"));
    });
});