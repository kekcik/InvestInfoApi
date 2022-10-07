import { createServer } from 'http'
import { readFile } from 'fs'
import { Provider, Notification } from 'apn'
import express from 'express'

// const fs = require('fs');
// const low = require('lowdb')

import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

// SERVER 
const app = express()
app.use(express.json())

app.listen(80)

// DATABASE
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
const { users } = db.data

// APN
var deviceToken = 'dffaf29239cd82fa43b18e8e4383a6a41d62e6e515def02c63b391c884404ef2';
var pfx = join(__dirname, '/push_investApi.p12');
var options = {
    pfx: pfx,
    passphrase: '123321',
    production: false
};
var apnProvider = new Provider(options);

// METHODS 
app.get('/register', async (req, res) => {
    console.log(req.query.uid);
    const user = users.find((u) => u.uid === req.query.uid)
    if (user != undefined) {
        res.send("Пользователь есть " + user)
    } else {

        let nextUser = {
            'name1': req.query.name1,
            'name2': req.query.name2, 
            'uid': req.query.uid, 
            'token': req.query.token
        }

        users.push(nextUser)
        await db.write()

        res.send("Пользователя нет, но зареган" + nextUser)
    }
})

app.get('/images/:name', async (req, res) => {
    console.log('images/' + req.params.name);
    readFile('images/' + req.params.name, function(err, data) {
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.end(data);
    })
})

app.get('/rates', async (req, res) => {
    readFile("rates.json", function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
    })
})

app.get('/push', async (req, res) => {
    let notification = new Notification();
    notification.alert = "¡Hola, тестовый пуш с сервера";
    notification.topic = "trofimov.mobi.InvestInfo"

    apnProvider.send(notification, [deviceToken]).then( (response) => { 
        res.writeHead(200);
        console.log(response);
        res.end("notififcation was sended on " + response);
    });
})

app.get('/feed', async (req, res) => {
    readFile("feed.json", function(err, data) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
    })
})
