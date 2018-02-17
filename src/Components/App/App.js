import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props) {
    super(props);
    Spotify.getAccessToken();
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: [],
      playing: false,
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.enter = this.enter.bind(this);
    this.playSong = this.playSong.bind(this);
  }

  addTrack(track) {
    let playlist = this.state.playlistTracks;

    let trackinList = playlist.find(f => f.id === track.id);
    if (!trackinList) {
      playlist.push(track);
      this.setState({
        playlistTracks: playlist
      });
    }
  }

  removeTrack(track) {
    let playlist = this.state.playlistTracks;
    let trackinList = playlist.find(t => t.id === track.id);

    if (trackinList) {
      let pos = playlist.map(function(t) { 
        return t.id;
      }).indexOf(track.id);
      playlist.splice(pos,1);

      this.setState({
        playlistTracks: playlist
      });
    }
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(t => t.uri);
    if (trackURIs) {
      Spotify.savePlaylist(this.state.playlistName, trackURIs);
      this.updatePlaylistName('New Playlist');
      this.setState({searchResults: []});
      this.setState({playlistTracks: []});
    }
  }

  search(term) {
    if (term) {

      Spotify.search(term).then(tracks => {
        this.setState({searchResults: tracks})
      });
    }
  }

  enter(term) {
    this.search(term);
  }

  playSong(ref) {
    this.setState({ playing: !this.state.playing });
    if (!this.state.playing) {
      ref.play();
    } else {
      ref.pause();
    }
  }

  render() {
    return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search} onEnter={this.enter}/>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} isRemoval={false} onPlay={this.playSong} isPlaying={this.state.playing}/>
          <Playlist onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} isRemoval={true} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
