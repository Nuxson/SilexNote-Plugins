/**
 * SilexNote Lorem Ipsum Generator Plugin
 *
 * Вставка сгенерированного Lorem Ipsum текста в документ.
 * Команда: Вставить Lorem Ipsum
 * Горячая клавиша: Ctrl+Shift+L
 */
module.exports = function setupPlugin(ctx) {
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
    'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
    'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
    'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
    'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit',
    'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi', 'nesciunt',
    'neque', 'porro', 'quisquam', 'nihil', 'impedit', 'quo', 'minus', 'maxime',
    'placeat', 'facere', 'possimus', 'omnis', 'voluptas', 'assumenda', 'repellendus',
    'temporibus', 'quibusdam', 'officiis', 'debitis', 'ratione', 'necessitatibus',
    'saepe', 'eveniet', 'repudiandae', 'recusandae', 'itaque', 'earum', 'rerum',
    'hic', 'tenetur', 'sapiente', 'delectus', 'reiciendis', 'voluptatibus', 'maiores',
    'alias', 'perferendis', 'doloribus', 'asperiores', 'reprehenderit',
  ];

  function generateParagraph(minSentences, maxSentences) {
    const count = minSentences + Math.floor(Math.random() * (maxSentences - minSentences + 1));
    const sentences = [];
    for (let i = 0; i < count; i++) {
      const len = 8 + Math.floor(Math.random() * 10);
      const parts = [];
      for (let j = 0; j < len; j++) {
        parts.push(words[Math.floor(Math.random() * words.length)]);
      }
      parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      sentences.push(parts.join(' ') + '.');
    }
    return sentences.join(' ');
  }

  function generateText(paragraphs) {
    const result = [];
    for (let i = 0; i < paragraphs; i++) {
      result.push(generateParagraph(3, 7));
    }
    return result.join('\n\n');
  }

  ctx.commands.register({
    id: 'lorem-short',
    name: 'Lorem Ipsum (короткий)',
    description: 'Вставить 1 абзац Lorem Ipsum',
    icon: '📝',
    action: (editor) => {
      editor.chain().focus().insertContent(generateParagraph(2, 4)).run();
      ctx.ui.showToast('Вставлен 1 абзац', 'success');
    },
  });

  ctx.commands.register({
    id: 'lorem-medium',
    name: 'Lorem Ipsum (средний)',
    description: 'Вставить 3 абзаца Lorem Ipsum',
    icon: '📝',
    action: (editor) => {
      editor.chain().focus().insertContent(generateText(3)).run();
      ctx.ui.showToast('Вставлено 3 абзаца', 'success');
    },
  });

  ctx.commands.register({
    id: 'lorem-long',
    name: 'Lorem Ipsum (длинный)',
    description: 'Вставить 5 абзацев Lorem Ipsum',
    icon: '📝',
    action: (editor) => {
      editor.chain().focus().insertContent(generateText(5)).run();
      ctx.ui.showToast('Вставлено 5 абзацев', 'success');
    },
  });

  ctx.commands.register({
    id: 'lorem-custom',
    name: 'Lorem Ipsum (свой размер)',
    description: 'Выбрать количество абзацев',
    icon: '📝',
    action: async (editor) => {
      const input = await ctx.ui.showInput('Количество абзацев', 'Введите число', '3');
      if (input === null) return;
      const n = parseInt(input, 10);
      if (isNaN(n) || n < 1 || n > 50) {
        ctx.ui.showToast('Введите число от 1 до 50', 'error');
        return;
      }
      editor.chain().focus().insertContent(generateText(n)).run();
      ctx.ui.showToast(`Вставлено ${n} абзацев`, 'success');
    },
  });

  ctx.shortcuts.register('Ctrl+Shift+L', (editor) => {
    editor.chain().focus().insertContent(generateParagraph(2, 4)).run();
  });

  ctx.uiManager.addButton({
    id: 'lorem-btn',
    title: 'Lorem Ipsum',
    icon: '📝',
    position: 'statusbar',
    action: (editor) => {
      ctx.ui.showModal({
        title: 'Lorem Ipsum',
        content: `
          <div style="display:flex;flex-direction:column;gap:8px;padding:4px 0">
            <div style="font-size:12px;color:var(--text-secondary)">Выберите размер:</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
              <button class="modal-btn modal-btn-ok lorem-insert" data-paras="1">Короткий (1)</button>
              <button class="modal-btn modal-btn-ok lorem-insert" data-paras="3">Средний (3)</button>
              <button class="modal-btn modal-btn-ok lorem-insert" data-paras="5">Длинный (5)</button>
              <button class="modal-btn modal-btn-ok lorem-insert" data-paras="custom">Свой...</button>
            </div>
          </div>
        `,
      });

      setTimeout(() => {
        document.querySelectorAll('.lorem-insert').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const paras = btn.getAttribute('data-paras');
            document.querySelector('.glass-modal-overlay')?.remove();

            if (paras === 'custom') {
              const input = await ctx.ui.showInput('Количество абзацев', 'Введите число', '3');
              if (input === null) return;
              const n = parseInt(input, 10);
              if (isNaN(n) || n < 1 || n > 50) {
                ctx.ui.showToast('Введите число от 1 до 50', 'error');
                return;
              }
              editor.chain().focus().insertContent(generateText(n)).run();
            } else {
              editor.chain().focus().insertContent(generateText(parseInt(paras, 10))).run();
            }
          });
        });
      }, 50);
    },
  });

  ctx.events.on('editor:ready', () => {
    ctx.log.info('LOREM', 'Lorem Ipsum plugin ready');
  });

  return {
    id: 'silex-lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    version: '1.0.0',
    description: 'Генерация Lorem Ipsum текста',
    type: 'community',
    destroy: () => {},
  };
};
