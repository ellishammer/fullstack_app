const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors())

const router = express.Router();

// database
const dbRoute = 'mongodb+srv://username:flcyYzZjnitdFfEG@cluster0-cax6v.mongodb.net/test?retryWrites=true&w=majority';

// connects back end with the db
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the db'));

db.on('error', console.error.bind(console, 'MongoDB connectior error'));

// logging and bodyParser - makes the request easier to read
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'))

// get method for getting data in db
router.get('/getData', (req, res) => {
	Data.find((err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

// update method
router.post('/updateData', (req, res) => {
	const { id } = req.body;
	Data.findByIdAndRemove(id, (err) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});

// delete method
router.delete('/deleteData', (req, res) => {
	const { id } = req.body;
	Data.findByIdAndRemove(id, (err) => {
		if (err) return res.send(err);
		return res.json({ success: true });
	});
});

// create method
router.post('/putData', (req, res) => {
	let data = new Data();

	const { id, message } = req.body;

	if ((!id && id !== 0) || !message) {
		return res.json({
			success: false, 
			error: 'INVALID INPUTS',
		});
	}
	data.message = message,
	data.id = id;
	data.save((err) => {
		if (err) return res.json({ successs: false, error: err });
		return res.json({ success: true });
	});
});

// append /api for our requests
app.use('/api', router)

// launch backend
app.listen(API_PORT, () => console.log('LISTENING ON PORT $(API_PORT)'));

// username is username
// password
// flcyYzZjnitdFfEG














