import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

	constructor(props) {
		super(props);
		 this.state = {
	      term: '',
	    };
		this.search = this.search.bind(this);
		this.enter = this.enter.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

	search() {
		this.props.onSearch(this.state.term);
	}

	enter(e) {
		if (e.key === 'Enter') { 
			this.props.onEnter(this.state.term);
			e.preventDefault();
		}
	}

	handleTermChange(e) {
		this.setState({ term: e.target.value });
		e.preventDefault();
	}

  render() {
    return (
		<div className="SearchBar" onClick={this.search}>
		  <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.enter}/>
		  <a>SEARCH</a>
		</div>
    );
  }
}

export default SearchBar;