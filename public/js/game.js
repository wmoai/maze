$(function() {
  var Game = function() {
    this.state = 0; // 0:map, 1:battle
    this.map = new Map(Math.floor(Math.random() * 3) * 2 + 19, Math.floor(Math.random() * 3) * 2 + 19);
    this.chara = new Chara();
    this.renderStatus();
  }
  Game.prototype.action = function() {

  }
  Game.prototype.renderStatus = function() {
    $('#hp-remain').css({
      "width": this.chara.getHpPercentile() + "%"
    });
    $('#inventory').text(null);
    this.chara.inventory.forEach(function(item, index) {
      var name = item.name;
      if (!item.equipment) {
        name += '[' + item.remaining + ']';
      }
      var itemElem = $('<input>', {'class': 'item'}).attr({
        "type": "button",
        "value": name,
        "data-index": index
      });
      if (item.equiped) {
        itemElem.addClass('equiped');
      }
      $('#inventory').append(itemElem);
    });
  }
  Game.prototype.useItem = function(index) {
    var item = this.chara.inventory[index];
    if (item) {
      item.use(this.chara);
      if (item.isExpended()) {
        this.chara.inventory.splice(index, 1);
      }
    }
    game.renderStatus();
  }


  var game = new Game();


  $('html').on('keydown', function(e) {
    if (e.keyCode == 32) {
      game.map.illustrate();
    }
  });
  $('html').on('keyup', function(e) {
    if (e.keyCode == 32) {
      game.map.view();
    }
    switch(e.keyCode) {
    case 37:
      game.map.turnLeft();
      break;
    case 38:
      game.chara.cure(1);
      game.map.walk();
      break;
    case 39:
      game.map.turnRight();
      break;
    case 40:
      game.map.turnBack();
      break;
    }
    game.renderStatus();
  });
  $('html').on('click', '.item', function() {
    var index = $(this).data().index;
    if (index%1===0) {
      game.useItem(index);
    }
  });

  var tapX = 0;
  var tapY = 0;
  $('#view').on('touchstart', function(e) {
    e.preventDefault();
    tapX = event.changedTouches[0].pageX;
    tapY = event.changedTouches[0].pageY;
  });
  $('#view').on('touchend', function(e) {
    e.preventDefault();
    var dx = event.changedTouches[0].pageX - tapX;
    var dy = event.changedTouches[0].pageY - tapY;
    if (Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)) < 5) {
      game.map.walk();
    } else if (dx > 10) {
      game.map.turnLeft();
    } else if (dx < -10) {
      game.map.turnRight();
    }
  });

});

