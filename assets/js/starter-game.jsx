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

    this.state = { 
      num_clicks: 0, 
      pairs_matched: 0, 
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
    if (view.game.failed_guess) {
      console.log("prev guess failed");
      this.hideTiles();
    }

  }

  resetGame() {
    this.channel.push("reset", {})
        .receive("ok", (resp) => { this.setState(resp.game); });  
  }

  tileClick(i) {
    this.channel.push("click", { tile_ind: i })
        .receive("ok", (resp) => { 
          if (resp.game.failed_guess) {
            console.log("guess failed");
            setTimeout(function() { this.hideTiles(); }.bind(this), 1000);
          }        
          this.setState(resp.game); 
        });
  }

  hideTiles() {
    console.log("hide tiles...");
    this.channel.push("hide_tiles", {})
        .receive("ok", (resp) => { this.setState(resp.game) });
  }

  render() {
    console.log(this.state);
    let shuffledTiles = [];
    for (let i = 0; i < this.state.shuffled_letters.length; i++) {
      let j = i;
      shuffledTiles.push(<Tile letter={this.state.shuffled_letters[j]} exposed={this.state.tiles_exposure[j]} onClick={() => { this.tileClick(j); }} />); 
    }

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

