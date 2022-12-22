/***********************************
    Prop class
 ***********************************/
function Prop(name, index, x, y) {
    this.name = name;
    this.index = index;
    this.point = new Point(x,y);
    
    this.frames = [];
    this.nextFrame = 0;

    this.isFocused = false;
    this.isActivated = false;
}