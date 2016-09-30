import Vue from 'vue'
import {rooms} from 'model'
import {log, fetchJSON} from 'utils'

log.level = 'dd'

log.dd(rooms)

Vue.component('chronos-room', {
	template: '#chronos-room',
	props: ['room'],
})

const vm = new Vue({
	el: 'main',
	data: {
		rooms,
		now: new Date,
	},
	methods: {
		show(event) {
			log.d(event)
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
setInterval(fetchRooms, 5000)

function fetchRooms() {
	fetchJSON('/rooms')
	.then(updateRooms => {
		updateRooms.forEach(updateRoom => {
			const room = rooms.find(room => room.id === updateRoom.info.id)
			if (room == null) {
				log.warn('No room:', updateRoom.info.id)
			} else {
				room.info = updateRoom.info
				room.schedule = updateRoom.schedule
			}
		})
	})
	.then(() => {
		log.d('rooms updated', rooms[0])
	})
}
