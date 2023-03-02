import React from "react";

import { PlaylistListItem } from "../PlaylistListItem/PlaylistListItem";
import Spotify from "../../util/Spotify";

import "./PlaylistList.css";

export class PlaylistList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { playlists: [] };

    this.getUserPlaylists = this.getUserPlaylists.bind(this);
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists().then((playlistArray) => {
      // console.log("In PlaylistList: ", playlistArray);
      this.setState({ playlists: playlistArray });
    });
  }

  componentDidMount() {
    this.getUserPlaylists();
  }

  render() {
    return (
      <div className="PlaylistList">
        <h2>Local Playlists</h2>
        {this.state.playlists.map((playlist) => (
          <PlaylistListItem
            key={playlist.playlistId}
            id={playlist.playlistId}
            playlist={playlist.playlistName}
            selectPlaylist={this.props.selectPlaylist}
          />
        ))}
      </div>
    );
  }
}
