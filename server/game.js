
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

module.exports.Player = Player;