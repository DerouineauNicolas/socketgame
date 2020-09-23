

function getUniqueID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

module.exports.getUniqueID = getUniqueID;

function Player(id, name) {
  this.id = id;
  this.name = name;
  this.x = 0;
  this.y = 0;
}

Player.prototype = {
  serialize: function() {
    return {
      name: this.name, 
      id: this.id, 
      status: this.status, 
      numWords: this.words.length
    }
  },
};

function Points(x, y, id) {
  this.x = x;
  this.y = y;
  this.id = id;
}

Player.prototype = {
  serialize: function() {
    return {
      name: this.name, 
      id: this.id, 
      status: this.status, 
      numWords: this.words.length
    }
  },
};

module.exports.Player = Player;
module.exports.Points = Points;

function PointsSet(TerrainWidth, TerrainHeight, NumPoints) {
  var pointsets = [];
  for (var i = 0; i < NumPoints; i++ ){
    var points = new Points((Math.random() * TerrainWidth) - (TerrainWidth/2.0), (Math.random() * TerrainHeight) - (TerrainHeight/2.0), getUniqueID());
    pointsets.push(points);
  }
  return pointsets;
};

module.exports.PointsSet = PointsSet;