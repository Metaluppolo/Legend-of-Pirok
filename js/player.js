/***********************************
    Player class
 ***********************************/
function Player(x, y, hero) {
    this.point = new Point(x,y);
    this.radius = M_SIZE;
    this.coins = 0;
    this.potions = (difficulty > 0) ? 1 : 2;
    // stats:
    this.hero = heroes[hero];
    this.weapon = this.hero.weapon;
    this.maxHP = 100;
    this.baseSpeed = 1;   // this.baseSpeed is used as backup variable when this.speed is modified by any effect
    this.HP = this.maxHP;
    this.speed = this.baseSpeed;        
    // aniimation:
    this.frames = [];
    this.nextFrame = 0;
    this.actions = { 'hit': 0,
                    'idle': 1,
                    'run': 5};
    this.currentAction = 'idle';
    this.facingDirection = 'right';
    this.blinking = false;
    // attack:
    this.attacking = false;
    this.attack_start = 0;
    // skill:
    this.skill_duration = 1000;
    this.skill_cooldown = 1000;
    this.skill_cooldownLeft = 0;
}

Player.prototype.move = 
        function(x, y, room) {
            if (room.index === 0  &&  this.point.y + y > 0.67 * room.height * pixelsPerTile - this.radius/2  
                                  &&  this.point.x + x < 0.32 * room.width  * pixelsPerTile + this.radius/2 ) {
                //shop collision//
            } else if ((this.point.x + x < room.width * pixelsPerTile - this.radius/2) && (this.point.x + x > this.radius/2) &&
                (this.point.y + y < room.height * pixelsPerTile - pixelsPerTile/2 - this.radius) && (this.point.y + y > this.radius/2) ) {
                    this.point.x += x;
                    this.point.y += y;
            }
}

Player.prototype.setAnimationFrames =
        function() {
            var action = 'hit';
            var nframe = 0;
            for (var i = 0; i < 9; i++) {
                if(i > 0 && i <= 4) {
                    action = 'idle';
                    nframe = i - 1;
                } else if (i > 4) {
                    action = 'run';
                    nframe = i - 5;
                }
                var frameName = action + '_anim_f' + nframe;
                this.frames[i] = frameName;
                // preload frames image to avoid flickering
                var imgPath = this.hero.name + '/' + frameName;
                preloadImage(imgPath);
            }
}

Player.prototype.activateSkill =
        function(game) {
            switch (this.hero.skill) {
                case 'charge':
                    this.charge(game);
                break;
                // OTHER HEROES WILL HAVE DIFFERENT SKILLS
            }
}
Player.prototype.disableSkill =
        function() {
            switch (this.hero.skill) {
                case 'charge':
                    this.stopCharge();
                break;
            }
}

Player.prototype.charge =
        function(game) {
            if (this.skill_cooldownLeft > 0)
                return;
            var up = controller.up;
            var left = controller.left;
            var down = controller.down;
            var right = controller.right;
            if ( (up || left || down || right) === false ) {
                controller.skill = false;
                return;
            }

            var CHARGE_TIME = 250;
            var CHARGE_COOLDOWN = 3000;
            this.skill_duration = CHARGE_TIME;
            this.skill_cooldown = CHARGE_COOLDOWN;
            this.skill_cooldownLeft = CHARGE_COOLDOWN;

            game.handleSkill();
            game.mouseClickListener();
            this.speed = 5.00;
}
Player.prototype.stopCharge = 
        function() {
            this.speed = this.baseSpeed;
}

