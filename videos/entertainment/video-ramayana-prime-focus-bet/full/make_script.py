# Full spoken script (Hinglish): A = Roman caption text, B = Devanagari TTS text (lexicon spellings: कर्ज़ा, सैलरी, इंटरेस्ट; numbers spelled out)
import json
G = []  # (chapter, [(A, B), ...])  -> one breath group each
def g(ch, *pairs): G.append((ch, list(pairs)))
g(0, ("Pandrah din. Pandrah sau saintalis crore se upar ki kamaai, andaaze se.", "पंद्रह दिन। पंद्रह सौ सैंतालीस करोड़ से ऊपर की कमाई, अंदाज़े से।"),
     ("Par is film ko banane wali company par? Paanch hazaar crore ka karza.", "पर इस फ़िल्म को बनाने वाली कंपनी पर? पाँच हज़ार करोड़ का कर्ज़ा।"))
g(0, ("Ye Ramayana Part 1 ka haal hai. Aur theatre ki line aur bank ki line, ek jaisi nahi hoti.", "ये रामायण पार्ट वन का हाल है। और थिएटर की लाइन और बैंक की लाइन, एक जैसी नहीं होती।"))
g(0, ("To aaj film ki nahi, us company ki kahani. Ek garage, aath Oscar, ek strike, aur ek number jo aakhir mein sab badal deta hai.", "तो आज फ़िल्म की नहीं, उस कंपनी की कहानी। एक गैराज, आठ ऑस्कर, एक स्ट्राइक, और एक नंबर जो आख़िर में सब बदल देता है।"),
     ("Sirf business ki baat hogi. Na aastha, na acting.", "सिर्फ़ बिज़नेस की बात होगी। न आस्था, न एक्टिंग।"))
g(0, ("Pehle ek chhoti si baat. Gross matlab ticket par kata hua poora paisa.", "पहले एक छोटी सी बात। ग्रॉस मतलब टिकट पर कटा हुआ पूरा पैसा।"),
     ("Net matlab tax hatane ke baad ka number. Aur producer ke haath mein jo aata hai, wo dono se alag hota hai, aur kam.", "नेट मतलब टैक्स हटाने के बाद का नंबर। और प्रोड्यूसर के हाथ में जो आता है, वो दोनों से अलग होता है, और कम।"))
g(1, ("Saal unnees sau pachaanbe. Mumbai. Ek unnees saal ka ladka, Namit Malhotra, bank se loan leta hai.", "साल उन्नीस सौ पचानवे। मुंबई। एक उन्नीस साल का लड़का, नमित मल्होत्रा, बैंक से लोन लेता है।"),
     ("Ek profile ke hisaab se, pehli company wahin shuru hui: ek garage mein.", "एक प्रोफ़ाइल के हिसाब से, पहली कंपनी वहीं शुरू हुई: एक गैराज में।"))
g(1, ("Usi profile ke mutabik, is safar mein baadh, aag aur mandi, teeno aaye.", "उसी प्रोफ़ाइल के मुताबिक, इस सफ़र में बाढ़, आग और मंदी, तीनों आए।"),
     ("Aur ye baat baar baar lautegi: ye kaarobaar kabhi seedhi line mein nahi chalta.", "और ये बात बार बार लौटेगी: ये कारोबार कभी सीधी लाइन में नहीं चलता।"))
g(1, ("Do hazaar aath. Mandi aayi, aur film industry mein strike.", "दो हज़ार आठ। मंदी आई, और फ़िल्म इंडस्ट्री में स्ट्राइक।"),
     ("Company bachi 3D conversion ke kaam se: purani aur nayi films ko 3D mein badalna.", "कंपनी बची थ्री डी कन्वर्ज़न के काम से: पुरानी और नई फ़िल्मों को थ्री डी में बदलना।"))
g(1, ("3D conversion matlab, ek normal film ke har frame mein depth banana, taaki wo 3D screen par chale.", "थ्री डी कन्वर्ज़न मतलब, एक नॉर्मल फ़िल्म के हर फ़्रेम में डेप्थ बनाना, ताकि वो थ्री डी स्क्रीन पर चले।"),
     ("Pehla sabak: jab sab ruk jaye, tab bhi ek kaam chalta rehna chahiye.", "पहला सबक: जब सब रुक जाए, तब भी एक काम चलता रहना चाहिए।"))
g(2, ("Do hazaar chaudah. Prime Focus ka London ki ek VFX company, Double Negative, se merger.", "दो हज़ार चौदह। प्राइम फ़ोकस का लंदन की एक वी एफ़ एक्स कंपनी, डबल नेगेटिव, से मर्जर।"),
     ("Naam hua D Neg. Staff saat sau se badhkar, profile ke mutabik, lagbhag nau hazaar.", "नाम हुआ डी नेग। स्टाफ़ सात सौ से बढ़कर, प्रोफ़ाइल के मुताबिक, लगभग नौ हज़ार।"))
g(2, ("Phir Oscar. Inception, Interstellar, Ex Machina, Blade Runner 2049, First Man, Tenet, Dune.", "फिर ऑस्कर। इन्सेप्शन, इंटरस्टेलर, एक्स माकिना, ब्लेड रनर, फ़र्स्ट मैन, टेनेट, ड्यून।"),
     ("Kul aath Oscar. Interstellar ke liye to ek asli black hole ka software bana, aur uske do research paper bhi chhape.", "कुल आठ ऑस्कर। इंटरस्टेलर के लिए तो एक असली ब्लैक होल का सॉफ़्टवेयर बना, और उसके दो रिसर्च पेपर भी छपे।"))
g(2, ("Sirf Dune Part Two mein, lagbhag ek hazaar VFX shots. Ye company ka apna bayaan hai.", "सिर्फ़ ड्यून पार्ट टू में, लगभग एक हज़ार वी एफ़ एक्स शॉट्स। ये कंपनी का अपना बयान है।"),
     ("Interstellar ke kuch frames render hone mein, reports ke hisaab se, sau ghante tak lage.", "इंटरस्टेलर के कुछ फ़्रेम रेंडर होने में, रिपोर्ट्स के हिसाब से, सौ घंटे तक लगे।"))
g(2, ("Isliye Oscar sirf award nahi hota. Wo bharose ka certificate hai, jo agle order mein badal jaata hai.", "इसलिए ऑस्कर सिर्फ़ अवॉर्ड नहीं होता। वो भरोसे का सर्टिफ़िकेट है, जो अगले ऑर्डर में बदल जाता है।"),
     ("Ye hamara analysis hai.", "ये हमारा एनालिसिस है।"))
g(3, ("Par VFX ek ajeeb business hai. Ye kaarkhaana hai, jahan sabse bada kharcha insaan hain.", "पर वी एफ़ एक्स एक अजीब बिज़नेस है। ये कारख़ाना है, जहाँ सबसे बड़ा ख़र्चा इंसान हैं।"))
g(3, ("Pichhle saal ka staff ka kharcha, lagbhag do hazaar aath sau pachaasi crore.", "पिछले साल का स्टाफ़ का ख़र्चा, लगभग दो हज़ार आठ सौ पचासी करोड़।"),
     ("Upar se lagbhag paanch sau athaavan crore ka interest. Reports ke hisaab se.", "ऊपर से लगभग पाँच सौ अट्ठावन करोड़ का इंटरेस्ट। रिपोर्ट्स के हिसाब से।"))
g(3, ("Ek chhota udaaharan. Maan lijiye sau rupaye ki kamaai aayi.", "एक छोटा उदाहरण। मान लीजिए सौ रुपये की कमाई आई।"),
     ("Usmein se tehattar rupaye staff ki salary mein chale gaye, aur kuch interest mein. Bachta hai bahut kam.", "उसमें से तिहत्तर रुपये स्टाफ़ की सैलरी में चले गए, और कुछ इंटरेस्ट में। बचता है बहुत कम।"))
g(3, ("Ab maan lijiye order aadhe ho gaye, par salary wahi rahi. Tab bachna door, kai baar ghaata ho jaata hai.", "अब मान लीजिए ऑर्डर आधे हो गए, पर सैलरी वही रही। तब बचना दूर, कई बार घाटा हो जाता है।"),
     ("Ye sirf samjhane ke liye hai, asli company ke numbers nahi.", "ये सिर्फ़ समझाने के लिए है, असली कंपनी के नंबर नहीं।"))
g(3, ("Jab order aate hain, to chaaron weight sambhal jaate hain. Jab order ruk jaye? Beam jhukta hai.", "जब ऑर्डर आते हैं, तो चारों वज़न सँभल जाते हैं। जब ऑर्डर रुक जाए? बीम झुकता है।"),
     ("Do hazaar baais mein, ek SPAC ke raaste, lagbhag ek dashamlav saat billion dollar par listing ka plan bana, aur market ki halat dekhkar wapas le liya gaya.", "दो हज़ार बाईस में, एक स्पैक के रास्ते, लगभग एक दशमलव सात बिलियन डॉलर पर लिस्टिंग का प्लान बना, और मार्केट की हालत देखकर वापस ले लिया गया।"))
g(3, ("Asli sabak: jahan kharcha pehle se fix ho, wahan order ka rukna sabse bada khatra hai.", "असली सबक: जहाँ ख़र्चा पहले से फ़िक्स हो, वहाँ ऑर्डर का रुकना सबसे बड़ा ख़तरा है।"))
g(4, ("Phir aayi do hazaar teis aur chaubees ki Hollywood strike. Writers aur actors, dono.", "फिर आई दो हज़ार तेईस और चौबीस की हॉलीवुड स्ट्राइक। राइटर्स और एक्टर्स, दोनों।"),
     ("Shooting ruki, to post-production bhi ruk gaya.", "शूटिंग रुकी, तो पोस्ट प्रोडक्शन भी रुक गया।"))
g(4, ("Revenue lagbhag chaar hazaar chhah sau crore se girkar, teen hazaar nau sau pachaas ke aas paas aaya.", "रेवेन्यू लगभग चार हज़ार छह सौ करोड़ से गिरकर, तीन हज़ार नौ सौ पचास के आस पास आया।"),
     ("Aur ghaata, alag alag reports ke hisaab se, chaar sau pachaas se paanch sau crore ke beech.", "और घाटा, अलग अलग रिपोर्ट्स के हिसाब से, चार सौ पचास से पाँच सौ करोड़ के बीच।"))
g(4, ("Artists bench par. Software ke license chalu. Studio ka kiraya chalu.", "आर्टिस्ट्स बेंच पर। सॉफ़्टवेयर के लाइसेंस चालू। स्टूडियो का किराया चालू।"),
     ("Kaarkhaana khaali, par meter chalta raha.", "कारख़ाना ख़ाली, पर मीटर चलता रहा।"))
g(4, ("Phir do hazaar pachchees mein Hollywood ka pipeline dobara khula.", "फिर दो हज़ार पच्चीस में हॉलीवुड का पाइपलाइन दोबारा खुला।"),
     ("Finshots ke hisaab se, pehli timahi mein revenue teis percent badhkar, lagbhag nau sau chhihattar crore hua. Pichhle saal ke ghaate ki jagah, lagbhag ek sau das crore ka munafa aaya.", "फ़िनशॉट्स के हिसाब से, पहली तिमाही में रेवेन्यू तेईस परसेंट बढ़कर, लगभग नौ सौ छिहत्तर करोड़ हुआ। पिछले साल के घाटे की जगह, लगभग एक सौ दस करोड़ का मुनाफ़ा आया।"))
g(4, ("Poore saal mein company ne lagbhag teen sau ek crore ka munafa dikhaya. Wahi bench, jo pehle dhakel rahe the, ab margin badhane lage.", "पूरे साल में कंपनी ने लगभग तीन सौ एक करोड़ का मुनाफ़ा दिखाया। वही बेंच, जो पहले धकेल रहे थे, अब मार्जिन बढ़ाने लगे।"))
g(5, ("Aise waqt mein zyadatar company kharcha ghatati hai. Prime Focus ne doosra raasta chuna.", "ऐसे वक़्त में ज़्यादातर कंपनी ख़र्चा घटाती है। प्राइम फ़ोकस ने दूसरा रास्ता चुना।"),
     ("Do hazaar chaubees ke July mein, D Neg ne Prime Focus Technologies chhah sau tiraanve crore mein kharidi.", "दो हज़ार चौबीस के जुलाई में, डी नेग ने प्राइम फ़ोकस टेक्नोलॉजीज़ छह सौ तिरानवे करोड़ में ख़रीदी।"))
g(5, ("Matlab: studios ab alag alag vendor nahi chahte. Jo ek hi jagah effects bhi banaye, aur content ko streaming ke liye taiyaar bhi kare, uski keemat badhti hai.", "मतलब: स्टूडियोज़ अब अलग अलग वेंडर नहीं चाहते। जो एक ही जगह इफ़ेक्ट्स भी बनाए, और कंटेंट को स्ट्रीमिंग के लिए तैयार भी करे, उसकी क़ीमत बढ़ती है।"),
     ("Aur phir ek aur daav: apni khud ki film.", "और फिर एक और दाँव: अपनी ख़ुद की फ़िल्म।"))
g(5, ("Yahi hai Ramayana. Ab tak ye company doosron ki films ke effects banati thi, yaani kiraye ka kaam. Ab wo makaan maalik bhi banna chahti hai.", "यही है रामायण। अब तक ये कंपनी दूसरों की फ़िल्मों के इफ़ेक्ट्स बनाती थी, यानी किराये का काम। अब वो मकान मालिक भी बनना चाहती है।"))
g(5, ("Makers ke hisaab se, do hisson ka budget lagbhag chaar hazaar crore.", "मेकर्स के हिसाब से, दो हिस्सों का बजट लगभग चार हज़ार करोड़।"),
     ("Alag trade reports Part 1 ke liye sola sau se do hazaar crore ka andaaza deti hain, aur ek shuruaati report aath sau paintees se nau sau. Budget ka number khud ek paheli hai.", "अलग ट्रेड रिपोर्ट्स पार्ट वन के लिए सोलह सौ से दो हज़ार करोड़ का अंदाज़ा देती हैं, और एक शुरुआती रिपोर्ट आठ सौ पैंतीस से नौ सौ। बजट का नंबर ख़ुद एक पहेली है।"))
g(5, ("Kiraye par kaam karne wale ki kamaai tab tak, jab tak order aata hai. Makaan maalik ki kamaai film ke saath saalon tak chal sakti hai: theatre, OTT, music, aur Part 2.", "किराये पर काम करने वाले की कमाई तब तक, जब तक ऑर्डर आता है। मकान मालिक की कमाई फ़िल्म के साथ सालों तक चल सकती है: थिएटर, ओ टी टी, म्यूज़िक, और पार्ट टू।"),
     ("Par makaan banane ka kharcha pehle dena padta hai. Aur wahi karze ka sawaal wapas laata hai.", "पर मकान बनाने का ख़र्चा पहले देना पड़ता है। और वही कर्ज़े का सवाल वापस लाता है।"))
g(6, ("Ye daav pehle bhi lag chuka hai. Do hazaar teis mein Adipurush.", "ये दाँव पहले भी लग चुका है। दो हज़ार तेईस में आदिपुरुष।"),
     ("Reports ke hisaab se budget paanch se saat sau crore, VFX par online aalochna, makers ne kaam dobara kiya, aur ek trade estimate ke mutabik lagbhag do sau pachchees crore ka ghaata.", "रिपोर्ट्स के हिसाब से बजट पाँच से सात सौ करोड़, वी एफ़ एक्स पर ऑनलाइन आलोचना, मेकर्स ने काम दोबारा किया, और एक ट्रेड एस्टिमेट के मुताबिक लगभग दो सौ पच्चीस करोड़ का घाटा।"))
g(6, ("Ye kisi film ka mazaak nahi. Bas ye dikhana hai ki is zameen par VFX ka daav kitna jokhim bhara hota hai.", "ये किसी फ़िल्म का मज़ाक नहीं। बस ये दिखाना है कि इस ज़मीन पर वी एफ़ एक्स का दाँव कितना जोखिम भरा होता है।"))
g(6, ("Is baar tech par poora zor. Filmed for IMAX.", "इस बार टेक पर पूरा ज़ोर। फ़िल्म्ड फ़ॉर आइमैक्स।"),
     ("Cinematographer ke mutabik, motion capture floor par lagbhag bayaalees infrared cameras, aur Jatayu poori tarah CG.", "सिनेमैटोग्राफ़र के मुताबिक, मोशन कैप्चर फ़्लोर पर लगभग बयालीस इन्फ़्रारेड कैमरे, और जटायु पूरी तरह सी जी।"))
g(6, ("Trailer kai delay ke baad tees July do hazaar chhabbees ko aaya. Plan tha: Part 1 Diwali do hazaar chhabbees, Part 2 Diwali do hazaar sattaees.", "ट्रेलर कई डिले के बाद तीस जुलाई दो हज़ार छब्बीस को आया। प्लान था: पार्ट वन दिवाली दो हज़ार छब्बीस, पार्ट टू दिवाली दो हज़ार सत्ताईस।"),
     ("Do hisson mein banane ka faayda: sets, assets aur technology ek baar ban kar dono mein chalte hain. Par risk bhi bada: Part 1 ki kamaai se Part 2 ka bharosa judta hai.", "दो हिस्सों में बनाने का फ़ायदा: सेट्स, एसेट्स और टेक्नोलॉजी एक बार बन कर दोनों में चलते हैं। पर रिस्क भी बड़ा: पार्ट वन की कमाई से पार्ट टू का भरोसा जुड़ता है।"))
g(7, ("Ab dhyaan se sunna.", "अब ध्यान से सुनना।"))
g(7, ("Pehla number: pandrah din mein, Sacnilk ke estimate ke mutabik, duniya bhar ka gross, lagbhag pandrah sau saintalis crore.", "पहला नंबर: पंद्रह दिन में, सैकनिल्क के एस्टिमेट के मुताबिक, दुनिया भर का ग्रॉस, लगभग पंद्रह सौ सैंतालीस करोड़।"),
     ("Doosra: Part 1 ka budget, andaaze se, sola sau se do hazaar crore. Teesra: Prime Focus ka gross karza, lagbhag paanch hazaar crore.", "दूसरा: पार्ट वन का बजट, अंदाज़े से, सोलह सौ से दो हज़ार करोड़। तीसरा: प्राइम फ़ोकस का ग्रॉस कर्ज़ा, लगभग पाँच हज़ार करोड़।"))
g(7, ("Par gross wo paisa hai, jo ticket par kata. Usmein se tax, theatre ka hissa aur distributor ka hissa nikalta hai.", "पर ग्रॉस वो पैसा है, जो टिकट पर कटा। उसमें से टैक्स, थिएटर का हिस्सा और डिस्ट्रीब्यूटर का हिस्सा निकलता है।"),
     ("Producer tak kitna pahunchta hai, ye exact split public nahi. Isliye pandrah sau crore ko kamaai kehna galat hoga. Ye ticket ki keemat hai.", "प्रोड्यूसर तक कितना पहुँचता है, ये एग्ज़ैक्ट स्प्लिट पब्लिक नहीं। इसलिए पंद्रह सौ करोड़ को कमाई कहना ग़लत होगा। ये टिकट की क़ीमत है।"))
g(7, ("Ab teeno ko saath rakhte hain. Agar budget sola sau se do hazaar crore ke beech hai, to gross ne pandrah din mein budget ke lagbhag barabar ka number chhoo liya.", "अब तीनों को साथ रखते हैं। अगर बजट सोलह सौ से दो हज़ार करोड़ के बीच है, तो ग्रॉस ने पंद्रह दिन में बजट के लगभग बराबर का नंबर छू लिया।"),
     ("Par us gross ka sirf ek hissa producer tak jaata hai. Aur karze ka square? Wo abhi bhi sabse bada hai.", "पर उस ग्रॉस का सिर्फ़ एक हिस्सा प्रोड्यूसर तक जाता है। और कर्ज़े का स्क्वेयर? वो अभी भी सबसे बड़ा है।"))
g(7, ("Hindi version akela, The Week ke mutabik, lagbhag chhah sau pachaas crore net par pahuncha.", "हिंदी वर्ज़न अकेला, द वीक के मुताबिक, लगभग छह सौ पचास करोड़ नेट पर पहुँचा।"))
g(8, ("Ab ek aur parat. Finshots ke mutabik Ranbir Kapoor ne Prime Focus mein pandrah crore rupaye khud lagaaye.", "अब एक और परत। फ़िनशॉट्स के मुताबिक रणबीर कपूर ने प्राइम फ़ोकस में पंद्रह करोड़ रुपये ख़ुद लगाए।"),
     ("Matlab film mein ek aadmi do jagah baitha hai: parde par, aur shareholder ke roop mein.", "मतलब फ़िल्म में एक आदमी दो जगह बैठा है: पर्दे पर, और शेयरहोल्डर के रूप में।"))
g(8, ("Do hazaar pachchees ke September mein, Madhusudan Kela aur Utpal Sheth jaise nivesh ne milkar, lagbhag teen dashamlav teen percent hissa kharida.", "दो हज़ार पच्चीस के सितंबर में, मधुसूदन केला और उत्पल शेठ जैसे निवेशकों ने मिलकर, लगभग तीन दशमलव तीन परसेंट हिस्सा ख़रीदा।"))
g(8, ("Share bazaar ne daav ko pehle hi daam mein daal diya: trailer ke mahine mein paintees percent, aur ek saal mein lagbhag attanve percent ki badhat.", "शेयर बाज़ार ने दाँव को पहले ही दाम में डाल दिया: ट्रेलर के महीने में पैंतीस परसेंट, और एक साल में लगभग अट्ठानवे परसेंट की बढ़त।"),
     ("Jab ummeedein pehle se daam mein hon, to kabhi kabhi badi safalta bhi kaafi nahi lagti.", "जब उम्मीदें पहले से दाम में हों, तो कभी कभी बड़ी सफलता भी काफ़ी नहीं लगती।"))
g(8, ("Ye mera analysis hai, investment salaah nahi. Ek aalochak ka manna ye bhi hai ki marketing film se zyada studio ko bech rahi hai. Dekhna ye hai ki sach kya nikalta hai.", "ये मेरा एनालिसिस है, इन्वेस्टमेंट सलाह नहीं। एक आलोचक का मानना ये भी है कि मार्केटिंग फ़िल्म से ज़्यादा स्टूडियो को बेच रही है। देखना ये है कि सच क्या निकलता है।"))
g(9, ("Unnees sau pachaanbe mein, bank loan se kharide computer. Do hazaar chhabbees mein, ek film jo IMAX ke liye shoot hui.", "उन्नीस सौ पचानवे में, बैंक लोन से ख़रीदे कंप्यूटर। दो हज़ार छब्बीस में, एक फ़िल्म जो आइमैक्स के लिए शूट हुई।"),
     ("Daav ka size badla, par sawaal wahi: jab order ruke, tab bhi kya kaarkhaana chalta rahega?", "दाँव का साइज़ बदला, पर सवाल वही: जब ऑर्डर रुके, तब भी क्या कारख़ाना चलता रहेगा?"))
g(9, ("Aur ye kahani sirf ek company ki nahi, ek tareeke ki hai. Jo kaam kiraye par karta hai, wo dheere dheere makaan banane ki taraf badhta hai.", "और ये कहानी सिर्फ़ एक कंपनी की नहीं, एक तरीक़े की है। जो काम किराये पर करता है, वो धीरे धीरे मकान बनाने की तरफ़ बढ़ता है।"),
     ("Isme jeet bhi badi hoti hai, aur girna bhi.", "इसमें जीत भी बड़ी होती है, और गिरना भी।"))
g(9, ("Part 2 ke liye teen cheezein dekhna. Ek: company ke results mein film ki kamaai kab aur kitni dikhti hai.", "पार्ट टू के लिए तीन चीज़ें देखना। एक: कंपनी के रिज़ल्ट्स में फ़िल्म की कमाई कब और कितनी दिखती है।"),
     ("Do: karze ka number kitna ghatta hai. Teen: Hollywood ke orders kitne aate hain. Reports ke hisaab se Part 2 Diwali do hazaar sattaees mein hai.", "दो: कर्ज़े का नंबर कितना घटता है। तीन: हॉलीवुड के ऑर्डर कितने आते हैं। रिपोर्ट्स के हिसाब से पार्ट टू दिवाली दो हज़ार सत्ताईस में है।"))
g(9, ("Agar business ko is tarah dekhna pasand aaya, to nerdlogic dot co ko follow aur subscribe karein.", "अगर बिज़नेस को इस तरह देखना पसंद आया, तो नर्डलॉजिक डॉट सी ओ को फ़ॉलो और सब्सक्राइब करें।"),
     ("Aur ye video us dost ko bhejiye, jo gross ko hi kamaai samajhta hai.", "और ये वीडियो उस दोस्त को भेजिए, जो ग्रॉस को ही कमाई समझता है।"))
S = []; sid = 0; PA = {}
for gi, (ch, pairs) in enumerate(G, 1):
    for k, (A, B) in enumerate(pairs):
        sid += 1; S.append(dict(id=f's{sid}', g=f'g{gi}', ch=ch, A=A, B=B))
        if k == len(pairs) - 1: PA[f's{sid}'] = 1.1 if ch == 7 and gi != 0 and B.startswith('अब ध्यान') else 0.55
PA[S[0]['id']] = 0.4
json.dump(dict(sentences=S, pause_after=PA), open('../script.full.json', 'w'), ensure_ascii=False, indent=1)
words = sum(len(x['B'].split()) for x in S); print(len(G), 'groups', len(S), 'sentences', words, 'words ~', round(words / 2.7 / 60, 1), 'min')
