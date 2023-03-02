import React from "react";

import "./TrackList.css";

import { Track } from "../Track/Track";

export class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks &&
          this.props.tracks.map((track) => (
            <Track
              key={track.id}
              track={track}
              onAdd={this.props.onAdd}
              isRemoval={this.props.isRemoval}
            />
          ))}
        {this.props.playlistTracks &&
          this.props.playlistTracks.map((track) => (
            <Track
              key={track.id}
              track={track}
              onRemove={this.props.onRemove}
              isRemoval={this.props.isRemoval}
            />
          ))}
      </div>
    );
  }
}
