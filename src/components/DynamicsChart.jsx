import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { CONFIG } from '../config';
import { isUnistroy, fetchAllSheetsData } from '../utils/parser';

const DynamicsChart = ({ 
  availableSheets, 
  selectedCity, 
  viewType, 
  metric,
  currentData 
}) => {
  const [allSheetsData, setAllSheetsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Загружаем данные со всех листов
  useEffect(() => {
    const loadAllData = async () => {
      if (!availableSheets || availableSheets.length === 0) return;
      
      setLoading(true);
      try {
        const data = await fetchAllSheetsData(availableSheets);
        setAllSheetsData(data);
      } catch (err) {
        console.error('Failed to load dynamics data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [availableSheets]);

  // Собираем всех уникальных застройщиков/проектов со ВСЕХ месяцев
  // и считаем их средний показатель для сортировки
  const allAvailableItems = useMemo(() => {
    if (!allSheetsData || !selectedCity) return [];

    const itemStats = {}; // { name: { total: number, count: number } }

    availableSheets.forEach(sheetName => {
      const sheetData = allSheetsData[sheetName];
      if (!sheetData) return;

      const items = viewType === 'developers' 
        ? sheetData.developers[selectedCity] || []
        : sheetData.projects[selectedCity] || [];

      items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { total: 0, count: 0 };
        }
        const value = item[metric.percentKey] || 0;
        if (value > 0) {
          itemStats[item.name].total += value;
          itemStats[item.name].count += 1;
        }
      });
    });

    // Сортируем по среднему значению за год (по убыванию)
    return Object.entries(itemStats)
      .map(([name, stats]) => ({
        name,
        avgValue: stats.count > 0 ? stats.total / stats.count : 0,
        totalValue: stats.total,
      }))
      .sort((a, b) => b.avgValue - a.avgValue)
      .map(item => item.name);
  }, [allSheetsData, availableSheets, selectedCity, viewType, metric.percentKey]);

  // Устанавливаем топ-5 по умолчанию когда данные загружены
  useEffect(() => {
    if (allAvailableItems.length > 0 && selectedItems.length === 0) {
      setSelectedItems(allAvailableItems.slice(0, 5));
    }
  }, [allAvailableItems]);

  // Сбрасываем выбранные элементы при смене города/типа/метрики
  useEffect(() => {
    if (allAvailableItems.length > 0) {
      setSelectedItems(allAvailableItems.slice(0, 5));
    }
  }, [selectedCity, viewType, metric.percentKey]);

  // Формируем данные для графика
  // Если застройщика нет в месяце - записываем null (линия прервётся)
  const chartData = useMemo(() => {
    if (!allSheetsData || !selectedCity || selectedItems.length === 0) return [];

    return availableSheets.map(sheetName => {
      const sheetData = allSheetsData[sheetName];
      if (!sheetData) return { month: sheetName };

      const items = viewType === 'developers' 
        ? sheetData.developers[selectedCity] || []
        : sheetData.projects[selectedCity] || [];

      const point = { month: sheetName.replace(' 2025', '').replace(' 2024', '') };
      
      selectedItems.forEach(itemName => {
        const item = items.find(i => i.name === itemName);
        // Если застройщика нет в этом месяце - записываем null, не 0
        point[itemName] = item ? (item[metric.percentKey] || null) : null;
      });

      return point;
    });
  }, [allSheetsData, availableSheets, selectedCity, viewType, selectedItems, metric.percentKey]);

  // Цвета для линий (фиксированные по имени для консистентности)
  const itemColors = useMemo(() => {
    const colors = {};
    allAvailableItems.forEach((name, index) => {
      colors[name] = isUnistroy(name) ? CONFIG.UNISTROY_COLOR : CONFIG.COLORS[index % CONFIG.COLORS.length];
    });
    return colors;
  }, [allAvailableItems]);

  const getLineColor = (name) => {
    return itemColors[name] || CONFIG.COLORS[0];
  };

  // Переключение выбранного элемента
  const toggleItem = (itemName) => {
    setSelectedItems(prev => {
      if (prev.includes(itemName)) {
        return prev.filter(n => n !== itemName);
      }
      if (prev.length >= 10) return prev; // Максимум 10 линий
      return [...prev, itemName];
    });
  };

  // Кастомный Tooltip с сортировкой по значению
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    // Сортируем по значению (по убыванию), null/undefined в конец
    const sortedPayload = [...payload]
      .filter(p => p.value !== null && p.value !== undefined)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    if (sortedPayload.length === 0) return null;

    return (
      <div style={{
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
          {label}
        </div>
        {sortedPayload.map((entry, index) => (
          <div 
            key={entry.dataKey} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: index < sortedPayload.length - 1 ? '4px' : 0,
            }}
          >
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: entry.color,
              flexShrink: 0,
            }} />
            <span style={{ color: entry.color, fontWeight: '500' }}>
              {entry.dataKey}:
            </span>
            <span style={{ fontWeight: '600' }}>
              {entry.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
        <div>Загрузка данных для графика динамики...</div>
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
        <div>Недостаточно данных для отображения динамики</div>
      </div>
    );
  }

  return (
    <div>
      {/* Выбор элементов для отображения */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '8px',
          fontWeight: '500'
        }}>
          Выберите для сравнения (макс. 10):
        </div>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '6px',
          maxHeight: '80px',
          overflowY: 'auto',
          padding: '4px 0'
        }}>
          {allAvailableItems.slice(0, 20).map((itemName) => {
            const isSelected = selectedItems.includes(itemName);
            const color = getLineColor(itemName);
            
            return (
              <button
                key={itemName}
                onClick={() => toggleItem(itemName)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? color : '#e5e7eb'}`,
                  background: isSelected ? `${color}15` : 'white',
                  color: isSelected ? color : '#6b7280',
                  cursor: 'pointer',
                  fontWeight: isSelected ? '600' : '400',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {itemName.length > 20 ? itemName.substring(0, 20) + '...' : itemName}
              </button>
            );
          })}
        </div>
      </div>

      {/* График */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ left: 0, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={(v) => `${v.toFixed(0)}%`}
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
          {selectedItems.map((itemName) => (
            <Line
              key={itemName}
              type="monotone"
              dataKey={itemName}
              stroke={getLineColor(itemName)}
              strokeWidth={isUnistroy(itemName) ? 3 : 2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicsChart;
