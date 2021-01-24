function motor (motor_state: boolean) {
    if (motor_state) {
        microIOBOX.motorRun(microIOBOX.Motors.M1, microIOBOX.Dir.CW, pins.analogReadPin(AnalogPin.P1) / 4)
        basic.showIcon(IconNames.Rollerskate)
    } else {
        microIOBOX.motorStopAll()
        basic.showIcon(IconNames.Butterfly)
    }
}
function Scan_uSonic () {
    uSonic(pins.analogReadPin(AnalogPin.P2), 10, 25)
    return PID_func(val, 0.07)
}
function PID_func (PID_input: number, Kp: number) {
    PID_bias = PID_input - PID_output
    PID_output = PID_output + PID_bias * Kp
    serial.writeValue("z", PID_output)
    return PID_output
}
function Trig_Touch (Digital_Read_Pin: number) {
    if (Digital_Read_Pin == 1 && trig_touch == false) {
        trig_touch = true
        strip2.showColor(neopixel.colors(NeoPixelColors.Violet))
        music.playTone(880, music.beat(BeatFraction.Eighth))
    } else if (Digital_Read_Pin == 0 && trig_touch == true) {
        trig_touch = false
        strip2.showColor(neopixel.colors(NeoPixelColors.Orange))
        music.playTone(698, music.beat(BeatFraction.Eighth))
    }
}
function uSonic (uS_input: number, start: number, length: number) {
    serial.writeValue("x", uS_input)
    if (uS_input <= 500) {
        val = Math.min(Math.max(uS_input, start), start + length) - start
        serial.writeValue("y", val)
    }
}
input.onButtonPressed(Button.A, function () {
    strip2.showColor(neopixel.colors(NeoPixelColors.Green))
    microIOBOX.motorRun(microIOBOX.Motors.M1, microIOBOX.Dir.CW, 90)
    basic.showIcon(IconNames.Yes)
    music.playTone(523, music.beat(BeatFraction.Whole))
})
function Trig_PIR (Digital_Read_Pin: number) {
    if (Digital_Read_Pin == 1 && trig_pir == false) {
        trig_pir = true
        motor(true)
    } else if (Digital_Read_Pin == 0 && trig_pir == true) {
        trig_pir = false
    }
}
function Trig_uSonic () {
    if (Scan_uSonic() <= 10 && trig_sonic == false) {
        trig_sonic = true
        motor(true)
    } else if (Scan_uSonic() > 10 && trig_sonic == true) {
        trig_sonic = false
    }
}
input.onButtonPressed(Button.B, function () {
    strip2.showColor(neopixel.colors(NeoPixelColors.Blue))
    microIOBOX.motorStopAll()
    basic.showIcon(IconNames.No)
    music.playTone(659, music.beat(BeatFraction.Whole))
})
function Trig_Magnite (Digital_Read_Pin: number) {
    if (Digital_Read_Pin == 1 && trig_magnite == false) {
        trig_magnite = true
        motor(false)
    } else if (Digital_Read_Pin == 0 && trig_magnite == true) {
        trig_magnite = false
    }
}
function Trig_Button (Digital_Read_Pin: number) {
    if (Digital_Read_Pin == 1 && trig_button == false) {
        trig_button = true
        motor(true)
    } else if (Digital_Read_Pin == 0 && trig_button == true) {
        trig_button = false
    }
}
let trig_button = false
let trig_magnite = false
let trig_sonic = false
let trig_pir = false
let trig_touch = false
let PID_output = 0
let PID_bias = 0
let val = 0
let strip2: neopixel.Strip = null
basic.showIcon(IconNames.Happy)
let strip = neopixel.create(DigitalPin.P8, 7, NeoPixelMode.RGB)
let range = strip.range(0, 7)
strip.showRainbow(1, 360)
strip2 = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
let range2 = strip2.range(0, 4)
strip2.showColor(neopixel.colors(NeoPixelColors.Red))
music.setVolume(255)
microIOBOX.motorStopAll()
servos.P0.setStopOnNeutral(false)
basic.forever(function () {
    Trig_Button(pins.digitalReadPin(DigitalPin.P13))
    Trig_Magnite(pins.digitalReadPin(DigitalPin.P15))
    Trig_Touch(pins.digitalReadPin(DigitalPin.P12))
})
control.inBackground(function () {
    while (true) {
        strip.showBarGraph(Scan_uSonic(), 25)
    }
})
