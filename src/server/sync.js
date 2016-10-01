import GraphAPI from '../api'
import {rooms} from '../model'
import {switchLED} from '../iot'
import {log} from '../util'

log.level = 'd'

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

	log.d('time range:', todayStart, todayEnd)

	rooms.forEach(room => {
		const roomId = room.id + '@baixing.com'
		graph.getCalendarView(roomId, todayStart, todayEnd).then(result => {
			room.schedule = result.value
			log.d(room.schedule)
		})
	})
}


const alerted = {
	end: new Set
}

function alertEnd() {
	rooms.forEach(room => {
		log.info(`check ${room.id}, ${room.schedule.length}/${alerted.end.size}`)
		room.schedule.forEach(session => {
			if (!alerted.end.has(session.id) && session.status == 'ready-to-end') {
				switchLED(room.id, true)
				alerted.end.add(session.id)
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
