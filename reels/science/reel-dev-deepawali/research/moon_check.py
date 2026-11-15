import ephem, math
def obs(lat,lon,name):
    o=ephem.Observer(); o.lat=str(lat); o.lon=str(lon); o.elevation=80; o.pressure=0; return o
print('full moon', ephem.next_full_moon('2026/11/20'), 'UTC')
print('prev new moon', ephem.previous_new_moon('2026/11/24'), 'next new', ephem.next_new_moon('2026/11/24'))
print('diwali new moon', ephem.previous_new_moon('2026/11/12'))
alc=ephem.star('Alcyone')
for nm,(la,lo) in {'Varanasi':(25.3176,83.0062),'Delhi':(28.61,77.21),'Mumbai':(19.08,72.88),'Chennai':(13.08,80.27)}.items():
    o=obs(la,lo,nm)
    o.date='2026/11/24 06:00'
    m=ephem.Moon(); s=ephem.Sun()
    mr=o.next_rising(m); ss=o.next_setting(s)
    print(nm,'sunset IST',ephem.Date(ss+5.5*ephem.hour),'moonrise IST',ephem.Date(mr+5.5*ephem.hour))
    for h in [12.5,13.5,14.5,15.5,16.5,18.5,20.5]:
        o.date=ephem.Date('2026/11/24')+h*ephem.hour
        m.compute(o); alc.compute(o)
        sep=math.degrees(ephem.separation(m,alc))
        print('  IST %05.2f'%(h+5.5),'sep Moon-Alcyone %.2f deg'%sep,'moon alt %.0f'%math.degrees(m.alt),'illum %.1f'%m.phase)
# geocentric min separation
best=(99,None)
d=ephem.Date('2026/11/24')
m=ephem.Moon()
for i in range(0,24*60,2):
    t=ephem.Date(d+i*ephem.minute); m.compute(t); alc.compute(t)
    s=math.degrees(ephem.separation(m,alc))
    if s<best[0]: best=(s,t)
print('geocentric min sep',best)
# diwali date check: amavasya
print('Diwali 2026 new moon', ephem.next_new_moon('2026/11/05'))
