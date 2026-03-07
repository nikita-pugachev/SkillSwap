# SkillSwap

Платформа обмена навыками: пользователи предлагают свои умения и находят тех, кто может помочь им в ответ.

---

## Стек

- **React 19** + **TypeScript**
- **Redux Toolkit** + **React-Redux** — управление состоянием
- **SCSS** — стили
- **ESLint 9** + **Prettier** + **Stylelint** — качество кода
- **Jest 30** + **React Testing Library** — unit-тесты
- **Husky** + **commitlint** — git-хуки, Conventional Commits
- **GitHub Actions** — CI (lint + тесты на каждый PR/push)

---

## Структура проекта

```text
src/
 ├── api/           # Методы работы с мок-данными (axios/fetch)
 ├── app/           # Инициализация, провайдеры, глобальные стили
 ├── assets/
 │  ├── icons/                    # Иконки
 │  │      ├── logo/
 │  │      └── skills-category/
 │  ├── fonts/                    # Шрифты
 │  ├── illustrations/            # Иллюстрации
 │  └── user-avatars/             # Аватары пользователей
 ├── entities/      # Модели домена (Skill, User, Request)
 ├── features/
 │    ├── auth/           # Авторизация
 │    ├── skills/         # Навыки
 │    ├── favorites/      # Избранное
 │    └── requests/       # Заявки на обмен
 ├── widgets/       # Переиспользуемые блоки: SkillCard, FiltersBar
 ├── pages/         # Страницы: Home, Profile, Skill, Favorites
 ├── shared/
 │    ├── ui/       # Атомы/молекулы
 │    ├── hooks/    # useDebounce, useLocalStorage ...
 │    └── lib/      # helpers, constants
 └── main.tsx

public/
├──favicon/
└──db/
    ├── skills.json
    ├── users.json
    └── cities.json
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

## Команды

### Разработка

| Команда          | Описание               |
| ---------------- | ---------------------- |
| `npm run dev`    | Запуск dev-сервера     |
| `npm run build`  | Production-сборка      |
| `npm run preview`| Предпросмотр сборки    |

### Тесты

| Команда                   | Описание                          |
| ------------------------- | --------------------------------- |
| `npm test`                | Запуск тестов (Jest)              |
| `npm run test:coverage`   | Тесты с отчётом о покрытии        |

### Линтинг и форматирование

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

```text
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

---

## Тестирование

Тесты пишутся рядом с тестируемым модулем в файлах `*.test.tsx` / `*.test.ts`.

```bash
npm test                 # запустить все тесты
npm run test:coverage    # с отчётом о покрытии
```

Цель — покрытие **≥ 70%**.

---

## CI

GitHub Actions запускает два job-а на каждый push/PR в `main`:

1. **lint** — `npm run check`
2. **test** — `npm test -- --coverage`

Статус пайплайна виден в PR перед мержем.

---

## Conventional Commits

Формат сообщений коммитов проверяется автоматически (Husky + commitlint):

```bash
<type>(<scope>): <описание>

feat: add skill card component
fix: correct avatar upload validation
chore: update dependencies
```

Допустимые типы: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`, `ci`.
