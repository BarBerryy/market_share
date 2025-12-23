import React from 'react';
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
import { isUnistroy } from '../utils/parser';

const Chart = ({ data, metric }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const sortedData = [...data]
    .sort((a, b) => (b[metric.percentKey] || 0) - (a[metric.percentKey] || 0))
    .slice(0, 10);

  const chartData = sortedData.map((item, index) => ({
    name: item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name,
    fullName: item.name,
    value: item[metric.percentKey] || 0,
    color: isUnistroy(item.name)
      ? CONFIG.UNISTROY_COLOR
      : CONFIG.COLORS[index % CONFIG.COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            background: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px', color: '#1f2937' }}>
            {data.fullName}
          </div>
          <div style={{ color: data.color, fontWeight: 700 }}>
            {data.value.toFixed(1)}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
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
          tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          tick={{ fontSize: 12, fill: '#374151' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf4' }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;
