import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Tile from './tile.jsx';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.shuffledTiles = this.genTiles();
    let tiles = this.shuffledTiles;
    this.state = { left: false, exposedLetter: null, exposedTileIndex: null, shuffledTiles: tiles };
  }

  genTiles() {
    let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    let lettersCopy = letters.slice();
    let letterPairs = _.concat(letters, lettersCopy);
    let shuffledLetters = _.shuffle(letterPairs);
    let tiles = [];
    for (let i = 0; i < shuffledLetters.length; i++) {
      let j = i;
      tiles.push(<Tile letter={shuffledLetters[j]} exposed={false} onClick={() => this.tileClick(j, shuffledLetters[j])} />);
    }
    return tiles; 
  }

  swap(_ev) {
    let state1 = _.assign({}, this.state, { left: !this.state.left });
    this.setState(state1);
  }

  hax(_ev) {
    alert("hax!");
  }

  hideTile(i, letter) {
    this.setState(function(state, props) {
      let tiles = _.slice(state.shuffledTiles, 0, state.shuffledTiles.length);
      tiles[i] = <Tile letter={letter} exposed={false} onClick={() => this.tileClick(i, letter)} />;

      let newState = _.assign({}, state, { shuffledTiles: tiles });
      return newState;
    });
  
  }

  exposeTile(i, letter) {
    /*let tiles = _.slice(this.state.shuffledTiles, 0, this.state.shuffledTiles.length);
    tiles[i] = <Tile letter={letter} exposed={true} onClick={() => this.tileClick(i, letter)} />;

    this.setState(function(state, props) {
      let newState = _.assign({}, state, { shuffledTiles: tiles });
      return newState;
    });*/

    this.setState(function(state, props) {
      let tiles = _.slice(state.shuffledTiles, 0, state.shuffledTiles.length);
      tiles[i] = <Tile letter={letter} exposed={true} onClick={() => this.tileClick(i, letter)} />;

      let newState = _.assign({}, state, { shuffledTiles: tiles });
      return newState;
    });

  }

  guessTile(i, letter) {
    this.exposeTile(i, letter);

    // process guess here
    console.log(this.state);
    // if not a match, hide tile values
    if (letter != this.state.exposedLetter) {
      let exposedInd = this.state.exposedTileIndex;
      let exposedLetter = this.state.exposedLetter;
      setTimeout(function() {
        this.hideTile(exposedInd, exposedLetter);
        this.hideTile(i, letter);
      }.bind(this), 1000);     
    }

    console.log("guess");
    this.setState(function(state, props) {
      let newState = _.assign({}, state, { exposedLetter: null, exposedTileIndex: null });
      return newState;
    });

  }

  tileClick(i, letter) {
    if (this.state.exposedLetter == null) {
      //this.exposeTile(i, letter);
      this.setState(function(state, props) {
        let newState = _.assign({}, state, { exposedLetter: letter, exposedTileIndex: i });
        return newState;
      });

      console.log("new state..");
      this.exposeTile(i, letter);
    } else {
      this.guessTile(i, letter);
    }
  }

  render() {
    let button = <div className="column" onMouseMove={this.swap.bind(this)}>
      <p><button onClick={this.hax.bind(this)}>Click Me</button></p>
    </div>;

    let blank = <div className="column">
      <p>Nothing here.</p>
    </div>;
    let tiles = <div className="tiles">
      <div className="row">
        {this.state.shuffledTiles[0]}
        {this.state.shuffledTiles[1]}
        {this.state.shuffledTiles[2]}
        {this.state.shuffledTiles[3]}
      </div>
      <div className="row">
        {this.state.shuffledTiles[4]}
        {this.state.shuffledTiles[5]}
        {this.state.shuffledTiles[6]}
        {this.state.shuffledTiles[7]}
      </div>
      <div className="row">
        {this.state.shuffledTiles[8]}
        {this.state.shuffledTiles[9]}
        {this.state.shuffledTiles[10]}
        {this.state.shuffledTiles[11]}
      </div>
      <div className="row">
        {this.state.shuffledTiles[12]}
        {this.state.shuffledTiles[13]}
        {this.state.shuffledTiles[14]}
        {this.state.shuffledTiles[15]}
      </div>
    </div>;

    if (this.state.left) {
      return <div>
        <div className="row">
        {button}
        {blank}
        </div>
        
        {tiles}
      </div>;
    }
    else {
      return <div className="row">
        {blank}
        {button}
      </div>;
    }
  }
}

