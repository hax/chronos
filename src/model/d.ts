interface Room {
	id: Id<Room>
	name: string
	location: string
	size: integer
}

interface RoomState {
	available: boolean
	current: Session&SessionState|Assignment?
	schedule: Map<Time, Session|Assignment>
}

interface RoomEvent {
	type: 'available'|'unavailable'
}

interface SessionState {
	status: 'coming'|'ready-to-start'|'in-progress'|'ready-to-end'|'in-overtime'|'ended'|'abandoned'
	cancel()
	postpone()
	start()
	delay()
	abandon()
	end()
	extend()
}

interface SessionStatusChangeEvent {
	type: 'ready-to-start'|'ready-to-end'|'overtime'|'abandoned'
		|'canceled'|'postponed'|'started'|'delayed'|'abandoned'|'ended'|'extended'
	source: 'timing'|'action'
}

interface Session {
	id: Id<Session>
	title: string
	organizer: User
	attendees: Set<User>
	duration: Duration
	visibility: 'open-door'|'closed-door'
}

interface Assignment {
	id: Id<Assignment>
	title: string
	admin: User
	duration: Duration
}

interface User {
	id: Id<User>
	name: string
}

type Id = string
type Time = integer // 0 ~ 96 (0:00 ~ 24:00)
type Duration = integer
