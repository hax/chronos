require('isomorphic-fetch')
const {inspect} = require('util')

const LogLevel = {
	debug: 1,
	info: 2,
	warn: 4,
	error: 8,
}

const LOG_LEVEL = LogLevel.warn

function fetchJSON(url, options) {
	return fetch(url, options)
		.then(response => {
			if (LOG_LEVEL < LogLevel.info) console.info('fetch json from:', url)
			if (response.status == 400) {
				return response.text().then(text => {
					try {
						return JSON.parse(text.slice(1))
					} catch (e) {
						if (LOG_LEVEL < LogLevel.error) console.error(text)
						return {}
					}
				})
			} else if (response.status >= 300) {
				if (LOG_LEVEL < LogLevel.warn) console.warn(response.status, response.statusText)
			} else {
				if (LOG_LEVEL < LogLevel.info) console.info(response.status, response.statusText)
			}
			return response.json()
		})
		.then(debugJSON)
}

function debugJSON(result) {
	if (result.error) {
		if (LOG_LEVEL < LogLevel.error) dir('error', result)
		throw new Error(result.error)
	} else {
		if (LOG_LEVEL < LogLevel.info) dir('info', result)
		return result
	}
}

function dir(level = 'log', obj) {
	console[level](inspect(obj, {depth: null, colors: true}))
}

module.exports = {
	fetchJSON,
	debugJSON,
}
