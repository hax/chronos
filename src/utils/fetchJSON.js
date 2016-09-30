import {inspect} from 'util'
import {log} from './logger'

export default function fetchJSON(url, options) {
	return fetch(url, options)
		.then(response => {
			log.info('fetch json from:', url)
			if (response.status == 400) {
				return response.text().then(text => {
					try {
						return JSON.parse(text.slice(1))
					} catch (e) {
						log.error(text)
						return {}
					}
				})
			} else if (response.status >= 300) {
				log.warn(response.status, response.statusText)
			} else {
				log.info(response.status, response.statusText)
			}
			return response.json()
		})
		.then(debugJSON)
}

export function debugJSON(result) {
	const output = inspect(result, {depth: null, colors: true})
	if (result.error) {
		log.error(output)
		throw new Error(result.error)
	} else {
		log.d(output)
		return result
	}
}
