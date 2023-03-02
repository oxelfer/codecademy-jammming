// Point 74 - links for Spotify API stuff
const clientId = "8f26678d35f848b6a3d4f3f2b8dbdad8";
// const redirectUri = "http://localhost:3000/";
// Netlify used for deploying app
const redirectUri = "https://gentle-babka-468b7c.netlify.app";
let accessToken;
let userID;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // Check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      // This clears the parameters, allowing us to grab a new access token when it expires.
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  // Gets the userID (refactored)
  getCurrentUserID() {
    if (userID) {
      return userID;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userID = jsonResponse.id;
        // console.log("Line 46:", userID);
        return userID;
      });
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();

    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        // console.log(jsonResponse.tracks.items[0]);
        return jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          preview: track.preview_url,
          uri: track.uri,
        }));
      });
  },

  getUserPlaylists() {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return Promise.resolve(Spotify.getCurrentUserID())
      .then((response) => {
        userID = response;
        // console.log("Line 118:", userID);

        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
          headers: headers,
        });
      })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (!jsonResponse.items) {
          return [];
        }
        // console.log(jsonResponse.items);
        return jsonResponse.items.map((playlist) => ({
          playlistId: playlist.id,
          playlistName: playlist.name,
        }));
      });
  },

  getPlaylist(playlistId) {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    return Promise.resolve(Spotify.getCurrentUserID())
      .then((response) => {
        userID = response;
        // console.log("Line 108:", userID);

        return fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`,
          {
            headers: headers,
          }
        );
      })
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (!jsonResponse.items) {
          return [];
        }
        // console.log("jsonResponse - line 122: ", jsonResponse.items);
        return jsonResponse.items.map((item) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          uri: item.track.uri,
        }));
      });
  },

  // Refactored to use .getCurrentUserID() - remember Promise.resolve() to apply method!
  savePlaylist(playlistName, trackURIs, listId) {
    if (!playlistName || !trackURIs.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    if (listId) {
      return Promise.resolve(Spotify.getCurrentUserID()).then((response) => {
        userID = response;

        return fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists/${listId}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((jsonResponse) => {
            // console.log(jsonResponse.name);
            playlistName = jsonResponse.name;
          });
      });
    }

    /*     return fetch("https://api.spotify.com/v1/me", {
      headers: headers,
    })
      .then((response) => response.json()) */
    return Promise.resolve(Spotify.getCurrentUserID()).then((response) => {
      userID = response;
      // console.log("Line 88:", userID);

      return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: headers,
        method: "POST",
        body: JSON.stringify({ name: playlistName }),
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          const playlistID = jsonResponse.id;
          // console.log("Line 95", playlistID);
          // console.log("Line 96", userID);
          return fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
            {
              headers: headers,
              method: "POST",
              body: JSON.stringify({ uris: trackURIs }),
            }
          );
        });
    });
  },
};

export default Spotify;
