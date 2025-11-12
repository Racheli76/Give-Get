# GiveAndGet Server

**Give And Get** is an ASP.NET Core server designed to connect people based on skills, talents, and interests. The system allows users to teach and learn from each other in a **secure, intelligent, and controlled** way. This project demonstrates a combination of **technical creativity, professional skill, and social contribution**.  

[Frontend/Client repository](https://github.com/Racheli76/Give-Get/blob/main/client/Give-Get-client) – full user interface for displaying matches, chat, and personal management.

---

## Technologies

- **C# ASP.NET Core**  
- **Entity Framework Code First** with SQL Server  
- **SignalR** – real-time chat  
- **External APIs** – email notifications, daily inspirational quotes, translation  
- **Authentication & Authorization** – JWT Tokens, Roles (Admin/User)  

---

## Key Features

- **User registration and management** – email and phone verification, secure storage  
- **Talent management with hierarchy** – e.g., Music → Piano/Flute; Baking → Breads/Desserts  
- **Smart matching algorithm** – generates new matches only, considers age, gender, and additional metrics  
- **Approval and moderation** – users can approve or reject matches; new talent requests are sent to an admin  
- **Real-time chat** – SignalR-based, minimal information exposure  
- **User rating system** – users can rate each other after collaboration  
- **Integration with external APIs** – email notifications, inspirational quotes, translation  

---

## Server Workflow & Background Operations

1. User registers and adds talents they can teach and want to learn  
2. Any change in talents triggers the smart matching algorithm  
3. The algorithm creates **new matches only** and updates users  
4. Users approve or reject each new match  
5. Requests to add new talents are sent to an admin for approval  
6. Approved users can use real-time chat  
7. Users can rate each other after collaboration  

**Additional background operations:**  
- Automatic algorithm execution whenever talents are added or updated  
- Sending notifications to admins for new requests  
- Fetching **daily inspirational quotes** from external API for display  
- Maintaining data consistency and preventing duplicate matches  
- Retrieving **top-rated users** for display on the site  

---

## Security & Testing

- JWT Tokens and Roles for secure access (Admin/User)  
- Comprehensive tests for CRUD operations, matches, and user data verification  
- Prevention of duplicate matches and incorrect associations  
- Minimal information exposure – only username and specific talent  

---

## Running the Server

1. Requires **Visual Studio** with ASP.NET Core support  
2. Requires **SQL Server**  
3. Run the server – database is created automatically using Code First  
4. Configure external Email API connection  
5. Connect with JWT Token; the Client handles the user interface  

---

## Overview

GiveAndGet demonstrates how **complex and professional software development** can combine creativity, smart design, and social awareness to deliver **meaningful value** to users. It highlights technical skill, originality, and a commitment to contributing positively to the community.

---

## 👩‍💻 Developers

**Shulamit Halbershtadt**
📫 [GitHub Profile](https://github.com/Shu6136713)

**Racheli Cohen** 
📫 [GitHub Profile](https://github.com/Racheli76)



---

---


# GiveAndGet Server

**Give And Get** הוא שרת ASP.NET Core שמחבר בין אנשים על בסיס כישורים, יכולות ותחומי עניין. המערכת מאפשרת למשתמשים ללמד וללמוד אחד מהשני בצורה **מאובטחת, חכמה ומבוקרת**. הפרויקט מדגים שילוב של **יצירתיות טכנולוגית, מקצועיות ותרומה חברתית משמעותית**.  

[Frontend/Client repository](https://github.com/shulamit-h/Give-Get-client) – ממשק משתמש מלא להצגת התאמות, צ׳אט וניהול אישי.

---

## טכנולוגיות

- **C# ASP.NET Core**  
- **Entity Framework Code First** עם SQL Server  
- **SignalR** – צ׳אט בזמן אמת  
- **API חיצוניים** – שליחת מיילים, משפטי השראה יומיים, תרגום  
- **Authentication & Authorization** – JWT Tokens, Roles (Admin/User)  

---

## פיצ’רים עיקריים

- **הרשמה וניהול משתמשים** – אימות מייל וטלפון, שמירה על פרטים מאובטחים  
- **ניהול כשרונות והיררכיה** – לדוגמה: נגינה → כינור/חליל; אפייה → לחמים/קינוחים  
- **אלגוריתם חכם להתאמות** – יוצר התאמות חדשות בלבד, מבצע שקלול לפי גיל, מגדר ומדדים נוספים  
- **אישור ובקרה** – משתמשים מאשרים או דוחים התאמות; בקשות להוספת כשרונות נשלחות למנהל  
- **צ׳אט בזמן אמת** – מבוסס SignalR, חשיפה מינימלית של מידע  
- **דרוג משתמשים** – לאחר שיתוף פעולה, המשתמשים יכולים לדרג זה את זה  
- **גישה ל‑API חיצוניים** – לשליחת התראות, משפטי השראה ותרגום  

---

## זרימת עבודה ופעולות שוטפות

1. משתמש נרשם ומוסיף כשרונות שהוא יכול ללמד ורוצה ללמוד  
2. שינויי כשרונות מפעילים את האלגוריתם החכם  
3. האלגוריתם יוצר **התאמות חדשות בלבד** ומעדכן את המשתמשים  
4. משתמשים מאשרים או דוחים כל התאמה  
5. בקשות להוספת כשרונות חדשים נשלחות למנהל  
6. משתמשים מאושרים יכולים להשתמש ב‑צ׳אט בזמן אמת  
7. בסיום השיתוף, ניתן לדרג את המשתמש השני  

**פעולות שוטפות נוספות:**  
- הפעלת האלגוריתם באופן אוטומטי עם הוספה או שינוי כשרונות  
- שליחת התראות למנהלים על בקשות חדשות  
- קבלת **משפטי השראה יומיים** מ‑API חיצוני והצגתם באתר  
- שמירה על עקביות הנתונים והימנעות מכפילויות בהתאמות  
- שליפת **משתמשים בעלי דירוג הגבוה ביותר** להצגה באתר  

---

## אבטחה ובדיקות

- JWT Tokens וניהול Roles (Admin/User)  
- בדיקות תקינות מקיפות של CRUD, התאמות ואימות פרטי משתמש  
- מניעת כפילויות והתאמות שגויות  
- חשיפת מידע מינימלית – רק שם משתמש וכשרון ספציפי  

---

## הרצת השרת

1. דרוש **Visual Studio** עם תמיכה ב‑ASP.NET Core  
2. דרוש **SQL Server**  
3. הרץ את השרת – מסד הנתונים נוצר אוטומטית באמצעות Code First  
4. הגדרת חיבור ל‑Email API  
5. התחברות עם JWT Token; ה‑Client מציג את הממשק  

---

## סיכום

GiveAndGet ממחיש כיצד **פיתוח תוכנה מורכב ומקצועי** יכול לשלב יצירתיות, חשיבה חכמה והבנה חברתית, ולהביא **ערך משמעותי למשתמשים**. הפרויקט מדגיש כישורים טכנולוגיים, מקוריות, ויכולת לתרום לקהילה באופן ממשי.

## מפתחים 👩‍💻

**Shulamit Halbershtadt**
📫 [GitHub Profile](https://github.com/Shu6136713)

**Racheli Cohen** 
📫 [GitHub Profile](https://github.com/Racheli76)






