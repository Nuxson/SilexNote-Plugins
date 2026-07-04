/**
 * SilexNote Export PDF Plugin
 *
 * Экспорт текущего документа в PDF через нативный диалог печати браузера.
 * Команда: Экспорт в PDF
 * Горячая клавиша: Ctrl+Shift+E
 */
module.exports = function setupPlugin(ctx) {
  function exportToPDF() {
    const html = ctx.editor.getHTML();
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      ctx.ui.showToast('Не удалось открыть окно печати', 'error');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Экспорт PDF</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.6;
      color: #1a1a1a;
      font-size: 14px;
    }
    h1 { font-size: 28px; margin: 24px 0 12px; }
    h2 { font-size: 22px; margin: 20px 0 10px; }
    h3 { font-size: 18px; margin: 16px 0 8px; }
    h4 { font-size: 16px; margin: 14px 0 6px; }
    h5 { font-size: 14px; margin: 12px 0 4px; }
    h6 { font-size: 13px; margin: 10px 0 4px; }
    p { margin: 8px 0; }
    pre {
      background: #f5f5f5;
      padding: 12px 16px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.4;
    }
    code {
      background: #f0f0f0;
      padding: 2px 5px;
      border-radius: 3px;
      font-size: 13px;
    }
    pre code { background: none; padding: 0; }
    blockquote {
      border-left: 3px solid #ccc;
      padding-left: 12px;
      color: #555;
      margin: 8px 0;
    }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; }
    td, th { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
    th { background: #f8f8f8; font-weight: 600; }
    hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
    ul, ol { padding-left: 24px; margin: 8px 0; }
    li { margin: 4px 0; }
    img { max-width: 100%; height: auto; }
    a { color: #0066cc; text-decoration: underline; }
    mark { background: #fff3a8; padding: 1px 3px; border-radius: 2px; }
    .print-bar {
      position: fixed; top: 0; left: 0; right: 0;
      background: #2563eb; color: #fff;
      padding: 12px 20px;
      display: flex; align-items: center; justify-content: space-between;
      font-family: -apple-system, sans-serif;
      z-index: 9999;
    }
    .print-bar button {
      background: #fff; color: #2563eb; border: none;
      padding: 8px 20px; border-radius: 6px; cursor: pointer;
      font-size: 14px; font-weight: 600;
    }
    .print-bar button:hover { background: #e0e7ff; }
    @media print {
      .print-bar { display: none !important; }
      body { padding: 0; margin: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <span>Предпросмотр документа</span>
    <button onclick="window.print()">Печать / Сохранить PDF</button>
  </div>
  <div style="padding-top: 50px;">
    ${html}
  </div>
  <script>
    setTimeout(function() { window.print(); }, 600);
  </script>
</body>
</html>`);
    printWindow.document.close();

    ctx.log.info('EXPORT', 'PDF export triggered');
    ctx.state.set('lastExport', Date.now());
  }

  ctx.commands.register({
    id: 'export-pdf',
    name: 'Экспорт в PDF',
    description: 'Сохранить текущий документ как PDF',
    icon: '📄',
    action: () => exportToPDF(),
  });

  ctx.shortcuts.register('Ctrl+Shift+E', () => exportToPDF());

  ctx.uiManager.addButton({
    id: 'export-pdf-btn',
    title: 'Экспорт в PDF',
    icon: '📄',
    position: 'statusbar',
    action: () => exportToPDF(),
  });

  ctx.events.on('editor:ready', () => {
    ctx.log.info('EXPORT', 'Export PDF plugin ready');
  });

  const lastExport = ctx.state.get('lastExport');
  if (lastExport) {
    ctx.log.info('EXPORT', 'Last export: ' + new Date(lastExport).toLocaleString());
  }

  return {
    id: 'silex-export-pdf',
    name: 'Export PDF',
    version: '1.0.0',
    description: 'Экспорт текущего документа в PDF через диалог печати',
    type: 'community',
    destroy: () => {},
  };
};
