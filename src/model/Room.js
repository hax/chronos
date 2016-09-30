const {currentTime, TIME_UNIT} = require('./time.js')

class Room {

	constructor(info) {
		this.info = info
		this._schedule = []
	}

	get id() {
		return this.info.id
	}
	get name() {
		return this.info.name
	}
	get location() {
		return this.info.location
	}
	get size() {
		return this.info.size
	}

	get available() {
		return !this.current
	}

	get currentEvent() {
		return this.schedule.find(event => event.current)
	}

	get comingEvents() {
		return this.schedule.filter(event => true)
	}

	get status() {
		return 'coming'
	}

	start() {
	}
	end() {
	}

	get schedule() {
		return this._schedule
	}
	set schedule(s) {
		this._schedule = s.map(event => new Event(event))
	}
}

class Event {
	constructor(info) {
		this.info = info
	}
	get startTime() {
		const d = new Date(this.info.start.dateTime)
		return pad0(d.getHours()) + ':' + pad0(d.getMinutes())
	}
	get endTime() {
		const d = new Date(this.info.end.dateTime)
		return pad0(d.getHours()) + ':' + pad0(d.getMinutes())
	}
	get subject() {
		return this.info.subject
	}
	get current() {
		const d0 = new Date(this.info.start.dateTime)
		const d1 = new Date(this.info.end.dateTime)
		const now = new Date()
		return now > d0 && now < d1
	}
}

function pad0(x) {
	return String(x).padStart(2, '0')
}

function running(it) {
	return it.status === 'assigned'
		|| it.status === 'in-progress'
		|| it.status === 'ready-to-end'
		|| it.status === 'in-overtime'
}

module.exports = Room
