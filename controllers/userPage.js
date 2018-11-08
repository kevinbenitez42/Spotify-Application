var express         = require('express');
var bodyParser      = require('body-parser');
var Router          = require('express-promise-router');
var router           = Router()
var jsonParser      = bodyParser.json();
var url             = require('url')
var cookieParser    = require('cookie-parser')
var SpotifyRequest  = require('../helpers/SpotifyRequest')
var InternalRequest = require('../helpers/InternalRequest')
var queryString     = require('query-string')
var middlewares     = [cookieParser(), jsonParser]
var StringBuilder   = require('../helpers/StringBuilder')
var ArrayOp         = require('../helpers/ArrayOp');

var stringBuilder   = new StringBuilder();
var arrayOp         = new ArrayOp();

router.get('/', (req,res,next) =>{
  res.render('login.html')
})
router.get('/testTS', (req,res,next) =>{
  res.render("ts_index.html")
})

router.get('/user_page', (req,res,next) =>{
  res.render("login.html")
})
router.get('/userInformation', middlewares, async (req,res,next)=>{

  const url = 'https://api.spotify.com/v1/me'
  const access_token = req.cookies.access_token;
  var spotifyRequest = new SpotifyRequest('GET', url, 10, 0, access_token)
  var result =  await spotifyRequest.query()
  console.log(result)
  res.send(result);

})

router.get('/getSingleArtistInformation/:id',middlewares, async(req,res,next)=>{
  const id     = req.params.id
  const url = `https://api.spotify.com/v1/artists/${id}`
  const access_token = req.cookies.access_token
  var spotifyRequest = new SpotifyRequest('GET', url, 0, 0, access_token)
  var result = await spotifyRequest.query()
  res.send(result);
})

router.get('/getMultipleArtistInformation',middlewares, async(req, res, next)=>{
  const id     = req.params.id
  var query    = req.query
  var id_param = req.query.ids
  id_param     = id_param.split(",")
  var n = undefined
  if( id_param.length < 50){
    n = id_param.length
  }
  else{
    n = 50
  }

  var result = await arrayOp.map_reduce(id_param, n, async (x) =>{
    var query = stringBuilder.create_comma_seperated_query_parameter(x)
    var url =  `https://api.spotify.com/v1/artists?ids=${query}`
    const access_token = req.cookies.access_token
    var spotifyRequest = new SpotifyRequest('GET', url, undefined, undefined, access_token)
    var my_result      = await spotifyRequest.query()
    return new Promise(resolve => {
      resolve(my_result.artists)
    })
  })

  console.log(result)
  res.json(result)

})


router.get('/getArtistTopTracks/:id/:country', middlewares, async(req,res,next) => {
  const artistID = req.params.id
  const country  = req.params.country
  const params = {country:country}
  const url = `https://api.spotify.com/v1/artists/${artistID}/top-tracks`
  const access_token = req.cookies.access_token
  var spotifyRequest = new SpotifyRequest('GET', url, undefined, undefined, access_token)
  var result = await spotifyRequest.query()
  res.send(result);
})

/*GET USERS TOP ARTISTS BY GENRES*/

router.get('/getUsersTopArtists/:limit/:offset', middlewares, async(req,res,next) => {
  const limit = req.params.limit
  const offset = req.params.offset
  const access_token = req.cookies.access_token
  const artist_ids = req.body;

  res.end();

  const url = `https://api.spotify.com/v1/me/top/artists`
  var spotifyRequest = new SpotifyRequest('GET', url, limit, offset, access_token)
  var result = await spotifyRequest.query()
  res.send(result)

})


router.get('/getCategories/:limit/:offset/:country', middlewares, async(req,res,next) => {
  var country = req.params.country
  var limit   = req.params.limit
  var offset  = req.params.offset
  if(limit === 'none' || offset === 'none'){
    limit  = undefined
    offset = undefined
  }
  if(country === 'none'){
    country = ''
  }
  var access_token = req.cookies.access_token
  const url= 'https://api.spotify.com/v1/browse/categories'
  var spotifyRequest = new SpotifyRequest('GET', url, limit, offset, access_token)
  var result = await spotifyRequest.query();
  res.send(result.categories.items)
})

/*GET CATEGORIES PLAYLISTS*/

router.get('/getArtistByCategories/:category/:limit/:offset/:country',middlewares, async(req,res,next) =>{
  var category = req.params.category;
  var country  = req.params.country;
  var limit    = req.params.limit;
  var offset   = req.params.offset;
  var category_id = undefined;

  if(limit === 'none' || offset === 'none'){
    limit  = undefined
    offset = undefined
  }
  if(country === 'none'){
    country = ''
  }

  var url = 'http://localhost:3000/userPage/getCategories/none/none/none'
  var access_token = req.cookies.access_token
  var internalRequest = new InternalRequest('GET', url, access_token)
  var result = await internalRequest.query();

  for(let i = 0; i < result.length; i++){
    if(result[i]['name'].toLowerCase() === category){
      category_id = result[i]['id'];
    }
  }

  if(category_id === undefined){ res.status(400).send('Category name doesnt exist')}
  url = `https://api.spotify.com/v1/browse/categories/${category_id}/playlists`

  var spotifyRequest  = new SpotifyRequest( 'GET', url, limit, offset, access_token)
  result = await spotifyRequest.query();
  result = result.playlists.items
  result = result.map((x) =>{return x['id']})

  url = 'http://localhost:3000/userPage/userInformation'
  internalRequest = new InternalRequest('GET', url, access_token)
  var user_id = await internalRequest.query()
  user_id = user_id.id;
  var artist_ids = []
  var artists = []

await Promise.all(result.map(
  async (x) => {
    let playlist_id = x;
    url = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`
    spotifyRequest = new SpotifyRequest('GET', url, limit, offset,access_token)
    var playlist_tracks = await spotifyRequest.query()

    var playlist_artists = playlist_tracks.items.map((x) => {return x.track.artists })
    playlist_artists.map((artist_arr) => {artist_arr.map((artist) =>{
      artist_ids.push(artist.id)
      artists.push(artist)
    })})
    return x;
  }
)).then(function(values){})


var uniq_artists = arrayOp.uniq_elem_func(artists,function(x,y){
  if(x.id === y.id){
    return true;
  } else {
    return false;
  }
})


res.json(uniq_artists);

})

/*GET Artists by search*/
router.get('/searchArtists/:limit/:offset/:artist', middlewares,async (req,res,next)=>{
   var artist = req.params.artist
   var limit  = req.params.limit
   var offset = req.params.offset
   var access_token = req.cookies.access_token

   if(limit === 'none' || offset === 'none'){
     limit  = undefined
     offset = undefined
   }

   var url = `https://api.spotify.com/v1/search?q=${artist}*&type=artist`
   var spotifyRequest = new SpotifyRequest('GET', url, limit, offset, access_token)
   var result = await spotifyRequest.query()
   res.end()
})

router.get('/getAlbumsFromArtist/:artistID', middlewares, async(req,res,next)=>{
  limit  = undefined
  offset = undefined
  var id     = req.params.artistID
  var url    =`https://api.spotify.com/v1/artists/${id}/albums`
  var access_token = req.cookies.access_token
  var spotifyRequest = new SpotifyRequest('GET', url, limit, offset, access_token)
  var result = await spotifyRequest.query()
  res.json(result)
})

router.get('/getAlbumTracks/:limit/:offset/:albumID', middlewares, async(req,res,next)=>{

  var limit  = req.params.limit
  var offset = req.params.offset
  if(limit === 'none' || offset === 'none'){
    limit  = undefined
    offset = undefined
  }

  var id     = req.params.albumID
  var url    =`https://api.spotify.com/v1/albums/${id}/tracks`
  var access_token = req.cookies.access_token
  var spotifyRequest = new SpotifyRequest('GET', url, limit, offset, access_token)
  var result = await spotifyRequest.query()
  res.send(result)
})

router.get('/trackAnalysis', middlewares,async(req,res,next) =>{

  var id_param = req.query.ids
  var n   = 100
  id_param     = id_param.split(",")
  var access_token = req.cookies.access_token
  var my_result = undefined
  var result = await arrayOp.map_reduce(id_param, n, async (x) =>{
    var query = stringBuilder.create_comma_seperated_query_parameter(x)
    var url =  `https://api.spotify.com/v1/audio-features/?ids=${query}`
    const access_token = req.cookies.access_token
    var spotifyRequest = new SpotifyRequest('GET', url, undefined, undefined, access_token)
     my_result         = await spotifyRequest.query()
    return new Promise(resolve => {
      resolve(my_result.audio_features)
    })
  })
  var finalResult = []
  for(let i = 0; i< result.length ;i++){
    for(let j = 0; j < result[i].length; j++){
      finalResult.push(result[i][j])
    }
  }
 res.json({result : finalResult})
})


router.get('/artistAnalysis/:limit/:offset/:artistID', middlewares, async (req,res,next)=>{
  var limit    = req.params.limit
  var offset   = req.params.offset

  var id       = req.params.artistID
  var url = `http://localhost:3000/userPage/getAlbumsFromArtist/${id}`
  var access_token = req.cookies.access_token
  var internalRequest = new InternalRequest('GET', url, access_token)
  var result = await internalRequest.query()

  var album_ids = result.items.map(album =>{return album.id})

  var track_ids = []
  for(let i of album_ids){
    url = `http://localhost:3000/userPage/getAlbumTracks/none/none/${i}`
    internalRequest = new InternalRequest('GET', url, access_token)
    result = await internalRequest.query()
    for(let j of result.items){
      track_ids.push(j.id)
    }
  }

  var query_param = stringBuilder.create_comma_seperated_query_parameter(track_ids)
  var url = `http://localhost:3000/userPage/trackAnalysis?ids=${query_param}`
  internalRequest = new InternalRequest('GET', url, access_token)
  var results = await internalRequest.query()
  results = results.result


  var finalVal = {
    danceability: 0.0,
    energy: 0.0,
    speechiness: 0.0,
    acousticness: 0.0,
    instrumentalness: 0.0,
    liveness: 0.0,
    valence: 0.0,
    tempo: 0.0,
    duration_ms: 0.0
  }

var acc = 0
  for(info of results ){
    if(info !== null){
      acc = acc + 1
      finalVal = {
        danceability: finalVal.danceability + info.danceability,
        energy: finalVal.energy + info.energy,
        speechiness: finalVal.speechiness + info.speechiness,
        acousticness: finalVal.acousticness +info.acousticness,
        instrumentalness: finalVal.instrumentalness + info.instrumentalness,
        liveness: finalVal.liveness + info.liveness,
        valence: finalVal.valence + info.valence,
        tempo: finalVal.tempo + info.tempo,
        duration_ms: finalVal.duration_ms + info.duration_ms
      }
    }
  }
  var finalVal = {
    danceability: finalVal.danceability / acc,
    energy: finalVal.energy / acc,
    speechiness: finalVal.speechiness / acc,
    acousticness: finalVal.acousticness / acc,
    instrumentalness: finalVal.instrumentalness / acc,
    liveness: finalVal.liveness / acc,
    valence: finalVal.valence / acc,
    tempo: finalVal.tempo / acc,
    duration_ms: finalVal.duration_ms / acc
  }

  res.json(finalVal)
})



module.exports = router
