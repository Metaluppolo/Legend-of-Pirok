enemies = {//       ||  race  ||  type  ||  size || weapon || HP || speed || bounty ||
    //orcs
    'orc/masked'    : ['orc',   'masked',  M_SIZE, 'cleaver', 100,  0.500,  3],
    'orc/goblin'    : ['orc',   'goblin',  S_SIZE,   'knife',  40,  0.750,  1],
    'orc/ogre'      : ['orc',     'ogre', XL_SIZE,   'baton', 500,  0.300,  12],

    //demons
    'demon/chort'   : ['demon',  'chort',  M_SIZE,   'fangs', 150,  0.500,  5],
    'demon/imp'     : ['demon',   'imp',   S_SIZE,'impClaws',  40,  0.700,  1],
    'demon/bigDemon': ['demon', 'bigDemon', XXL_SIZE, 'bigFangs', 700,  0.680,  15],
    
}

/***********************************
    Enemy class
 ***********************************/
function Enemy(game, index, x, y, enemyType) {
    this.index = index;
    // position:
    this.point = new Point(x,y);
    this.radius = enemies[enemyType][2];
    this.target = game.player;
    // stats:
    this.race = enemies[enemyType][0];
    this.type = enemies[enemyType][1];
    this.weapon = weapons[ enemies[enemyType][3] ];
    this.HP = enemies[enemyType][4];
    this.speed = enemies[enemyType][5];
    this.bounty = enemies[enemyType][6];
    // animations:
    this.frames = [];
    this.nextFrame = 0;
    this.actions = {'idle': 0,
                    'run': 4};
    this.currentAction = 'idle';
    this.facingDirection = 'right';
    // attack:
    this.attacking = false;
    this.attack_start = 0;
}

Enemy.prototype.setAnimationFrames =
        function() {
            var action = '';
            var nframe = null;
            for (var i = 0; i < 8; i++) {
                if (i > 3) {
                    action = 'run';
                    nframe = i - 4;
                } else {
                    action = 'idle';
                    nframe = i;
                }
                var frameName = action + '_anim_f' + nframe;
                this.frames[i] = frameName;
                // preload frames image to avoid flickering
                var imgPath = 'enemies/' + this.race + '/' + this.type + '/' + frameName;
                preloadImage(imgPath);
            }
}

Enemy.prototype.move =
        function() {
            switch(this.type){
                case 'masked':
                    this.movesetMasked();
                break;
                case 'goblin':
                    this.movesetGoblin();
                break;
                case 'ogre':
                    this.movesetOgre();
                break;
                case 'chort':
                    this.movesetChort();
                break;
                case 'imp':
                    this.movesetImp();
                break;
                case 'bigDemon':
                    this.movesetBigDemon();
                break;
                default: 
                    this.movesetGoblin();
                break;
            }
}

Enemy.prototype.movesetMasked =
        function() {
            var radii = this.radius + this.target.radius;
            var distance = MathUtil.distance(this.point, this.target.point);
            var focusRange = radii + pixelsPerTile * 4;
            var speed = this.speed;

            // charging
            if (distance < focusRange / 1.85) 
                speed += 0.120;
            // he gets angrier
            if (this.HP < 50)
                speed += 0.080;
            else if (this.HP < 100)
                speed += 0.040;

            this.moveset(radii, focusRange, speed);
}

Enemy.prototype.movesetGoblin =
        function() {
            var radii = this.radius + this.target.radius;
            var focusRange = radii + pixelsPerTile * 5;

            this.moveset(radii, focusRange);

            // goblins will try to surround the player
            var distance = MathUtil.distance(this.point, this.target.point);
            var speed = this.speed;
            if (distance <= radii) {
                if (this.index % 3 === 0) {
                    if (this.point.x - speed > this.target.point.x - radii)
                        this.point.x -= speed;
                } else if (this.point.x + speed < this.target.point.x + radii)
                        this.point.x += speed;
            }
}

Enemy.prototype.movesetOgre =
        function() {
            var radii = this.radius + this.target.radius;
            var distance = MathUtil.distance(this.point, this.target.point);
            var focusRange = radii + pixelsPerTile * 6;
            var speed = this.speed;

            this.HP = (this.HP < 250) ? this.HP + 0.2 : this.HP;
            if (this.HP < 120)
                this.weapon.attackSpeed = 720;
            if (distance > focusRange * 0.4 && distance < focusRange)
                speed *= 1.5;
            this.moveset(radii, focusRange, speed);
}

Enemy.prototype.movesetChort =
        function() {
            var radii = (this.radius + this.target.radius) * 0.75;
            var distance = MathUtil.distance(this.point, this.target.point);
            var focusRange = radii + pixelsPerTile * 5;
            var speed = this.speed;

            if (distance < focusRange / 1.5)
                speed *= 1.5;
            this.moveset(radii, focusRange, speed);

            // chorts will try to surround the player
            if (distance <= radii) {
                if (this.index % 2 === 0) {
                    if (this.point.x - speed > this.target.point.x - radii)
                        this.point.x -= speed;
                } else if (this.point.x + speed < this.target.point.x + radii)
                        this.point.x += speed;
            }
}

Enemy.prototype.movesetImp =
        function() {
            var radii = (this.radius + this.target.radius) * 0.5;
            var focusRange = radii + pixelsPerTile * 5;

            this.moveset(radii, focusRange);

            // imps will try to surround the player
            var distance = MathUtil.distance(this.point, this.target.point);
            var speed = this.speed;
            if (distance <= radii) {
                if (this.index % 3 === 0) {
                    if (this.point.x - speed > this.target.point.x - radii)
                        this.point.x -= speed;
                } else if (this.point.x + speed < this.target.point.x + radii)
                        this.point.x += speed;
            }
}

Enemy.prototype.movesetBigDemon =
        function() {
            var radii = (this.radius + this.target.radius) * 0.85;
            var distance = MathUtil.distance(this.point, this.target.point);
            var focusRange = radii + pixelsPerTile * 6;
            var speed = this.speed;

            // charging
            if (distance < focusRange / 1.85) 
                speed += 0.120;
            // he gets angrier
            if (this.HP < 150)
                speed += 0.080;
            else if (this.HP < 300)
                speed += 0.040;

            this.moveset(radii, focusRange, speed);
}

Enemy.prototype.moveset = 
        function(radii, focusRange, speed) {
            speed = (speed) ? speed : this.speed;
            var distance = MathUtil.distance(this.point, this.target.point);
            var range = this.target.radius + this.weapon.attackRange;
            // moving pattern:
            if (distance < focusRange){
                this.currentAction = 'idle';

                if (this.point.x > this.target.point.x) {
                    this.facingDirection = 'left';
                    if (this.point.x > this.target.point.x + radii) {
                        this.currentAction = 'run';
                        this.point.x -= speed;
                    }
                } else if (this.point.x < this.target.point.x) {
                    this.facingDirection = 'right';
                    if (this.point.x < this.target.point.x - radii) {
                        this.currentAction = 'run';
                        this.point.x += speed;
                    }
                }

                if (this.point.y > this.target.point.y + this.target.radius) {
                    this.currentAction = 'run';
                    this.point.y -= speed;
                } else if (this.point.y < this.target.point.y - this.target.radius) {
                    this.currentAction = 'run';
                    this.point.y += speed;
                } else { // distribute enemies more evenly
                    attackPositionY = this.target.point.y + this.target.radius * ( 2 / (this.index % 4 + 1) - 1 );
                    if (this.point.y - speed > attackPositionY)
                        this.point.y -= speed;
                    if (this.point.y + speed < attackPositionY)
                        this.point.y += speed;
                }

            } else {
                this.currentAction = 'idle';
                this.attacking = false;
            }

            // attack pattern:
            if (distance < range){
                if (this.attacking === false)
                    this.attacking = true;
                if (this.attack_start === 0) {
                    var date = new Date;
                    var attackDelay = this.weapon.attackSpeed;
                    this.attack_start = date.getTime() + attackDelay;
                    this.hitbox(this, attackDelay, range);
                }
            }
}

Enemy.prototype.hitbox =
        function(enemy, attackDelay, range) {
            setTimeout( function(){
                if (MathUtil.distance(enemy.point, enemy.target.point) < range  &&  enemy.target.currentAction != 'hit') {
                    enemy.target.HP -= enemy.weapon.damage;
                    enemy.target.currentAction = 'hit';
                }
            }, attackDelay);
}

Enemy.prototype.harm =
        function(game, i) {
            var player = game.player;
            var enemies = game.enemies;
            var enemyIndex = enemies[i].index;
            var enemyNode = document.getElementById(ENEMY_ID + enemyIndex);

            enemies[i].HP -= player.weapon.damage;  //inflict weapon damage to the enemy

            if (enemies[i].HP > 0) { 
                var speed = enemies[i].speed;
                var knockbackTime = player.weapon.attackSpeed / (1.2 * BACKSWING[player.weapon.type]);

                enemies[i].speed = (-1 * speed);
                enemyNode.style.filter = 'sepia(1.50)'; //visual feedback of enemy being hit
               
                // we need a little kick-off just in case the enemy is right on us:
                if (enemies[i].point.x < player.point.x){
                    enemies[i].point.x--;
                } else {
                    enemies[i].point.x++;
                }
                // knockback:
                var enemyHit = enemies[i];
                setTimeout( function(){ 
                    enemyHit.speed = speed;
                    enemyNode.style.filter = '';
                }, knockbackTime );
            } else {
                player.coins += this.bounty;
                score += this.bounty;
                // death animation:
                var enemyOut = enemies.splice(i, 1);
                delete enemyOut.weapon;
                delete enemyOut;
                enemyNode.style.filter = 'grayscale(1.0)';  //visual feedback
                setTimeout ( function() {
                    enemyNode.childNodes[0].style.transition = 'background-size 0.3s';
                    enemyNode.childNodes[0].style.backgroundSize = '0%';
                    if (enemyNode.childNodes[1]) { // enemy could not have a weapon
                        enemyNode.childNodes[1].style.transition = 'background-size 0.2s';
                        enemyNode.childNodes[1].style.backgroundSize = '0%';
                    }
                    // removing the enemy:
                    setTimeout( function(){
                        enemyNode.remove();
                        if(enemies.length === 0) {  //check if current door can be opened
                            var currentRoomIndex = (game.dungeon.length + game.dungeon.nextRoom - 1) % game.dungeon.length;
                            game.dungeon.rooms[currentRoomIndex].isOpen = true;
                        }
                    }, 300 );
                }, 200);
            }
}