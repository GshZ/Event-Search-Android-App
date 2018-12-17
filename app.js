const request = require('request');
const http = require('http');
// const https = require('https');
// const url = require('url');
const express = require('express');
const path1 = require('path');
const geohash = require('ngeohash');

const app = express();
const port = 8081;
const server = http.createServer(app);
// app.get('/', (req, res) => {
//   res.status(200).send('Hello, world!').end();
// });

// Start the server
const PORT = process.env.PORT || 8081;
// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}`);
//   console.log('Press Ctrl+C to quit.');
// });
// const url = 'https://app.ticketmaster.com/discovery/v2/venues.json?keyword=Los+Angeles+Memorial+Coliseum&apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3';
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.static(path1.join(__dirname, './dist/HW8')));
app.get('/', (req, res)=>{
  res.sendFile(path1.join(__dirname, './dist/HW8/index.html'))
});
// app.get('/:year', (req, res)=>{
//   res.send(req.params);
//   res.end;
// })

function getData(res, apiCallUrl){
  // sync
  new Promise((resolve, reject) => {
    request({
        url: apiCallUrl,
        method: 'get'
    }, (err, resp, body) => {
        if (resp && resp.statusCode === 200) {
            resolve(body);
        } else {
            reject('call API failed' + resp.statusCode + apiCallUrl);
        }
    });
  }).then(result => {
    console.log('get response from TM, ', result);
    res.send(result);
    res.end();
  }).catch(err => {
    console.log("error: " + err);
    const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
  });
}

function callSpotifyApi(req, res, artistRes){
  var SpotifyWebApi = require('spotify-web-api-node');

  // credentials are optional
  var spotifyApi = new SpotifyWebApi({
  clientId: '2400eb580f514aab9a47aebce947d409',
  clientSecret: 'd20940c8ae9d4809be977ee914079010',
  // redirectUri: `http://localhost:8080/spotifyApiCall/${req.params.keyword}`
  });


  spotifyApi.searchArtists(req.params.keyword).then(
    function(data) {
      console.log('Search artists by ', req.params.keyword, data.body);
      res.send(data.body);
      res.end();
    },
    function(err) {
      console.log("error info", err, typeof err)
      if (err.statusCode == 401){
        spotifyApi.clientCredentialsGrant().then(
          function(data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token'], typeof data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.searchArtists(req.params.keyword).then(
              function(data) {
                console.log('Search artists by ', req.params.keyword, JSON.stringify(data.body), typeof data.body);
                artistRes += ', "artists":{';
                if (data.body['artists']['items']) {
                  for (let i = 0; i < data.body['artists']['items'].length; i++ ) {
                    if (data.body['artists']['items'][i]['name'] && data.body['artists']['items'][i]['name'] === req.params.keyword){
                      artistRes += `"name":"${data.body['artists']['items'][i]['name']}"`;
                      if (data.body['artists']['items'][i]['followers'] && data.body['artists']['items'][i]['followers']['total']) {
                        artistRes += `, "followers":"${data.body['artists']['items'][i]['followers']['total']}"`;
                      }
                      if (data.body['artists']['items'][i]['popularity']) {
                        artistRes += `, "popularity":"${data.body['artists']['items'][i]['popularity']}"`;
                      }
                      if (data.body['artists']['items'][i]['external_urls'] && data.body['artists']['items'][i]['external_urls']['spotify']) {
                        artistRes += `, "check_at":"${data.body['artists']['items'][i]['external_urls']['spotify']}"`;
                      }
                      break;
                    }
                  }
                  artistRes += '}}';
                }
                console.log("artist result: ", artistRes);
                // console.log("artists data body", data.body, typeof data.body)
                let resultJson = JSON.parse(artistRes);
                res.send(resultJson);
                res.end();
              },
              function(err) {console.error(err);
                // callSpotifyApi(req, res);
              }
            );
          },
          function(err) {
            console.log('Something went wrong when retrieving an access token', err);
          }
        );
      }

      console.error(err);
      // callSpotifyApi(req, res);
    }
  );
}

app.get('/autoCom/:input', (req, res) => {
  let path = `https://app.ticketmaster.com/discovery/v2/suggest?apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3&keyword=${req.params.input}`
  new Promise((resolve, reject) => {
    request({
      url: path,
      method: 'get'
    }, (err,resp, body) => {
      if (resp && resp.statusCode === 200) {
        resolve(body);
    } else {
        reject('call API failed');
    }
    })
  }).then(data => {
    let obj = JSON.parse(data);
    if(obj['_embedded'] && obj['_embedded']['attractions']) {
      var result = new Array();
      for (let i=0; i<5 || i<obj['_embedded']['attractions'].length; i++){
        result.push(obj['_embedded']['attractions'][i]['name']);
      }
    }
    res.send(result);
    res.end;
  }).catch(err => {
    const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
    console.log("error: " + err)
  });
})

app.get('/eventsSearch', (req, res) => {
  console.log('hello word');

  let query  = req.query;
  // console.log('app.get event search in app.js: ',query);

  let geoPoint;

  if (query.from == ''){
    geoPoint = geohash.encode(query.fromLat, query.fromLon);
    // console.log(geoPoint); //works!
    let path = `https://app.ticketmaster.com/discovery/v2/events.json?sort=date,asc&keyword=${query.keyword}&geoPoint=${geoPoint}&radius=${query.distanceValue}&unit=${query.distanceUnit}&segmentId=${query.category}&apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3`;
    console.log('app.js TM events search path: ', path);
    getData(res, path);
  }
  else {
    new Promise((resolve, reject) => {
      request({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${query.from}&key=AIzaSyDongkyvMdQtin6IlrL2pLkmV40P5_nLDE`,//TODO: geocode API,
        method: 'get'
        },
        (err, res, body) => {
        if (res && res.statusCode === 200) {
            resolve(body);
        } else {
          reject(' error - -');
        }
      });
    }).then(geo => {
      let geoCode = JSON.parse(geo);
      // console.log("geoCode, ", typeof geoCode);
      // res.send(geoCode);
      geoPoint = geohash.encode(
        geoCode["results"][0]["geometry"]["location"]["lat"],
        geoCode["results"][0]["geometry"]["location"]["lng"]
        );/* TODO: geocode lat and lon */
      console.log("geoPoint, ", geoPoint);
      let path = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${query.keyword}&geoPoint=${geoPoint}&radius=${query.distanceValue}&unit=${query.distanceUnit}&segmentId=${query.category}&apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3`;

      // console.log(req);
      getData(res, path);
    }).catch(err=>{
      const errres = new Object;
      errres.error = err;
      res.send(errres);
      res.end();
      console.log("error: " + err);
    })
  }




    // res.send(response);

});

app.get('/detailSearch/:id', (req, res) => {

  // console.log('hello word');

  // console.log('app.get detail search in app.js: ', req.params);

  let path = `https://app.ticketmaster.com/discovery/v2/events/${req.params.id}?apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3`;
  // getData(res, path);
  new Promise((resolve, reject) => {
    request({
        url: path,
        method: 'get'
    }, (err, resp, body) => {
        if (resp && resp.statusCode === 200) {
            resolve(body);
        } else {
            reject('call API failed');
        }
    });
  }).then(data => {
    let obj = JSON.parse(data);
    // console.log(obj['_embedded']['attractions']);
    let result = "{";

    if (obj.hasOwnProperty('_embedded') && obj['_embedded'].hasOwnProperty('attractions') && obj['_embedded']['attractions'].length > 0){
      result += '"Artist/Team" : "';
      var attraction = obj['_embedded']['attractions'];
      for (var i = 0; i < attraction.length -1 ; i++){
        result += attraction[i]['name'] + " | ";
      }
      result += attraction[i]['name'] + '"';
    }

    if (obj.hasOwnProperty('_embedded') && obj['_embedded'].hasOwnProperty('venues') && obj['_embedded']['venues'].length > 0 && obj['_embedded']['venues'][0].hasOwnProperty('name')){
      if (result != "{") {result += ', ';}
      result += '"Venue" : "'
      result += obj['_embedded']['venues'][0]['name'] + '"';
    }
    if (obj.hasOwnProperty('dates') && obj['dates'].hasOwnProperty('start') && obj['dates']['start'].hasOwnProperty('localDate')){
      // console.log('get dates from obj, ', obj['dates']);
      if (result != "{") {result += ', ';}

      result += '"Date": "' + obj['dates']['start']['localDate'] + '"';
      if (obj['dates']['start'].hasOwnProperty('localTime')) {
        result += ', "Time": "' + obj['dates']['start']['localTime'] + '"';
      }
    }
    if (obj['classifications'] && (obj['classifications'][0]['genre']['name'] || obj['classifications'][0]['segment']['name'])) {
      if (result != "{") {result += ', ';}
      result += '"Category":"';
      if (obj['classifications'][0]['genre']['name']) {
        result += obj['classifications'][0]['genre']['name'];
      }
      if (obj['classifications'][0]['segment']['name']) {
        result += ' | ' + obj['classifications'][0]['segment']['name'];
      }
      result += '"';
    }
    if (obj['priceRanges'] && obj['priceRanges'][0]['max'] && obj['priceRanges'][0]['min']) {
      if (result != "{") {result += ', ';}
      result += '"Price Ranges":{"max":' + obj['priceRanges'][0]['max'] +', "min":'+ obj['priceRanges'][0]['min'] + '}';
    }
    if (obj['dates'] && obj['dates']['status'] && obj['dates']['status']['code']) {
      if (result != "{") {result += ', ';}
      result += '"Ticket Status":"' + obj['dates']['status']['code'] + '"';
    }
    if (obj['url']) {
      if (result != "{") {result += ', ';}
      result += '"Buy Ticket At":"' + obj['url'] + '"';
    }
    if (obj['seatmap'] && obj['seatmap']['staticUrl']) {
      if (result != "{") {result += ', ';}
      result += '"Seat Map":"' + obj['seatmap']['staticUrl'] + '"';
    }
    result += `,"id":"${req.params.id}"}`;
    let resultJson = JSON.parse(result);
    res.send(resultJson);
    res.end();
  }).catch(err => {
    const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
    console.log("error: " + err)
  });


});



app.get('/spotifyApiCall/:keyword', (req, res) => {
  // console.log('hello word');
  console.log('app.get spotify call in app.js: ', req.params.keyword);
  // var SpotifyWebApi = require('spotify-web-api-node');
  callSpotifyApi(req, res);
});

app.get('/googleCustom/:keyword', (req, res) => {
  path = `https://www.googleapis.com/customsearch/v1?q=${req.params.keyword}&cx=016780878409703986926:izkqcmrltte&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyCvRQKM1h1kw8p6ojT1r2zDKP88rajLB-M`;
  new Promise((resolve, reject) => {
    request ({
      url: path,
      method: 'get'
    }, (err, resp, body) => {
      if (resp && resp.statusCode === 200) {
        resolve(body);
    } else {
        reject('call API failed');
    }
    });
  }).then((datastring) => {
    let data = JSON.parse(datastring);
    let result = `{"${req.params.keyword}":{`;//TODO: MEMBERS AND IMAGES
    // console.log("data item type", data['items'][0], typeof data['items'][0])
    if(data['items']){
      result += `"url0":"${data['items'][0]['link']}"`;
      for(let i = 1; i<8 || data['items'][i] != undefined; i++){
        // console.log(`data['items'][i]['link']: , `, data['items'][i]['link']);
        result += `, "url${i}":"${data['items'][i]['link']}"`
        // console.log("result: ", result);
      }
    }
    result += '}}';
    let resultJson = JSON.parse(result);
    console.log("req, ", req.params.keyword)
    res.send(resultJson);
    res.end();
  }).catch(err => {
    const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
    console.log("error: " + err)
  });
});


app.get('/getArtists/:keyword/:category', (req, res) => {
  console.log("into get aritists search");
  path = `https://www.googleapis.com/customsearch/v1?q=${req.params.keyword}&cx=016780878409703986926:izkqcmrltte&imgSize=huge&imgType=news&num=9&searchType=image&key=AIzaSyCvRQKM1h1kw8p6ojT1r2zDKP88rajLB-M`;
  new Promise((resolve, reject) => {
    request ({
      url: path,
      method: 'get'
    }, (err, resp, body) => {
      if (resp && resp.statusCode === 200) {
        resolve(body);
    } else {
        reject('call API failed');
    }
    });
  }).then((datastring) => {
    let data = JSON.parse(datastring);
    let result = `{"images":{"name":"${req.params.keyword}"`;
    if(data['items']){
      // result += `"url0":"${data['items'][0]['link']}"`;
      for(let i = 0; i<8 || data['items'][i] != undefined; i++){
        result += `, "url${i}":"${data['items'][i]['link']}"`
      }
    }
    result += '}';
    console.log("image result: ", result);
    const regex = new RegExp('(Music)+');
    if (regex.test(req.params.category)) {
      callSpotifyApi(req, res, result);
    } else {
      result += ', "artists":{}}';
      let resultJson = JSON.parse(result);
      res.send(resultJson);
      res.end();
    }
  }).catch(err => {
    console.log("error: " + err)
  });
})



app.get('/getVenue/:venue', (req, res) => {
  path = `https://app.ticketmaster.com/discovery/v2/venues.json?keyword=${req.params.venue}&apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3`;
  new Promise((resolve, reject) => {
    request ({
      url: path,
      method: 'get'
    }, (err, resp, body) => {
      if (resp && resp.statusCode === 200) {
        resolve(body);
      } else {
        reject('call API failed');
      }
    });
  }).then(data => {
    let dataobj = JSON.parse(data);
    let result = new Object;
    if(dataobj['_embedded'] && dataobj['_embedded']['venues']){
      if(dataobj['_embedded']['venues'][0]['address']){
        result.address=dataobj['_embedded']['venues'][0]['address'];
      }
      if(dataobj['_embedded']['venues'][0]['city'] && dataobj['_embedded']['venues'][0]['state']){
        result.city=dataobj['_embedded']['venues'][0]['city']['name'];
        result.state=dataobj['_embedded']['venues'][0]['state']['name'];
      }
      if(dataobj['_embedded']['venues'][0]['boxOfficeInfo'] && dataobj['_embedded']['venues'][0]['boxOfficeInfo']['phoneNumberDetail']){
        result.phoneNUmber=dataobj['_embedded']['venues'][0]['boxOfficeInfo']['phoneNumberDetail'];
      }
      if(dataobj['_embedded']['venues'][0]['boxOfficeInfo'] && dataobj['_embedded']['venues'][0]['boxOfficeInfo']['openHoursDetail']){
        result.openHour=dataobj['_embedded']['venues'][0]['boxOfficeInfo']['openHoursDetail'];
      }
      if(dataobj['_embedded']['venues'][0]['generalInfo'] && dataobj['_embedded']['venues'][0]['generalInfo']['generalRule']){
        result.generalRule=dataobj['_embedded']['venues'][0]['generalInfo']['generalRule'];
      }
      if(dataobj['_embedded']['venues'][0]['generalInfo'] && dataobj['_embedded']['venues'][0]['generalInfo']['childRule']){
        result.childRule=dataobj['_embedded']['venues'][0]['generalInfo']['childRule'];
      }
      if(dataobj['_embedded']['venues'][0]['location']){
        result.location=dataobj['_embedded']['venues'][0]['location'];
      }
    }
    res.send(result);
    res.end;
  }).catch(err => {
    const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
    console.log("error: " + err)
  });
});

app.get('/getUpcoming/:venue', (req, res) => {
  let path = `https://api.songkick.com/api/3.0/search/venues.json?query=${req.params.venue}&apikey=T6sbB1pgQlCqnlgm`;
  console.log("upcoming path: ", path);
  new Promise((resolve, reject) => {
    request ({
      url: path,
      method: 'get'
    }, (err, resp, body) => {
      if (resp && resp.statusCode === 200) {
        resolve(body);
      } else {
        reject('call API failed');
      }
    });
  }).then(data => {
    let dataobj = JSON.parse(data);
    let id = `${dataobj['resultsPage']['results']['venue'][0]['id']}`;
    path = `https://api.songkick.com/api/3.0/venues/${id}/calendar.json?apikey=T6sbB1pgQlCqnlgm`;

    new Promise((resolve, reject) => {
      request ({
        url: path,
        method: 'get'
      }, (err, resp, body) => {
        if (resp && resp.statusCode === 200) {
          resolve(body);
        } else {
          reject('call API failed');
        }
      });
    }).then(data => {
      let dataobj = JSON.parse(data);
      let obj = new Object;

      let resobj = [];
      if(dataobj["resultsPage"] && dataobj["resultsPage"]["results"] && dataobj["resultsPage"]["results"]['event']) {
        console.log("how many: ", dataobj["resultsPage"]["results"]['event'].length)
        for(let i=0; i<dataobj["resultsPage"]["results"]['event'].length; i++) {
          console.log("hello")
          obj = {};
          if(dataobj["resultsPage"]["results"]['event'][i]['displayName']){
            obj.displayName=dataobj["resultsPage"]["results"]['event'][i]['displayName'];
          }
          if(dataobj["resultsPage"]["results"]['event'][i]['uri']){
            obj.uri=dataobj["resultsPage"]["results"]['event'][i]['uri'];
          }
          if(dataobj["resultsPage"]["results"]['event'][i]["performance"] && dataobj["resultsPage"]["results"]['event'][i]["performance"][0]["displayName"]){
            obj.artist=dataobj["resultsPage"]["results"]['event'][i]["performance"][0]['displayName'];
          }
          if(dataobj["resultsPage"]["results"]['event'][i]['start'] && dataobj["resultsPage"]["results"]['event'][i]['start']['date']){
            obj.date=dataobj["resultsPage"]["results"]['event'][i]['start']['date'];
          }
          if(dataobj["resultsPage"]["results"]['event'][i]['start'] && dataobj["resultsPage"]["results"]['event'][i]['start']['time']){
            obj.time=dataobj["resultsPage"]["results"]['event'][i]['start']['time'];
          }
          if(dataobj["resultsPage"]["results"]['event'][i]['type']){
            obj.type=dataobj["resultsPage"]["results"]['event'][i]['type'];
          }
          console.log("obj with i,", obj)
          resobj.push(obj);
        }

      }
      console.log("resobj, ", typeof resobj)
      res.send(resobj);
      res.end;
    }).catch(err => {
      const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
      console.log("error: " + err)
    });

  }).catch(err => {
    const errres = new Object;
    errres.error = err;
    res.send(errres);
    res.end();
    console.log("error: " + err)
  });
});


app.listen(port, () => {
  console.log(`we are live on ${port}`);
});

// let options={
// 	hostname: 'app.ticketmaster.com',
// 	port: 443,
//   path: '/discovery/v2/venues.json?keyword=Los+Angeles+Memorial+Coliseum&apikey=z7lVnpLc64LaVCSFF4MVytzSlKZqzLk3',
// 	method: 'GET'
// };
// let options2 = {
//   hostname: 'maps.googleapis.com',
//   port: 443,
//   path: '/maps/api/geocode/json?address=niversity+of+Southern+California+CA&key=AIzaSyDongkyvMdQtin6IlrL2pLkmV40P5_nLDE',
//   method: 'GET',
// };

