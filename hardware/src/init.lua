--[[ Files/Modules needed ]]--
modules = {
  'LED',
  'chronos',
  'telnet',
}

print(node.bootreason())

function getFreeTimerId()
  for i = 0, 6 do
    if not tmr.state(i) then
      return i
    end
  end
end

local Init = {
  log = function(str)
    uart.write(0, str)
  end,
  load = function(module)
    local found_flag = false
    for _, filename in ipairs({ module, module .. '.lc', module .. '.lua' }) do
      if file.exists(filename) then
        dofile(filename)
        found_flag = true
        break
      end
    end
    if found_flag ~= true then
      print('[ERR] module "' .. module .. '" not found.')
    end
  end
}

Init.ap_list_connect = function(scaned_aps)
  Init.log('done\r\n')
  -- todo: support connect timeout and switch
  for ssid, key in pairs(config.wifi) do
    if (scaned_aps[ssid]) then
      Init.log('Found matching SSID: ' .. ssid .. '\r\n')
      wifi.sta.config(ssid, key, 0)
      Init.log('Connecting WiFi: ' .. ssid)
      wifi.sta.connect()
      local timer_id = getFreeTimerId()
      tmr.alarm(timer_id, 500, tmr.ALARM_AUTO, function()
        if wifi.sta.getip() == nil then
          Init.log('.')
        else
          Init.log('done, IP is: ' .. wifi.sta.getip() .. '\r\n')
          tmr.unregister(timer_id)
          Init.log('Init all done.\r\n\r\n')
          Init.finish_callback()
        end
      end)
      break
    end
  end
end

Init.finish_callback = function()
  for _, module in pairs(modules) do
    Init.load(module)
  end
end

Init.log('Loading config...')
config = dofile('config.lua')
Init.log('done\r\n');

print("I'm " .. config.hostname)

Init.log('Setting up WiFi config...')
wifi.setmode(wifi.STATION)
wifi.sta.sethostname(config.hostname)
Init.log('done\r\n')

Init.log('Scaning WiFi AP...')
wifi.sta.getap(Init.ap_list_connect)
