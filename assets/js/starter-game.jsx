import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import Tile from './tile.jsx';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel} />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props); 
     
    this.channel = props.channel;

    let tiles = this.genTiles();
    this.state = { 
      exposedLetter: null, 
      exposedTileIndex: null, 
      ignoreClicks: false, 
      numClicks: 0, 
      pairsMatched: 0, 
      shuffledTiles: tiles,
      shuffled_letters: Array(16).fill("Z"),
      tiles_exposure: Array(16).fill(false),  
    };

    this.channel
        .join()
        .receive("ok", this.set_view.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp); });
  }

  set_view(view) {
    console.log("new view...", view);
    this.setState(view.game);
  }

  resetGame() {
    this.channel.push("reset", {})
        .receive("ok", (resp) => { this.setState(resp.game); });  
    //let tiles = this.genTiles();
    //this.setState({ 
    //  exposedLetter: null, 
    //  exposedTileIndex: null, 
    //  ignoreClicks: false, 
    //  numClicks: 0, 
    //  pairsMatched: 0, 
    //  shuffledTiles: tiles 
    //});
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
  tileClick(i) {
    this.channel.push("click", { tile_ind: i })
        .receive("ok", (resp) => { this.setState(resp.game); });
  }

  render() {
    console.log(this.state);
    let shuffledTiles = [];
    for (let i = 0; i < this.state.shuffled_letters.length; i++) {
      let j = i;
      shuffledTiles.push(<Tile letter={this.state.shuffled_letters[j]} exposed={this.state.tiles_exposure[j]} onClick={() => { this.tileClick(j); }} />); 
    }

    console.log(shuffledTiles);
  
    let tiles = <div className="tiles">
      <div className="row">
        {shuffledTiles[0]}
        {shuffledTiles[1]}
        {shuffledTiles[2]}
        {shuffledTiles[3]}
      </div>
      <div className="row">
        {shuffledTiles[4]}
        {shuffledTiles[5]}
        {shuffledTiles[6]}
        {shuffledTiles[7]}
      </div>
      <div className="row">
        {shuffledTiles[8]}
        {shuffledTiles[9]}
        {shuffledTiles[10]}
        {shuffledTiles[11]}
      </div>
      <div className="row">
        {shuffledTiles[12]}
        {shuffledTiles[13]}
        {shuffledTiles[14]}
        {shuffledTiles[15]}
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
              <p>Pairs matched: {this.state.pairs_matched}</p>
            </div>
            <div className="column">
              <p>Number of clicks: {this.state.num_clicks}</p>
            </div>
          </div>
        </div>
      </div>;
  }
}

