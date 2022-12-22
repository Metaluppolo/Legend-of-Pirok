/***********************************
    Room class
 ***********************************/
function Room(index) {
    this.width = tilesOnWidth;
    this.height = tilesOnHeight;
    this.index = index;
    this.type = undefined;
    this.isOpen = false;     // false:close true:open
    this.doorPoint = new Point(PLAYGROUND_WIDTH/2, PLAYGROUND_HEIGHT);
    this.isDoorFocused = false;
}

Room.prototype.generateRoom = 
        function(game) {
            var boss = game.dungeon.length - 1;

            this.isOpen = false;
            var roomType = game.dungeon.currentFloor % 2;  // 2 is the number of room type
            switch (roomType) {
                case 0:
                    this.type = 'demon';
                break;
                default:
                    this.type = 'orc';
                break;
            }
            switch (this.index) {
                case 0:
                    this.shopRoom(game);
                break;
                case boss:
                    this.bossRoom(game);
                break;
                default:
                    this.enemyRoom(game);
                break;
            }
}

Room.prototype.enemyRoom = 
        function(game) {
            switch (this.type) {
                case 'orc':
                    this.orcRoom(game);
                break;
                case 'demon':
                    this.demonRoom(game);
                break;
            }
}

Room.prototype.bossRoom =
        function(game) {
            switch (this.type) {
                case 'orc':
                    this.ogreRoom(game);
                break;
                case 'demon':
                    this.bigDemonRoom(game);
                break;
            }
}

Room.prototype.shopRoom =
        function(game) {
            this.isOpen = true; 
            var offsetX = 0.175;
            var offsetY = 0.8;
            var X = this.width * pixelsPerTile;
            var Y = this.height * pixelsPerTile;
            var roomNode = document.getElementById(ROOM_ID + '0');
            
            // merchant:
            var merchantID = 'merchant';
            var merchantIndex = 0;
            var merchant = new Prop(merchantID, merchantIndex, X * offsetX, Y * offsetY);
            var merchantNode = game.sketcher.drawProp(game, roomNode, merchant, 4);
            // listeners which detect merchant interactions:
            var merchantNodeID = merchantID + '_' + merchantIndex;
            document.getElementById(merchantNodeID).addEventListener('mouseenter', function(){
                        merchant.isFocused = true;
            }, false);                
            document.getElementById(merchantNodeID).addEventListener('mouseleave', function(){
                        merchant.isFocused = false;
                        merchantNode.style.filter = '';
            }, false);

            
            // fountain:
            offsetX = 0.84;
            offsetY = 0.946;
            var fountainID = 'fountain_blue';
            var fountainIndex = 0;
            var fountain = new Prop(fountainID, fountainIndex, X * offsetX, Y * offsetY);
            var fountainNode = game.sketcher.drawProp(game, roomNode, fountain, 3);
            // listeners which detect fountain interactions:
            var fountainNodeID = fountainID + '_' + fountainIndex;
            document.getElementById(fountainNodeID).addEventListener('mouseenter', function(){
                        fountain.isFocused = true;
            }, false);                
            document.getElementById(fountainNodeID).addEventListener('mouseleave', function(){
                        fountain.isFocused = false;
                        fountainNode.style.filter = '';
            }, false);

            // basin:
            offsetX = 0.84;
            offsetY = 0.855;
            var basinID = 'fountain_blue/basin';
            var basinIndex = 0;
            var basin = new Prop(basinID, basinIndex, X * offsetX, Y * offsetY);
            game.sketcher.drawProp(game, roomNode, basin, 3);


            // crates:
            offsetX = -0.02;
            offsetY = 0.635;
            var zindex = 9;
            for (var i = 0; i <= 7; i++) {
                var propID = 'crate_' + i;
                var propNode = newChild(roomNode, propID, 'large crate sprite');
                propNode.style.left = 'calc( ' + pixelSize + ' * ' + (X * offsetX) + ' )';
                propNode.style.bottom = 'calc( ' + pixelSize + ' * ' + (Y * offsetY) + ' )';
                if (i < 3) {
                    propNode.style.backgroundPositionX = 'calc( ' + pixelSize + '*' + 2 + ' )';
                    offsetX += 0.075;
                }
                else {
                    propNode.style.left = 'calc( ' + pixelSize + ' * ' + (X * (offsetX + 0.013)) + ' )';
                    propNode.style.height = 'calc( ' + pixelSize + ' * ' + 20 + ' )';
                    offsetY += 0.045;
                }
                zindex--;
                propNode.style.zIndex = zindex;
            }

            // banner: (tells which type of enemies the player will encounter on the current floor)
            var tile1Node = document.getElementById(ROOM_ID + '0-tile_0_3');
            var tile2Node = document.getElementById(ROOM_ID + '0-tile_0_6');
            switch (this.type) {
                case 'orc':
                    tile1Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_green.png')";
                    tile2Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_green.png')";
                break;
                case 'demon':
                    tile1Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_red.png')";
                    tile2Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_red.png')";
                break;
                case 'undead':
                    tile1Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_blue.png')";
                    tile2Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_blue.png')";
                break;
                case 'ooze':
                    tile1Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_yellow.png')";
                    tile2Node.style.backgroundImage = "url('./css/img/dungeon/wall_banner_yellow.png')";
                break;
            }
}

Room.prototype.ogreRoom =
        function(game) {
            if (game.dungeon.currentFloor > 1)
                this.orcRoom(game);

            var x = pixelsPerTile * this.width / 2;
            var y = pixelsPerTile * this.height / 1.25;
            var i = game.enemies.length;
            game.enemies[i] = new Enemy(game, i, x, y, 'orc/ogre');
            game.sketcher.drawEnemy(game.enemies[i], game.enemies[i].index);
}

Room.prototype.orcRoom =
        function(game) {
            var roomDifficulty = this.index + game.dungeon.currentFloor * (difficulty + 1);
            // masked orcs
            if (roomDifficulty > 3) {
                var random = Math.floor( Math.random() * (difficulty + 2) );
                var enemyCount = this.index - 1 + random;
                var maxIndex = game.enemies.length + enemyCount;
                this.generateRoomEnemy(game, maxIndex, 'orc/masked');
            }
            // goblins
            enemyCount = roomDifficulty;
            maxIndex = game.enemies.length + enemyCount;
            this.generateRoomEnemy(game, maxIndex, 'orc/goblin');
}

Room.prototype.bigDemonRoom =
        function(game) {
            if (game.dungeon.currentFloor > 2)
                this.demonRoom(game);

            var x = pixelsPerTile * this.width / 2;
            var y = pixelsPerTile * this.height / 1.25;
            var i = game.enemies.length;
            game.enemies[i] = new Enemy(game, i, x, y, 'demon/bigDemon');
            game.sketcher.drawEnemy(game.enemies[i], game.enemies[i].index);
}

Room.prototype.demonRoom = 
        function(game) {
            var roomDifficulty = this.index + game.dungeon.currentFloor * (difficulty + 1);
            var random = Math.floor( Math.random() * (difficulty + 1) );
            // chorts
            var enemyCount = this.index + 1 + random;
            var maxIndex = game.enemies.length + enemyCount;
            this.generateRoomEnemy(game, maxIndex, 'demon/chort');
            // imps
            enemyCount = roomDifficulty;
            maxIndex = game.enemies.length + enemyCount;
            this.generateRoomEnemy(game, maxIndex, 'demon/imp');
}

Room.prototype.generateRoomEnemy =
        function(game, maxIndex, enemyType) {
            var limitX = this.width * pixelsPerTile;
            var limitY = this.height * pixelsPerTile - pixelsPerTile/2;
            for (var i = game.enemies.length; i < maxIndex; i++) {
                var x = (limitX - M_SIZE) - Math.random() * (limitX - 2 * M_SIZE);
                var y = 0.5 * ( limitY + (limitY - M_SIZE) - Math.random() * (limitY - 2 * M_SIZE) );

                game.enemies[i] = new Enemy(game, i, x, y, enemyType);
                game.enemies[i].facingDirection = (Math.random() < 0.5) ? 'right' : 'left';
                game.sketcher.drawEnemy(game.enemies[i], game.enemies[i].index);
            }
}