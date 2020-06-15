const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const username = require('../config.json').username;
const password = require('../config.json').password;
const dbName = require('../config.json').dbName;

const API_PORT = 3001;
const app = express();
app.use(cors())

const router = express.Router();

const dbRoute = `mongodb+srv://${username}:${password}@cluster0-ccrwv.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(
	dbRoute, 
	{ 
		useNewUrlParser: true,
		useUnifiedTopology: true
 	}
);


let db = mongoose.connection;

db.once('open', () => console.log('connected to the db'));

db.on('error', console.error.bind(console, 'MongoDB connectior error'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'))

router.get('/getData', (req, res) => {
	Data.find((err, data) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true, data: data });
	});
});

router.post('/updateData', (req, res) => {
	const { id } = req.body;
	Data.findByIdAndRemove(id, (err) => {
		if (err) return res.json({ success: false, error: err });
		return res.json({ success: true });
	});
});

router.delete('/deleteData', (req, res) => {
	const { id } = req.body;
	Data.findByIdAndRemove(id, (err) => {
		if (err) return res.send(err);
		return res.json({ success: true });
	});
});

// TODO
// router.delete('/purgeData', (req, res) => {
// 	Data.find((err, data) => {
// 		if (err) return res.json({ success: false, error: err });
// 		// re
// 		// TODO: finish db purge method
// 	})
// })

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

app.use('/api', router)

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
