# Royal Family Bot - Ready Package

## ماذا في الحزمة
هذه الحزمة تحتوي على بوت جاهز لإنشاء رتب وقنوات بنظام "عائلة ملكية" داخل سيرفرك عند تنفيذ الأمر `!setup`.

## كيف تستخدمها بسرعة
1. فك الضغط عن الملف `royal-family-bot-ready.zip`.
2. افتح الملف `.env` وغيّر القيم:
   - `TOKEN=` ضع توكن البوت (انسخ من Discord Developer Portal) — **لا ترفع التوكن للمستودعات العامة**.
   - `GUILD_ID=` ضع ID السيرفر.
3. ارفع المشروع إلى GitHub أو استخدم Render مباشرة:
   - على Render: اختر **New → Background Worker** (مش Web Service).
   - Build Command: `npm install`
   - Start Command: `npm start`
   - في Environment أو Secrets تأكد أن القيم مضبوطة (أو استخدم .env محلي).
4. شغّل الخدمة ثم في ديسكورد اكتب:
   ```
   !setup
   ```
   يجب أن يتم إنشاء الرتب والقنوات تلقائيًا.

## تحذير أمني مهم
- التوكن الذي وضعته في `.env` مكشوف الآن في هذه الحزمة. إذا تم مشاركته بشكل عام، **عليك فورًا** إعادة ضبط التوكن من Discord Developer Portal → Bot → Reset Token.
- الأفضل أن تحذف `.env` من المستودع العام أو تستخدم متغيرات البيئة في Render بدلاً من رفع `.env` إلى GitHub.
