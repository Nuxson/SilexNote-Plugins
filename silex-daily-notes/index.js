/**
 * SilexNote Daily Notes Plugin
 *
 * Создание дневниковых записей по шаблону.
 * Команда: Новая дневниковая запись
 * Горячая клавиша: Ctrl+Shift+J
 */
module.exports = function setupPlugin(ctx) {
  function formatDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatDateTime(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function getDayOfWeek(date) {
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return days[date.getDay()];
  }

  function getMonthName(date) {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return months[date.getMonth()];
  }

  function generateDailyTemplate(date) {
    const dayName = getDayOfWeek(date);
    const day = date.getDate();
    const month = getMonthName(date);
    const year = date.getFullYear();
    const time = formatDateTime(date);

    return `<h1>${dayName}, ${day} ${month} ${year}</h1>
<p><em>Создано в ${time}</em></p>
<h2>Задачи на сегодня</h2>
<ul>
<li data-type="taskItem" data-checked="false"> </li>
<li data-type="taskItem" data-checked="false"> </li>
<li data-type="taskItem" data-checked="false"> </li>
</ul>
<h2>Заметки</h2>
<p></p>
<h2>Итоги дня</h2>
<p></p>`;
  }

  function getStoredNoteCount() {
    return ctx.state.get('noteCount') || 0;
  }

  function incrementNoteCount() {
    const count = getStoredNoteCount() + 1;
    ctx.state.set('noteCount', count);
    return count;
  }

  ctx.commands.register({
    id: 'daily-note',
    name: 'Новая дневниковая запись',
    description: 'Создать запись с шаблоном на сегодня',
    icon: '📔',
    action: (editor) => {
      const now = new Date();
      const template = generateDailyTemplate(now);
      editor.commands.setContent(template);
      incrementNoteCount();
      ctx.ui.showToast('Дневниковая запись создана', 'success');
      ctx.log.info('DAILY', `Note created: ${formatDate(now)}`);
    },
  });

  ctx.commands.register({
    id: 'daily-note-append',
    name: 'Добавить секцию в дневник',
    description: 'Добавить заголовок + поле в конец документа',
    icon: '📔',
    action: (editor) => {
      const now = new Date();
      const time = formatDateTime(now);
      const section = `<h2>${time}</h2><p></p>`;
      editor.chain().focus().insertContent(section).run();
      ctx.ui.showToast('Секция добавлена', 'success');
    },
  });

  ctx.shortcuts.register('Ctrl+Shift+J', (editor) => {
    const now = new Date();
    const template = generateDailyTemplate(now);
    editor.commands.setContent(template);
    incrementNoteCount();
    ctx.ui.showToast('Дневниковая запись создана', 'success');
  });

  ctx.uiManager.addButton({
    id: 'daily-btn',
    title: 'Дневниковая запись',
    icon: '📔',
    position: 'statusbar',
    action: (editor) => {
      ctx.ui.showModal({
        title: 'Дневник',
        content: `
          <div style="display:flex;flex-direction:column;gap:8px;padding:4px 0">
            <div style="font-size:12px;color:var(--text-secondary)">Что сделать?</div>
            <div style="display:grid;grid-template-columns:1fr;gap:6px">
              <button class="modal-btn modal-btn-ok daily-create">📔 Новая запись на сегодня</button>
              <button class="modal-btn modal-btn-ok daily-append">➕ Добавить секцию</button>
            </div>
            <div style="font-size:11px;color:var(--text-tertiary);margin-top:4px">
              Всего записей: ${getStoredNoteCount()}
            </div>
          </div>
        `,
      });

      setTimeout(() => {
        document.querySelector('.daily-create')?.addEventListener('click', () => {
          const now = new Date();
          const template = generateDailyTemplate(now);
          editor.commands.setContent(template);
          incrementNoteCount();
          ctx.ui.showToast('Дневниковая запись создана', 'success');
          document.querySelector('.glass-modal-overlay')?.remove();
        });

        document.querySelector('.daily-append')?.addEventListener('click', () => {
          const now = new Date();
          const time = formatDateTime(now);
          editor.chain().focus().insertContent(`<h2>${time}</h2><p></p>`).run();
          ctx.ui.showToast('Секция добавлена', 'success');
          document.querySelector('.glass-modal-overlay')?.remove();
        });
      }, 50);
    },
  });

  ctx.events.on('editor:ready', () => {
    ctx.log.info('DAILY', 'Daily Notes plugin ready');
  });

  return {
    id: 'silex-daily-notes',
    name: 'Daily Notes',
    version: '1.0.0',
    description: 'Дневниковые записи по шаблону',
    type: 'community',
    destroy: () => {},
  };
};
