var GAME = null;
var STATUSBAR_ID = 'statusBar';
var PLAYGROUND_ID = 'playground';


function begin() {
    var wrapper = document.getElementById('wrapper');
    window.ondragstart = function() {return false};

    createMenu(wrapper);
}

/***********************************
    Game class
 ***********************************/
function Game(wrapper) {
    var playground = wrapper.childNodes[1];

    this.keyEventListener = this.keyListener.bind(this);    // just in case we want to remove this event listener
    window.addEventListener('keydown', this.keyEventListener, false);
    window.addEventListener('keyup', this.keyEventListener, false);
    playground.addEventListener('mousemove', this.mouseMoveListener.bind(this), false);
    playground.addEventListener('mousedown', this.mouseClickListener.bind(this), false);

    this.gameStateFlag = new GameStateFlag();
    this.playground = new Playground();
    this.sketcher = new Sketcher(wrapper);

    this.dungeon = null;
    this.player = null;
    this.enemies = null;
    this.props = null;
    this.statusBar = null;
    this.shop = null;
}

Game.prototype.start = 
        function() {
            // reset initial values
            this.dungeon = new Dungeon(difficulty);
            this.player = new Player(80, 10, hero);
            this.enemies = new Array();
            this.props = new Array();
            this.statusBar = new StatusBar(this);
            this.shop = new Shop(this);

            playground.style.transition = '';
            playground.style.filter = '';
            this.gameStateFlag.gameOverFlag = false;
            
            score = 0;

            this.newDungeon();
            this.sketcher.drawPlayer(this.player);

            this.gameStateFlag.startAll(this);
}

Game.prototype.newDungeon = 
        function() {
            this.dungeon.addRooms();
            this.sketcher.drawDungeon(this.dungeon);
            this.dungeon.rooms[0].generateRoom(this);
}

Game.prototype.pause =
        function() {
            if (controller.pause) {
                this.gameStateFlag.pauseAll();
                createMenu(wrapper);
            } else if (this.gameStateFlag.gameOverFlag === false) {
                if (this.player.skill_cooldownLeft > 0)
                    this.handleSkill();
                this.gameStateFlag.startAll(this);
                removeMenu();
            }
}

Game.prototype.gameOver =
        function() {
            this.gameStateFlag.gameOverFlag = true;
            this.gameStateFlag.pause('reposition');
            
            // slow down animations
            setTimeout( function(game) { 
                game.gameStateFlag.start('animate', game.animate.bind(game), ANIMATE_CLOCK * 1.8);

                // fade to grey    
                playground.style.transition = 'filter 1.0s';
                playground.style.filter = 'grayscale(2.0)';

                // pause the game
                controller.pause = true;
                setTimeout( function(game) { 
                    game.pause();
                }, 1000, game);

            }, 10, this);
            this.gameStateFlag.pause('animate');
            
            //send the current score to the server
            ajax_sendScore(this.dungeon.currentFloor);
}


Game.prototype.reposition =
        function () {
            var speedReduction = (this.player.attacking) ? 0.65 : 1;    // player has reduced speed while attacking
            var speed = this.player.speed * speedReduction;
            var counter = 0;
            // check if moving obliquely and if so, adjust speed accordingly using Pythagoras' constant
            for (var i = 0; i < 4; i++){
                switch (i) {
                    case 0:
                        counter += (controller.up) ? 1 : 0;
                    break;
                    case 1:
                        counter += (controller.left) ? 1 : 0;
                    break;
                    case 2:
                        counter += (controller.down) ? 1 : 0;
                    break;
                    case 3:
                        counter += (controller.right) ? 1 : 0;
                    break;
                }
                if (counter > 1) {
                    speed /= Math.sqrt(2);
                    break;
                }
            }
            // move and draw the player facing the correct direction
            var roomIndex = (this.dungeon.length + this.dungeon.nextRoom - 1) % this.dungeon.length;
            var currentRoom = this.dungeon.rooms[roomIndex];
            if (controller.up)
                this.player.move(0, speed, currentRoom);
            if (controller.left)
                this.player.move(-speed, 0, currentRoom);
            if (controller.down)
                this.player.move(0, -speed, currentRoom);
            if (controller.right)
                this.player.move(speed, 0, currentRoom);
            if (this.player.attacking === false)
                this.player.facingDirection = (crosshair.x < this.player.point.x) ? 'left' : 'right';
            this.sketcher.drawPlayer(this.player);
            // move and draw enemies
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i] != null) {
                    this.enemies[i].move();
                    this.sketcher.drawEnemy(this.enemies[i], this.enemies[i].index);
                }
            }
}

Game.prototype.animate = 
        function () {
            var date = new Date;

            // animate player
            if (this.player.currentAction === 'hit') {
                if (this.player.HP > 0) {
                    // hit animation
                    setTimeout( function(game){
                        game.player.currentAction = 'idle';
                    }, HIT_TIME, this);
                    // blinking animation:
                    if (this.player.blinking === false) {
                        var howManyBlinks = 2;
                        var blinking = setInterval( function(player){
                                            player.blinking = true;
                                            var playerNode = document.getElementById(PLAYER_ID);
                                            playerNode.setAttribute('class', 'medium character hidden');//makes player hidden
                                            setTimeout( function(playerNode){ 
                                                playerNode.setAttribute('class', 'medium character');   //makes player visible
                                            }, HIT_TIME / howManyBlinks, playerNode);
                                        }, HIT_TIME / howManyBlinks, this.player);
                        setTimeout( function(player){ //stops blinking
                            clearInterval(blinking);
                            player.blinking = false;
                        }, HIT_TIME, this.player);
                    }
                } else {
                    this.gameOver(); //GAME OVER!
                }
            } else {
                if (date.getTime() > this.player.attack_start + this.player.weapon.attackSpeed) {
                    this.player.attack_start = 0;
                    this.player.attacking = false;
                    this.sketcher.drawWeapon(this.player, PLAYER_ID);
                }
                if ( controller.up || controller.left || controller.down || controller.right) {
                    this.player.currentAction = 'run';
                } else {
                    this.player.currentAction = 'idle';
                }
            }
            this.sketcher.animatePlayer(this.player);
            this.sketcher.animateWeapon(this.player, PLAYER_ID);

            // update status bar
            this.sketcher.drawStatusBar(this);

            // animate enemies
            for (var i = 0; i < this.enemies.length; i++) {
                if (this.enemies[i] != null) {
                    var enemyId = ENEMY_ID + this.enemies[i].index;
                    var enemyNode = document.getElementById(enemyId);
                }
                if (enemyNode != null && this.enemies[i] != null) {
                    if (this.enemies[i].weapon != null) {
                        if (date.getTime() > this.enemies[i].attack_start + this.enemies[i].weapon.attackSpeed) {
                            this.enemies[i].attack_start = 0;
                            this.enemies[i].attacking = false;
                            this.sketcher.drawWeapon(this.enemies[i], enemyId);
                        }
                        if (this.enemies[i].weapon.name !== undefined)
                            this.sketcher.animateWeapon(this.enemies[i], enemyId);
                    }
                    this.sketcher.animateEnemy(this.enemies[i], this.enemies[i].index);
                }
            }
            
            // animate props (NB: NPCs such as the merchant are also considered props)
            for (var i = 0; i < this.props.length; i++) {
                this.sketcher.animateProp(this.props[i]);
            }
}

Game.prototype.interact = 
        function () {
            var roomIndex = (this.dungeon.length + this.dungeon.nextRoom - 1) % this.dungeon.length;
            var currentRoom = this.dungeon.rooms[roomIndex];
            var nextRoom = this.dungeon.rooms[this.dungeon.nextRoom];

            /**************************************
             * CHECK DOOR INTERACTION
             **************************************/
            if (currentRoom.isOpen){
                var doorNode = document.getElementById(ROOM_ID + roomIndex + DOOR_ID);
                
                if (nextRoom.index === 0)   // if we defeat the boss, we open a portal
                    doorNode.style.backgroundImage = "url('./css/img/dungeon/doors_leaf_open.png'), url('./css/img/portalBackground.gif')";
                
                if (currentRoom.isDoorFocused) {                
                    var distance = MathUtil.distance(currentRoom.doorPoint, this.player.point);
                    var range = (pixelsPerTile * 2.5);
                    
                    if (distance < range) { //visual indicator of interactability
                        doorNode.style.filter = 'brightness(1.35)';
                        doorNode.style.outline = 'calc( ' + pixelSize + '/ 2 ) solid white';

                        if (controller.interact) {  //transition to next room
                            currentRoom.isOpen = false;
                            doorNode.style.backgroundImage = "url('./css/img/dungeon/doors_leaf_open.png')";
                            this.sketcher.drawDungeon(this.dungeon);
                            // make repositioning smoother
                            this.gameStateFlag.pause('reposition');
                            document.getElementById(PLAYER_ID).style.transition = 'bottom ' + ROOM_TRANSITION_TIME + 's, left ' + ROOM_TRANSITION_TIME + 's';
                            this.player.point.x = 80;
                            this.player.point.y = 10;
                            this.sketcher.drawPlayer(this.player);
                            setTimeout(function(game){
                                if (controller.pause === false)
                                    game.gameStateFlag.start('reposition', game.reposition.bind(game), REPOSITION_CLOCK);
                                document.getElementById(PLAYER_ID).style.transition = '';
                            }, ROOM_TRANSITION_TIME * 1000, this);
                            // empty props array and generate next room
                            setTimeout(function(game){
                                game.props.splice(0, game.props.length);
                                nextRoom.generateRoom(game);
                            }, ROOM_TRANSITION_TIME * 100, this);
                        }
                            
                    } else {
                        doorNode.style.filter = '';
                        doorNode.style.outline = '';
                    }
                }
            }

            /**************************************
             * PROPS INTERACTIONS
             **************************************/
            for (var i = 0; i < this.props.length; i++) {
                var propNode = document.getElementById(this.props[i].name + '_' + this.props[i].index);
                var distance = MathUtil.distance(this.props[i].point, this.player.point);
                var range =  (pixelsPerTile * 2.00);
                
                if (this.props[i].isFocused && this.props[i].isActivated === false 
                    && distance < range) {                    
                    propNode.style.filter = 'brightness(1.35)';    //visual indicator of interactability                
                    if (controller.interact) {
                        switch (this.props[i].name) {
                            case 'merchant':
                                this.props[i].isActivated = true;
                                this.sketcher.drawShop(this);
                            break;
                            case 'fountain_blue':
                                this.props[i].isActivated = true;
                                if (this.player.HP < this.player.maxHP / 2)
                                    this.player.HP = this.player.maxHP / 2;
                            break;
                        }
                    }
                } else {
                    propNode.style.filter = '';
                }
                if (this.props[i].name === 'merchant' && this.props[i].isActivated && distance >= range) {
                    this.props[i].isActivated = false;
                    this.sketcher.removeShop();
                }
            }

}

Game.prototype.handleSkill = 
        function() {
            if (this.gameStateFlag.skillTimer === null)
                this.gameStateFlag.start('skill', this.skillHandler.bind(this), SKILL_CLOCK);
}

Game.prototype.skillHandler =
        function (){
            var durationLeft = this.player.skill_duration - SKILL_CLOCK;
            var cooldownLeft = this.player.skill_cooldownLeft - SKILL_CLOCK;

            this.player.skill_duration = (durationLeft > 0) ? durationLeft : 0;
            this.player.skill_cooldownLeft = (cooldownLeft > 0) ? cooldownLeft : 0;

            if (this.player.skill_duration <= 0) {
                this.player.skill_duration = 0;
                this.player.disableSkill(this.player.baseSpeed);
            }
            if (this.player.skill_cooldownLeft <= 0) {
                controller.skill = false;
                this.gameStateFlag.pause('skill');
            }
}

Game.prototype.drinkPotion =
        function() {
            if (this.player.potions > 0  &&  this.player.HP != this.player.maxHP) {
                this.player.potions--;
                var healedHP = this.player.HP + HP_PER_HEART;  
                this.player.HP = (healedHP > this.player.maxHP) ? this.player.maxHP : healedHP;
            }
}

// EVENT HANDLERS
Game.prototype.keyListener = 
        function(evt) {
            evt = (!evt) ? window.event : evt;  // IE -> !evt
            var key_state = (evt.type == 'keydown') ? true : false; // detects if we are pressing or releasing a key
            var key_code = evt.which || evt.keyCode || evt.charCode;// cross-browser solution
            switch(key_code) {
                case 87: // W = up
                    controller.up = key_state;
                    if (controller.down)
                        controller.down = undefined;
                    if (key_state === false && controller.down === undefined)
                        controller.down = true;
                break; 
                case 65: // A = left
                    controller.left = key_state;
                    if (controller.right)
                        controller.right = undefined;
                    if (key_state === false && controller.right === undefined)
                        controller.right = true;
                break;
                case 83: // S = down
                    controller.down = key_state;
                    if (controller.up)
                        controller.up = undefined;
                    if (key_state === false && controller.up === undefined)
                        controller.up = true;                    
                break;
                case 68: // D = right
                    controller.right = key_state;
                    if (controller.left)
                        controller.left = undefined;
                    if (key_state === false && controller.left === undefined)
                        controller.left = true;
                break;
                case 69: // E = interact
                    controller.interact = key_state;
                break;
                case 16: // Shift = skill
                    if (key_state && controller.skill === false) {
                        controller.skill = true;
                        this.player.activateSkill(this);
                    }
                break;
                case 80: // P = pause
                    if (this.gameStateFlag.gameOverFlag)
                        break;
                    if (key_state) {
                        controller.pause = (controller.pause === false) ? true : false;
                        this.pause();
                    }
                break;
                case 81: // Q = potion
                    if (key_state)
                        this.drinkPotion();
                break;
            }
}

Game.prototype.mouseMoveListener =
        function(evt) {
            evt = (!evt) ? window.event : evt;  // IE -> !evt
            var rect = playground.getBoundingClientRect();  //in-game coordinates are bounded to the playground
            var offsetLeft = rect.left;
            var offsetTop = rect.bottom;
            crosshair.x = (evt.clientX - offsetLeft) * this.playground.width / rect.width;
            crosshair.y = (offsetTop - evt.clientY) * this.playground.height / rect.height;
}

Game.prototype.mouseClickListener =
        function() {
            if (this.player.attacking === false 
            && this.player.currentAction != 'hit') {
                this.player.attacking = true;
                if (this.player.attack_start === 0) {
                    var date = new Date;
                    this.player.attack_start = date.getTime();

                    var backswingDelay = this.player.weapon.attackSpeed / BACKSWING[this.player.weapon.type];
                    setTimeout(function(game){
                        if (controller.pause)
                            game.player.attacking = true;
                        for (var i = game.enemies.length - 1; i >= 0 ; i--) {
                            var hit = null;
                            hit = game.player.hero.checkHitbox(game.player, game.enemies[i]);
                            if (hit) {
                                game.enemies[i].harm(game, i);
                            }
                        }
                    }, backswingDelay , this);
                 
                }
        }
}