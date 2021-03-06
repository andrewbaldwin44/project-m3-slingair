'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {
  handleHomepage,
  handleSeatSelection,
  getFlight,
  newFlightPurchase,
  confirmedFlightPurchase,
  findFlight,
  flightLookup,
  handleFourOhFour
} = require('./handlers/handlers');

const {
  handleAdmin,
  confirmAuthentication,
  handleAuthenticated,
  handleUsers,
  handleFlights,
  handleFindUser
} = require('./handlers/admin-handlers');

const PORT = process.env.PORT || 8000;

app
.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
.use(morgan('dev'))
.use(express.static('public'))
.use(bodyParser.json())
.use(express.urlencoded({extended: false}))
.set('view engine', 'ejs')

.get('/', handleHomepage)
.get('/seat-select', handleSeatSelection)
.get('/flights/:flightNumber', getFlight)
.post('/new-user', newFlightPurchase)
.get('/flight-confirmed/:id', confirmedFlightPurchase)
.get('/find-flight', findFlight)
.post('/flight-lookup', flightLookup)
.get('/admin', handleAdmin)
.post('/confirm-authentication', confirmAuthentication)
.get('/admin-authenticated', handleAuthenticated)
.get('/admin-authenticated/users', handleUsers)
.get('/admin-authenticated/flights', handleFlights)
.post('/admin-authenticated/find-user', handleFindUser)
.get('*', handleFourOhFour)

.listen(PORT, () => console.log(`Listening on port ${PORT}`));
