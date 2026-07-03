/**
 * SilexNote Timestamp Plugin
 *
 * Вставляет текущую дату и время в документ в разных форматах.
 * Команды: дата (YYYY-MM-DD), время (HH:mm), дата+время, дата русская (DD.MM.YYYY)
 * Горячие клавиши: Ctrl+Shift+D (дата), Ctrl+Shift+T (время)
 */
module.exports = function setupPlugin(ctx) {
  const now = () => new Date();
  const pad = (n) => String(n).padStart(2, '0');

  const formats = {
    'date': () => {
      const d = now();
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    },
    'time': () => {
      const d = now();
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
    'datetime': () => {
      const d = now();
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    },
    'date-ru': () => {
      const d = now();
      return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
    },
    'iso': () => now().toISOString(),
    'timestamp': () => String(Math.floor(now().getTime() / 1000)),
  };

  ctx.commands.register({
    id: 'timestamp-date',
    name: 'Вставить дату',
    description: 'Текущая дата (YYYY-MM-DD)',
    icon: '📅',
    action: (editor) => {
      editor.chain().focus().insertContent(formats.date()).run();
    },
  });

  ctx.commands.register({
    id: 'timestamp-time',
    name: 'Вставить время',
    description: 'Текущее время (HH:mm)',
    icon: '🕐',
    action: (editor) => {
      editor.chain().focus().insertContent(formats.time()).run();
    },
  });

  ctx.commands.register({
    id: 'timestamp-datetime',
    name: 'Вставить дату и время',
    description: 'Текущая дата и время (YYYY-MM-DD HH:mm)',
    icon: '⏰',
    action: (editor) => {
      editor.chain().focus().insertContent(formats.datetime()).run();
    },
  });

  ctx.commands.register({
    id: 'timestamp-date-ru',
    name: 'Вставить дату (русская)',
    description: 'Текущая дата в формате DD.MM.YYYY',
    icon: '📅',
    action: (editor) => {
      editor.chain().focus().insertContent(formats['date-ru']()).run();
    },
  });

  ctx.commands.register({
    id: 'timestamp-iso',
    name: 'Вставить ISO timestamp',
    description: 'Полный ISO 8601 timestamp',
    icon: '🔢',
    action: (editor) => {
      editor.chain().focus().insertContent(formats.iso()).run();
    },
  });

  ctx.shortcuts.register('Ctrl+Shift+D', (editor) => {
    editor.chain().focus().insertContent(formats.date()).run();
  });

  ctx.shortcuts.register('Ctrl+Shift+T', (editor) => {
    editor.chain().focus().insertContent(formats.time()).run();
  });

  ctx.uiManager.addButton({
    id: 'timestamp-btn',
    title: 'Вставить дату/время',
    icon: '📅',
    position: 'statusbar',
    action: (editor) => {
      ctx.ui.showModal({
        title: 'Timestamp',
        content: `
          <div style="display:flex;flex-direction:column;gap:6px;padding:4px 0">
            <div style="font-size:12px;color:var(--text-secondary)">Выберите формат:</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
              <button class="modal-btn modal-btn-ok ts-insert" data-format="date">📅 Дата</button>
              <button class="modal-btn modal-btn-ok ts-insert" data-format="time">🕐 Время</button>
              <button class="modal-btn modal-btn-ok ts-insert" data-format="datetime">⏰ Дата+Время</button>
              <button class="modal-btn modal-btn-ok ts-insert" data-format="date-ru">📅 Дата (рус)</button>
              <button class="modal-btn modal-btn-ok ts-insert" data-format="iso">🔢 ISO</button>
              <button class="modal-btn modal-btn-ok ts-insert" data-format="timestamp">⏱ Unix</button>
            </div>
          </div>
        `,
      });

      setTimeout(() => {
        document.querySelectorAll('.ts-insert').forEach((btn) => {
          btn.addEventListener('click', () => {
            const fmt = btn.getAttribute('data-format');
            if (fmt && formats[fmt]) {
              editor.chain().focus().insertContent(formats[fmt]()).run();
            }
            document.querySelector('.glass-modal-overlay')?.remove();
          });
        });
      }, 50);
    },
  });

  ctx.events.on('editor:ready', () => {
    ctx.log.info('EVENT', 'Timestamp plugin ready');
  });

  const lastUse = ctx.state.get('lastUse');
  if (lastUse) {
    ctx.log.info('STATE', 'Last used: ' + new Date(lastUse).toLocaleString());
  }
  ctx.state.set('lastUse', Date.now());
};
