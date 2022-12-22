var MIN_ROOMS = 3;

/**************************************************************************************
    Dungeon class
**************************************************************************************/
function Dungeon(difficulty) {
    this.length = MIN_ROOMS + difficulty;
    this.rooms = [];
    this.nextRoom = 0;
    this.currentFloor = 0;
}

Dungeon.prototype.addRooms = 
        function() {
            for (var i = 0; i < this.length; i++)
                this.rooms[i] = new Room(i);
}

Dungeon.prototype.nextRoomUpdate = 
        function() {
            if(this.nextRoom === 0)
                this.currentFloor++;            
            this.nextRoom = (this.nextRoom + 1) % this.length;
}