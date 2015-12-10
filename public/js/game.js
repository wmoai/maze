$(function() {
  var Game = function() {
    this.state = 0; // 0:map, 1:battle
    this.map = new Map(Math.floor(Math.random() * 6) * 2 + 15, Math.floor(Math.random() * 6) * 2 + 15);
    this.chara = new Chara();
    this.renderStatus();
  }
  Game.prototype.action = function() {

  }
  Game.prototype.renderStatus = function() {
    $('#hp-remain').css({
      "width": this.chara.getHpPercentile() + "%"
    });
    $('#inventory').text('');
    this.chara.inventory.forEach(function(item, index) {
      var itemElem = $('<input>', {'class': 'item'}).attr({
        "type": "button",
        "value": item.name,
        "data-index": index
      });
      $('#inventory').append(itemElem);
    });
  }
  Game.prototype.useItem = function(index) {
    var item = this.chara.inventory[index];
    console.log(this.chara.inventory);
    console.log(index);
    if (item) {
      item.effect(this.chara);
      if (item.expendable) {
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
    console.log("hoge");
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

