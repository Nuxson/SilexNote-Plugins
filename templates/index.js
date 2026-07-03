/**
 * Шаблон community-плагина для SilexNote.
 *
 * Скопируйте эту папку, переименуйте и отредактируйте.
 * PluginContext API:
 *   - ctx.editor              — Tiptap Editor
 *   - ctx.registerCommand()   — команда в палитре
 *   - ctx.registerShortcut()  — горячая клавиша
 *   - ctx.addButton()         — кнопка в statusbar
 *   - ctx.showModal()         — модальное окно
 *   - ctx.on(event, handler)  — подписка на событие
 *
 * События: 'editor:ready', 'editor:destroy', 'settings:changed'
 */
module.exports = function setupPlugin(ctx) {
  // Команда в палитре (/)
  ctx.registerCommand({
    id: 'my-action',
    name: 'Мое действие',
    description: 'Что делает команда',
    icon: '🔧',
    action: (editor) => {
      editor.chain().focus().insertContent('Hello from my plugin!').run();
    },
  });

  // Горячая клавиша
  ctx.registerShortcut('Ctrl+Shift+M', (editor) => {
    editor.chain().focus().insertContent('⚡').run();
  });

  // Кнопка в statusbar
  ctx.addButton({
    id: 'my-btn',
    title: 'Мой плагин',
    icon: '🔧',
    position: 'statusbar',
    action: () => {
      ctx.showModal({
        title: 'My Plugin',
        content: 'Это модальное окно из community-плагина!',
      });
    },
  });

  // Подписка на событие
  ctx.on('editor:ready', () => {
    console.log('MyPlugin: редактор готов');
  });

  // Возвращаем объект плагина
  return {
    id: 'my-plugin',
    name: 'My Plugin',
    version: '1.0.0',
    description: 'Описание плагина',
    type: 'community',
    destroy: () => {
      console.log('MyPlugin: плагин выгружен');
    },
  };
};
