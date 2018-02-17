import React, { Component } from 'react';
import './Track.css';

class Track extends Component {

	constructor(props) {
		super(props);
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
    this.playSong = this.playSong.bind(this);
	}

  addTrack() {
  	this.props.onAdd(this.props.track);
  	
  }

  removeTrack() {
  	this.props.onRemove(this.props.track);
  }

  playSong() {
    this.props.onPlay(this.refs.audio_tag); 
  }

  renderAction() {
  	if (!this.props.isRemoval) {
  		return <a className="Track-action" onClick={this.addTrack}> + </a>;
  	} else {
  		return <a className="Track-action" onClick={this.removeTrack}> - </a>;
  	}
  }

  render() {

    return (
		<div className="Track">
		  <div className="Track-information">
		    <h3>{this.props.track.name}</h3>
		    <p>
		    {this.props.track.artist} | {this.props.track.album} | <a onClick={this.playSong}> Preview </a>
		    </p>
		  </div>
        <audio ref="audio_tag" src={this.props.track.preview_url} type="audio/mpeg"></audio>
		  	{this.renderAction()}
        
		 </div>
    );
  }
}

export default Track;