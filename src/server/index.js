require('./sync')

const {createServer} = require('http')

createServer((request, response) => {
	const [f, segments] = router(request.url)
	response.setHeader('Access-Control-Allow-Origin', '*')
	f({request, response, segments})
}).listen(1337)

function router(url) {
	const segments = url.split('/').slice(1)
	const route = [routers[segments[0]], segments]
	return route[0] ? route : [routers['404'], null]
}

const {rooms} = require('../model/rooms')
const {switchLED} = require('../iot')

const routers = {
	rooms({request, response}) {
		response.write(JSON.stringify(rooms))
		response.end()
	},
	reset({request, response, segments}) {
		if (request.method !== 'POST') {
			response.writeHead(405)
			response.end()
		}
		const [, roomId] = segments
		const room = rooms.find(room => room.id === roomId)
		if (!room) {
			response.writeHead(404)
			response.end('Room not found:', roomId)
		} else {
			switchLED(roomId, false)
			response.end()
		}
	},
	'404'({response}) {
		response.writeHead(404)
		response.end(JSON.stringify('Not found'))
	}
}
