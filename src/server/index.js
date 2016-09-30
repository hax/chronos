const express = require('express')
const path = require('path')
const {rooms} = require('../model/rooms')
const {switchLED} = require('../iot')
// require('./sync')


const app = express()
const port = 8080

app.listen(port, () => console.log('Chronos started on port %s', port))

app.use(express.static(path.resolve(__dirname, '../client')))
app.use('/systemjs', express.static(path.resolve(__dirname, '../../node_modules/systemjs/dist')))
app.use('/vue', express.static(path.resolve(__dirname, '../../node_modules/vue/dist')))

app.get('/rooms', (req, res) => {
	res.status(200).send(rooms)
})

app.post('/clear/:roomId', (req, res) => {
	const roomId = req.params.roomId
	const room = rooms.find(room => room.id === roomId)
	if (!room) {
		res.status(404).send(`No such room: ${roomId}`)
	} else {
		switchLED(roomId, false)
		res.status(204).end()
	}
})
