window.addEventListener("beforeunload", function (e) {
  var confirmationMessage = "このページを離れようとしています。";
  (e || window.event).returnValue = confirmationMessage;
  return confirmationMessage;
});

var Game = function() {
  this.map = new Map(Math.floor(Math.random() * 3) * 2 + 19, Math.floor(Math.random() * 3) * 2 + 19);
  this.player = new Player();
  this.depth = 0;
  this.messages = [];
  this.initEngage();
}
Game.prototype.initEngage = function() {
  this._engage = 8 + (Math.random() * 20);
}
Game.prototype.useItem = function(index) {
  var item = this.player.inventory[index];
  if (item) {
    var msg = item.use(this, this.player);
    if (item.isExpended()) {
      this.player.inventory.splice(index, 1);
    }
    this.addMessage(msg);
  }
}
Game.prototype.proceedBattle = function(index, item) {
  this.battle.action(index);
  if (this.battle.end) {
    this.battle = null;
  }
}
Game.prototype.engage = function() {
  var rnd = Math.random();
  this._engage -= rnd;
  if (this.battle == null && this._engage < 0) {
    this.battle = new Battle(this);
    this.battle.action();
    this.initEngage();
  }
}
Game.prototype.addMessage = function(messages) {
  if (messages != null && messages.length > 0) {
    Array.prototype.push.apply(this.messages, messages);
  }
}


var Inventory = React.createClass({
  handleClick: function(e) {
    e.target.blur();
    var index = e.target.getAttribute('data-index');
    if (index%1===0) {
      this.props.useItemDelegate(index);
    }
  },
  render: function() {
    var self = this;
    return (
      <div id="inventory">
      {
        this.props.player.inventory.map(function(item, index) {
          var name = item.name;
          if (!item.equipment) {
            name += '[' + item.remaining + ']';
          }
          if (item.equiped) {
            return (
              <input
              className="item equiped"
              type="button"
              value={name}
              data-index={index}
              key={index}
              onClick={self.handleClick}
              />
            );
          } else {
            return (
              <input
              className="item"
              type="button"
              value={name}
              data-index={index}
              key={index}
              onClick={self.handleClick}
              />
            );
          }
        })
      }
      </div>
    );
  }
});

var HP = React.createClass({
  render: function() {
    return (
      <div id="hp">
        <div id="hp-remain"
        style={{width: this.props.player.getHpPercentile()+'%'}}
        />
      </div>
    );
  }
});

var Console = React.createClass({
  render: function() {
    var messages = this.props.messages;
    if (!messages) {
      messages = [];
    }
    return (
      <div id="console">
      {
        messages.map(function(message, index) {
          return <div key={index}>{message}</div>
        })
      }
      </div>
    );
  }
});

var GameScreen = React.createClass({
  getInitialState: function() {
    return {
      game: new Game(),
      renderedMap: false,
      messages: []
    };
  },
  componentDidMount: function() {
    document.body.addEventListener('keydown', this.handleKeydown);
    document.body.addEventListener('keyup', this.handleKeyup);
    var drawer = new Drawer(document.getElementById('view'));
    this.setState({
      drawer: drawer
    });
    drawer.view(this.state.game.map.getVision());
  },
  componentWillUnmount: function() {
    document.body.removeEventListener('keydown', this.handleKeydown);
    document.body.removeEventListener('keyup', this.handleKeyup);
  },
  handleKeydown: function(e) {
    if (e.keyCode == 32 && !this.state.renderedMap) {
      this.state.drawer.map(this.state.game.map);
      this.setState({renderedMap: true});
    }
  },
  handleKeyup: function(e) {
    var game = this.state.game;
    if (game.player.isDead()) {
      return;
    }
    if (game.battle == null) {
      switch(e.keyCode) {
        case 37:
          game.map.turnLeft();
        break;
        case 38:
          game.player.cure(game.player.maxHp / 128);
        game.map.walk();
        game.engage();
        break;
        case 39:
          game.map.turnRight();
        break;
        case 40:
          game.map.turnBack();
        break;
      }
    }
    this.showMessages();
    this.setState({
      game: game,
      renderedMap: false
    });
    this.state.drawer.view(game.map.getVision());
  },
  handleClickCanvas: function(e) {
    var game = this.state.game;
    if (game.player.isDead()) {
      return;
    }
    if (game.battle) {
      var enemyIndex = e.target.getAttribute('data-index');
      game.proceedBattle(enemyIndex);
      this.showMessages();
    }
    this.setState({game: game});
    return false;
  },
  useItem: function(index) {
    var game = this.state.game;
    if (game.player.isDead()) {
      return;
    }
    game.useItem(index);
    this.showMessages();
    this.setState({game: game});
  },
  showMessages: function() {
    if (this.state.game.messages.length > 0) {
      this.setState({messages: this.state.game.messages});
      this.state.game.messages = [];
    }
  },
  render: function() {
    var enemy = null;
    if (this.state.game.battle) {
      enemy = this.state.game.battle.enemies.map(function(enemy, index) {
        var style = {
          top: "70%",
          left: 100 * index + 50 +  "px"
        };
        return (
          <div className="enemy" data-index={index} key={index} style={style}>
            {enemy.name}
          </div>
        );
      })
    }
    return (
      <div id="container">
        <div id="main">
          <div id="view-box" onClick={this.handleClickCanvas}>
            <canvas id="view" width={1000} height={1000} />
            {enemy}
          </div>
          <Console messages={this.state.messages} />
        </div>
        <div id="menu">
          <HP player={this.state.game.player} />
          <Inventory player={this.state.game.player} useItemDelegate={this.useItem} />
        </div>
      </div>
    );
  }
});

window.onload = function() {
  ReactDOM.render(
    <GameScreen />,
    document.getElementById('content')
  );
}

