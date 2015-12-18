$(function () {
  $(window).bind("beforeunload", function () {
    return "このページを離れようとしています。";
  });

  var Game = function () {
    this.map = new Map(Math.floor(Math.random() * 3) * 2 + 19, Math.floor(Math.random() * 3) * 2 + 19);
    this.player = new Player();
    this.safe = 10;
    this.depth = 0;
  };
  Game.prototype.useItem = function (index) {
    var item = this.player.inventory[index];
    if (item) {
      var msg = item.use(this, this.player);
      if (item.isExpended()) {
        this.player.inventory.splice(index, 1);
      }
      return msg;
    }
  };
  Game.prototype.engage = function () {
    if (this.safe > 0) {
      this.safe--;
    } else if (this.battle == null && Math.random() < 0.05) {
      this.safe = 10;
      this.battle = new Battle(this);
      return this.battle.proceed();
    }
  };

  var Inventory = React.createClass({
    displayName: "Inventory",

    handleClick: function (e) {
      e.target.blur();
      var index = $(e.target).data().index;
      if (index % 1 === 0) {
        this.props.useItemDelegate(index);
      }
    },
    render: function () {
      var self = this;
      return React.createElement(
        "div",
        { id: "inventory" },
        this.props.player.inventory.map(function (item, index) {
          var name = item.name;
          if (!item.equipment) {
            name += '[' + item.remaining + ']';
          }
          if (item.equiped) {
            return React.createElement("input", { className: "item equiped", type: "button", value: name, "data-index": index, onClick: self.handleClick });
          } else {
            return React.createElement("input", { className: "item", type: "button", value: name, "data-index": index, onClick: self.handleClick });
          }
        })
      );
    }
  });

  var HP = React.createClass({
    displayName: "HP",

    render: function () {
      return React.createElement(
        "div",
        { id: "hp" },
        React.createElement("div", { id: "hp-remain", style: { width: this.props.player.getHpPercentile() + '%' } })
      );
    }
  });

  var Console = React.createClass({
    displayName: "Console",

    render: function () {
      var message = this.props.message;
      if (!message) {
        message = [];
      }
      return React.createElement(
        "div",
        { id: "console" },
        message.map(function (line) {
          return React.createElement(
            "div",
            null,
            line
          );
        })
      );
    }
  });

  var GameScreen = React.createClass({
    displayName: "GameScreen",

    getInitialState: function () {
      return {
        game: new Game(),
        renderedMap: false
      };
    },
    componentDidMount: function () {
      $(document.body).on('keydown', this.handleKeydown);
      $(document.body).on('keyup', this.handleKeyup);
      $('#view-box').on('click', this.handleClickCanvas);
      var drawer = new Drawer(document.getElementById('view'));
      this.setState({
        drawer: drawer
      });
      drawer.view(this.state.game.map.getVision());
    },
    componentWillUnmount: function () {
      $(document.body).off('keydown', this.handleKeydown);
      $(document.body).off('keyup', this.handleKeyup);
      $('#view-box').off('click', this.handleClickCanvas);
    },
    handleKeydown: function (e) {
      if (e.keyCode == 32 && !this.state.renderedMap) {
        this.state.drawer.map(this.state.game.map);
        this.setState({ renderedMap: true });
      }
    },
    handleKeyup: function (e) {
      var game = this.state.game;
      if (game.player.isDead()) {
        return;
      }
      if (game.battle == null) {
        switch (e.keyCode) {
          case 37:
            game.map.turnLeft();
            break;
          case 38:
            game.player.cure(game.player.maxHp / 128);
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
    handleClickCanvas: function (e) {
      var game = this.state.game;
      if (game.player.isDead()) {
        return;
      }
      if (game.battle) {
        var enemyIndex = $(e.target).data('index');
        this.console(game.battle.proceed(enemyIndex));
        if (game.battle.end) {
          game.battle = null;
        }
      }
      this.setState({ game: game });
      return false;
    },
    useItem: function (index) {
      var game = this.state.game;
      if (game.player.isDead()) {
        return;
      }
      this.console(game.useItem(index));
      this.setState({ game: game });
    },
    console: function (message) {
      if (message != null) {
        this.setState({ message: message });
      }
    },
    render: function () {
      var enemy = null;
      if (this.state.game.battle) {
        enemy = this.state.game.battle.enemies.map(function (enemy, index) {
          var style = {
            top: "70%",
            left: 100 * index + 50 + "px"
          };
          return React.createElement(
            "div",
            { className: "enemy", "data-index": index, style: style },
            enemy.name
          );
        });
      }
      return React.createElement(
        "div",
        { id: "container" },
        React.createElement(
          "div",
          { id: "main" },
          React.createElement(
            "div",
            { id: "view-box" },
            React.createElement("canvas", { id: "view", width: 1000, height: 1000 }),
            enemy
          ),
          React.createElement(Console, { message: this.state.message })
        ),
        React.createElement(
          "div",
          { id: "menu" },
          React.createElement(HP, { player: this.state.game.player }),
          React.createElement(Inventory, { player: this.state.game.player, useItemDelegate: this.useItem })
        )
      );
    }
  });

  ReactDOM.render(React.createElement(GameScreen, null), document.getElementById('content'));
});