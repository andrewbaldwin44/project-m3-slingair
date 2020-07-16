const { v4: uuidv4 } = require('uuid');
const request = require('request-promise');
require('dotenv').config();

function findUser(allUsers, name) {
  return allUsers.find(user => user.givenName == name);
}

function handleHomepage(req, res) {
  res.render('./pages/homepage.ejs', { title: 'Sling Air' });
}

async function handleSeatSelection(req, res) {
  const response = await request({ uri: 'https://journeyedu.herokuapp.com/slingair/flights',
                                     json: true });
  const allFlights = response.flights

  res.render('./pages/seat-select', { title: 'Seat Selection', allFlights });
}

async function handleFlight(req, res) {
  const { flightNumber } = req.params;
  const response = await request({
    uri: `https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`,
    json: true
  });

  const flight = response[flightNumber]

  if (response.status == 200) {
    res.status(200).json({ status: 200, flight });
  } else {
    res.status(401).json({ status: 401, message: 'Flight not found' });
  }
}

async function newFlightPurchase(req, res) {
  const customerInfo = req.body;

  try {
    const registerUser = await request({
      uri: 'https://journeyedu.herokuapp.com/slingair/users',
      method: 'POST',
      body: customerInfo,
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json"
      },
      json: true
    });

    confirmationNumber = registerUser.reservation.id;

    res.status(201).json({ status: 201, confirmationNumber });
  }
  catch (e) {
    res.status(401).json({ status: 401, e });
  }
}

async function confirmedFlightPurchase(req, res, next) {
  const { id } = req.params;
  const response = await request({
    uri: `https://journeyedu.herokuapp.com/slingair/users/${id}`,
    json: true
  });

  const customer = response.data;
  console.log(response, response.data);

  if (response.status == 200) {
    res.render('./pages/flight-confirmed', { title: 'Take to the Skies!', customer })
  } else next();
}

function findFlight(req, res) {
  res.render('./pages/find-flight', { title: 'Find your Flight!' });
}

async function flightLookup(req, res) {
  const { name } = req.body;
  const allUsers = await request({
    uri: 'https://journeyedu.herokuapp.com/slingair/users/',
    json: true
  });

  const user = findUser(allUsers, name);

  if (user) {
    res.status(201).json({ status: 201, userID: user.id });
  } else res.status(401).json({ status: 401, message: 'Reservation not found!' });
}

function handleAdmin(req, res) {
  res.render('./pages/admin', { title: 'Admin' })
}

function confirmAuthentication(req, res) {
  const password = req.body.password;

  console.log(process.env.PASSWORD)

  if (password == process.env.PASSWORD) {
    res.status(201).json({ status: 201 });
  } else res.status(401).json({ status: 401, message: 'Wrong password!' });
}

function handleAuthenticated(req, res) {
  res.send('cool')
}

function handleFourOhFour(req, res) {
  res.status(404).send('Page not Found!')
}

module.exports = { handleHomepage, handleSeatSelection, handleFlight,
                   newFlightPurchase, confirmedFlightPurchase,
                   findFlight, flightLookup, handleAdmin, confirmAuthentication,
                   handleAuthenticated, handleFourOhFour }
