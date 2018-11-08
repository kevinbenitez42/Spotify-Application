var apiInformation = {
  clientID     : 'e3d585e8b715444781bd1b88bf623ca8',
  clientSecret :'2ee2da15e6864a03ae56d069c66d77c9',
  scopes       : 'user-library-read user-library-modify '+
                 'playlist-read-private playlist-modify-public '+
                 'playlist-modify-private playlist-read-collaborative '+
                 'user-read-recently-played user-top-read user-read-private '+
                 'user-read-email user-read-birthdate streaming '+
                 'user-modify-playback-state user-read-currently-playing '+
                 'user-read-playback-state user-follow-modify '+
                 'user-follow-read ',
  redirect_uri: 'http://localhost:3000/login/getAuthenticationCode'
}

module.exports = apiInformation
