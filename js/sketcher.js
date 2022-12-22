var STATUS_ID = 'status';
var INVENTORY_ID = 'inventory';
var OPTIONS_ID = 'optionsButton';
var LVL_ID = 'level';
var HPBAR_ID = 'hpBar';
var HEART_ID = 'heart_';
var POTION_ID = 'potion_';
var COINS_ID = 'coins';


var PLAYER_ID = 'player';
var HEROSPRITE_ID = 'heroSprite';
var SHADOWSPRITE_ID = 'shadowSprite';

var ENEMY_ID = 'enemy_'

var WEAPON_ID = '-weapon';

var DUNGEON_ID = 'dungeon';
var ROOM_ID = 'room_';
var DOOR_ID = '-door';


/******************************
 *    Sketcher class
 ******************************/
function Sketcher(wrapper) {
    this.statusBar = wrapper.childNodes[0];
    this.playground = wrapper.childNodes[1];
}
/******************************************************************************************************************
    player sketchers
 ******************************************************************************************************************/
Sketcher.prototype.drawPlayer = 
        function(player) {
            var playerNode = document.getElementById(PLAYER_ID);
            if (playerNode === null) {
                playerNode = newChild(this.playground, PLAYER_ID, 'medium character');
                var heroSpriteNode = newChild(playerNode, HEROSPRITE_ID, 'medium sprite');
                newChild(playerNode, SHADOWSPRITE_ID, 'medium sprite');
                player.setAnimationFrames();
                heroSpriteNode.style.backgroundImage = 
                            "url('./css/img/" + player.hero.name + "/idle_anim_f0.png')";
                this.drawWeapon(player, PLAYER_ID);
            }
            playerNode.style.left = 'calc( ' + pixelSize + ' * ' + (player.point.x - player.radius) + ' )';
            playerNode.style.bottom = 'calc( ' + pixelSize + ' * ' + (player.point.y - player.radius) + ' )';

            playerNode.style.transform = (player.facingDirection === 'left')?'scaleX(-1)':'scaleX(1)';
}

Sketcher.prototype.animatePlayer = 
        function(player) {
            var act = player.currentAction;
            if (player.currentAction === 'hit') {
                player.nextFrame = 0;
            }
            var frameIndex = player.actions[act] + player.nextFrame;
            var frameId = player.hero.name + '/' + player.frames[frameIndex];            
            document.getElementById(HEROSPRITE_ID).style.backgroundImage = "url('./css/img/" + frameId + ".png')";
            if (player.currentAction != 'hit') {
                player.nextFrame = (player.nextFrame + 1) % 4;
            }
}

/******************************************************************************************************************
    weapon sketchers
 ******************************************************************************************************************/
Sketcher.prototype.drawWeapon =
        function(holder, holderID) {
            var weapon = holder.weapon;
            if (weapon.name === undefined) {return;}
            var holderNode = document.getElementById(holderID); 
            var weaponNode = document.getElementById(holderID + WEAPON_ID);
            if (weaponNode === null) {
                weaponNode = newChild(holderNode, holderID + WEAPON_ID, 'sprite');
                weaponNode.style.backgroundImage = "url('./css/img/weapons/" + weapon.name + ".png')";
                weaponNode.style.width = 'calc( ' + pixelSize + ' * ' + weapon.width + ' )';
                weaponNode.style.height = 'calc( ' + pixelSize + ' * ' + weapon.height + ' )';
            }
            weaponNode.style.left = weapon.leftPerc;
            weaponNode.style.bottom = weapon.bottomPerc;
            weaponNode.style.zIndex = 0;
}

Sketcher.prototype.animateWeapon =
        function(holder, holderID) {
            var weaponNode = document.getElementById(holderID + WEAPON_ID);
            if (holder.attacking) {
                var weaponType = holder.weapon.type;
                holder.weapon.animate(holder, weaponType, weaponNode);
            } else {
                switch (holder.currentAction) {
                    case 'hit':
                        weaponNode.style.visibility = 'hidden';
                    break;
                    case 'idle':
                        weaponNode.style.visibility = 'visible';
                        weaponNode.style.transform = 'rotate(0deg)';
                        if (holder.nextFrame % 3 === 0) {
                            weaponNode.style.transform = 'translate(0,5%)';
                        }
                    break;
                    case 'run':
                        weaponNode.style.visibility = 'visible';
                        weaponNode.style.transform = 'rotate(10deg)';
                    break;
                }
            }
}

/******************************************************************************************************************
    enemy sketchers
 ******************************************************************************************************************/
Sketcher.prototype.drawEnemy =
        function(enemy, indexEnemy) {
            var enemyID = ENEMY_ID + indexEnemy;
            var enemyNode = document.getElementById(enemyID);
            if (enemyNode === null) {
                var ENEMYSPRITE_ID = enemyID + '-sprite';
                var enemySize = undefined;
                switch (enemy.radius) {
                    case S_SIZE:
                        enemySize = 'small';
                    break;
                    case M_SIZE:
                        enemySize = 'medium';
                    break;
                    case L_SIZE:
                        enemySize = 'large';
                    break;
                    case XL_SIZE:
                        enemySize = 'extraLarge';
                    break;
                    case XXL_SIZE:
                        enemySize = 'extraLarge2';
                    break;
                }
                enemyNode = newChild(this.playground, enemyID, enemySize + ' character');
                enemySprite = newChild(enemyNode, ENEMYSPRITE_ID, enemySize + ' sprite');
                enemy.setAnimationFrames();
                document.getElementById(ENEMYSPRITE_ID).style.backgroundImage = 
                            "url('./css/img/enemies/" + enemy.race + "/" + enemy.type + "/idle_anim_f0.png')";
                if (enemy.weapon != null)
                    this.drawWeapon(enemy, enemyID);
            }
            enemyNode.style.left = 'calc( ' + pixelSize + ' * ' + (enemy.point.x - enemy.radius) + ' )';
            enemyNode.style.bottom = 'calc( ' + pixelSize + ' * ' + (enemy.point.y - enemy.radius) + ' )';
            enemyNode.style.transform = (enemy.facingDirection === 'left')?'scaleX(-1)':'scaleX(1)';
            // simulate perspective
            if (enemy.target.point.y > enemy.point.y) {
                enemyNode.style.zIndex = 1;
            } else {
                enemyNode.style.zIndex = 0;
            }
}

Sketcher.prototype.animateEnemy = 
        function(enemy, indexEnemy) {
            var act = enemy.currentAction;
            var frameIndex = enemy.actions[act] + enemy.nextFrame;
            var ENEMYSPRITE_ID = ENEMY_ID + indexEnemy + '-sprite';
            var frameId = enemy.race + '/' + enemy.type + '/' + enemy.frames[frameIndex];            
            document.getElementById(ENEMYSPRITE_ID).style.backgroundImage = "url('./css/img/enemies/" + frameId + ".png')";
            enemy.nextFrame = (enemy.nextFrame + 1) % 4;
}

/******************************************************************************************************************
    prop sketchers
 ******************************************************************************************************************/
Sketcher.prototype.drawProp =
        function(game, roomNode, prop, nFrames) {
            var imgPath = 'dungeon/' + prop.name + '/anim_f';
            for (var i = 0; i < nFrames; i++) {
                prop.frames.push('anim_f' + i);
                preloadImage(imgPath + i);
            }
            game.props.push(prop);
           
            var propNode = newChild(roomNode, prop.name + '_' + prop.index, 'large sprite');
            propNode.style.left = 'calc( ' + pixelSize + ' * ' + (prop.point.x - M_SIZE) + ' )';
            propNode.style.bottom = 'calc( ' + pixelSize + ' * ' + (prop.point.y - M_SIZE) + ' )';
           
            return propNode;
}

Sketcher.prototype.animateProp =
        function(prop) {
            var propId = prop.name + '_' + prop.index;
            var frameId = prop.name + '/' + prop.frames[prop.nextFrame];            
            document.getElementById(propId).style.backgroundImage = "url('./css/img/dungeon/" + frameId + ".png')";
            prop.nextFrame = (prop.nextFrame + 1) % prop.frames.length;
}

/******************************************************************************************************************
    statusbar sketchers
 ******************************************************************************************************************/
var COOLDOWNBAR_ID = 'cooldownBar';
var COOLDOWN_ID = 'cooldown';

Sketcher.prototype.drawStatusBar =
        function(game) {
            var statusBar = game.statusBar;
            var statusNode = document.getElementById(STATUS_ID);
            var hpNode = document.getElementById(HPBAR_ID);
            var inventoryNode = document.getElementById(INVENTORY_ID);

            if (statusNode === null) {
                statusNode = newChild(this.statusBar, STATUS_ID, 'unselectable');
                // create level counter
                var lvlNode = document.createElement('p');
                lvlNode.id = LVL_ID;
                newTextChild(lvlNode, 'LVL: ');
                statusNode.appendChild(lvlNode);
                // create health bar
                hpNode = newChild(statusNode, HPBAR_ID);
                // create skill cooldown bar
                var cooldownBarNode = newChild(statusNode, COOLDOWNBAR_ID, 'cdBar');
                newChild(cooldownBarNode, COOLDOWN_ID, 'cdBar');

                // create options button
                var optionsNode = newChild(this.statusBar, OPTIONS_ID, 'sprite');
                optionsNode.onclick = function() {
                    controller.pause = (controller.pause === false) ? true : false;
                    game.pause();
                }
                
                // create inventory
                inventoryNode = newChild(this.statusBar, INVENTORY_ID, 'unselectable');
                var coinsNode = newChild(inventoryNode, COINS_ID);
                newTextChild(coinsNode, 'x');
                newChild(coinsNode, COINS_ID + 'Img', 'coinImg sprite');
            }

            statusBar.update();
            
            // draw cooldown bar
            var player = game.player;
            var cooldownNode = document.getElementById(COOLDOWN_ID);
            cooldownNode.style.width = 100 * (player.skill_cooldown - player.skill_cooldownLeft) / player.skill_cooldown + '%';
            // draw potions
            for (var i = 0; i < statusBar.potions.length; i++) {
                var potionNode = document.getElementById(POTION_ID + i);
                if (potionNode === null)
                    potionNode = newChild(inventoryNode, POTION_ID + i, 'potion sprite');
            }
            // draw spinning coin 
            var coinsImgNode = document.getElementById(COINS_ID + 'Img');
            coinsImgNode.style.backgroundImage = "url('./css/img/UI/coin_anim_f" + statusBar.coinFrame + ".png')";
            var coinsCount = document.getElementById(COINS_ID).childNodes[0];
            coinsCount.nodeValue = statusBar.player.coins + ' x';
            // draw level counter
            var lvlNode = document.getElementById(LVL_ID).firstChild;
            var text = 'LVL: ' + statusBar.level;
            if (lvlNode.nodeValue != text)
                lvlNode.nodeValue = text;
            // draw health bar
            for (var i = 0; i < statusBar.hearts.length; i++) {
                var heartNode = document.getElementById(HEART_ID + i);
                if (heartNode === null)
                    heartNode = newChild(hpNode, HEART_ID + i, 'heart sprite');
                var frame = 'empty';
                switch (statusBar.hearts[i]) {
                    case 1:
                        frame = 'half';
                    break;
                    case 2:
                        frame = 'full';
                    break;
                }
                heartNode.style.backgroundImage = "url('./css/img/UI/" + HEART_ID + frame + ".png')";
            }
}

/**************************************************************************************
    shop sketchers
**************************************************************************************/
Sketcher.prototype.drawShop =
        function (game) {
            var shopNode = document.getElementById(SHOP_ID);
            if (shopNode !== null)
                return;
            shopNode = newChild(wrapper, SHOP_ID);
            shopNode.setAttribute('class', 'unselectable');
            // write flavour text
            var text = ' "Greetings! Trader has wares if you have coin!" ';
            newTextChild(shopNode, text);
            var hr = document.createElement('hr');
            shopNode.appendChild(hr);
            // draw every item in the shop
            for (var i = 0; i < shopInventory.length; i++) {
                var item = shopInventory[i];
                var buttonNode = this.createShopButton(shopNode, item, game.shop[item]);
                // change price color if player can't afford this item
                if (game.player.coins < game.shop[item][1])
                    buttonNode.style.color = 'red';
            }
}
Sketcher.prototype.removeShop =
        function () {
            var shopNode = document.getElementById(SHOP_ID);
            if (shopNode !== null)
                shopNode.remove();
}
Sketcher.prototype.createShopButton =
        function (shopNode, buttonName, shopItem) {
            var isAvailable = shopItem[0];
            var price = shopItem[1];
            var buyItem = shopItem[2];
            
            var buttonNode = newChild(shopNode, buttonName, 'shopButton');
            var imgNode = newChild(buttonNode, buttonName + 'Img', 'shopItem sprite');

            var priceTag = (isAvailable) ? price : 'SOLD OUT';
            if (price !== 0) {
                newTextChild(buttonNode, priceTag);
            } else {
               imgNode.style.left = '-35%';
            }

            if (isAvailable) {
                buttonNode.onclick = function() {
                    if (controller.pause === false)
                        buyItem();
                };
                if (price !== 0)
                    newChild(buttonNode, buttonName + 'Coin', 'coinImg sprite');
            } else {
                buttonNode.setAttribute('class', 'soldOut');
            }
            
            return buttonNode;
}

/******************************************************************************************************************
    dungeon sketchers
******************************************************************************************************************/
Sketcher.prototype.drawDungeon = 
        function(dungeon) {
            var dungeonNode = newChild(this.playground, DUNGEON_ID);
            dungeonNode.style.bottom = ( dungeon.length - 1 ) * 100 + '%';
            /* create all rooms and draw the first one if a new game started, or draw next room otherwise  */
            var roomId = ROOM_ID + dungeon.nextRoom;
            if (document.getElementById(ROOM_ID + (dungeon.length - 1) ) === null) {
                for (var i = dungeon.length - 1; i >= 0; i--) {
                    roomId = ROOM_ID + i;
                    newChild(dungeonNode, roomId, 'room');
                }
                this.drawRoom(dungeon, roomId);
            } else {    // animate transition and erase previous room. We need to adjust bottom distance due to DOM tree manipulation
                this.erasePreviousRoom(dungeon);
                this.drawRoom(dungeon, roomId); 
                dungeonNode.style.transform = 'translate(0,' + (dungeon.nextRoom / dungeon.length) * (100) + '%)';
            }
        dungeon.nextRoomUpdate();
}

Sketcher.prototype.drawRoom =   /* draw the room in a grid pattern */
            function(dungeon, roomId) {
                var roomNode = document.getElementById(roomId);
                var roomIndex = dungeon.nextRoom;

                var backgroundId = roomId + '-background';
                var backgroundNode = newChild(roomNode, backgroundId, 'room');

                for (var r = 0; r < dungeon.rooms[roomIndex].height; r++) {
                    for (var c = 0; c < dungeon.rooms[roomIndex].width; c++) {
                        var TILE_ID = roomId + '-tile_' + r + '_' + c;
                        var tileNode = newChild(backgroundNode, TILE_ID , 'tile sprite');
                        if (r === 0) { // draw walls and door
                            if ( c === Math.floor( dungeon.rooms[roomIndex].width / 2 - 1 ) 
                              || c === Math.floor( dungeon.rooms[roomIndex].width / 2 ) ) {
                                var doorId = roomId + DOOR_ID;
                                newChild(backgroundNode, doorId, 'door sprite');
                            } else { // let's add some randomness to the wall creation
                                if ( Math.random() > 0.95) {
                                    tileNode.style.backgroundImage = "url('./css/img/dungeon/wall_2.png')";
                                } else {
                                    tileNode.style.backgroundImage = "url('./css/img/dungeon/wall_1.png')";
                                }
                                tileNode.style.transform = 'scaleX(' + ((Math.random() > 0.2) ? 1 : -1) + ')';
                            }
                        } else { // let's add some randomness to the floor creation
                            if ( Math.random() > 0.95) {
                                tileNode.style.backgroundImage = "url('./css/img/dungeon/floor_2.png')";
                            } else if ( Math.random() < 0.05) {
                                tileNode.style.backgroundImage = "url('./css/img/dungeon/floor_3.png')";
                            }
                            tileNode.style.transform = "rotate(" + Math.floor(Math.random() * 4) * 90 + "deg)";
                        }
                    }
                    newChild(backgroundNode, undefined, undefined, 'br');
                }

                roomIndex = (dungeon.nextRoom) % dungeon.length;
                
                var targetRoom = dungeon.rooms[roomIndex];
                var targetNode = document.getElementById(ROOM_ID + roomIndex + DOOR_ID);
                // listeners which detect doors interactions:
                document.getElementById(roomId + DOOR_ID).addEventListener('mouseenter', function(){
                            targetRoom.isDoorFocused = true;
                }, false);                
                document.getElementById(roomId + DOOR_ID).addEventListener('mouseleave', function(){
                            targetRoom.isDoorFocused = false;
                            targetNode.style.filter = '';
                            targetNode.style.outline = '';
                }, false);
}

Sketcher.prototype.erasePreviousRoom =
            function(dungeon) {
                var dungeonNode = this.playground.childNodes[0];
                var targetNode = dungeonNode.lastChild; // the room we want to erase is the last child of dungeon node
                var targetId = targetNode.id;
                var targetNumber = parseInt( targetId.match(/\d+/g) ); // RegExp meaning:   \d = find a digit,      g = don't stop after the first match
                if ( (targetNumber + MIN_ROOMS) % dungeon.length === dungeon.nextRoom ) {   // if target room is MIN_ROOMS before the actual room, remove it from the DOM
                    targetNode.remove();                    
                    targetNode = document.createElement('div');
                    targetNode.id = targetId;
                    targetNode.setAttribute('class', 'room');
                    dungeonNode.insertBefore(targetNode, dungeonNode.firstChild);
                    // since we altered the DOM tree by moving rooms nodes, we need to adjust dungeon positioning
                    dungeonNode.style.bottom = ( dungeon.length + dungeon.nextRoom - MIN_ROOMS) * 100 + '%';
                }
}


/******************************************************************************************************************
    remove all
******************************************************************************************************************/
Sketcher.prototype.removeAll =
	function(game) {
        // remove nodes
        while (this.playground.lastChild !== null) {
            this.playground.lastChild.remove();
        }
        
        // remove objects
        delete game.player;
        delete game.shop;

        for (var i = game.dungeon.rooms.length - 1; i >= 0; i--)
            delete game.dungeon.rooms[i];
        delete game.dungeon;
        
        for (var i = game.enemies.length - 1; i >= 0; i--) {
            delete game.enemies[i].weapon;
            delete game.enemies[i];
        }
        delete game.enemies;
        
        for (var i = game.props.length - 1; i >= 0; i--)
            delete game.props[i];
        delete game.props;

        for (var i = game.statusBar.hearts.length - 1; i >= 0; i--) {
            delete game.statusBar.hearts[i];
            document.getElementById(HEART_ID + i).remove();
        }
        delete game.statusBar.hearts;

        for (var i = game.statusBar.potions.length - 1; i >= 0; i--) {
            delete game.statusBar.potions[i];
            document.getElementById(POTION_ID + i).remove();
        }
        delete game.statusBar.potions;
}