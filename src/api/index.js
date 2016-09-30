import {fetchJSON} from './util'
import {requestAccessToken} from './auth'

export default class GraphAPI {

	constructor(appConfig, apiVersion = 'v1.0') {
		this.config = appConfig
		this.version = apiVersion
		this.tokenState = null
	}

	isTokenExpired() {
		return this.tokenState == null || Date.now() >= this.tokenState.expires_on * 1000
	}

	requestToken() {
		if (!this.isTokenExpired()) {
			return Promise.resolve(this.tokenState.access_token)
		} else {
			return requestAccessToken(this.config)
				.then(result => this.tokenState = result)
				.then(() => this.tokenState.access_token)
		}
	}

	get(url) {
		return this.requestToken().then(token =>
			fetchJSON(`${this.config.serviceRoot}/${this.version}/${url}`, {
				headers: {
					Authorization: token,
					Accept: 'application/json'
				}
			})
		)
	}

	getCalendarView(user, start, end) {
		const startDateTime = dateTime(start)
		const endDateTime = dateTime(end)
		return this.get(`users/${user}/calendarView?startDateTime=${startDateTime}&endDateTime=${endDateTime}`)
	}

	getCalendars(user) {
		return this.get(`users/${user}/calendars`)
	}

	getCalendarGroups(user) {
		return this.get(`users/${user}/calendarGroups`)
	}

	getEvents(user) {
		return this.get(`users/${user}/events`)
	}

	getEventInstances(user, event, start, end) {
		const startDateTime = dateTime(start)
		const endDateTime = dateTime(end)
		return this.get(`users/${user}/events/${event}?startDateTime=${startDateTime}&endDateTime=${endDateTime}`)
	}

}

function dateTime(t) {
	if (t instanceof Date) return t.toISOString()
	else return t
}
