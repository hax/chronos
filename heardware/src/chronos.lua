local heartbeat_i = 0
local chronos_timer_id = getFreeTimerId()

local chronos_led = LED:new(config.chronos.led_pin, config.chronos.led_lit)

local topics = {
  debug_toggle_led = "chronos/debug/toggle_led/" .. config.chronos.name,
  led_switch = "chronos/led_switch/" .. config.chronos.name,
  heartbeat = "chronos/status/heartbeat/" .. config.chronos.name,
  alert = "chronos/status/alert/" .. config.chronos.name,
}

local MQTT = {
  QOS = {[0] = 0, [1] = 1, [2] = 2},
  RETAIN = 1,
  AUTO_RECONNECT = 1,
  connected = 0,
}

local function led_switch(flag)
  print('[INFO]switch_led: ' .. flag)
  if (flag == 1) then
    chronos_led:on()
  elseif (flag == 0) then
    chronos_led:off()
  end
end

local function mqtt_system_report(client)
  client:publish("/status/" .. config.hostname, "online, ip: " .. wifi.sta.getip(), MQTT.QOS[2], MQTT.RETAIN)
  tmr.alarm(chronos_timer_id, 10000, tmr.ALARM_AUTO, function()
    if (MQTT.connected == 1) then
      heartbeat_i = heartbeat_i + 1
      client:publish(topics.heartbeat, 'up ' .. heartbeat_i * 10 .. 's', MQTT.QOS[2], MQTT.RETAIN)
    end
  end)
end

local function connect()
  MQTT.connected = 1
  print(config.mqtt_broker.name .. " connected")

  mqtt_system_report(chronos_mqtt_client)

  chronos_mqtt_client:subscribe(topics.debug_toggle_led, 2, function(conn)
    print("subscribed " .. topics.debug_toggle_led .. " success")
    chronos_mqtt_client:subscribe(topics.led_switch, 2, function(conn) print("subscribed " .. topics.led_switch .. " success") end)
  end)

  chronos_mqtt_client:publish(topics.alert, "online", MQTT.QOS[2], MQTT.RETAIN)
end

-- start logic --
chronos_mqtt_client = mqtt.Client(config.hostname, config.mqtt_broker.timeout, config.mqtt_broker.user, config.mqtt_broker.password)
chronos_mqtt_client:close()
tmr.stop(chronos_timer_id)

chronos_mqtt_client:lwt(topics.alert, config.chronos.name .. '(' .. node.chipid() .. ") offline", MQTT.QOS[2], MQTT.RETAIN)
chronos_mqtt_client:lwt("/status/" .. config.hostname, "offline", MQTT.QOS[2], MQTT.RETAIN)

chronos_mqtt_client:on("connect", connect)

chronos_mqtt_client:on("offline", function(client)
  print("offline")
  MQTT.connected = 0
end)

chronos_mqtt_client:on("message", function(client, topic, data)
  print(topic .. ":"); if data then print(data) end

  if (topic == topics.debug_toggle_led) then
    print('[INFO]toggle_led')
    chronos_led:toggle()
  end

  if (topic == topics.led_switch) then led_switch(tonumber(data)) end
end)

chronos_mqtt_client:connect(config.mqtt_broker.host, config.mqtt_broker.port, config.mqtt_broker.secure, MQTT.AUTO_RECONNECT)
