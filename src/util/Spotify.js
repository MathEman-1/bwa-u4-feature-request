

const apiKey = '_7J7PmvGON_E3SueuRLDgk_1QR6UeBkwzCALn3WW2NVSVG9cbDeqodBGOyEdML4wZZz3VkwYtucSp9a_oH6kAY8vMzg4iQK7Thz2O96yRf05yyWKDKWVrHup1eV5WnYx';

const clientID = '7bb7fb4ce69f4045aa7d9a8926d29989';
//const redirectURI = 'https://matheman-jammming.surge.sh/';
const redirectURI = 'http://localhost:3000/';

var accessToken = '';

const Spotify = {


	getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
    },

	getAccessToken() {
		var params = this.getHashParams();
		let newaccessToken = params.access_token;
		let expiresTime = params.expires_in;
		if (newaccessToken) {
			accessToken = newaccessToken;
			return accessToken;
		} else if (newaccessToken && expiresTime) {
			accessToken = newaccessToken;
			window.setTimeout(() => accessToken = '', expiresTime * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			window.location.replace(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`);
		}
	},

  search(term) {
  	let tempaccessToken = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {
        headers: { Authorization: `Bearer ${tempaccessToken}` }
      }).then(response => {
        if (response.ok) {
              return response.json();
          }
          throw new Error('Request failed!');
      }, networkError => { console.log(networkError.message);
      }).then(jsonResponse => {
        if (jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview_url: track.preview_url,
          }));
        }
      });
	},

	savePlaylist(playlistName, trackUris) {
		if (!playlistName && !trackUris) {
			return;
		}

		let useraccessToken = accessToken;
		let headers = { Authorization: `Bearer ${useraccessToken}` };
		let userId = '';
		let playlistID = '';

		fetch(
			`https://api.spotify.com/v1/me`,
	      	{ headers: { Authorization: `Bearer ${useraccessToken}`} })

			.then(response => {

	        if (response.ok) {
	              return response.json();
	          }
	          throw new Error('Request failed!');
	      }, networkError => { console.log(networkError.message);
	      }).then(jsonResponse => {
	        if (jsonResponse) {
	        	userId = jsonResponse.id;
	          return jsonResponse.id;
	        }
	      }).then(newuserId => {
	      	fetch(
	    	`https://api.spotify.com/v1/users/${userId}/playlists`, {
	    	method: 'POST',
	    	headers: {
		    	'Authorization': `Bearer ${useraccessToken}`,
		    	'Content-Type': 'application/json',
	    	},
	    	body: JSON.stringify({ name: playlistName }),
		}).then(response => {
	        if (response.ok) {
	              return response.json();
	          }
	          throw new Error('Request failed!');
	      }, networkError => { console.log(networkError.message);
	      }).then(jsonResponse2 => {
	        if (jsonResponse2) {
	          playlistID = jsonResponse2.id;
	          return jsonResponse2.id;
	        }
	      }).then(newplaylistId => {
	      	fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, 
	      	{
	    	method: 'POST',
	    	headers: {
		    	'Authorization': `Bearer ${useraccessToken}`,
		    	'Content-Type': 'application/json',
	    	},
	    	body: JSON.stringify({ uris: trackUris }),
		}).then(response => {
	        if (response.ok) {
	              return response.json();
	          }
	          throw new Error('Request failed!');
	      }, networkError => { console.log(networkError.message);
	      }).then(jsonResponse => {
	        if (jsonResponse) {
	          return jsonResponse.id;
	        }
	      })
	      })
	      });
	}	
};
export default Spotify;
