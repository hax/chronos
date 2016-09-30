const Vue = require('vue')
const {rooms} = require('../model/rooms.js')
// const Session = require('../model/Session.js')

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
			console.log(event)
		},
	},
})

console.log(vm.rooms[0].coming)


setInterval(update, 1000)

function update() {
	const now = new Date()
	now.setUTCMilliseconds(0) // drop ms
	vm.now = now
}

fetchRooms()
setInterval(fetchRooms, 5000)

function fetchRooms() {
	fetch('http://localhost:1337/rooms')
	.then(response => response.json())
	.then(updateRooms => {
		updateRooms.forEach(updateRoom => {
			const room = rooms.find(room => room.id === updateRoom.info.id)
			if (room == null) {
				console.warn('No room:', updateRoom.info.id)
			} else {
				room.info = updateRoom.info
				room.schedule = updateRoom.schedule
			}
		})
	})
	.then(() => {
		console.log('rooms updated', rooms[0])
	})
}
