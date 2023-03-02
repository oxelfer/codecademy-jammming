import React from "react";

import "./PlaylistListItem.css";

export class PlaylistListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // console.log(this.props.id, this.props.playlist);
    this.props.selectPlaylist(this.props.id, this.props.playlist);
  }

  render() {
    return (
      <div className="PlaylistListItem">
        <div
          className="PlaylistListItem-information PlaylistListItem-action"
          onClick={this.handleClick}
        >
          <h3>{this.props.playlist}</h3>
        </div>
      </div>
    );
  }
}
