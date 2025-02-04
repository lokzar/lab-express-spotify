require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

  // Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {spotifyApi.setAccessToken(data.body['access_token'])
    console.log("Tengo el token!")
}) 
    
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

//get Artists
app.get("/",(req,res,next)=>{
    res.render("index")
})

app.get("/artist-search",(req,res,next)=>{

    spotifyApi
    .searchArtists(req.query.artistSearch)
    .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render('artist-search-results',{artist: data.body.artists})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

//get Albums
app.get("/albums/:artistId", (req,res,next)=>{
    spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data=> {
          console.log('Artist albums', data.body);
          res.render('albums',{albums: data.body.items})
        })
    .catch(err=> {
          console.error('error at get albums', err);
        })
})

app.get("/tracks/:tracksId",(req,res,next)=>{
    spotifyApi
    .getAlbumTracks(req.params.tracksId, { limit : 5, offset : 1 })
  .then(data=> {
    console.log(data.body.items);
    res.render("tracks",{tracks:data.body.items})
  } )    
  .catch(err=> {
    console.error('error at get albums', err);
  })
  });







//

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
