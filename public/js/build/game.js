$(function () {
  var Game = function () {
    this.state = 0; // 0:map, 1:battle
    this.map = new Map(Math.floor(Math.random() * 3) * 2 + 19, Math.floor(Math.random() * 3) * 2 + 19);
    this.chara = new Chara();
  };
  Game.prototype.useItem = function (index) {
    var item = this.chara.inventory[index];
    if (item) {
      var msg = item.use(this, this.chara);
      if (item.isExpended()) {
        this.chara.inventory.splice(index, 1);
      }
      return msg;
    }
  };

  var Inventory = React.createClass({
    displayName: 'Inventory',

    handleClick: function (e) {
      var index = $(e.target).data().index;
      if (index % 1 === 0) {
        this.props.useItemDelegate(index);
      }
    },
    render: function () {
      var self = this;
      return React.createElement(
        'div',
        { id: 'inventory' },
        this.props.chara.inventory.map(function (item, index) {
          var name = item.name;
          if (!item.equipment) {
            name += '[' + item.remaining + ']';
          }
          if (item.equiped) {
            return React.createElement('input', { className: 'item equiped', type: 'button', value: name, 'data-index': index, onClick: self.handleClick });
          } else {
            return React.createElement('input', { className: 'item', type: 'button', value: name, 'data-index': index, onClick: self.handleClick });
          }
        })
      );
    }
  });

  var HP = React.createClass({
    displayName: 'HP',

    render: function () {
      return React.createElement(
        'div',
        { id: 'hp' },
        React.createElement('div', { id: 'hp-remain', style: { width: this.props.chara.getHpPercentile() + '%' } })
      );
    }
  });

  var Console = React.createClass({
    displayName: 'Console',

    render: function () {
      return React.createElement(
        'div',
        { id: 'console' },
        React.createElement(
          'div',
          null,
          this.props.message
        )
      );
    }
  });

  var GameScreen = React.createClass({
    displayName: 'GameScreen',

    getInitialState: function () {
      return {
        game: new Game(),
        message: [],
        renderedMap: false
      };
    },
    componentDidMount: function () {
      $(document.body).on('keydown', this.handleKeydown);
      $(document.body).on('keyup', this.handleKeyup);
      var drawer = new Drawer(document.getElementById('view'));
      this.setState({
        drawer: drawer
      });
      drawer.view(this.state.game.map.getVision());
    },
    componentWillUnmount: function () {
      $(document.body).off('keydown', this.handleKeydown);
      $(document.body).off('keyup', this.handleKeyup);
    },
    handleKeydown: function (e) {
      if (e.keyCode == 32 && !this.state.renderedMap) {
        this.state.drawer.map(this.state.game.map);
        this.setState({ renderedMap: true });
      }
    },
    handleKeyup: function (e) {
      var game = this.state.game;
      switch (e.keyCode) {
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
      this.setState({
        game: game,
        renderedMap: false
      });
      this.state.drawer.view(game.map.getVision());
    },
    useItem: function (index) {
      var game = this.state.game;
      this.console(game.useItem(index));
      this.setState({ game: game });
    },
    console: function (text) {
      this.setState({ message: text });
    },
    render: function () {
      return React.createElement(
        'div',
        { id: 'container' },
        React.createElement(
          'div',
          { id: 'main' },
          React.createElement('canvas', { id: 'view', width: 1000, height: 1000 }),
          React.createElement(Console, { message: this.state.message })
        ),
        React.createElement(
          'div',
          { id: 'menu' },
          React.createElement(HP, { chara: this.state.game.chara }),
          React.createElement(Inventory, { chara: this.state.game.chara, useItemDelegate: this.useItem })
        )
      );
    }
  });

  $(window).bind("beforeunload", function () {
    return "このページを離れようとしています。";
  });

  ReactDOM.render(React.createElement(GameScreen, null), document.getElementById('content'));
});