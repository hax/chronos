import Vue from 'vue'
import {rooms} from 'model'
import {log, fetchJSON} from 'util'

log.level = 'dd'

log.dd(rooms)

Vue.component('chronos-room', {
	template: '#chronos-room',
	props: ['room'],
})

Vue.filter('timeHHMM', d => {
	log.d(d)
	return pad0(d.getHours()) + ':' + pad0(d.getMinutes())
})

const vm = new Vue({
	el: 'main',
	data: {
		rooms,
		now: new Date,
	},
	methods: {
		startSession(room) {
			log.d('start session')
			if (room.start()) {
				fetchJSON(`/clear/${room.id}`, {method: 'POST'})
			}
		},
		endSession(room) {
			log.d('end session')
			if (room.end()) {
				fetchJSON(`/clear/${room.id}`, {method: 'POST'})
			}
		},
	},
})


setInterval(update, 1000)

function update() {
	const now = new Date()
	now.setUTCMilliseconds(0) // drop ms
	vm.now = now
}

fetchRooms()
setInterval(fetchRooms, 15000)

function fetchRooms() {
	fetchJSON('/rooms')
	.then(updateRooms => {
		updateRooms.forEach(updateRoom => {
			const room = rooms.find(room => room.id === updateRoom.info.id)
			if (room == null) {
				log.warn('No room:', updateRoom.info.id)
			} else {
				room.info = updateRoom.info
				room.schedule = updateRoom._schedule
			}
		})
	})
	.then(() => {
		log.d('rooms updated')
		// const s = rooms[0].schedule[0]
		// log.d(s.start)
	})
}

function pad0(x) {
	return ('0' + String(x)).slice(-2)
}
