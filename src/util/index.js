export {log, Logger, ConsoleAppender} from './logger'
export {default as fetchJSON, debugJSON} from './fetchJSON'

export function inspect(obj, options) {
	return JSON.stringify(obj)
}
