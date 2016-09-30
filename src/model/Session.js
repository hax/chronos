export class Assignment {
	constructor(calendarEvent) {
		this.event = calendarEvent
		this.status = calendarEvent.isCancelled ? 'cancelled' : ''
	}
}

export default class Session {
	constructor(calendarEvent) {
		this.event = calendarEvent
		this.status = calendarEvent.isCancelled ? 'cancelled' : ''
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
	get start() {
		return Date.parse(this.event.start.dateTime)
	}
	get end() {
		return Date.parse(this.event.end.dateTime)
	}
	get duration() {
		return (this.end - this.start) / 60000
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
	}
	delay() {
	}
	abandon() {
		this.status = 'abandoned'
	}
	end() {
		this.status = 'ended'
	}
	extend() {
	}
}
