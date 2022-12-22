weapons = { //               ||imgName| type || damage | atkSpeed(ms) | atkRange ||width|height|left|bottom|
    // heroes weapons
    'knight_sword': new Weapon('knight_sword', '2H', 45, 600, pixelsPerTile * 1.35,  8.5, 25, '55%', '10%'),
    'lavish_sword': new Weapon('lavish_sword', '2H', 65, 650, pixelsPerTile * 1.40,  9.0, 27, '55%', '10%'),
    'anime_sword':  new Weapon('anime_sword', '2H', 100, 900, pixelsPerTile * 1.50, 12.0, 30, '55%', '10%'),

    //orcs weapons
        //'machete':      new Weapon(     'machete', '1H', 20, 350, pixelsPerTile * 1.00, 4.5, 20, '75%', '10%',),
    'knife':        new Weapon(     'knife', 'STAB', 10, 300, pixelsPerTile * 0.50,  4.0,  9, '65%', '10%'),
    'cleaver':      new Weapon(     'cleaver', '1H', 20, 400, pixelsPerTile * 0.65,  5.0, 12, '80%', '10%'),
    'baton':        new Weapon(     'baton',   '1H', 40, 800, pixelsPerTile * 2.00, 12.0, 30, '70%', '25%'),
    
    //demons weapons
    'fangs':        new Weapon(   undefined, undefined, 5, 150, pixelsPerTile * 0.20, undefined, undefined, undefined, undefined),
    'bigFangs':     new Weapon(   undefined, undefined, 5, 150, pixelsPerTile * 1.20, undefined, undefined, undefined, undefined),
    'impClaws':     new Weapon(   undefined, undefined, 5, 150, pixelsPerTile * 0.05, undefined, undefined, undefined, undefined),
}

// backswings (the latency of one attack) of every weapon type
var BACKSWING = {   // animate function called every 100ms: reccomanded values at this refresh rate are [2, 6]
    '1H': 5,
    '2H': 2,
    'STAB': 6,
}

/***********************************
    Weapon class
 ***********************************/
function Weapon(imgName, type, damage, atkSpeed, atkRange, width, height, leftPerc, bottomPerc) {
    this.name = imgName;
    this.type = type;
    this.damage = damage;
    this.attackSpeed = atkSpeed;    //ms
    this.attackRange = atkRange;

    this.width = width;
    this.height = height;
    this.leftPerc = leftPerc;
    this.bottomPerc = bottomPerc;
}

Weapon.prototype.animate =
        function(holder, weaponType, weaponNode) {
            switch(weaponType){
                case '1H':
                    this.animateOneHanded(holder, weaponNode);
                break;
                case '2H':
                    this.animateTwoHanded(holder, weaponNode);
                break;
                case 'STAB':
                    this.animateStab(holder, weaponNode);
                break;
            }
}

Weapon.prototype.animateOneHanded =
        function(holder, weaponNode) {
            var delay = holder.attack_start + holder.weapon.attackSpeed / BACKSWING["1H"];
            var date = new Date;    
             if ( date.getTime() > delay) {
                weaponNode.style.bottom = '-30%';
                weaponNode.style.left = '75%';
                weaponNode.style.transform = 'rotate(120deg)';
            } else {
                weaponNode.style.bottom = '25%';
            }
}


Weapon.prototype.animateTwoHanded =
        function(holder, weaponNode) {
            var delay = holder.attack_start + holder.weapon.attackSpeed / BACKSWING["2H"]; 
            var date = new Date; 
            if ( date.getTime() > delay) {
                weaponNode.style.bottom = '-83%';
                weaponNode.style.left = '60%';
                weaponNode.style.transform = 'rotate(130deg)';
                weaponNode.style.zIndex = 1;
            } else {
                weaponNode.style.transform = 'rotate(30deg)';
                weaponNode.style.bottom = '20%';
            }
}

Weapon.prototype.animateStab =
        function(holder, weaponNode) {
            var delay = holder.attack_start + holder.weapon.attackSpeed / BACKSWING["STAB"];
            var date = new Date;
             if ( date.getTime() > delay) {
                weaponNode.style.bottom = '-30%';
                weaponNode.style.left = '105%';
                weaponNode.style.transform = 'rotate(90deg)';
            } else {
                weaponNode.style.bottom = '-30%';
                weaponNode.style.left = '90%';
                weaponNode.style.transform = 'rotate(90deg)';
            }
}