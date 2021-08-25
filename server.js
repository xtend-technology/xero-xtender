require('dotenv').config()

const express = require('express');
const session = require('express-session');
const  xero_node = require('xero-node')
const qs = require('querystring')
const axios = require('axios')
const cors = require('cors')
const path = require('path')

let app = express()

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsOptions))

app.use(session({
    secret: 'something crazy',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/bank_transactions', require('./routes/bank_transactions'))
app.use('/invoices', require('./routes/invoices'))
app.use('/user', require('./routes/user'))
app.use('/customers', require('./routes/customers'))
app.use('/xero_token', require('./routes/xero_token'))

const client_id_xero = process.env.CLIENT_ID_XERO
const client_secret_xero = process.env.CLIENT_SECRET_XERO
const redirectUri_xero = process.env.REDIRECT_URL_XERO
//const scopes_xero = process.env.SCOPES_XERO
//const scopes_xero_formatted = scopes_xero.replace(/\s/g, "%20")

//app.get('/', function(req, res) {
//    const url = `https://login.xero.com/identity/connect/authorize?client_id=${client_id_xero}&scope=${scopes_xero_formatted}&response_type=code&redirect_uri=${redirectUri_xero}`
//    console.log(url)
//  res.send(`<a href=${url}>Connect to Xero</a>`);
//})



app.get('/callback', async function(req, res) {
//    const url = "http://localhost:5000" + req.originalUrl;

    console.log(req.query.code)
    const requestToken = req.query.code
    //Authorization: "Basic " + base64encode(client_id + ":" + client_secret)
    
    const config = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${client_id_xero}:${client_secret_xero}`).toString('base64')}
    }
    
    //The request body will need to contain the grant type (authorization_code), code and redirect_uri

//grant_type=authorization_code
//code=The authorization code you received in the callback
//redirect_uri=The same redirect URI that was used when requesting the code
    
    const requestBody = {
        grant_type: 'authorization_code',
        code: requestToken,
        redirect_uri: redirectUri_xero
        
    }
    
    axios.post(`https://identity.xero.com/connect/token`, qs.stringify(requestBody), config)
        .then(
    (result) => {
//        const accessToken = result.data.access_token,
//        const idToken = result.data.id_token,
//        const accessTokenExp = result.data.expires_in,
//        const refreshToken = result.data.refresh_token
            let time = new Date()
            let xeroTokenExpiryTime = new Date(time.getTime() + result.data.expires_in * 1000)
        
//        console.log('Access token ' + result.data.access_token)
            
            //Try date transform to millisecs from epoque
        
        Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

const add_half_hour = new Date().addHours(.5)

const time_in_hour = add_half_hour.getTime()

const time_now = new Date().getTime()
        
        console.log('access token ' + result.data.access_token)
        console.log('id token ' + result.data.id_token)
        console.log('access token expiry ' + result.data.expires_in)
        console.log('refresh token ' + result.data.refresh_token)
        
        req.session.xero_access_token = result.data.access_token
        req.session.xero_access_token_expiry = xeroTokenExpiryTime.getTime()
        req.session.xero_refresh_token = result.data.refresh_token
        
        const timeToExp = req.session.xero_access_token_expiry - time_now
        
        console.log('access token expiry epoch' + req.session.xero_access_token_expiry)
        console.log('Time at generation ' + time_now)
        console.log('Milliseconds to Xero Access token exp  ' + timeToExp)
        
    
        
        
    })
        .then(() => {
        res.redirect('/tenants')
//        res.send('Should have access token')
    }).catch((err) => {
        console.log(err)
        res.send('err' + err)
    })
    
})

app.get('/tenants', (req, res) => {
    const config = {
        headers: { 'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.session.xero_access_token}
    }
    
    axios.get('https://api.xero.com/connections', config).then((response) => {
        return response.data[0]
//        console.log(response.data[0].tenantId)
            
    }).then((x)=> {
            
        req.session.tenantId = x.tenantId
        console.log('Saved session tenant Id ' + req.session.tenantId)
            
        })
        .then(() => {
//        res.send('Xero access token' + req.session.xero_access_token + 'Tenant ID ' + req.session.tenantId)
        
        //Redirect to react
        if (process.env.NODE_ENV === 'production') {
            res.redirect('/')
        } else {
           res.redirect('http://localhost:3000') 
        }
        
    })
        .catch((err) => {
        console.log(err)
        res.send('Error ' + err)
    })
})

// Serve static assets if in production. Make this after other routes which shouldn't be redirected to react
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
  console.log("Your Xero bank transactions app is running at localhost:" + PORT)
})
