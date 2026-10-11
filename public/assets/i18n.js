/* Fair Value — tarjimalar: uz (lotin), cy (кирилл), ru */
(function () {
  const D = {
    uz: {
      "nav.services": "Xizmatlar", "nav.about": "Afzalliklar", "nav.process": "Jarayon",
      "nav.verify": "Hujjatni tekshirish", "nav.contact": "Aloqa", "nav.faq": "Savollar",
      "cta.request": "Ariza qoldirish", "cta.verify": "QR orqali tekshirish",

      "hero.badge": "Baholash firmasi",
      "hero.lead": "Hurmatli mijozlar, biz sizga mol-mulkni baholash, biznes loyihalar, ekspert xulosalari va audit bo'yicha professional yordam bera olamiz.",
      "hero.p1": "Har bir hujjat QR kod bilan himoyalangan",
      "hero.p2": "Banklar, notarius va sud uchun",
      "hero.p3": "Tezkor va shaffof jarayon",
      "hero.card.t": "Hujjatingiz haqiqiymi?",
      "hero.card.d": "Hisobotdagi QR kodni skanerlang yoki hujjat ID raqamini kiriting.",

      "srv.kicker": "Xizmatlarimiz", "srv.title": "Sizga quyidagi xizmatlar bo'yicha yordam bera olamiz",
      "srv.1.t": "Barcha turdagi mol-mulkni baholash",
      "srv.1.d": "Ko'chmas mulk, avtotransport, asbob-uskunalar, biznes va qimmatli qog'ozlarni qonunchilik va milliy standartlarga muvofiq baholash.",
      "srv.2.t": "Biznes loyihalar va TEO",
      "srv.2.d": "Bank krediti, investor va davlat dasturlari uchun biznes-reja hamda texnik-iqtisodiy asoslarni (TEO) tayyorlash.",
      "srv.3.t": "Import shartnomasi bo'yicha ekspert xulosasi",
      "srv.3.d": "Import shartnomalari narxlarining bozor qiymatiga muvofiqligi bo'yicha mustaqil ekspert xulosasi.",
      "srv.4.t": "Audit xulosasi",
      "srv.4.d": "Moliyaviy hisobotlarning ishonchliligini tekshirish va rasmiy audit xulosasini taqdim etish.",
      "srv.more": "Ariza qoldirish →",

      "obj.kicker": "Nimalarni baholaymiz", "obj.title": "Baholash obyektlari",
      "obj.1": "Kvartira, uy va yer uchastkalari", "obj.2": "Tijorat va ishlab chiqarish binolari",
      "obj.3": "Avtomobil va maxsus texnika", "obj.4": "Asbob-uskunalar va liniyalar",
      "obj.5": "Biznes, ulush va aksiyalar", "obj.6": "Intellektual mulk va nomoddiy aktivlar",
      "obj.7": "Qishloq xo'jaligi aktivlari", "obj.8": "Yetkazilgan zararni baholash",

      "why.kicker": "Nega aynan biz", "why.title": "Ishonchli, aniq va shaffof",
      "why.1.t": "Litsenziyalangan baholovchilar", "why.1.d": "Hisobotlar malakali mutaxassislar tomonidan milliy baholash standartlari asosida tayyorlanadi.",
      "why.2.t": "QR kod bilan tasdiqlash", "why.2.d": "Har bir hisobotga noyob QR kod beriladi — bank yoki notarius uning haqiqiyligini bir necha soniyada tekshiradi.",
      "why.3.t": "Qisqa muddatlar", "why.3.d": "Obyektni ko'zdan kechirishdan hisobot topshirishgacha bo'lgan jarayonni minimal muddatda bajaramiz.",
      "why.4.t": "Maxfiylik", "why.4.d": "Mijoz ma'lumotlari himoyalangan, tekshirish sahifasida shaxsiy ma'lumotlar yashirin ko'rsatiladi.",

      "qr.kicker": "QR tasdiqlash tizimi", "qr.title": "Har bir hujjat — QR kod bilan tasdiqlanadi",
      "qr.sub": "Soxta hisobotlardan himoya: hujjatdagi QR kod Fair Value rasmiy bazasiga bog'langan.",
      "qr.s1.t": "Hujjat beriladi", "qr.s1.d": "Hisobot rasmiylashtirilgach, unga noyob ID va QR kod biriktiriladi.",
      "qr.s2.t": "QR skanerlanadi", "qr.s2.d": "Telefon kamerasi bilan QR kodni skanerlang yoki ID raqamini kiriting.",
      "qr.s3.t": "Natija ko'rinadi", "qr.s3.d": "Hujjat holati, raqami, sanasi va asosiy ma'lumotlari darhol ko'rsatiladi.",
      "qr.ph": "Hujjat ID: FV-XXXX-XXXX-XX", "qr.btn": "Tekshirish", "qr.scan": "Kamerada skanerlash",

      "proc.kicker": "Qanday ishlaymiz", "proc.title": "Ish jarayoni",
      "proc.1.t": "Ariza", "proc.1.d": "Sayt, telefon yoki Instagram orqali murojaat qilasiz.",
      "proc.2.t": "Hujjatlar", "proc.2.d": "Obyektga oid hujjatlar va maqsad aniqlanadi, shartnoma tuziladi.",
      "proc.3.t": "Ko'zdan kechirish", "proc.3.d": "Baholovchi obyektni joyida o'rganadi, bozor tahlili o'tkaziladi.",
      "proc.4.t": "Hisobot", "proc.4.d": "Hisobot tayyorlanadi va QR kod bilan muhrlanadi.",
      "proc.5.t": "Topshirish", "proc.5.d": "Hisobot topshiriladi — uni istalgan vaqtda onlayn tekshirish mumkin.",

      "use.kicker": "Qayerda kerak bo'ladi", "use.title": "Baholash hisoboti maqsadlari",
      "use.1": "Bank krediti va garov", "use.2": "Notarial harakatlar va meros",
      "use.3": "Sud va nizolar", "use.4": "Oldi-sotdi va ijara",
      "use.5": "Ustav fondiga kiritish", "use.6": "Sug'urta va bojxona",

      "faq.kicker": "Savol-javob", "faq.title": "Ko'p beriladigan savollar",
      "faq.1.q": "Baholash qancha vaqt oladi?", "faq.1.a": "Muddat obyekt turi va hajmiga bog'liq. Odatiy ko'chmas mulk yoki avtomobil uchun hisobot qisqa muddatda tayyorlanadi — aniq muddatni murojaat paytida aytamiz.",
      "faq.2.q": "Qanday hujjatlar kerak?", "faq.2.a": "Mulkka egalik hujjati, kadastr pasporti yoki texnik pasport, shaxsni tasdiqlovchi hujjat. Biznes baholashda moliyaviy hisobotlar ham talab qilinadi.",
      "faq.3.q": "QR kod qanday ishlaydi?", "faq.3.a": "Hisobotdagi QR kod Fair Value rasmiy saytidagi tekshirish sahifasiga olib boradi. U yerda hujjat bazada borligi, holati va asosiy ma'lumotlari ko'rinadi. Agar hujjat topilmasa yoki bekor qilingan bo'lsa, bu darhol ko'rsatiladi.",
      "faq.4.q": "Hisobotni banklar qabul qiladimi?", "faq.4.a": "Ha, hisobotlar amaldagi qonunchilik va milliy baholash standartlari talablariga muvofiq tayyorlanadi.",
      "faq.5.q": "Narx qanday belgilanadi?", "faq.5.a": "Narx obyekt turi, murakkabligi va baholash maqsadiga qarab belgilanadi. Ariza qoldiring — mutaxassisimiz siz bilan bog'lanib, aniq narxni aytadi.",

      "contact.kicker": "Aloqa", "contact.title": "Ariza qoldiring — biz siz bilan bog'lanamiz",
      "contact.sub": "Ma'lumotlaringizni qoldiring, mutaxassisimiz qisqa vaqt ichida qo'ng'iroq qiladi.",
      "form.name": "Ismingiz", "form.phone": "Telefon raqamingiz", "form.service": "Xizmat turi",
      "form.choose": "Tanlang", "form.msg": "Qo'shimcha ma'lumot (ixtiyoriy)", "form.send": "Yuborish",
      "form.ok": "Rahmat! Arizangiz qabul qilindi. Tez orada bog'lanamiz.",
      "form.err": "Yuborishda xatolik. Iltimos, telefon orqali bog'laning.",
      "info.phone": "Telefon", "info.email": "Email", "info.address": "Manzil", "info.hours": "Ish vaqti", "info.social": "Ijtimoiy tarmoqlar",

      "footer.desc": "Mol-mulkni baholash, biznes loyihalar, ekspert xulosalari va audit xizmatlari.",
      "footer.rights": "Barcha huquqlar himoyalangan.", "footer.links": "Bo'limlar",

      "type.valuation": "Baholash hisoboti", "type.business_plan": "Biznes loyiha",
      "type.teo": "TEO (texnik-iqtisodiy asos)", "type.import": "Import shartnomasi bo'yicha ekspert xulosasi",
      "type.audit": "Audit xulosasi", "type.other": "Boshqa hujjat",

      "v.kicker": "Rasmiy tekshiruv", "v.title": "Hujjatning haqiqiyligini tekshirish",
      "v.sub": "Hisobotdagi QR kodni skanerlang yoki hujjat ID raqamini kiriting.",
      "v.loading": "Tekshirilmoqda…", "v.back": "← Bosh sahifa", "v.again": "Boshqa hujjatni tekshirish",
      "v.ok.t": "Hujjat haqiqiy", "v.ok.d": "Ushbu hujjat Fair Value tomonidan berilgan va rasmiy bazada ro'yxatdan o'tgan.",
      "v.rev.t": "Hujjat bekor qilingan", "v.rev.d": "Ushbu hujjat Fair Value tomonidan bekor qilingan va kuchga ega emas.",
      "v.exp.t": "Hujjat muddati tugagan", "v.exp.d": "Hujjat Fair Value tomonidan berilgan, lekin amal qilish muddati tugagan.",
      "v.nf.t": "Hujjat topilmadi", "v.nf.d": "Bunday ID raqamli hujjat bazada mavjud emas. Hujjat soxta bo'lishi mumkin — iltimos, biz bilan bog'laning.",
      "v.f.id": "Hujjat ID", "v.f.number": "Hujjat raqami", "v.f.type": "Hujjat turi", "v.f.title": "Nomi",
      "v.f.client": "Buyurtmachi", "v.f.object": "Obyekt", "v.f.address": "Obyekt manzili", "v.f.value": "Qiymati",
      "v.f.purpose": "Maqsadi", "v.f.appraiser": "Baholovchi", "v.f.issue": "Berilgan sana",
      "v.f.valid": "Amal qilish muddati", "v.f.reason": "Bekor qilish sababi", "v.f.checked": "Tekshirilgan vaqt",
      "v.pdf": "Asl hujjatni ko'rish (PDF)",
      "v.note": "Qo'lingizdagi hujjatdagi ma'lumotlarni yuqoridagilar bilan solishtiring. Farq bo'lsa, darhol biz bilan bog'laning.",
      "v.err": "Server bilan bog'lanib bo'lmadi. Internetni tekshirib, qayta urinib ko'ring.",
      "v.cam": "Kamerani ochib bo'lmadi. Brauzerga kamera ruxsatini bering yoki ID ni qo'lda kiriting.",
      "v.stop": "Skanerlashni to'xtatish", "v.badqr": "Bu QR kod Fair Value hujjatiga tegishli emas.",
      "nf.t": "Sahifa topilmadi", "nf.d": "Siz izlagan sahifa mavjud emas yoki ko'chirilgan.",
    },

    cy: {
      "nav.services": "Хизматлар", "nav.about": "Афзалликлар", "nav.process": "Жараён",
      "nav.verify": "Ҳужжатни текшириш", "nav.contact": "Алоқа", "nav.faq": "Саволлар",
      "cta.request": "Ариза қолдириш", "cta.verify": "QR орқали текшириш",

      "hero.badge": "Баҳолаш фирмаси",
      "hero.lead": "Ҳурматли мижозлар, биз сизга мол-мулкни баҳолаш, бизнес лойиҳалар, эксперт хулосалари ва аудит бўйича профессионал ёрдам бера оламиз.",
      "hero.p1": "Ҳар бир ҳужжат QR код билан ҳимояланган",
      "hero.p2": "Банклар, нотариус ва суд учун",
      "hero.p3": "Тезкор ва шаффоф жараён",
      "hero.card.t": "Ҳужжатингиз ҳақиқийми?",
      "hero.card.d": "Ҳисоботдаги QR кодни сканерланг ёки ҳужжат ID рақамини киритинг.",

      "srv.kicker": "Хизматларимиз", "srv.title": "Сизга қуйидаги хизматлар бўйича ёрдам бера оламиз",
      "srv.1.t": "Барча турдаги мол-мулкларни баҳолаш хизмати",
      "srv.1.d": "Кўчмас мулк, автотранспорт, асбоб-ускуналар, бизнес ва қимматли қоғозларни қонунчилик ва миллий стандартларга мувофиқ баҳолаш.",
      "srv.2.t": "Бизнес лойиҳалар ва ТЕО (техник иқтисодий асослари)",
      "srv.2.d": "Банк кредити, инвестор ва давлат дастурлари учун бизнес-режа ҳамда техник-иқтисодий асосларни тайёрлаш.",
      "srv.3.t": "Импорт шартномаси бўйича эксперт хулосаси",
      "srv.3.d": "Импорт шартномалари нархларининг бозор қийматига мувофиқлиги бўйича мустақил эксперт хулосаси.",
      "srv.4.t": "Аудит хулосаси",
      "srv.4.d": "Молиявий ҳисоботларнинг ишончлилигини текшириш ва расмий аудит хулосасини тақдим этиш.",
      "srv.more": "Ариза қолдириш →",

      "obj.kicker": "Нималарни баҳолаймиз", "obj.title": "Баҳолаш объектлари",
      "obj.1": "Квартира, уй ва ер участкалари", "obj.2": "Тижорат ва ишлаб чиқариш бинолари",
      "obj.3": "Автомобил ва махсус техника", "obj.4": "Асбоб-ускуналар ва линиялар",
      "obj.5": "Бизнес, улуш ва акциялар", "obj.6": "Интеллектуал мулк ва номоддий активлар",
      "obj.7": "Қишлоқ хўжалиги активлари", "obj.8": "Етказилган зарарни баҳолаш",

      "why.kicker": "Нега айнан биз", "why.title": "Ишончли, аниқ ва шаффоф",
      "why.1.t": "Лицензияланган баҳоловчилар", "why.1.d": "Ҳисоботлар малакали мутахассислар томонидан миллий баҳолаш стандартлари асосида тайёрланади.",
      "why.2.t": "QR код билан тасдиқлаш", "why.2.d": "Ҳар бир ҳисоботга ноёб QR код берилади — банк ёки нотариус унинг ҳақиқийлигини бир неча сонияда текширади.",
      "why.3.t": "Қисқа муддатлар", "why.3.d": "Объектни кўздан кечиришдан ҳисобот топширишгача бўлган жараённи минимал муддатда бажарамиз.",
      "why.4.t": "Махфийлик", "why.4.d": "Мижоз маълумотлари ҳимояланган, текшириш саҳифасида шахсий маълумотлар яширин кўрсатилади.",

      "qr.kicker": "QR тасдиқлаш тизими", "qr.title": "Ҳар бир ҳужжат — QR код билан тасдиқланади",
      "qr.sub": "Сохта ҳисоботлардан ҳимоя: ҳужжатдаги QR код Fair Value расмий базасига боғланган.",
      "qr.s1.t": "Ҳужжат берилади", "qr.s1.d": "Ҳисобот расмийлаштирилгач, унга ноёб ID ва QR код бириктирилади.",
      "qr.s2.t": "QR сканерланади", "qr.s2.d": "Телефон камераси билан QR кодни сканерланг ёки ID рақамини киритинг.",
      "qr.s3.t": "Натижа кўринади", "qr.s3.d": "Ҳужжат ҳолати, рақами, санаси ва асосий маълумотлари дарҳол кўрсатилади.",
      "qr.ph": "Ҳужжат ID: FV-XXXX-XXXX-XX", "qr.btn": "Текшириш", "qr.scan": "Камерада сканерлаш",

      "proc.kicker": "Қандай ишлаймиз", "proc.title": "Иш жараёни",
      "proc.1.t": "Ариза", "proc.1.d": "Сайт, телефон ёки Instagram орқали мурожаат қиласиз.",
      "proc.2.t": "Ҳужжатлар", "proc.2.d": "Объектга оид ҳужжатлар ва мақсад аниқланади, шартнома тузилади.",
      "proc.3.t": "Кўздан кечириш", "proc.3.d": "Баҳоловчи объектни жойида ўрганади, бозор таҳлили ўтказилади.",
      "proc.4.t": "Ҳисобот", "proc.4.d": "Ҳисобот тайёрланади ва QR код билан муҳрланади.",
      "proc.5.t": "Топшириш", "proc.5.d": "Ҳисобот топширилади — уни исталган вақтда онлайн текшириш мумкин.",

      "use.kicker": "Қаерда керак бўлади", "use.title": "Баҳолаш ҳисоботи мақсадлари",
      "use.1": "Банк кредити ва гаров", "use.2": "Нотариал ҳаракатлар ва мерос",
      "use.3": "Суд ва низолар", "use.4": "Олди-сотди ва ижара",
      "use.5": "Устав фондига киритиш", "use.6": "Суғурта ва божхона",

      "faq.kicker": "Савол-жавоб", "faq.title": "Кўп бериладиган саволлар",
      "faq.1.q": "Баҳолаш қанча вақт олади?", "faq.1.a": "Муддат объект тури ва ҳажмига боғлиқ. Одатий кўчмас мулк ёки автомобил учун ҳисобот қисқа муддатда тайёрланади — аниқ муддатни мурожаат пайтида айтамиз.",
      "faq.2.q": "Қандай ҳужжатлар керак?", "faq.2.a": "Мулкка эгалик ҳужжати, кадастр паспорти ёки техник паспорт, шахсни тасдиқловчи ҳужжат. Бизнес баҳолашда молиявий ҳисоботлар ҳам талаб қилинади.",
      "faq.3.q": "QR код қандай ишлайди?", "faq.3.a": "Ҳисоботдаги QR код Fair Value расмий сайтидаги текшириш саҳифасига олиб боради. У ерда ҳужжат базада борлиги, ҳолати ва асосий маълумотлари кўринади. Агар ҳужжат топилмаса ёки бекор қилинган бўлса, бу дарҳол кўрсатилади.",
      "faq.4.q": "Ҳисоботни банклар қабул қиладими?", "faq.4.a": "Ҳа, ҳисоботлар амалдаги қонунчилик ва миллий баҳолаш стандартлари талабларига мувофиқ тайёрланади.",
      "faq.5.q": "Нарх қандай белгиланади?", "faq.5.a": "Нарх объект тури, мураккаблиги ва баҳолаш мақсадига қараб белгиланади. Ариза қолдиринг — мутахассисимиз сиз билан боғланиб, аниқ нархни айтади.",

      "contact.kicker": "Алоқа", "contact.title": "Ариза қолдиринг — биз сиз билан боғланамиз",
      "contact.sub": "Маълумотларингизни қолдиринг, мутахассисимиз қисқа вақт ичида қўнғироқ қилади.",
      "form.name": "Исмингиз", "form.phone": "Телефон рақамингиз", "form.service": "Хизмат тури",
      "form.choose": "Танланг", "form.msg": "Қўшимча маълумот (ихтиёрий)", "form.send": "Юбориш",
      "form.ok": "Раҳмат! Аризангиз қабул қилинди. Тез орада боғланамиз.",
      "form.err": "Юборишда хатолик. Илтимос, телефон орқали боғланинг.",
      "info.phone": "Телефон", "info.email": "Email", "info.address": "Манзил", "info.hours": "Иш вақти", "info.social": "Ижтимоий тармоқлар",

      "footer.desc": "Мол-мулкни баҳолаш, бизнес лойиҳалар, эксперт хулосалари ва аудит хизматлари.",
      "footer.rights": "Барча ҳуқуқлар ҳимояланган.", "footer.links": "Бўлимлар",

      "type.valuation": "Баҳолаш ҳисоботи", "type.business_plan": "Бизнес лойиҳа",
      "type.teo": "ТЕО (техник-иқтисодий асос)", "type.import": "Импорт шартномаси бўйича эксперт хулосаси",
      "type.audit": "Аудит хулосаси", "type.other": "Бошқа ҳужжат",

      "v.kicker": "Расмий текширув", "v.title": "Ҳужжатнинг ҳақиқийлигини текшириш",
      "v.sub": "Ҳисоботдаги QR кодни сканерланг ёки ҳужжат ID рақамини киритинг.",
      "v.loading": "Текширилмоқда…", "v.back": "← Бош саҳифа", "v.again": "Бошқа ҳужжатни текшириш",
      "v.ok.t": "Ҳужжат ҳақиқий", "v.ok.d": "Ушбу ҳужжат Fair Value томонидан берилган ва расмий базада рўйхатдан ўтган.",
      "v.rev.t": "Ҳужжат бекор қилинган", "v.rev.d": "Ушбу ҳужжат Fair Value томонидан бекор қилинган ва кучга эга эмас.",
      "v.exp.t": "Ҳужжат муддати тугаган", "v.exp.d": "Ҳужжат Fair Value томонидан берилган, лекин амал қилиш муддати тугаган.",
      "v.nf.t": "Ҳужжат топилмади", "v.nf.d": "Бундай ID рақамли ҳужжат базада мавжуд эмас. Ҳужжат сохта бўлиши мумкин — илтимос, биз билан боғланинг.",
      "v.f.id": "Ҳужжат ID", "v.f.number": "Ҳужжат рақами", "v.f.type": "Ҳужжат тури", "v.f.title": "Номи",
      "v.f.client": "Буюртмачи", "v.f.object": "Объект", "v.f.address": "Объект манзили", "v.f.value": "Қиймати",
      "v.f.purpose": "Мақсади", "v.f.appraiser": "Баҳоловчи", "v.f.issue": "Берилган сана",
      "v.f.valid": "Амал қилиш муддати", "v.f.reason": "Бекор қилиш сабаби", "v.f.checked": "Текширилган вақт",
      "v.pdf": "Асл ҳужжатни кўриш (PDF)",
      "v.note": "Қўлингиздаги ҳужжатдаги маълумотларни юқоридагилар билан солиштиринг. Фарқ бўлса, дарҳол биз билан боғланинг.",
      "v.err": "Сервер билан боғланиб бўлмади. Интернетни текшириб, қайта уриниб кўринг.",
      "v.cam": "Камерани очиб бўлмади. Браузерга камера рухсатини беринг ёки ID ни қўлда киритинг.",
      "v.stop": "Сканерлашни тўхтатиш", "v.badqr": "Бу QR код Fair Value ҳужжатига тегишли эмас.",
      "nf.t": "Саҳифа топилмади", "nf.d": "Сиз излаган саҳифа мавжуд эмас ёки кўчирилган.",
    },

    ru: {
      "nav.services": "Услуги", "nav.about": "Преимущества", "nav.process": "Процесс",
      "nav.verify": "Проверить документ", "nav.contact": "Контакты", "nav.faq": "Вопросы",
      "cta.request": "Оставить заявку", "cta.verify": "Проверить по QR",

      "hero.badge": "Оценочная компания",
      "hero.lead": "Уважаемые клиенты, мы готовы помочь вам с оценкой имущества, бизнес-проектами, экспертными заключениями и аудитом.",
      "hero.p1": "Каждый документ защищён QR-кодом",
      "hero.p2": "Для банков, нотариусов и суда",
      "hero.p3": "Быстро и прозрачно",
      "hero.card.t": "Ваш документ подлинный?",
      "hero.card.d": "Отсканируйте QR-код в отчёте или введите ID документа.",

      "srv.kicker": "Наши услуги", "srv.title": "Мы поможем вам в следующих вопросах",
      "srv.1.t": "Оценка всех видов имущества",
      "srv.1.d": "Оценка недвижимости, транспорта, оборудования, бизнеса и ценных бумаг в соответствии с законодательством и национальными стандартами.",
      "srv.2.t": "Бизнес-проекты и ТЭО",
      "srv.2.d": "Подготовка бизнес-планов и технико-экономических обоснований для банков, инвесторов и государственных программ.",
      "srv.3.t": "Экспертное заключение по импортным контрактам",
      "srv.3.d": "Независимое заключение о соответствии цен импортных контрактов рыночной стоимости.",
      "srv.4.t": "Аудиторское заключение",
      "srv.4.d": "Проверка достоверности финансовой отчётности и предоставление официального аудиторского заключения.",
      "srv.more": "Оставить заявку →",

      "obj.kicker": "Что мы оцениваем", "obj.title": "Объекты оценки",
      "obj.1": "Квартиры, дома и земельные участки", "obj.2": "Коммерческие и производственные здания",
      "obj.3": "Автомобили и спецтехника", "obj.4": "Оборудование и линии",
      "obj.5": "Бизнес, доли и акции", "obj.6": "Интеллектуальная собственность и НМА",
      "obj.7": "Сельскохозяйственные активы", "obj.8": "Оценка причинённого ущерба",

      "why.kicker": "Почему мы", "why.title": "Надёжно, точно и прозрачно",
      "why.1.t": "Лицензированные оценщики", "why.1.d": "Отчёты готовят квалифицированные специалисты на основе национальных стандартов оценки.",
      "why.2.t": "Подтверждение QR-кодом", "why.2.d": "Каждому отчёту присваивается уникальный QR-код — банк или нотариус проверит подлинность за секунды.",
      "why.3.t": "Короткие сроки", "why.3.d": "От осмотра объекта до выдачи отчёта — в минимальные сроки.",
      "why.4.t": "Конфиденциальность", "why.4.d": "Данные клиентов защищены, на странице проверки личные данные скрыты.",

      "qr.kicker": "Система QR-подтверждения", "qr.title": "Каждый документ подтверждается QR-кодом",
      "qr.sub": "Защита от подделок: QR-код в документе связан с официальной базой Fair Value.",
      "qr.s1.t": "Выдача документа", "qr.s1.d": "После оформления отчёту присваиваются уникальный ID и QR-код.",
      "qr.s2.t": "Сканирование", "qr.s2.d": "Отсканируйте QR-код камерой телефона или введите ID.",
      "qr.s3.t": "Результат", "qr.s3.d": "Сразу отображаются статус, номер, дата и основные данные документа.",
      "qr.ph": "ID документа: FV-XXXX-XXXX-XX", "qr.btn": "Проверить", "qr.scan": "Сканировать камерой",

      "proc.kicker": "Как мы работаем", "proc.title": "Этапы работы",
      "proc.1.t": "Заявка", "proc.1.d": "Вы обращаетесь через сайт, по телефону или в Instagram.",
      "proc.2.t": "Документы", "proc.2.d": "Определяем цель оценки и документы, заключаем договор.",
      "proc.3.t": "Осмотр", "proc.3.d": "Оценщик осматривает объект, проводится анализ рынка.",
      "proc.4.t": "Отчёт", "proc.4.d": "Готовится отчёт и заверяется QR-кодом.",
      "proc.5.t": "Выдача", "proc.5.d": "Отчёт выдаётся — его можно проверить онлайн в любое время.",

      "use.kicker": "Где нужен отчёт", "use.title": "Цели оценки",
      "use.1": "Банковский кредит и залог", "use.2": "Нотариальные действия и наследство",
      "use.3": "Суд и споры", "use.4": "Купля-продажа и аренда",
      "use.5": "Внесение в уставный фонд", "use.6": "Страхование и таможня",

      "faq.kicker": "Вопросы и ответы", "faq.title": "Частые вопросы",
      "faq.1.q": "Сколько времени занимает оценка?", "faq.1.a": "Срок зависит от типа и объёма объекта. Для типовой недвижимости или автомобиля отчёт готовится в короткие сроки — точный срок сообщим при обращении.",
      "faq.2.q": "Какие документы нужны?", "faq.2.a": "Документ о праве собственности, кадастровый или технический паспорт, документ, удостоверяющий личность. Для оценки бизнеса — также финансовая отчётность.",
      "faq.3.q": "Как работает QR-код?", "faq.3.a": "QR-код в отчёте ведёт на страницу проверки на официальном сайте Fair Value. Там видно, есть ли документ в базе, его статус и основные данные. Если документ не найден или аннулирован, это сразу отображается.",
      "faq.4.q": "Принимают ли отчёт банки?", "faq.4.a": "Да, отчёты готовятся в соответствии с действующим законодательством и национальными стандартами оценки.",
      "faq.5.q": "Как определяется стоимость?", "faq.5.a": "Стоимость зависит от типа объекта, сложности и цели оценки. Оставьте заявку — специалист свяжется с вами и назовёт точную цену.",

      "contact.kicker": "Контакты", "contact.title": "Оставьте заявку — мы свяжемся с вами",
      "contact.sub": "Оставьте свои данные, и наш специалист перезвонит в ближайшее время.",
      "form.name": "Ваше имя", "form.phone": "Номер телефона", "form.service": "Услуга",
      "form.choose": "Выберите", "form.msg": "Дополнительная информация (необязательно)", "form.send": "Отправить",
      "form.ok": "Спасибо! Ваша заявка принята. Мы скоро свяжемся с вами.",
      "form.err": "Ошибка отправки. Пожалуйста, позвоните нам.",
      "info.phone": "Телефон", "info.email": "Email", "info.address": "Адрес", "info.hours": "Время работы", "info.social": "Соцсети",

      "footer.desc": "Оценка имущества, бизнес-проекты, экспертные заключения и аудит.",
      "footer.rights": "Все права защищены.", "footer.links": "Разделы",

      "type.valuation": "Отчёт об оценке", "type.business_plan": "Бизнес-проект",
      "type.teo": "ТЭО (технико-экономическое обоснование)", "type.import": "Экспертное заключение по импортному контракту",
      "type.audit": "Аудиторское заключение", "type.other": "Другой документ",

      "v.kicker": "Официальная проверка", "v.title": "Проверка подлинности документа",
      "v.sub": "Отсканируйте QR-код в отчёте или введите ID документа.",
      "v.loading": "Проверяем…", "v.back": "← На главную", "v.again": "Проверить другой документ",
      "v.ok.t": "Документ подлинный", "v.ok.d": "Документ выдан компанией Fair Value и зарегистрирован в официальной базе.",
      "v.rev.t": "Документ аннулирован", "v.rev.d": "Документ аннулирован компанией Fair Value и недействителен.",
      "v.exp.t": "Срок действия истёк", "v.exp.d": "Документ выдан Fair Value, но срок его действия истёк.",
      "v.nf.t": "Документ не найден", "v.nf.d": "Документа с таким ID нет в базе. Документ может быть поддельным — пожалуйста, свяжитесь с нами.",
      "v.f.id": "ID документа", "v.f.number": "Номер документа", "v.f.type": "Тип документа", "v.f.title": "Наименование",
      "v.f.client": "Заказчик", "v.f.object": "Объект", "v.f.address": "Адрес объекта", "v.f.value": "Стоимость",
      "v.f.purpose": "Цель", "v.f.appraiser": "Оценщик", "v.f.issue": "Дата выдачи",
      "v.f.valid": "Действителен до", "v.f.reason": "Причина аннулирования", "v.f.checked": "Время проверки",
      "v.pdf": "Открыть оригинал (PDF)",
      "v.note": "Сверьте данные вашего документа с указанными выше. При расхождении немедленно свяжитесь с нами.",
      "v.err": "Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.",
      "v.cam": "Не удалось открыть камеру. Разрешите доступ к камере или введите ID вручную.",
      "v.stop": "Остановить сканирование", "v.badqr": "Этот QR-код не относится к документу Fair Value.",
      "nf.t": "Страница не найдена", "nf.d": "Страница не существует или была перемещена.",
    },
  };

  const LANGS = { uz: ["O'zbek", "UZ"], cy: ["Ўзбек", "ЎЗ"], ru: ["Рус", "RU"] };
  const HTML_LANG = { uz: "uz-Latn", cy: "uz-Cyrl", ru: "ru" };
  let lang = "uz";
  try { lang = localStorage.getItem("fv_lang") || lang; } catch (e) {}
  if (!D[lang]) lang = "uz";

  function t(key) { return (D[lang] && D[lang][key]) || D.uz[key] || key; }

  function apply(root = document) {
    document.documentElement.lang = HTML_LANG[lang];
    root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
    root.querySelectorAll("[data-cfg]").forEach(el => {
      const v = el.dataset.cfg.split(".").reduce((o, k) => (o ? o[k] : undefined), window.FV_CONFIG || {});
      el.textContent = v && typeof v === "object" ? (v[lang] || v.uz) : (v || "");
    });
    document.querySelectorAll(".lang-switch button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    document.dispatchEvent(new CustomEvent("fv:lang", { detail: lang }));
  }

  function setLang(l) {
    if (!D[l]) return;
    lang = l;
    try { localStorage.setItem("fv_lang", l); } catch (e) {}
    apply();
  }

  function mountSwitch() {
    document.querySelectorAll(".lang-switch").forEach(box => {
      box.innerHTML = Object.entries(LANGS)
        .map(([k, [full, short]]) => `<button type="button" data-lang="${k}" title="${full}"><span class="l-full">${full}</span><span class="l-short">${short}</span></button>`).join("");
      box.addEventListener("click", e => { const b = e.target.closest("button"); if (b) setLang(b.dataset.lang); });
    });
  }

  window.FV_I18N = { t, apply, setLang, get lang() { return lang; } };
  document.addEventListener("DOMContentLoaded", () => { mountSwitch(); apply(); });
})();
