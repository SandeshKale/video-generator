import ephem, math
rad=ephem.FixedBody(); rad._ra=ephem.hours('7:28'); rad._dec=ephem.degrees('32:00'); rad._epoch=ephem.J2000
for nm,(la,lo) in {'Delhi':(28.61,77.21),'Varanasi':(25.32,83.0),'Mumbai':(19.08,72.88),'Chennai':(13.08,80.27)}.items():
    o=ephem.Observer(); o.lat=str(la); o.lon=str(lo); o.pressure=0
    o.date='2026/12/13 12:00'; m=ephem.Moon()
    ms=o.next_setting(m); sset=o.next_setting(ephem.Sun())
    out=[]
    for h in (20,22,24,26,28):   # IST hours after 13 Dec 00:00
        o.date=ephem.Date('2026/12/13 00:00')+ (h-5.5)/24; rad.compute(o); m.compute(o)
        out.append('%02d:00 IST radiant alt %.0f° (moon alt %.0f°)'%(h%24,math.degrees(rad.alt),math.degrees(m.alt)))
    print(nm,'sunset',ephem.Date(sset+5.5*ephem.hour),'moonset',ephem.Date(ms+5.5*ephem.hour),'| illum %.0f%%'%m.phase); print('  ',' ; '.join(out))
print('new moon',ephem.previous_new_moon('2026/12/13'),'phase on 13 Dec 18:00 UT',ephem.Moon('2026/12/13 12:30').phase)
