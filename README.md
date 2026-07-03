# SilexNote Community Plugins

Открытый маркетплейс плагинов для [SilexNote](https://github.com/Nuxson/SilexNote).

Плагины для расширения функциональности текстового редактора Silex. Любой желающий может написать и опубликовать свой плагин.

## Установка плагинов

### Способ 1: Локальная папка

1. Склонируйте или скачайте плагин в папку `plugins/` рядом с Silex:
```
~/.silex/plugins/my-plugin/
├── manifest.json
└── index.js
```

2. Перезапустите Silex — плагин появится в **Настройки → Плагины → Плагины сообщества**.

### Способ 2: GitHub (в разработке)

Установка по URL репозитория:
```
Настройки → Плагины → Установить из GitHub → https://github.com/user/plugin-repo
```

## Структура плагина

Каждый плагин — это папка с `manifest.json` и entry point файлом.

```
my-plugin/
├── manifest.json      # Метаданные плагина (обязательно)
├── index.js           # Entry point (обязательно)
├── icon.png           # Иконка (опционально, 64x64)
└── styles.css         # Стили (опционально)
```

### manifest.json

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Краткое описание плагина",
  "author": "YourName",
  "main": "index.js",
  "keywords": ["editor", "text", "productivity"],
  "repository": "https://github.com/user/my-plugin"
}
```

| Поле | Обязательно | Описание |
|------|-------------|----------|
| `id` | ✅ | Уникальный ID плагина (kebab-case) |
| `name` | ✅ | Отображаемое имя |
| `version` | ✅ | Версия (semver) |
| `description` | ✅ | Краткое описание |
| `author` | ✅ | Имя автора |
| `main` | ✅ | Путь к entry point |
| `keywords` | ❌ | Ключевые слова для поиска |
| `repository` | ❌ | Ссылка на GitHub репозиторий |

### index.js

Entry point плагина экспортирует функцию, возвращающую объект `Plugin`:

```js
module.exports = function setupPlugin(ctx) {
  // ctx.editor — Tiptap Editor instance
  // ctx.registerCommand() — добавить команду в палитру
  // ctx.registerShortcut() — горячая клавиша
  // ctx.addButton() — кнопка в statusbar
  // ctx.showModal() — модальное окно
  // ctx.on() — подписка на события

  ctx.registerCommand({
    id: 'my-action',
    name: 'Мое действие',
    description: 'Что делает команда',
    icon: '🔧',
    action: (editor) => {
      editor.chain().focus().insertContent('Hello!').run();
    },
  });

  return {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    description: 'Описание плагина',
    type: 'community',
    destroy: () => {
      // Очистка при выгрузке
    },
  };
};
```

## PluginContext API

Плагин получает объект `PluginContext` с полным доступом к редактору и UI:

| Метод | Описание |
|-------|----------|
| `editor` | Экземпляр Tiptap Editor |
| `registerCommand(cmd)` | Добавить команду в палитру (`/` или `Ctrl+P`) |
| `registerShortcut(shortcut, handler)` | Назначить горячую клавишу |
| `addButton(options)` | Добавить кнопку в statusbar |
| `showModal(options)` | Показать модальное окно |
| `on(event, handler)` | Подписаться на событие |

### События

| Событие | Описание |
|---------|----------|
| `editor:ready` | Редактор инициализирован |
| `editor:destroy` | Редактор уничтожается |
| `settings:changed` | Настройки изменены |

### Примеры

**Команда в палитре:**
```js
ctx.registerCommand({
  id: 'word-count',
  name: 'Подсчёт слов',
  description: 'Показать статистику текста',
  icon: '#',
  action: (editor) => {
    const words = editor.getText().split(/\s+/).filter(Boolean).length;
    ctx.showModal({ title: 'Статистика', content: `Слов: ${words}` });
  },
});
```

**Горячая клавиша:**
```js
ctx.registerShortcut('Ctrl+Shift+H', (editor) => {
  editor.chain().focus().insertContent('👋').run();
});
```

**Кнопка в statusbar:**
```js
ctx.addButton({
  id: 'my-btn',
  title: 'Мой плагин',
  icon: '🔧',
  position: 'statusbar',
  action: () => { /* ... */ },
});
```

**Модальное окно:**
```js
ctx.showModal({
  title: 'Результат',
  content: '<p>Операция выполнена!</p>',
  onConfirm: () => { /* OK clicked */ },
});
```

## Работа с Tiptap Editor

Плагин получает полный доступ к Tiptap Editor через `ctx.editor`:

```js
// Вставка текста
editor.chain().focus().insertContent('Текст').run();

// Форматирование
editor.chain().focus().toggleBold().run();
editor.chain().focus().toggleHeading({ level: 2 }).run();

// Получение контента
const text = editor.getText();    // Plain text
const html = editor.getHTML();    // HTML
const json = editor.getJSON();    // JSON

// Выделение
const { from, to } = editor.state.selection;
const selected = editor.state.doc.textBetween(from, to);

// Замена контента
editor.commands.setContent('<p>Новый контент</p>');
```

## Публикация плагина

1. Создайте репозиторий на GitHub с названием `silex-plugin-<name>`
2. Добавьте `manifest.json` и `index.js`
3. Добавьте README с описанием
4. Создайте [Issue](https://github.com/Nuxson/SilexNote-Plugins/issues) с тегом `plugin-submission`:

```
### Плагин
- **Имя**: My Plugin
- **Описание**: Краткое описание
- **Автор**: YourName
- **Репозиторий**: https://github.com/user/silex-plugin-my-plugin
- **Ключевые слова**: editor, text, productivity
```

5. После проверки плагин будет добавлен в каталог

## Готовые плагины

| Плагин | Описание | Автор |
|--------|----------|-------|
| *(пока нет)* | | |

## Требования к плагинам

- [ ] Уникальный `id` (не совпадает с другими)
- [ ] `manifest.json` валиден
- [ ] Entry point экспортирует функцию
- [ ] `destroy()` освобождает ресурсы (таймеры, слушатели)
- [ ] Горячие клавиши не конфликтуют с системными
- [ ] Нет сторонних зависимостей (только PluginContext API)

## Лицензия

MIT
