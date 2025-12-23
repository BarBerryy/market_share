import { CONFIG } from '../config';

/**
 * Парсит число из строки (поддержка русской локали)
 */
export const parseNumber = (str) => {
  if (str === null || str === undefined || str === '') return 0;
  if (typeof str === 'number') return str;
  
  const strValue = str.toString();
  const cleaned = strValue.replace(/\s/g, '').replace(',', '.').replace('%', '');
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? 0 : num;
};

/**
 * Проверяет, является ли название Унистроем
 */
export const isUnistroy = (name) => {
  if (!name) return false;
  const lower = name.toLowerCase();
  return lower.includes('унистрой') || lower === 'unistroy';
};

/**
 * Парсит данные из JSON (от Apps Script API)
 */
export const parseSheetData = (rows) => {
  if (!rows || rows.length < 4) {
    return { cities: [], developers: {}, projects: {} };
  }

  const cityRow = rows[0] || [];
  const cities = [];
  const cityStartColumns = [];

  // Находим города (каждые 7 колонок)
  for (let i = 0; i < cityRow.length; i += 7) {
    const cityName = cityRow[i]?.toString().trim();
    if (cityName && cityName !== '') {
      cities.push(cityName);
      cityStartColumns.push(i);
    }
  }

  // Находим строку "Проекты"
  let projectsStartRow = -1;
  for (let i = 0; i < rows.length; i++) {
    const firstCell = rows[i]?.[0];
    if (firstCell && firstCell.toString().trim() === 'Проекты') {
      projectsStartRow = i;
      break;
    }
  }

  const developers = {};
  const projects = {};

  // Парсим застройщиков (начиная со строки 3, индекс 3)
  const devStartRow = 3;
  const devEndRow = projectsStartRow > 0 ? projectsStartRow : rows.length;

  cities.forEach((city, cityIndex) => {
    const startCol = cityStartColumns[cityIndex];
    developers[city] = [];

    for (let r = devStartRow; r < devEndRow; r++) {
      const row = rows[r];
      if (!row) continue;

      const name = row[startCol]?.toString().trim();
      if (!name || name === '') continue;

      // Колонки: название, шт, %шт, м², %м², руб, %руб
      // Google Sheets хранит проценты как дроби (16.3% = 0.163), поэтому умножаем на 100
      developers[city].push({
        name,
        units: parseNumber(row[startCol + 1]),
        unitsPercent: parseNumber(row[startCol + 2]) * 100,
        sqm: parseNumber(row[startCol + 3]),
        sqmPercent: parseNumber(row[startCol + 4]) * 100,
        rub: parseNumber(row[startCol + 5]),
        rubPercent: parseNumber(row[startCol + 6]) * 100,
      });
    }
  });

  // Парсим проекты
  if (projectsStartRow > 0) {
    const projStartRow = projectsStartRow + 2; // Пропускаем "Проекты" и заголовки

    cities.forEach((city, cityIndex) => {
      const startCol = cityStartColumns[cityIndex];
      projects[city] = [];

      for (let r = projStartRow; r < rows.length; r++) {
        const row = rows[r];
        if (!row) continue;

        const name = row[startCol]?.toString().trim();
        if (!name || name === '') continue;

        projects[city].push({
          name,
          units: parseNumber(row[startCol + 1]),
          unitsPercent: parseNumber(row[startCol + 2]) * 100,
          sqm: parseNumber(row[startCol + 3]),
          sqmPercent: parseNumber(row[startCol + 4]) * 100,
          rub: parseNumber(row[startCol + 5]),
          rubPercent: parseNumber(row[startCol + 6]) * 100,
        });
      }
    });
  }

  return { cities, developers, projects };
};

/**
 * Загружает список доступных листов
 */
export const fetchSheetsList = async () => {
  const response = await fetch(CONFIG.API_URL);
  
  if (!response.ok) {
    throw new Error('Не удалось подключиться к API');
  }

  const json = await response.json();
  
  if (json.error) {
    throw new Error(json.error);
  }

  return json.sheets || [];
};

/**
 * Загружает данные конкретного листа из Google Sheets через Apps Script API
 */
export const fetchSheetData = async (sheetName) => {
  const url = `${CONFIG.API_URL}?sheet=${encodeURIComponent(sheetName)}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Не удалось загрузить данные. Проверьте подключение к API.');
  }

  const json = await response.json();
  
  if (json.error) {
    throw new Error(json.error);
  }

  if (!json.data || json.data.length === 0) {
    throw new Error(`Лист "${sheetName}" пуст или не найден`);
  }

  const data = parseSheetData(json.data);

  if (data.cities.length === 0) {
    throw new Error('Не найдены города в таблице. Проверьте структуру данных.');
  }

  // Возвращаем также список листов для динамического меню
  return {
    ...data,
    availableSheets: json.sheets || [],
  };
};

/**
 * Загружает данные со всех листов для графика динамики
 */
export const fetchAllSheetsData = async (sheets) => {
  const allData = {};
  
  for (const sheetName of sheets) {
    try {
      const url = `${CONFIG.API_URL}?sheet=${encodeURIComponent(sheetName)}`;
      const response = await fetch(url);
      
      if (!response.ok) continue;
      
      const json = await response.json();
      if (json.error || !json.data) continue;
      
      const parsed = parseSheetData(json.data);
      allData[sheetName] = parsed;
    } catch (err) {
      console.warn(`Failed to load sheet ${sheetName}:`, err);
    }
  }
  
  return allData;
};
