const http = require('http');
const fs = require('fs');

const requestListener = function (req, res) {    

  if (req.url.includes("/images/")) {

    fs.readFile(req.url.substring(1), function(err, data) {
      if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'image/jpeg'});
      res.end(data);
    })
    
  } else if (req.url.includes("well-known/acme-challenge/Iqv94Vz72-52YB1dvF63lNPxTij8OWFSDKjALiRKLgg")) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end("Iqv94Vz72-52YB1dvF63lNPxTij8OWFSDKjALiRKLgg.J1C9f7bOoW-Ex3EZ3zlNfO1P6SIHBOR9l-XOXStLM20");
  } else if (req.url.includes("/rates/")) {

    fs.readFile("rates.json", function(err, data) {
      if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(data);
    })

  } else {

    fs.readFile("feed.json", function(err, data) {
      if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(data);
    })
    
  }

}

const server = http.createServer(requestListener);
server.listen(80); 
