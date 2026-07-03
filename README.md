# SilexNote Community Plugins

Открытый маркетплейс плагинов для [SilexNote](https://github.com/Nuxson/SilexNote).

Плагины для расширения функциональности текстового редактора Silex. Любой желающий может написать и опубликовать свой плагин.

## Установка плагинов

### Встроенный магазин

Настройки → Плагины → **Магазин плагинов** → Установить

### Программно

```ts
import { installPluginFromGitHub } from './plugins/community/loader';
await installPluginFromGitHub('https://github.com/user/silex-plugin-name');
```

### Локальная папка

Скопируйте плагин в `AppData/SilexNote/plugins/`:
```
~/.silex/plugins/my-plugin/
├── manifest.json
└── index.js
```

## Структура плагина

```
my-plugin/
├── manifest.json
└── index.js
```

### manifest.json

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Краткое описание",
  "author": "YourName",
  "main": "index.js",
  "keywords": ["editor", "text"],
  "repository": "https://github.com/user/my-plugin"
}
```

## PluginContext API

Плагин получает объект `ctx` с полным доступом к приложению:

| API | Описание |
|-----|----------|
| `ctx.pluginId` | ID плагина |
| `ctx.editor` | Tiptap Editor |
| `ctx.fs` | Файловая система |
| `ctx.settings` | Настройки плагина |
| `ctx.ui` | UI (модалки, toast) |
| `ctx.log` | Логирование |
| `ctx.commands` | Команды в палитре |
| `ctx.shortcuts` | Горячие клавиши |
| `ctx.uiManager` | Кнопки, панели |
| `ctx.events` | События |
| `ctx.state` | Состояние плагина |

### ctx.fs — Файловая система

```js
await ctx.fs.read(path)        // прочитать файл
await ctx.fs.write(path, data) // записать файл
await ctx.fs.exists(path)      // проверить существование
await ctx.fs.list(dir)         // список файлов в папке
await ctx.fs.remove(path)      // удалить файл/папку
await ctx.fs.mkdir(path)       // создать папку
```

### ctx.settings — Настройки

```js
ctx.settings.get('key')        // получить значение
ctx.settings.set('key', value) // установить значение
ctx.settings.getAll()          // все настройки
ctx.settings.remove('key')     // удалить настройку
```

### ctx.ui — Интерфейс

```js
ctx.ui.showModal({ title, content, onConfirm? })      // модальное окно
ctx.ui.showToast(message, type?, duration?)            // toast-уведомление
ctx.ui.showConfirm(title, message)                     // подтверждение
ctx.ui.showInput(title, placeholder?, defaultValue?)   // ввод текста
```

### ctx.log — Логирование

```js
ctx.log.info('CODE', 'Сообщение', 'детали?')
ctx.log.warn('CODE', 'Предупреждение')
ctx.log.error('CODE', 'Ошибка', String(err))
```

### ctx.commands — Команды

```js
ctx.commands.register({
  id: 'my-cmd',
  name: 'Моя команда',
  description: 'Описание',
  icon: '🔧',
  shortcut: 'Ctrl+Shift+M',  // опционально
  action: (editor) => { /* ... */ },
})

ctx.commands.unregister('my-cmd')
ctx.commands.getAll()
```

### ctx.shortcuts — Горячие клавиши

```js
ctx.shortcuts.register('Ctrl+Shift+M', (editor) => { /* ... */ })
ctx.shortcuts.unregister('Ctrl+Shift+M')
```

### ctx.uiManager — UI компоненты

```js
ctx.uiManager.addButton({
  id: 'my-btn',
  title: 'Мой плагин',
  icon: '🔧',
  position: 'statusbar',
  action: (editor) => { /* ... */ },
})

ctx.uiManager.removeButton('my-btn')
ctx.uiManager.addPanel({ id, title, icon, render })
ctx.uiManager.removePanel(panelId)
```

### ctx.events — События

```js
ctx.events.on('editor:ready', () => { /* ... */ })
ctx.events.off('editor:ready', handler)
ctx.events.emit('my-event', data)
```

**Доступные события:**
- `editor:ready` — редактор инициализирован
- `editor:destroy` — редактор уничтожается
- `settings:changed` — настройки изменены
- `plugin:loaded` / `plugin:unloaded` — плагин загружен/выгружен

### ctx.state — Состояние

```js
ctx.state.get('key')        // получить
ctx.state.set('key', value) // установить
ctx.state.getAll()          // все данные
```

Данные хранятся в localStorage изолированно для каждого плагина.

## Пример плагина

```js
module.exports = function setupPlugin(ctx) {
  // Команда в палитре
  ctx.commands.register({
    id: 'timestamp-insert',
    name: 'Вставить дату',
    description: 'Текущая дата в формате YYYY-MM-DD',
    icon: '📅',
    action: (editor) => {
      const date = new Date().toISOString().slice(0, 10);
      editor.chain().focus().insertContent(date).run();
      ctx.ui.showToast('Дата вставлена', 'success');
    },
  })

  // Горячая клавиша
  ctx.shortcuts.register('Ctrl+Shift+D', (editor) => {
    const date = new Date().toISOString().slice(0, 10);
    editor.chain().focus().insertContent(date).run();
  })

  // Кнопка в statusbar
  ctx.uiManager.addButton({
    id: 'my-btn',
    title: 'Вставить дату',
    icon: '📅',
    position: 'statusbar',
    action: (editor) => {
      const date = new Date().toISOString().slice(0, 10);
      editor.chain().focus().insertContent(date).run();
    },
  })

  // Логирование
  ctx.log.info('INIT', 'Плагин загружен')

  // Сохранение данных
  ctx.state.set('lastUse', Date.now())

  // Возврат объекта плагина
  return {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    description: 'Описание',
    type: 'community',
    destroy: () => {
      console.log('Плагин выгружен')
    },
  }
}
```

## Публикация

1. Создайте репозиторий `silex-plugin-<name>` на GitHub
2. Добавьте `manifest.json` и `index.js`
3. Создайте [Issue](https://github.com/Nuxson/SilexNote-Plugins/issues) с тегом `plugin-submission`

## Требования

- Уникальный `id` (kebab-case)
- `destroy()` освобождает ресурсы (таймеры, слушатели)
- Горячие клавиши не конфликтуют с системными
- Нет сторонних зависимостей
