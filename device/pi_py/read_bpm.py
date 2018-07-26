import serial
ser = serial.Serial()
ser.baudrate = 115200
ser.port = '/dev/ttyAMA0'

sampler = []
sample_size = 10

sample = 0

ser.open()

while True:
  sline = ser.readline()
  if sline:
    bpm = int(sline)
    print bpm

    #hr = sample_bpm(bpm)




def sample_bpm(bpm):
    if sample <= sample_size:
        sampler.insert(sample, bpm)
        if sample == sample_size:
            heart_rate = sum(sampler) / len(sampler)
            sample = 0
            return heart_rate
        else:
            sample = sample + 1