const Room = require('./Room.js')

const rooms = [
	{id: 'lianmengmeetingroom',	name: '效率',	location: '206',	size: 50},
	{id: 'chaogemeetingroom',	name: '朝歌',	location: '206',	size: 6},
	{id: 'muyemeetingroom',	name: '牧野',	location: '206',	size: 10},
	{id: 'guandumeetingroom',	name: '官渡',	location: '206',	size: 4},
	{id: 'duanshelimeetingroom',	name: '断舍离',	location: '808',	size: 10},
	{id: 'jingzhemeetingroom',	name: '简单',	location: '1808',	size: 20},
	{id: 'jianshuomeetingroom',	name: '企鹅',	location: '1808',	size: 5},
	{id: 'sofameetingroom',	name: '冰山',	location: '1808',	size: 4},
	{id: 'qinfangmeetingroom',	name: '琴房',	location: '1806',	size: 6},
	{id: '19fmeetingroom',	name: '海鸥',	location: '1908',	size: 5},
	{id: '2409huiyishi',	name: '共创',	location: '2409',	size: 30},
].slice(0, 1).map(info => new Room(info))

function roomDistance(a, b) {
	return Math.abs(a.location - b.location)
}

module.exports = {
	rooms,
	roomDistance,
}
