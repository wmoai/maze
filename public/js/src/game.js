$(function() {
  $(window).bind("beforeunload", function() {
    return "このページを離れようとしています。";
  });

  var Game = function() {
    this.state = 0; // 0:map, 1:battle
    this.map = new Map(Math.floor(Math.random() * 3) * 2 + 19, Math.floor(Math.random() * 3) * 2 + 19);
    this.chara = new Chara();
  }
  Game.prototype.useItem = function(index) {
    var item = this.chara.inventory[index];
    if (item) {
      var msg = item.use(this, this.chara);
      if (item.isExpended()) {
        this.chara.inventory.splice(index, 1);
      }
      return msg;
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
          this.props.chara.inventory.map(function(item, index) {
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
          <div id="hp-remain" style={{width: this.props.chara.getHpPercentile()+'%'}} />
        </div>
      );
    }
  });

  var Console = React.createClass({
    render: function() {
      return (
        <div id="console">
          <div>{this.props.message}</div>
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
      var drawer = new Drawer(document.getElementById('view'));
      this.setState({
        drawer: drawer
      });
      drawer.view(this.state.game.map.getVision());
    },
    componentWillUnmount: function() {
      $(document.body).off('keydown', this.handleKeydown);
      $(document.body).off('keyup', this.handleKeyup);
    },
    handleKeydown: function(e) {
      if (e.keyCode == 32 && !this.state.renderedMap) {
        this.state.drawer.map(this.state.game.map);
        this.setState({renderedMap: true});
      }
    },
    handleKeyup: function(e) {
      var game = this.state.game;
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
      this.setState({
        game: game,
        renderedMap: false
      });
      this.state.drawer.view(game.map.getVision());
    },
    useItem: function(index) {
      var game = this.state.game;
      this.console(game.useItem(index));
      this.setState({game: game});
    },
    console: function(text) {
      this.setState({message: text});
    },
    render: function() {
      return (
        <div id="container">
          <div id="main">
            <canvas id="view" width={1000} height={1000} />
            <Console message={this.state.message} />
          </div>
          <div id="menu">
            <HP chara={this.state.game.chara} />
            <Inventory chara={this.state.game.chara} useItemDelegate={this.useItem} />
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

