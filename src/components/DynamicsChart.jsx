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

  // Получаем топ-5 по текущему месяцу для отображения на графике
  useEffect(() => {
    if (currentData && currentData.length > 0) {
      const top5 = [...currentData]
        .sort((a, b) => (b[metric.percentKey] || 0) - (a[metric.percentKey] || 0))
        .slice(0, 5)
        .map(item => item.name);
      setSelectedItems(top5);
    }
  }, [currentData, metric.percentKey]);

  // Формируем данные для графика
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
        point[itemName] = item ? item[metric.percentKey] || 0 : 0;
      });

      return point;
    });
  }, [allSheetsData, availableSheets, selectedCity, viewType, selectedItems, metric.percentKey]);

  // Цвета для линий
  const getLineColor = (name, index) => {
    if (isUnistroy(name)) return CONFIG.UNISTROY_COLOR;
    return CONFIG.COLORS[index % CONFIG.COLORS.length];
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

  // Получаем все доступные элементы для выбора
  const allAvailableItems = useMemo(() => {
    if (!currentData) return [];
    return [...currentData]
      .sort((a, b) => (b[metric.percentKey] || 0) - (a[metric.percentKey] || 0))
      .map(item => item.name);
  }, [currentData, metric.percentKey]);

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
          {allAvailableItems.slice(0, 15).map((itemName, index) => {
            const isSelected = selectedItems.includes(itemName);
            const isUni = isUnistroy(itemName);
            const color = isUni ? CONFIG.UNISTROY_COLOR : CONFIG.COLORS[index % CONFIG.COLORS.length];
            
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
          <Tooltip
            formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
          {selectedItems.map((itemName, index) => (
            <Line
              key={itemName}
              type="monotone"
              dataKey={itemName}
              stroke={getLineColor(itemName, index)}
              strokeWidth={isUnistroy(itemName) ? 3 : 2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DynamicsChart;
