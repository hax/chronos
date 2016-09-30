import Session from './Session'

export default class Room {

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
		return this.schedule.filter(session => true)
	}

	get status() {
		return 'coming'
	}

	start() {
	}
	end() {
	}

}

function running({status}) {
	return status === 'assigned'
		|| status === 'in-progress'
		|| status === 'ready-to-end'
		|| status === 'in-overtime'
}
