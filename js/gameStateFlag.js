/***********************************
    Timing constants
 ***********************************/
var REPOSITION_CLOCK = 15;
var ANIMATE_CLOCK = 100;
var INTERACT_CLOCK = 25;
var SKILL_CLOCK = 25;

var ROOM_TRANSITION_TIME = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--room-transition-time'));
var HIT_TIME = 150;

/***********************************
    Game variables
 ***********************************/
var hero = 'knight_m';
var difficulty = 1;
var score = 0;

/***********************************
    Game controls
 ***********************************/
var crosshair = new Point(PLAYGROUND_WIDTH, PLAYGROUND_HEIGHT);
var controller = {
    up: false,
    left: false,
    down: false,
    right: false,
    interact: false,
    skill: false,
    pause: false,
};

/***********************************
    GameStateFlag class
 ***********************************/
function GameStateFlag() {
    this.repositionTimer = null;
    this.animateTimer = null;
    this.interactTimer = null;
    this.skillTimer = null;

    this.gameOverFlag = false;
}

GameStateFlag.prototype.start =
        function(functionName, clockFunction, clock_interval) {
            if (this[functionName + 'Timer'] === null)
                this[functionName + 'Timer'] = setInterval(clockFunction, clock_interval);
}

GameStateFlag.prototype.startAll =
        function(game) {
            this.start('reposition', game.reposition.bind(game), REPOSITION_CLOCK);
            this.start('animate', game.animate.bind(game), ANIMATE_CLOCK);
            this.start('interact', game.interact.bind(game), INTERACT_CLOCK);
}

GameStateFlag.prototype.pause =
        function(functionName) {
            clearInterval(this[functionName + 'Timer']);
            this[functionName + 'Timer'] = null;
}

GameStateFlag.prototype.pauseAll =
        function() {
            this.pause('reposition');
            this.pause('animate');
            this.pause('interact');
            this.pause('skill');
}