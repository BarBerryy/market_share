import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { METRICS, CONFIG } from '../config';
import { fetchSheetData, fetchSheetsList } from '../utils/parser';
import DataTable from './DataTable';
import Chart from './Chart';
import DynamicsChart from './DynamicsChart';
import AverageDynamicsChart from './AverageDynamicsChart';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Список доступных листов (загружается из API)
  const [availableSheets, setAvailableSheets] = useState([]);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMetric, setSelectedMetric] = useState(METRICS[0]);
  const [viewType, setViewType] = useState('developers');

  // Загружаем список листов при первом рендере
  useEffect(() => {
    const loadSheets = async () => {
      try {
        const sheets = await fetchSheetsList();
        setAvailableSheets(sheets);
        // Выбираем первый лист по умолчанию
        if (sheets.length > 0 && !selectedMonth) {
          setSelectedMonth(sheets[0]);
        }
      } catch (err) {
        console.error('Failed to load sheets list:', err);
        setError('Не удалось загрузить список листов: ' + err.message);
      }
    };
    
    loadSheets();
  }, []);

  // Загружаем данные при выборе листа
  const loadData = useCallback(async () => {
    if (!selectedMonth) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await fetchSheetData(selectedMonth);
      setData(result);
      setLastUpdate(new Date());
      
      // Обновляем список листов, если пришёл из API
      if (result.availableSheets && result.availableSheets.length > 0) {
        setAvailableSheets(result.availableSheets);
      }

      // Выбираем первый город, если текущий не найден
      if (!selectedCity || !result.cities.includes(selectedCity)) {
        setSelectedCity(result.cities[0] || '');
      }
    } catch (err) {
      console.error('Load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedCity]);

  useEffect(() => {
    if (selectedMonth) {
      loadData();
    }
  }, [selectedMonth]);

  const currentData = useMemo(() => {
    if (!data || !selectedCity) return [];
    return viewType === 'developers'
      ? data.developers[selectedCity] || []
      : data.projects[selectedCity] || [];
  }, [data, selectedCity, viewType]);

  // Initial loading state
  if (loading && !data && availableSheets.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingIcon}>⏳</div>
          <div className={styles.loadingTitle}>Подключение к API...</div>
          <div className={styles.loadingSubtitle}>
            Загрузка данных из Google Sheets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Доля рынка новостроек</h1>
        <div className={styles.subtitle}>
          <span>Данные из Google Sheets (Apps Script API)</span>
          {lastUpdate && (
            <span className={styles.status}>
              <span className={styles.statusDot}></span>
              Обновлено{' '}
              {lastUpdate.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <div className={styles.errorTitle}>Ошибка загрузки</div>
          <div className={styles.errorMessage}>{error}</div>
          <div className={styles.errorHint}>
            Проверьте, что Apps Script развёрнут и имеет права доступа
          </div>
          <button onClick={loadData} className={styles.retryButton}>
            🔄 Попробовать снова
          </button>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        {/* Month/Sheet Selector */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className={styles.select}
          disabled={availableSheets.length === 0}
        >
          {availableSheets.length === 0 ? (
            <option>Загрузка...</option>
          ) : (
            availableSheets.map((sheet) => (
              <option key={sheet} value={sheet}>
                {sheet}
              </option>
            ))
          )}
        </select>

        {/* City Selector */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className={styles.select}
          disabled={!data?.cities?.length}
        >
          {!data?.cities?.length ? (
            <option>Выберите месяц</option>
          ) : (
            data.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))
          )}
        </select>

        {/* Metric Toggle */}
        <div className={styles.toggleGroup}>
          {METRICS.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric)}
              className={`${styles.toggleButton} ${
                selectedMetric.key === metric.key ? styles.toggleButtonActive : ''
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {/* View Type Toggle */}
        <div className={styles.toggleGroup}>
          <button
            onClick={() => setViewType('developers')}
            className={`${styles.toggleButton} ${
              viewType === 'developers' ? styles.toggleButtonActive : ''
            }`}
          >
            Застройщики
          </button>
          <button
            onClick={() => setViewType('projects')}
            className={`${styles.toggleButton} ${
              viewType === 'projects' ? styles.toggleButtonActive : ''
            }`}
          >
            Проекты
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={loadData}
          className={styles.refreshButton}
          disabled={loading || !selectedMonth}
        >
          {loading ? '⏳' : ''}
          <span>{loading ? 'Загрузка...' : 'Обновить данные'}</span>
        </button>

        {/* Link to Spreadsheet */}
        <a
          href={CONFIG.SPREADSHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.spreadsheetLink}
        >
          📊 Открыть таблицу
        </a>
      </div>

      {/* Content */}
      {!error && data && (
        <>
          {/* Chart Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>
                {viewType === 'developers'
                  ? 'Топ-10 застройщиков'
                  : 'Топ-10 проектов'}{' '}
                — {selectedCity}, {selectedMonth}
              </span>
            </div>
            <Chart data={currentData} metric={selectedMetric} />
          </div>

          {/* Dynamics Chart Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>
                Динамика {viewType === 'developers' ? 'застройщиков' : 'проектов'}{' '}
                — {selectedCity} ({selectedMetric.label})
              </span>
            </div>
            <DynamicsChart
              availableSheets={availableSheets}
              selectedCity={selectedCity}
              viewType={viewType}
              metric={selectedMetric}
              currentData={currentData}
            />
          </div>

          {/* Average Dynamics Chart Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>
                Динамика с НИ — {viewType === 'developers' ? 'застройщики' : 'проекты'}{' '}
                — {selectedCity} ({selectedMetric.label})
              </span>
            </div>
            <AverageDynamicsChart
              availableSheets={availableSheets}
              selectedCity={selectedCity}
              viewType={viewType}
              metric={selectedMetric}
            />
          </div>

          {/* Table Card */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>
                {viewType === 'developers'
                  ? 'Рейтинг застройщиков'
                  : 'Рейтинг проектов'}
              </span>
            </div>
            <DataTable
              data={currentData}
              metric={selectedMetric}
              type={viewType}
            />
          </div>
        </>
      )}

      {/* Loading overlay */}
      {loading && data && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>⏳</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
