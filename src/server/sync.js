const mqtt = require('mqtt')
const GraphAPI = require('../api')
const {rooms} = require('../model/rooms')
const {switchLED} = require('../iot')

const config = require('../../api-config')
const graph = new GraphAPI(config)


function retriveCals() {
	const todayStart = new Date//('2016-09-29')
	todayStart.setHours(0)
	todayStart.setMinutes(0)
	todayStart.setSeconds(0)
	todayStart.setMilliseconds(0)
	const todayEnd = new Date//('2016-09-29')
	todayEnd.setHours(23)
	todayEnd.setMinutes(59)
	todayEnd.setSeconds(59)
	todayEnd.setMilliseconds(999)

	console.info('time range:', todayStart, todayEnd)

	rooms.forEach(room => {
		const roomId = room.id + '@baixing.com'
		graph.getCalendarView(roomId, todayStart, todayEnd).then(result => {
			room.schedule = result.value
		})
	})
}


const alerted = {
	end: new Set
}

function alertEnd() {
	rooms.forEach(room => {
		console.log(`check ${room.id}, ${room.schedule.length}/${alerted.end.size}`)
		room.schedule.forEach(event => {
			const reminderTime = new Date(event.end.dateTime) - 300 * 1000
			if (!alerted.end.has(event.id) && !event.isCanceled && new Date() >= reminderTime) {
				switchLED(room.id, true)
				alerted.end.add(event.id)
			}
		})
	})
}

retriveCals()
setInterval(retriveCals, 30000)

setInterval(alertEnd, 5000)


//TODO: fetch real event from organizer
// result.value.slice(0, 1).forEach(event => {
// 	const owner = event.organizer.emailAddress.address
// 	const start = event.start.dateTime
// 	const end = event.end.dateTime
// 	graph.getCalendarView(owner, start, end)
// })
