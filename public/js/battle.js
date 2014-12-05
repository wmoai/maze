$(function() {

  var log = function(message) {
    var line = $('<div>').html(message);
    $('#console').prepend(line);
  }

  var Chara = function(name, hp, atk, dff, agl) {
    this.name = name;
    this.hp = hp;
    this.atk = atk;
    this.dff = dff;
    this.agl = agl;
  }
  Chara.actions = {
    atk : 0
  }
  Chara.prototype.setAction = function(action, target) {
    this.action = action;
    this.target = target;
  }
  Chara.prototype.act = function() {
    if (this.hp <= 0) {
      return;
    }
    switch (this.action) {
      case Chara.actions.atk:
        this.target.attacked(this);
        break;
    }
  }
  Chara.prototype.attacked = function(opp) {
    var damage = opp.atk - this.dff;
    if (damage < 0) {
      damage = 0;
    }
    this.hp -= damage;
    log(opp.name + 'の攻撃！' + this.name + 'に' + damage + 'のダメージ');
    if (this.hp <= 0) {
      log(this.name + ' は死にました！');
    }
  }

  var you = new Chara("あなた", 45, 32, 18, 15);
  var npc = new Chara("てき", 32, 28, 12, 13);

  var turn = function() {
    // decide action
    you.setAction(Chara.actions.atk, npc);
    npc.setAction(Chara.actions.atk, you);
    // sort action order
    var order = [you, npc];
    order.sort(function(a,b) {
      return b.agl - a.agl;
    });
    // action loop
    order.forEach(function(chara) {
      chara.act();
    });
    // render
    showHp();
  };
  var showHp = function() {
    console.log(you.hp);
    var hp = '';
    for (var i=0; i<you.hp; i++) {
      hp += '|';
    }
    $('#hp').html(hp);
  };
  showHp();

  $("#command").on('click', 'input', function(e) {
    turn();
  });

});

