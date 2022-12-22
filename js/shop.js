var SHOP_ID = 'shop';

/**************************************************************************************
    Shop class
**************************************************************************************/
shopInventory = ['flaskRed', 'flaskBigRed', 'flaskBigYellow', 'weaponOne', 'weaponTwo', 'weaponThree'];

function Shop(game) {
    //this.player = game.player;
    this.game = game;
    // potions
    this.flaskRed = [true, 3, this.buyFlaskRed.bind(this)];
    this.flaskBigRed = [true, 30, this.buyFlaskBigRed.bind(this)];
    this.flaskBigYellow = [true, 50, this.buyFlaskBigYellow.bind(this)];
    // weapons
    this.weaponOne = [true, 0, this.buyWeaponOne.bind(this), 'knight_sword'];
    this.weaponTwo = [true, 75, this.buyWeaponTwo.bind(this), 'lavish_sword'];
    this.weaponThree = [true, 90, this.buyWeaponThree.bind(this), 'anime_sword'];
}

Shop.prototype.buyFlaskRed =
        function(){
            var player = this.game.player;
            var itemPrice = this.flaskRed[1];
            if (player.coins < itemPrice || player.potions >= 4)
                return;
            // update player stats
            player.coins -= itemPrice;
            player.potions += 1;
            // update this item price tag
            this.flaskRed[1] += 1;
            // redraw updated shop
            var sketcher = this.game.sketcher;
            sketcher.removeShop();
            sketcher.drawShop(this.game);
}

Shop.prototype.buyFlaskBigRed =
        function(){
            var player = this.game.player;
            var itemPrice = this.flaskBigRed[1];
            if (player.coins < itemPrice)
                return;
            // update player stats
            player.coins -= itemPrice;
            player.maxHP += HP_PER_HEART;
            // update this item price tag
            this.flaskBigRed[1] += 10;
            if (player.maxHP >= HP_PER_HEART * 10)
                this.flaskBigRed[0] = false;
            // redraw updated shop
            var sketcher = this.game.sketcher;
            sketcher.removeShop();
            sketcher.drawShop(this.game);
}

Shop.prototype.buyFlaskBigYellow =
        function(){
            var player = this.game.player;
            var itemPrice = this.flaskBigYellow[1];
            if (player.coins < itemPrice)
                return;
            // update player stats
            player.coins -= itemPrice;
            player.baseSpeed += 0.20;
            player.speed = player.baseSpeed;
            // update this item price tag
            this.flaskBigYellow[1] += 25;
            if (player.baseSpeed >= 1.50)
                this.flaskBigYellow[0] = false;
            // redraw updated shop
            var sketcher = this.game.sketcher;
            sketcher.removeShop();
            sketcher.drawShop(this.game);
}

Shop.prototype.buyWeaponOne =
        function(){
            this.buyWeapon('weaponOne');
}

Shop.prototype.buyWeaponTwo =
        function(){
            this.buyWeapon('weaponTwo');
}
Shop.prototype.buyWeaponThree =
        function(){
            this.buyWeapon('weaponThree');
}
Shop.prototype.buyWeapon =
        function(weapon) {
            var item = this[weapon];
            var player = this.game.player;
            var itemPrice = item[1];
            var weaponName = item[3];
            if (player.coins < itemPrice || player.weapon.name == weaponName)
                return;
            // update player stats
            player.coins -= itemPrice;
            delete player.weapon;
            player.weapon = weapons[weaponName];
            // update weapon image
            var weaponNode = document.getElementById(PLAYER_ID + WEAPON_ID);
            weaponNode.style.backgroundImage = "url('./css/img/weapons/" + weaponName + ".png')";
            // update this item price tag
            item[1] = 0;
            // redraw updated shop
            var sketcher = this.game.sketcher;
            sketcher.removeShop();
            sketcher.drawShop(this.game);
}