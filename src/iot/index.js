const mqtt = require('mqtt')

// const options = {
// 	servers: [
// 		{host: 'h.pax.so', port: 9001},
// 	],
// 	username: 'hax',
// 	password: 'hax',
// }
const options = require('../../iot-config')
const client = mqtt.connect(options)

client.on('connect', () => {
	console.info('mqtt broker connected!')
	switchLED('lianmengmeetingroom', true)
	setTimeout(() => {
		switchLED('lianmengmeetingroom', false)
	}, 3000)
})

client.on('message', (topic, message) => {
	console.warn('mqtt broker say:', message)
})

function switchLED(room, toggle) {
	console.info(toggle ? 'turn on' : 'turn off', 'LED of', room)
	client.publish(`chronos/led_switch/${room}`, toggle ? '1' : '0', {qos: 2, retain: true})
}

module.exports = {
	switchLED,
}
