// ========== CONFIGURATION ==========
// Измените эти значения под свои нужды

export const CONFIG = {
  // URL Google Apps Script (ваш API)
  API_URL: 'https://script.google.com/macros/s/AKfycbw3P90kxqZN7dJIZwCAWF2Y6K7ojKl0-9WNQ5l-6rHovsJ9X0zylOG1HVam43ZUH1aQIg/exec',
  
  // Ссылка на Google-таблицу с данными
  SPREADSHEET_URL: 'https://docs.google.com/spreadsheets/d/1XrND9_--a4ASTrj2fKOXGiHQEWa9yRWSZvZlVdOnCTY/edit',
  
  // Пароль для входа
  PASSWORD: '5555',
  
  // Цвет подсветки Унистрой
  UNISTROY_COLOR: '#22c55e',
  
  // Цвета для графиков
  COLORS: [
    '#f0a31eff', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4',
    '#ec4899', '#2a97ebff', '#f97316', '#6366f1', '#7e932dff'
  ],
};

// Метрики для отображения
export const METRICS = [
  { 
    key: 'units', 
    label: 'Доля в шт.', 
    percentKey: 'unitsPercent', 
    format: (v) => v?.toLocaleString('ru-RU') || '0' 
  },
  { 
    key: 'sqm', 
    label: 'Доля в м²', 
    percentKey: 'sqmPercent', 
    format: (v) => (v?.toLocaleString('ru-RU', { minimumFractionDigits: 1 }) || '0') + ' м²' 
  },
  { 
    key: 'rub', 
    label: 'Доля в руб.', 
    percentKey: 'rubPercent', 
    format: (v) => ((v || 0) / 1000000).toLocaleString('ru-RU', { minimumFractionDigits: 0 }) + ' млн ₽' 
  },
];

// Список листов загружается автоматически из Google Sheets API
