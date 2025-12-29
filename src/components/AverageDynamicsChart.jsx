import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CONFIG } from '../config';
import { isUnistroy, fetchAllSheetsData } from '../utils/parser';

const AverageDynamicsChart = ({ 
  availableSheets, 
  selectedCity, 
  viewType, 
  metric,
}) => {
  const [allSheetsData, setAllSheetsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

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

  // Устанавливаем период по умолчанию (весь год)
  useEffect(() => {
    if (availableSheets && availableSheets.length > 0) {
      if (!periodStart) setPeriodStart(availableSheets[0]);
      if (!periodEnd) setPeriodEnd(availableSheets[availableSheets.length - 1]);
    }
  }, [availableSheets]);

  // Фильтруем листы по выбранному периоду
  const filteredSheets = useMemo(() => {
    if (!availableSheets || !periodStart || !periodEnd) return [];
    
    const startIndex = availableSheets.indexOf(periodStart);
    const endIndex = availableSheets.indexOf(periodEnd);
    
    if (startIndex === -1 || endIndex === -1) return availableSheets;
    
    const from = Math.min(startIndex, endIndex);
    const to = Math.max(startIndex, endIndex);
    
    return availableSheets.slice(from, to + 1);
  }, [availableSheets, periodStart, periodEnd]);

  // Рассчитываем среднюю долю за период
  const chartData = useMemo(() => {
    if (!allSheetsData || !selectedCity || filteredSheets.length === 0) return [];

    const itemStats = {}; // { name: { total: number, count: number } }

    filteredSheets.forEach(sheetName => {
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

    // Формируем данные для графика
    return Object.entries(itemStats)
      .map(([name, stats]) => ({
        name,
        fullName: name,
        value: stats.count > 0 ? stats.total / stats.count : 0,
        months: stats.count,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 15) // Топ-15
      .map((item, index) => ({
        ...item,
        name: item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name,
        color: isUnistroy(item.fullName) 
          ? CONFIG.UNISTROY_COLOR 
          : CONFIG.COLORS[index % CONFIG.COLORS.length],
      }));
  }, [allSheetsData, filteredSheets, selectedCity, viewType, metric.percentKey]);

  // Кастомный Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;
    
    const data = payload[0].payload;
    
    return (
      <div style={{
        background: 'white',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '12px',
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px', color: '#374151' }}>
          {data.fullName}
        </div>
        <div style={{ color: data.color, fontWeight: '700', fontSize: '14px' }}>
          {data.value.toFixed(1)}%
        </div>
        <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
          Данные за {data.months} мес.
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
        <div>Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Фильтр по периоду */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '16px',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
          Период:
        </span>
        <select
          value={periodStart}
          onChange={(e) => setPeriodStart(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {availableSheets.map(sheet => (
            <option key={sheet} value={sheet}>{sheet}</option>
          ))}
        </select>
        <span style={{ color: '#9ca3af' }}>—</span>
        <select
          value={periodEnd}
          onChange={(e) => setPeriodEnd(e.target.value)}
          style={{
            padding: '6px 12px',
            fontSize: '13px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {availableSheets.map(sheet => (
            <option key={sheet} value={sheet}>{sheet}</option>
          ))}
        </select>
        <span style={{ 
          fontSize: '11px', 
          color: '#9ca3af',
          marginLeft: '8px',
        }}>
          ({filteredSheets.length} мес.)
        </span>
      </div>

      {/* График */}
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <div>Нет данных за выбранный период</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(300, chartData.length * 28)}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11, fill: '#374151' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4' }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AverageDynamicsChart;
