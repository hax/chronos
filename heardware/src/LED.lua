LED = {state = 0}

-- pin int [pin number connected to LED(or sth. like an LED)
--     mapping table: https://nodemcu.readthedocs.io/en/master/en/modules/gpio/]
-- lit 1/0 [whether the LED is lit on HIGH(1) or LOW(0)]
function LED:new(pin, lit)
  local o = {}
  self.__index = self
  self.pin = pin
  self.lit = lit
  gpio.mode(self.pin, gpio.OUTPUT)
  return setmetatable(o, self)
end

function LED:on()
  self.status = self.lit
  gpio.write(self.pin, self.status)
end

function LED:off()
  self.status = 1 - self.lit
  gpio.write(self.pin, self.status)
end

function LED:toggle()
  self.status = 1 - self.status
  gpio.write(self.pin, self.status)
end
