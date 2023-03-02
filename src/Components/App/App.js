import React from "react";

import "./App.css";

import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";
import { PlaylistList } from "../PlaylistList/PlaylistList";

import Spotify from "../../util/Spotify";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: "Playlist Name",
      playlistTracks: [],
      playlistId: null,
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (
      this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)
    ) {
      return;
    }

    this.setState({
      playlistTracks: [...this.state.playlistTracks, track],
    });
  }

  removeTrack(track) {
    const newPlaylist = this.state.playlistTracks.filter(
      (removeTrack) => removeTrack.id !== track.id
    );

    this.setState({
      playlistTracks: newPlaylist,
    });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri);
    Spotify.savePlaylist(
      this.state.playlistName,
      trackURIs,
      this.state.playlistId
    ).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: [],
        playlistId: null,
      });
    });
  }

  selectPlaylist(id, playlistName) {
    Spotify.getPlaylist(id).then((tracks) => {
      // console.log(tracks);
      this.setState({
        playlistName: playlistName,
        playlistTracks: tracks,
        playlistId: id,
      });
    });
  }

  search(term) {
    Spotify.search(term).then((searchResults) => {
      // console.log(searchResults);
      this.setState({ searchResults: searchResults });
    });
  }

  render() {
    return (
      <div>
        <h1>
          Ja<span className="highlight">mmm</span>ing
        </h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <PlaylistList selectPlaylist={this.selectPlaylist} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}
