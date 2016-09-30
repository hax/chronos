export const LogLevel = {
	'*':	-1,
	'ddd':	0,
	'dd':	1,
	'd':	2,
	'info':	3,
	'warn':	4,
	'error':	5,
}

export class Logger {
	constructor(level = 'warn', appender = ConsoleAppender) {
		this.level = level
		this.appenders = []
		if (appender) this.addAppender(appender)
	}
	set level(v) {
		if (typeof v === 'number') {
			this._level = v|0
		} else if (typeof v === 'string' && v in LogLevel) {
			this._level = LogLevel[v]
		} else {
			throw new Error('Invalid log level: %s', v)
		}
	}
	get level() {
		return this._level
	}
	addAppender(...appenders) {
		this.appenders.push(...appenders)
	}
	ddd(...args) {
		this._log(LogLevel.ddd, args)
	}
	dd(...args) {
		this._log(LogLevel.dd, args)
	}
	d(...args) {
		this._log(LogLevel.d, args)
	}
	info(...args) {
		this._log(LogLevel.info, args)
	}
	warn(...args) {
		this._log(LogLevel.warn, args)
	}
	error(...args) {
		this._log(LogLevel.error, args)
	}
	_log(level, args) {
		if (level < this.level) return
		for (const a of this.appenders) {
			a._log(level, args)
		}
	}
}

export const ConsoleAppender = {
	_log(level, args) {
		if (level >= LogLevel.error) console.error(...args)
		else if (level >= LogLevel.warn) console.warn(...args)
		else if (level >= LogLevel.info) console.info(...args)
		else console.log(...args)
	}
}

export const log = new Logger
