#Мое описание для запуска тестового задания

---

### 1. **Установите зависимости**

```bash
npm install
```

### 2. **Создайте и настройте файл переменных окружения**

- Скопируйте `.env.example` → `.env`
- Укажите все необходимые переменные

### 3. **Подготовьте Google Service Account и Google-таблицу**

[Подробнее о настройке Google Service Account и Google Sheets](#настройка-google-service-account-и-google-sheets)

### 4. **Запустите контейнеры**

```bash
docker compose up --build
```

### 5. **Проверьте миграции и сиды**

- Миграции и сиды должны выполниться автоматически при запуске контейнера.
- Логи должны содержать сообщение:
    ```
    All migrations and seeds have been run
    ```

### 6. **Проверьте логи приложения**

- Убедитесь, что нет ошибок по ключам, доступу к БД, Google Sheets и WB API.
- В логах должны появляться сообщения о выполнении cron-задач.

### 7. **Проверьте Google Sheets**

- Через 5 минут после запуска (или сразу, если запускать вручную) в листе `stocks_coefs` должны появиться актуальные тарифы.

---

# Шаблон для выполнения тестового задания

## Описание

Шаблон подготовлен для того, чтобы попробовать сократить трудоемкость выполнения тестового задания.

В шаблоне настоены контейнеры для `postgres` и приложения на `nodejs`.  
Для взаимодействия с БД используется `knex.js`.  
В контейнере `app` используется `build` для приложения на `ts`, но можно использовать и `js`.

Шаблон не является обязательным!\
Можно использовать как есть или изменять на свой вкус.

Все настройки можно найти в файлах:

- compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

## Команды:

Запуск базы данных:

```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:

```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```

Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:

```bash
npm run dev
```

Запуск проверки самого приложения:

```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:

```bash
docker compose down --rmi local --volumes
docker compose up --build
```

PS: С наилучшими пожеланиями!

---

## Настройка Google Service Account и Google Sheets

### Инструкция

1. **Создайте проект в Google Cloud Console**  
   https://console.cloud.google.com/
2. **Включите Google Sheets API**  
   В разделе "APIs & Services" → "Enable APIs and Services" → найдите и включите "Google Sheets API".
3. **Создайте сервисный аккаунт**  
   "IAM & Admin" → "Service Accounts" → "Create Service Account".  
   Дайте имя, выберите роль "Editor" или "Project > Editor".
4. **Создайте и скачайте JSON-ключ сервисного аккаунта**  
   После нажатия на сервис в разделе "Keys" → "Add Key" → "Create new key" → выберите JSON.  
   Скачайте файл и поместите его в папку проекта и переименуйте в google-service-account.json (пример, `src/config/keys/google-service-account.json`).
5. **Дайте сервисному аккаунту доступ к вашей Google-таблице**  
   Откройте нужную Google-таблицу.  
   Нажмите "Файд" -> "Поделиться" -> "Открыть доступ".  
   Введите email сервисного аккаунта (например, `my-service-account@my-project.iam.gserviceaccount.com`), дайте права "Редактор".
6. **Убедитесь, что в таблице есть лист с именем `stocks_coefs`**  
   Если нужно другое имя — измените его в коде.

---
