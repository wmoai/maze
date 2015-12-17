$(function() {
  $(window).bind("beforeunload", function() {
    return "このページを離れようとしています。";
  });

  var Game = function() {
    this.map = new Map(Math.floor(Math.random() * 3) * 2 + 19, Math.floor(Math.random() * 3) * 2 + 19);
    this.player = new Player();
  }
  Game.prototype.useItem = function(index) {
    var item = this.player.inventory[index];
    if (item) {
      var msg = item.use(this, this.player);
      if (item.isExpended()) {
        this.player.inventory.splice(index, 1);
      }
      return msg;
    }
  }
  Game.prototype.engage = function() {
    if (this.battle == null && Math.random() < 0.1) {
      this.battle = new Battle(this);
      return this.battle.proceed();
    }
  }


  var Inventory = React.createClass({
    handleClick: function(e) {
      e.target.blur();
      var index = $(e.target).data().index;
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
              return <input className="item equiped" type="button" value={name} data-index={index} onClick={self.handleClick} />
            } else {
              return <input className="item" type="button" value={name} data-index={index} onClick={self.handleClick} />
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
          <div id="hp-remain" style={{width: this.props.player.getHpPercentile()+'%'}} />
        </div>
      );
    }
  });

  var Console = React.createClass({
    render: function() {
      var message = this.props.message;
      if (!message) {
        message = [];
      }
      return (
        <div id="console">
        {
          message.map(function(line) {
            return <div>{line}</div>
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
        renderedMap: false
      };
    },
    componentDidMount: function() {
      $(document.body).on('keydown', this.handleKeydown);
      $(document.body).on('keyup', this.handleKeyup);
      $('#view').on('click', this.handleClickCanvas);
      var drawer = new Drawer(document.getElementById('view'));
      this.setState({
        drawer: drawer
      });
      drawer.view(this.state.game.map.getVision());
    },
    componentWillUnmount: function() {
      $(document.body).off('keydown', this.handleKeydown);
      $(document.body).off('keyup', this.handleKeyup);
      $('#view').off('click', this.handleClickCanvas);
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
          game.player.cure(1);
          game.map.walk();
          this.console(game.engage());
          break;
        case 39:
          game.map.turnRight();
          break;
        case 40:
          game.map.turnBack();
          break;
        }
      }
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
        this.console(game.battle.proceed());
        if (game.battle.end) {
          game.battle = null;
        }
      }
      this.setState({game: game});
      return false;
    },
    useItem: function(index) {
      var game = this.state.game;
      this.console(game.useItem(index));
      this.setState({game: game});
    },
    console: function(message) {
      if (message != null) {
        this.setState({message: message});
      }
    },
    render: function() {
      return (
        <div id="container">
          <div id="main">
            <canvas id="view" width={1000} height={1000} />
            <Console message={this.state.message} />
          </div>
          <div id="menu">
            <HP player={this.state.game.player} />
            <Inventory player={this.state.game.player} useItemDelegate={this.useItem} />
          </div>
        </div>
      );
    }
  });

  ReactDOM.render(
    <GameScreen />,
    document.getElementById('content')
  );
});

