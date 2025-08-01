#web-exercise=3

در این تمرین تحت معماری rest api یک backend برای تمرین قبل تحت ساختار زیر ساخته‌ایم که در ادامه به توضیح آن می‌پردازیم.


paint-app/
├── paint-backend/
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── example/
    │       │           └── paintapp/
    │       │               ├── controller/
    │       │               │   ├── PaintingController.java
    │       │               │   └── UserController.java
    │       │               ├── model/
    │       │               │   ├── Painting.java
    │       │               │   └── User.java
    │       │               ├── repository/
    │       │               │   ├── PaintingRepository.java
    │       │               │   └── UserRepository.java
    │       │               └── PaintAppApplication.java
    │       └── resources/
    │           └── application.properties
    └── pom.xml



User entity:  

در این بخش موجودیت کاربر با یک شناسه (کلید منحصر به فرد هر کاربر)؛ نام هر کاربر برای ذخیره‌سازی و یک نیز یک نام برای نمایش در بخش کاربر تعریف شده است.

Painting Entity:

در این بخش موجودیت هر نقاشی با نام، شناسه، کاربر سازنده‌ی آن، اطلاعات مختصات شکل‌ها (در shapesDate) و نیز زمان ساختن آن ذخیره می‌شوند.

PaintingRepository & UserRepository:

برای زدن کوئری و پیدا کردن کاربر و نقاشی‌ها مورد استفاده قرار می‌گیرند.

UserController:

درخواست‌های مربوط به کاربران با استفاده از UserRepository پاسخ می‌دهد و لیست کاربران را برمی‌گرداند.

PaintingController:

در savePaiting نقاشی قبلی کاربر در صورت وجود پاک شده و نقاشی جدید با اطلاعات توضیح داده شده برای آن ایجاد شده و ذخیره می‌شود. و نیز هر نقاشی با توجه به شناسه‌ی کاربر نمایش و بر اساس شناسه‌ی آن انتخاب شده و بازگردانده می‌شود.





