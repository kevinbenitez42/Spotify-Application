
var scopes = {
  library: {
    user-library-read: 'user-libary-read',
    user-libary-modify: 'user-libary-modify'
  },
  playlists:{
    playlistReadPrivate  : 'playlist-read-private',
    playlistModifyPublic : 'playlist-modify-public',
    playlistModifyPrivate: 'playlist-modify-private'
  },
  listeningHistory:{
    userReadRecentlyPlayed: 'user-read-recently-played',
    userTopRead: 'user-top-read'
  },
  users:{
    userReadPrivate: 'user-read-private',
    userReadEmail: 'user-read-email',
    userReadBirthdate: 'user-read-birthdate'
  },
  playback:{
    streaming: 'streaming'
  },
  spotifyConnect{
    userModifyPlaybackState: 'user-modify-playback-state',
    userReadCurrentlyPlaying: 'user-read-currently-playing',
    userReadPlaybackState: 'user-read-playback-state'
  },
  Follow{
  userFollowModify: 'user-follow-modify',
  userFollowRead: 'user-follow-read'
  }
}

module.exports = scopes
