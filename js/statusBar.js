var HP_PER_HEART = 20;

/***********************************
    StatusBar class
 ***********************************/
function StatusBar(game) {
    this.player = game.player;
    this.dungeon = game.dungeon;

    this.level = null;
    this.hearts = [];   // 0: empty;    1: half;    2: full;
    this.potions = []; 
    this.coinFrame = 0;
}

StatusBar.prototype.update =
        function(){
            this.coinFrame = (this.coinFrame + 1) % 4;
            // level update
            if (this.level !== this.dungeon.currentFloor)
                this.level = this.dungeon.currentFloor;
            // hearts update
            if (Math.round(this.player.maxHP / HP_PER_HEART) > this.hearts.length)
                this.hearts.push(0);
            for (var i = 0; i < this.hearts.length; i++) {
                if (this.player.HP >= HP_PER_HEART * (i + 1)){
                    this.hearts[i] = 2;
                } else if (this.player.HP > HP_PER_HEART * i) {
                    this.hearts[i] = 1;
                } else {
                    this.hearts[i] = 0;
                }
            }
            //potions update
            if (this.player.potions > this.potions.length)
                this.potions.push(1);
            else while (this.player.potions < this.potions.length) {
                var i = this.potions.length - 1;
                document.getElementById(POTION_ID + i).remove();
                this.potions.pop();
            }
}