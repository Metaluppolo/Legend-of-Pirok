heroes = {
    'knight_m': new Hero('knight_m', 'charge', 'knight_sword'),
    'knight_f': new Hero('knight_f', 'charge', 'knight_sword'),
    //'elf_m':  new Hero(),
    //'wizard_m': new Hero(),
}

/***********************************
    Hero class
 ***********************************/
function Hero(name, skill, weapon) {
    this.name = name;
    this.skill = skill;
    this.weapon = weapons[weapon];
}

Hero.prototype.checkHitbox =
        function(player, enemy) {
            var result = null;
            switch (this.name) {    // each hero class has his own hitbox
                case 'knight_m': case 'knight_f':
                    result = this.knightHitbox(player, enemy);
                break;
            }
            return result;
}

Hero.prototype.knightHitbox =
        function(player, enemy) {
            var distance = MathUtil.distance(player.point, enemy.point);
            var atan = Math.atan2(enemy.point.x - player.point.x, enemy.point.y - player.point.y) * 180 / Math.PI; //atan measured in degrees
            //console.log('atan: ',atan, '  distance: ',distance, '  MIN: ',player.weapon.attackRange + enemy.radius);

            if ((distance < player.weapon.attackRange + enemy.radius)
                && ( (player.facingDirection === 'right' && atan < 160 && atan > 25)
                    || (player.facingDirection === 'left' && atan < -25 && atan > -160) )) {
                return true;
            } else {
                return false;
            }
}