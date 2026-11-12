# Sources read 3 Nov 2026 (tier A = primary page read in full; B = reputable secondary / abstract as reported; C = unverified, never on screen)

## The measurement (ISRO/NRSC + NASA ICESat-2)
- Dandabathula et al., "Physical features of Adam's Bridge interpreted from ICESat-2 based high-resolution digital bathymetric elevation model", *Scientific Reports* 14 (28 Jun 2024), DOI 10.1038/s41598-024-65908-2. **The paper page returned 403/redirect from this sandbox, so numbers below come from its abstract as reported (DOAJ/PubMed index snippet, ThePrint 9 Jul 2024, WION): tier B until the paper is read.**
  - chain of shoals "extending for ~29 km" from Dhanushkodi (India) to Talaimannar Island (Sri Lanka); a submarine continuation of both (B)
  - "only 0.02 percent of this volume is above the mean sea level" => 99.98 % submerged (B; one outlet prints 99.8 %, treated as a typo, do not use)
  - ICESat-2 data Oct 2018 - Oct 2023; ~0.2 million photons with depth information; 10 m resolution bathymetric model (B)
  - green laser reaches the seafloor to roughly 40 m (ThePrint, B)
  - crest "highly undulating within the super-shallow water with occurrences of sudden depths"; ~1.5 km either side of the crest line highly undulating (B)
  - volume about 1 km3 (ThePrint, B)
  - asymmetric transverse slopes; authors attribute it to stronger material transport from the Gulf of Mannar than from the Palk Strait (ThePrint, B)
  - existing geological evidence "suggests" a former land connection (ThePrint's wording, B). The paper is not reported to say anything about construction or the epic.
- "11 narrow channels": **not found in any source, never used.**

## Length / depth discrepancies (shown honestly)
- ~48 km Rameswaram island to Mannar island: ESA Sentinel-2 image coverage (Curly Tales, Lokmat, Inshorts, Jun 2024) (B). ~29 km: the paper above (B). Other pages say 30 or 50 km (C). Depth quotes vary (1-10 m / 3-30 ft) (C): show a range only if the paper is read.
- **Our reading, labelled as such on screen:** the numbers differ because the end points differ. Not stated by any source; phrase as "likely".

## The film
- Ramayana Part 1 (Nitesh Tiwari), Diwali 2026; Part 2 Diwali 2027; DNEG/Prime Focus VFX; IMAX shoot (Statesman, Open, ThePrint trailer pieces) (B). Budget figures conflict (about Rs 835 cr Part 1 vs Rs 4,000 cr both parts): **not used.** Release date not independently confirmed: say "Diwali pe aa rahi hai (reported)".

## To verify before the full build
1. Read the Scientific Reports paper (open access) for exact length, depths, channel count, slopes. 2. ESA's own page for the Sentinel-2 image date and credit line (Copernicus Sentinel data, ESA). 3. ICESat-2: six beams in three pairs, orbit altitude (NASA ICESat-2 page) before drawing them.

## v2 real-data pass (12 Nov 2026, for the LiDAR Survey rebuild)
- **ICESat-2 ATL03 photons (tier A, NASA/NSIDC via OpenAltimetry, no login):** `fetch_photons.py` pulled all six beams for the four reference ground tracks that cross the strait (RGT 0081, 0150, 0523, 1095; 113 passes, Nov 2018 - Jun 2026; 1.1 GB raw, not committed). Photons are (lat, lon, WGS84 ellipsoid height) with confidence classes. Sea surface sits at about -95.7 m ellipsoid height (geoid). Track 0523 (lon 79.69-79.78) shows the Sri Lankan land edge (Mannar island, ~+3 m above sea) at lat 9.06-9.10; tracks 0081/0150/1095 cross the chain itself.
- **What did NOT work:** a seabed depth estimator on the photons (`process_photons.py`, v1 histogram mode, v2 contiguous-layer test) returned only surface scatter. A bathymetric DEM from ATL03 needs the careful curated processing the paper used; those depths are therefore NOT derived here and must stay REPORTED (paper) or schematic.
- **Real satellite image (tier A, NASA GIBS, HLS Sentinel-2 30 m, 15 Mar 2024, bbox 79.15-80.00 E, 9.00-9.40 N):** `imagery/hls_2024-03-15.jpg`; shows Pamban/Rameswaram island, the chain of pale sand shoals and the Mannar island coast. Credit line: "NASA GIBS / HLS (Copernicus Sentinel-2 data)". Clouds sit over both islands.
- ETOPO 2022 15-arcsec tiles for this area were not reachable (THREDDS 404, ERDDAP 503).
