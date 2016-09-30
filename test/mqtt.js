const mqtt = require('mqtt')

const options = {
	servers: [
		{host: '192.168.2.200', port: 1883},
		// {host: 'h.pax.so', port: 9001},
	],
	username: 'chronos',
	password: 'haxnodelay',
}


const client  = mqtt.connect(options);

// 'mqtt://test.mosquitto.org'


client.on('connect', () => {
	console.log('connected!')
})

client.subscribe('presence');
client.publish('presence', 'Hello mqtt');

client.on('message', function (topic, message) {
  console.log(message.toString());
});

client.end();
