import React from 'react';
import _ from 'lodash';

class Tile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { exposed: false }
  }

  exposeTile() {
    this.setState({exposed: true});
    console.log('ha');
  }

  render() {
    return (
      <div className="tile" onClick={this.props.onClick}>
        {this.props.exposed && this.props.letter}
      </div>
    )
  }
}

export default Tile;
