export class Assignment {
	constructor(calendarEvent) {
		if (calendarEvent.event) {
			this.event = calendarEvent.event
		} else {
			this.event = calendarEvent
		}
		this.status = this.event.isCancelled ? 'cancelled' : ''
	}
}

export default class Session {
	constructor(calendarEvent) {
		if (calendarEvent.event) {
			this.event = calendarEvent.event
		} else {
			this.event = calendarEvent
		}
	}
	get status() {
		if (this.event.isCancelled) return 'cancelled'
		if (this._abandoned) return 'abandoned'
		if (this._ended) return 'ended'
		const now = Date.now()
		if (now > this.endTime) return 'ended'
		if (now > this.endTime - 5 * 60 * 1000) return 'ready-to-end'
		if (now < this.startTime - 15 * 60 * 1000) return 'coming'
		if (this._started) return 'in-progress'
		if (now < this.startTime + 10 * 60 * 1000) return 'ready-to-start'
		return 'in-progress'
		// return 'abandoned'
	}
	get id() {
		return this.event.id
	}
	get subject() {
		return this.event.subject
	}
	get organizer() {
		return this.event.organizer
	}
	get attendees() {
		return this.event.attendees
	}
	get startTime() {
		return new Date(this.event.start.dateTime)
	}
	get endTime() {
		return new Date(this.event.end.dateTime)
	}
	get duration() {
		return (this.endTime - this.startTime) / 60000
	}
	get sensitivity() {
		return this.event.sensitivity
	}
	get isCanceled() {
		switch (this.status) {
			case 'cancelled':
			case 'abandoned':
				return true
			default:
				return false
		}
	}
	cancel() {
		switch (this.status) {
			case 'cancelled':
			case 'abandoned':
			case 'ended':
				return false
			case 'in-progress':
			case 'ready-to-end':
			case 'in-overtime':
				throw new IllegalStatusError()
		}
	}
	postpone() {
	}
	start() {
		this._started = true
		return true
	}
	delay() {
	}
	abandon() {
		this._abandoned = true
	}
	end() {
		this._ended = true
		return true
	}
	extend() {
	}
}
