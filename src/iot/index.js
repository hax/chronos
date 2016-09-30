import mqtt from 'mqtt'

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
	console.info('Chronos MQTT broker connected.')
})

client.on('message', (topic, message) => {
	console.warn('Chronos MQTT broker says: %s', message)
})

export function switchLED(room, toggle) {
	console.info(toggle ? 'turn on' : 'turn off', 'LED of', room)
	client.publish(`chronos/led_switch/${room}`, toggle ? '1' : '0', {qos: 2, retain: true})
}
