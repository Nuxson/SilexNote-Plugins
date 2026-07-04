/**
 * SilexNote Document Templates Plugin
 *
 * Создание документов из готовых шаблонов.
 * Команда: Выбрать шаблон
 * Горячая клавиша: Ctrl+Shift+T
 */
module.exports = function setupPlugin(ctx) {
  const templates = {
    meeting: {
      name: 'Заметки встречи',
      icon: '🤝',
      content: `<h1>Встреча: </h1>
<p><em>Дата: ${new Date().toLocaleDateString('ru-RU')} · Участники: </em></p>
<h2>Повестка</h2>
<ol>
<li></li>
</ol>
<h2>Решения</h2>
<ul>
<li></li>
</ul>
<h2>TODO</h2>
<ul>
<li data-type="taskItem" data-checked="false"> </li>
</ul>`,
    },
    todo: {
      name: 'Список задач',
      icon: '✅',
      content: `<h1>Задачи</h1>
<h2>Срочные</h2>
<ul>
<li data-type="taskItem" data-checked="false"> </li>
</ul>
<h2>Обычные</h2>
<ul>
<li data-type="taskItem" data-checked="false"> </li>
</ul>
<h2>Позже</h2>
<ul>
<li data-type="taskItem" data-checked="false"> </li>
</ul>`,
    },
    article: {
      name: 'Статья / Пост',
      icon: '📰',
      content: `<h1></h1>
<p><em>Описание темы в одно предложение.</em></p>
<h2>Введение</h2>
<p></p>
<h2>Основная часть</h2>
<p></p>
<h3>Пункт 1</h3>
<p></p>
<h3>Пункт 2</h3>
<p></p>
<h2>Заключение</h2>
<p></p>`,
    },
    retrospective: {
      name: 'Ретроспектива',
      icon: '🔄',
      content: `<h1>Ретроспектива</h1>
<p><em>Период: </em></p>
<h2>Что прошло хорошо</h2>
<ul>
<li></li>
</ul>
<h2>Что можно улучшить</h2>
<ul>
<li></li>
</ul>
<h2>Действия на следующий спринт</h2>
<ul>
<li data-type="taskItem" data-checked="false"> </li>
</ul>`,
    },
    booknotes: {
      name: 'Заметки по книге',
      icon: '📚',
      content: `<h1></h1>
<p><em>Автор: </em></p>
<h2>Главная мысль</h2>
<p></p>
<h2>Ключевые цитаты</h2>
<blockquote><p></p></blockquote>
<h2>Мои размышления</h2>
<p></p>
<h2>Применение</h2>
<p></p>`,
    },
    blank: {
      name: 'Пустой документ',
      icon: '📄',
      content: '<p></p>',
    },
  };

  ctx.commands.register({
    id: 'doc-template',
    name: 'Выбрать шаблон',
    description: 'Создать документ из шаблона',
    icon: '📋',
    action: (editor) => {
      const items = Object.entries(templates)
        .map(([key, t]) => `<button class="modal-btn modal-btn-ok tpl-select" data-tpl="${key}">${t.icon} ${t.name}</button>`)
        .join('');

      ctx.ui.showModal({
        title: 'Шаблоны документов',
        content: `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 0">
            ${items}
          </div>
        `,
      });

      setTimeout(() => {
        document.querySelectorAll('.tpl-select').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-tpl');
            if (key && templates[key]) {
              editor.commands.setContent(templates[key].content);
              ctx.ui.showToast(`Шаблон «${templates[key].name}» применён`, 'success');
              ctx.log.info('TEMPLATE', `Applied: ${key}`);
              ctx.state.set('lastTemplate', key);
            }
            document.querySelector('.glass-modal-overlay')?.remove();
          });
        });
      }, 50);
    },
  });

  ctx.commands.register({
    id: 'doc-template-meeting',
    name: 'Шаблон: Встреча',
    description: 'Быстро создать заметки встречи',
    icon: '🤝',
    action: (editor) => {
      editor.commands.setContent(templates.meeting.content);
      ctx.ui.showToast('Шаблон «Встреча» применён', 'success');
    },
  });

  ctx.commands.register({
    id: 'doc-template-todo',
    name: 'Шаблон: Задачи',
    description: 'Быстро создать список задач',
    icon: '✅',
    action: (editor) => {
      editor.commands.setContent(templates.todo.content);
      ctx.ui.showToast('Шаблон «Задачи» применён', 'success');
    },
  });

  ctx.shortcuts.register('Ctrl+Shift+T', (editor) => {
    const items = Object.entries(templates)
      .map(([key, t]) => `<button class="modal-btn modal-btn-ok tpl-select" data-tpl="${key}">${t.icon} ${t.name}</button>`)
      .join('');

    ctx.ui.showModal({
      title: 'Шаблоны документов',
      content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 0">${items}</div>`,
    });

    setTimeout(() => {
      document.querySelectorAll('.tpl-select').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-tpl');
          if (key && templates[key]) {
            editor.commands.setContent(templates[key].content);
            ctx.ui.showToast(`Шаблон «${templates[key].name}» применён`, 'success');
          }
          document.querySelector('.glass-modal-overlay')?.remove();
        });
      });
    }, 50);
  });

  ctx.uiManager.addButton({
    id: 'template-btn',
    title: 'Шаблоны',
    icon: '📋',
    position: 'statusbar',
    action: (editor) => {
      const items = Object.entries(templates)
        .map(([key, t]) => `<button class="modal-btn modal-btn-ok tpl-select" data-tpl="${key}">${t.icon} ${t.name}</button>`)
        .join('');

      ctx.ui.showModal({
        title: 'Шаблоны документов',
        content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:4px 0">${items}</div>`,
      });

      setTimeout(() => {
        document.querySelectorAll('.tpl-select').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-tpl');
            if (key && templates[key]) {
              editor.commands.setContent(templates[key].content);
              ctx.ui.showToast(`Шаблон «${templates[key].name}» применён`, 'success');
              ctx.state.set('lastTemplate', key);
            }
            document.querySelector('.glass-modal-overlay')?.remove();
          });
        });
      }, 50);
    },
  });

  ctx.events.on('editor:ready', () => {
    ctx.log.info('TEMPLATE', 'Document Templates plugin ready');
  });

  return {
    id: 'silex-doc-templates',
    name: 'Document Templates',
    version: '1.0.0',
    description: 'Шаблоны документов',
    type: 'community',
    destroy: () => {},
  };
};
