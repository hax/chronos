import Session from './Session'

export default class Room {

	constructor(info) {
		if (info.info) {
			this.info = info.info
			this.schedule = info._schedule
		} else {
			this.info = info
			this.schedule = []
		}
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

	get schedule() {
		return this._schedule
	}
	set schedule(events) {
		this._schedule = events.map(event => new Session(event))
	}

	get available() {
		return !this.currentSession
	}

	get currentSession() {
		return this.schedule.find(running)
	}

	get comingSessions() {
		return this.schedule.filter(({status}) => status === 'coming')
	}

	get status() {
		return 'coming'
	}

	start() {
		if (this.currentSession) {
			return this.currentSession.start()
		} else return false
	}

	end() {
		if (this.currentSession) {
			return this.currentSession.end()
		} else return false
	}

}

function running({status}) {
	return status === 'assigned'
		|| status === 'ready-to-start'
		|| status === 'in-progress'
		|| status === 'ready-to-end'
		|| status === 'in-overtime'
}
