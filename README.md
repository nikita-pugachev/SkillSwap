# SkillSwap

Платформа обмена навыками: пользователи предлагают свои умения и находят тех, кто может помочь им в ответ.

---

## Стек

- **React 19** + **TypeScript**
- **SCSS** — стили
- **ESLint 9** + **Prettier** + **Stylelint** — качество кода

---

## Структура проекта

```
src/
├── api/          # Методы работы с мок-данными (axios/fetch)
├── app/          # Инициализация, провайдеры, глобальные стили
├── entities/     # Модели домена: Skill, User, Request
├── features/
│   ├── auth/         # Авторизация
│   ├── skills/       # Навыки
│   ├── favorites/    # Избранное
│   └── requests/     # Заявки на обмен
├── widgets/      # Переиспользуемые блоки: SkillCard, FiltersBar
└── pages/        # Страницы: Home, Profile, Skill, Favorites
```

---

## Установка

```bash
npm install
```

## Запуск

```bash
npm run dev
```

---

## Команды линтинга

| Команда                 | Описание                                          |
| ----------------------- | ------------------------------------------------- |
| `npm run lint`          | Проверка TS/TSX через ESLint                      |
| `npm run lint:fix`      | Автоисправление ESLint                            |
| `npm run format`        | Форматирование Prettier                           |
| `npm run format:check`  | Проверка форматирования без изменений             |
| `npm run stylelint`     | Проверка CSS/SCSS                                 |
| `npm run stylelint:fix` | Автоисправление стилей                            |
| `npm run check`         | Полная проверка (lint + stylelint + format:check) |

---

## Git-воркфлоу

```
main
 └── dev         <- вся разработка ведётся здесь
      ├── feature/auth
      ├── feature/skills
      ├── fix/some-bug
      └── ...
```

### Правила

- **`main`** — стабильная версия. Прямые коммиты запрещены.
- **`dev`** — основная ветка для разработки. Все PR открываются в `dev`.
- Для каждой задачи создаётся отдельная ветка от `dev`:
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b feature/название-задачи
  ```
- После завершения — открыть PR в `dev`, пройти код-ревью тимлида.
- Называть ветки по шаблону: `feature/`, `fix/`, `refactor/`

---

## Соглашения

- Каждая фича — изолированный модуль в `features/`
- Общие компоненты без бизнес-логики — в `widgets/`
- Типы и интерфейсы моделей — в `entities/`
- Все API-запросы — только через `api/`
