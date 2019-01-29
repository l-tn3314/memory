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
     
    let tiles = this.genTiles();
    this.state = { 
      exposedLetter: null, 
      exposedTileIndex: null, 
      ignoreClicks: false, 
      numClicks: 0, 
      pairsMatched: 0, 
      shuffledTiles: tiles 
    };
  }

  resetGame() {
    let tiles = this.genTiles();
    this.setState({ 
      exposedLetter: null, 
      exposedTileIndex: null, 
      ignoreClicks: false, 
      numClicks: 0, 
      pairsMatched: 0, 
      shuffledTiles: tiles 
    });
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

  incrementClickCount() {
    this.setState((state, props) => (
      _.assign({}, state, { numClicks: state.numClicks + 1 })));
  }

  incrementMatchCount() {
    this.setState((state, props) => (
      _.assign({}, state, { pairsMatched: state.pairsMatched + 1 })));
  }

  setTileNoOnClick(i, letter) {
    this.setState(function(state, props) {
      let tiles = _.slice(state.shuffledTiles, 0, state.shuffledTiles.length);
      tiles[i] = <Tile letter={letter} exposed={true} onClick={null} />;

      return _.assign({}, state, { shuffledTiles: tiles });
    });
  }

  setTileExposed(i, letter, isExposed) {
    this.setState(function(state, props) {
      let tiles = _.slice(state.shuffledTiles, 0, state.shuffledTiles.length);
      tiles[i] = <Tile letter={letter} exposed={isExposed} onClick={() => this.tileClick(i, letter)} />;

      return _.assign({}, state, { shuffledTiles: tiles });
    });
  }

  hideTile(i, letter) {
    this.setTileExposed(i, letter, false);
  }

  exposeTile(i, letter) {
    this.setTileExposed(i, letter, true);
    this.setTileNoOnClick(i, letter);
  }

  guessTile(i, letter) {
    this.exposeTile(i, letter);

    // if not a match, hide tile values
    if (letter != this.state.exposedLetter) {
      let exposedInd = this.state.exposedTileIndex;
      let exposedLetter = this.state.exposedLetter;
      setTimeout(function() {
        this.hideTile(exposedInd, exposedLetter);
        this.hideTile(i, letter);

        this.setState((state, props) => (
          _.assign({}, state, { ignoreClicks: false })));
      }.bind(this), 1000);     

      this.setState((state, props) => (
        _.assign({}, state, { ignoreClicks: true })));
    } else {
      this.incrementMatchCount();
    }

    this.setState((state, props) => (
      _.assign({}, state, { exposedLetter: null, exposedTileIndex: null })));
  }

  tileClick(i, letter) {
    if (this.state.ignoreClicks) {
      return;
    }
 
    if (this.state.exposedLetter == null) {
      this.setState((state, props) => (
        _.assign({}, state, { exposedLetter: letter, exposedTileIndex: i })));

      this.exposeTile(i, letter);
    } else {
      this.guessTile(i, letter);
    }

    this.incrementClickCount();
  }

  render() {
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

    return <div>
        {tiles}
        <div>
          <br />
          <div className="row">
            <div className="column">
              <button onClick={this.resetGame.bind(this)}>Reset Game</button>
            </div>
            <div className="column">
              <p>Pairs matched: {this.state.pairsMatched}</p>
            </div>
            <div className="column">
              <p>Number of clicks: {this.state.numClicks}</p>
            </div>
          </div>
        </div>
      </div>;
  }
}

