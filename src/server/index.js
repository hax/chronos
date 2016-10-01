import express from 'express'
import path from 'path'
import {rooms} from '../model'
import {switchLED} from '../iot'
// require('./sync')

const app = express()
const port = 8080

app.listen(port, () => console.log('Chronos HTTP server started on port %s.', port))

app.use('/',	express.static(path.resolve(__dirname, '../client')))
app.use('/model',	express.static(path.resolve(__dirname, '../model')))
app.use('/util',	express.static(path.resolve(__dirname, '../util')))

app.use('/systemjs',	express.static(path.resolve(__dirname, '../../node_modules/systemjs/dist')))
app.use('/systemjs-plugin-babel',	express.static(path.resolve(__dirname, '../../node_modules/systemjs-plugin-babel')))
app.use('/fetch',	express.static(path.resolve(__dirname, '../../node_modules/whatwg-fetch')))
app.use('/vue',	express.static(path.resolve(__dirname, '../../node_modules/vue/dist')))

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
