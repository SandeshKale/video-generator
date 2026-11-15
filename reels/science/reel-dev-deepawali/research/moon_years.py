import ephem, math
o=ephem.Observer(); o.lat='25.3176'; o.lon='83.0062'; o.pressure=0
m=ephem.Moon()
def sep(star,date):
    s=ephem.star(star); o.date=date; m.compute(o); s.compute(o)
    return math.degrees(ephem.separation(m,s)), math.degrees(m.alt)
print('Kartik full moons vs Alcyone (Varanasi, 19:00 IST on the full-moon evening)')
for y in range(2019,2032):
    fm=ephem.next_full_moon('%d/10/28'%y)  # Kartik purnima window approx late Oct-Nov
    # choose the full moon between Nov 1 and Dec 1 roughly: Kartik purnima dates
    d=ephem.Date(fm)
    ist=ephem.Date(d+5.5*ephem.hour)
    # evening 13:30 UTC of the IST date nearest
    day=ephem.Date(int(d+0.5+5.5/24)-0.5) # IST midnight approx in UTC
    ev=ephem.Date(str(ist).split(' ')[0]+' 13:30')
    s,a=sep('Alcyone',ev)
    print(y, 'full moon IST', ist, ' sep %.1f deg'%s, 'alt %.0f'%a)
print()
for nm,star,date in [('Magha','Regulus','2026/2/1 14:00'),('Chaitra','Spica','2026/4/2 14:30'),('Jyeshtha','Antares','2026/6/29 15:30'),('Kartik','Alcyone','2026/11/24 13:30'),('Pausha (Pushya ~ Asellus Australis n/a) use Pollux','Pollux','2026/12/24 14:00')]:
    s,a=sep(star,date); print(nm,star,date,'sep %.1f'%s,'alt %.0f'%a, 'fullmoon', ephem.next_full_moon(ephem.Date(date)-2))
# Diwali->Dev Deepawali
nm=ephem.Date('2026/11/9 07:02:03'); fm=ephem.Date('2026/11/24 14:53:29'); print('new->full days',fm-nm, 'next new', ephem.next_new_moon(fm)-nm)
# moon angular diameter & distance that evening
o.date='2026/11/24 13:30'; m.compute(o); print('moon diam deg',m.size/3600,'dist km',m.earth_distance*149597870.7)
s=ephem.Sun(); s.compute(o); print('sun-moon elong',math.degrees(ephem.separation(m,s)))
