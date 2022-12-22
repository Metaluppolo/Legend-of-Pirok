/***********************************
    Constants
 ***********************************/
var pixelSize = 'var(--pixel-size)';
var pixelsPerTile = 16;

var tileSize = 'var(--tile-size)';
var tilesOnWidth = 10;
var tilesOnHeight = 11;

var PLAYGROUND_WIDTH = pixelsPerTile * tilesOnWidth;
var PLAYGROUND_HEIGHT = pixelsPerTile * tilesOnHeight;

// radii of characters of different sizes:
var S_SIZE = pixelsPerTile * 0.3;   // pixelsPerTile * width/2
var M_SIZE = pixelsPerTile * 0.4;
var L_SIZE = pixelsPerTile * 0.5;
var XL_SIZE = pixelsPerTile * 1.0;
var XXL_SIZE = pixelsPerTile * 1.1;


/***********************************
    Utility
 ***********************************/
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function MathUtil(){}
MathUtil.distance =
        function(point1, point2) {
            return Math.sqrt( (point1.x - point2.x) * (point1.x - point2.x) 
                            + (point1.y - point2.y) * (point1.y - point2.y) );
}

// Adds a non-existing child node and assigns it a different tag and class if specified
function newChild(parentNode, childID, childClass, childTag) {
    var newNode = document.getElementById(childID);
    if (newNode === null) {
        if (childTag === undefined)
            childTag = 'div';
        newNode = document.createElement(childTag);
        if (childID != undefined)
            newNode.id = childID;
        if (childClass != undefined)
            newNode.setAttribute('class', childClass);
        parentNode.appendChild(newNode);
    }
    return newNode;
}

// Adds a text node
function newTextChild(parentNode, text) {
    var textNode = document.createTextNode(text);
    parentNode.appendChild(textNode);
    return textNode;
}

// Sets multiple attributes at once
function setAttributes(element, attributes) {
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Preloads frames image (this avoids flickering during animations)
function preloadImage(imagePath) {
    var imageNode = document.getElementById(imagePath);
    if (imageNode === null) {
        var imgPreloader = document.getElementById('imgPreloader');
        var source = './css/img/' + imagePath + '.png';
        imageNode = document.createElement('img');
        imageNode.id = imagePath;
        //imageNode.setAttribute('src', source);
        setAttributes(imageNode, {'src': source, 'alt': 'ImgPreload'});

        imgPreloader.appendChild(imageNode);
    }
}