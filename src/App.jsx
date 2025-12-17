import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';

// ========== DEMO DATA ==========
// В будущем эти данные будут загружаться из Excel-файла
const marketData = {
  'Казань': {
    'Ноябрь': [
      { name: 'Суварстроит', units: 203, unitsPercent: 20.5, sqm: 7411.17, sqmPercent: 17.9, rub: 1691083829, rubPercent: 16.1 },
      { name: 'ПИК', units: 148, unitsPercent: 15.0, sqm: 5536.97, sqmPercent: 13.4, rub: 1320703569, rubPercent: 12.5 },
      { name: 'КамаСтройИнвест', units: 72, unitsPercent: 7.3, sqm: 3345.95, sqmPercent: 8.1, rub: 944581426, rubPercent: 9.0 },
      { name: 'СМУ 88', units: 64, unitsPercent: 6.5, sqm: 3754.13, sqmPercent: 9.1, rub: 1062019312, rubPercent: 10.1 },
      { name: 'СЗ ТЕКТУМ-1', units: 64, unitsPercent: 6.5, sqm: 2606.59, sqmPercent: 6.3, rub: 619972007, rubPercent: 5.9 },
      { name: 'ТСИ', units: 62, unitsPercent: 6.3, sqm: 2334.13, sqmPercent: 5.6, rub: 566341350, rubPercent: 5.4 },
      { name: 'Ак Барс Дом', units: 55, unitsPercent: 5.6, sqm: 2470.84, sqmPercent: 6.0, rub: 634762905, rubPercent: 6.0 },
      { name: 'Унистрой', units: 51, unitsPercent: 5.2, sqm: 2187.89, sqmPercent: 5.3, rub: 601388506, rubPercent: 5.7 },
      { name: 'GloraX', units: 51, unitsPercent: 5.2, sqm: 2041.51, sqmPercent: 4.9, rub: 511636220, rubPercent: 4.9 },
      { name: 'КОМОССТРОЙ', units: 37, unitsPercent: 3.7, sqm: 1425.70, sqmPercent: 3.4, rub: 345518754, rubPercent: 3.3 },
      { name: 'Прочие', units: 181, unitsPercent: 18.3, sqm: 8322.61, sqmPercent: 20.1, rub: 2230878323, rubPercent: 21.2 },
    ],
    'Октябрь': [
      { name: 'Суварстроит', units: 195, unitsPercent: 19.8, sqm: 7100.00, sqmPercent: 17.2, rub: 1620000000, rubPercent: 15.8 },
      { name: 'ПИК', units: 155, unitsPercent: 15.7, sqm: 5700.00, sqmPercent: 13.8, rub: 1380000000, rubPercent: 13.4 },
      { name: 'КамаСтройИнвест', units: 68, unitsPercent: 6.9, sqm: 3200.00, sqmPercent: 7.8, rub: 900000000, rubPercent: 8.8 },
      { name: 'СМУ 88', units: 70, unitsPercent: 7.1, sqm: 3900.00, sqmPercent: 9.4, rub: 1100000000, rubPercent: 10.7 },
      { name: 'СЗ ТЕКТУМ-1', units: 58, unitsPercent: 5.9, sqm: 2400.00, sqmPercent: 5.8, rub: 580000000, rubPercent: 5.6 },
      { name: 'ТСИ', units: 65, unitsPercent: 6.6, sqm: 2450.00, sqmPercent: 5.9, rub: 590000000, rubPercent: 5.7 },
      { name: 'Ак Барс Дом', units: 52, unitsPercent: 5.3, sqm: 2350.00, sqmPercent: 5.7, rub: 610000000, rubPercent: 5.9 },
      { name: 'Унистрой', units: 48, unitsPercent: 4.9, sqm: 2050.00, sqmPercent: 5.0, rub: 570000000, rubPercent: 5.5 },
      { name: 'GloraX', units: 55, unitsPercent: 5.6, sqm: 2150.00, sqmPercent: 5.2, rub: 540000000, rubPercent: 5.3 },
      { name: 'КОМОССТРОЙ', units: 40, unitsPercent: 4.1, sqm: 1550.00, sqmPercent: 3.8, rub: 380000000, rubPercent: 3.7 },
      { name: 'Прочие', units: 180, unitsPercent: 18.3, sqm: 8450.00, sqmPercent: 20.5, rub: 2000000000, rubPercent: 19.5 },
    ],
    'Сентябрь': [
      { name: 'Суварстроит', units: 188, unitsPercent: 19.2, sqm: 6900.00, sqmPercent: 16.8, rub: 1550000000, rubPercent: 15.2 },
      { name: 'ПИК', units: 160, unitsPercent: 16.3, sqm: 5900.00, sqmPercent: 14.4, rub: 1420000000, rubPercent: 13.9 },
      { name: 'КамаСтройИнвест', units: 65, unitsPercent: 6.6, sqm: 3050.00, sqmPercent: 7.4, rub: 860000000, rubPercent: 8.4 },
      { name: 'СМУ 88', units: 72, unitsPercent: 7.3, sqm: 4000.00, sqmPercent: 9.7, rub: 1130000000, rubPercent: 11.1 },
      { name: 'СЗ ТЕКТУМ-1', units: 55, unitsPercent: 5.6, sqm: 2300.00, sqmPercent: 5.6, rub: 550000000, rubPercent: 5.4 },
      { name: 'ТСИ', units: 60, unitsPercent: 6.1, sqm: 2280.00, sqmPercent: 5.5, rub: 550000000, rubPercent: 5.4 },
      { name: 'Ак Барс Дом', units: 58, unitsPercent: 5.9, sqm: 2580.00, sqmPercent: 6.3, rub: 660000000, rubPercent: 6.5 },
      { name: 'Унистрой', units: 45, unitsPercent: 4.6, sqm: 1950.00, sqmPercent: 4.7, rub: 540000000, rubPercent: 5.3 },
      { name: 'GloraX', units: 48, unitsPercent: 4.9, sqm: 1900.00, sqmPercent: 4.6, rub: 480000000, rubPercent: 4.7 },
      { name: 'КОМОССТРОЙ', units: 42, unitsPercent: 4.3, sqm: 1600.00, sqmPercent: 3.9, rub: 390000000, rubPercent: 3.8 },
      { name: 'Прочие', units: 188, unitsPercent: 19.2, sqm: 8700.00, sqmPercent: 21.2, rub: 2070000000, rubPercent: 20.3 },
    ],
  },
  'КА': {
    'Ноябрь': [
      { name: 'Суварстроит', units: 250, unitsPercent: 22.0, sqm: 9200.00, sqmPercent: 19.5, rub: 2100000000, rubPercent: 18.0 },
      { name: 'ПИК', units: 180, unitsPercent: 15.8, sqm: 6800.00, sqmPercent: 14.4, rub: 1650000000, rubPercent: 14.1 },
      { name: 'КамаСтройИнвест', units: 85, unitsPercent: 7.5, sqm: 4000.00, sqmPercent: 8.5, rub: 1130000000, rubPercent: 9.7 },
      { name: 'СМУ 88', units: 78, unitsPercent: 6.9, sqm: 4500.00, sqmPercent: 9.5, rub: 1280000000, rubPercent: 11.0 },
      { name: 'Унистрой', units: 72, unitsPercent: 6.3, sqm: 3100.00, sqmPercent: 6.6, rub: 850000000, rubPercent: 7.3 },
      { name: 'Прочие', units: 472, unitsPercent: 41.5, sqm: 19600.00, sqmPercent: 41.5, rub: 4660000000, rubPercent: 39.9 },
    ],
    'Октябрь': [
      { name: 'Суварстроит', units: 240, unitsPercent: 21.5, sqm: 8900.00, sqmPercent: 19.0, rub: 2030000000, rubPercent: 17.5 },
      { name: 'ПИК', units: 175, unitsPercent: 15.7, sqm: 6600.00, sqmPercent: 14.1, rub: 1600000000, rubPercent: 13.8 },
      { name: 'КамаСтройИнвест', units: 82, unitsPercent: 7.3, sqm: 3850.00, sqmPercent: 8.2, rub: 1090000000, rubPercent: 9.4 },
      { name: 'СМУ 88', units: 80, unitsPercent: 7.2, sqm: 4600.00, sqmPercent: 9.8, rub: 1310000000, rubPercent: 11.3 },
      { name: 'Унистрой', units: 68, unitsPercent: 6.1, sqm: 2950.00, sqmPercent: 6.3, rub: 810000000, rubPercent: 7.0 },
      { name: 'Прочие', units: 470, unitsPercent: 42.1, sqm: 19900.00, sqmPercent: 42.5, rub: 4760000000, rubPercent: 41.0 },
    ],
    'Сентябрь': [
      { name: 'Суварстроит', units: 235, unitsPercent: 21.2, sqm: 8700.00, sqmPercent: 18.7, rub: 1980000000, rubPercent: 17.2 },
      { name: 'ПИК', units: 182, unitsPercent: 16.4, sqm: 6900.00, sqmPercent: 14.8, rub: 1680000000, rubPercent: 14.6 },
      { name: 'КамаСтройИнвест', units: 78, unitsPercent: 7.0, sqm: 3700.00, sqmPercent: 8.0, rub: 1050000000, rubPercent: 9.1 },
      { name: 'СМУ 88', units: 82, unitsPercent: 7.4, sqm: 4700.00, sqmPercent: 10.1, rub: 1340000000, rubPercent: 11.6 },
      { name: 'Унистрой', units: 65, unitsPercent: 5.9, sqm: 2820.00, sqmPercent: 6.1, rub: 780000000, rubPercent: 6.8 },
      { name: 'Прочие', units: 466, unitsPercent: 42.0, sqm: 19680.00, sqmPercent: 42.3, rub: 4690000000, rubPercent: 40.7 },
    ],
  },
  'Пермь': {
    'Ноябрь': [
      { name: 'ПЗСП', units: 120, unitsPercent: 18.5, sqm: 5200.00, sqmPercent: 17.0, rub: 780000000, rubPercent: 16.5 },
      { name: 'Девелопмент-Юг', units: 95, unitsPercent: 14.6, sqm: 4100.00, sqmPercent: 13.4, rub: 640000000, rubPercent: 13.5 },
      { name: 'СтройПанельКомплект', units: 78, unitsPercent: 12.0, sqm: 3500.00, sqmPercent: 11.4, rub: 530000000, rubPercent: 11.2 },
      { name: 'ПИК', units: 65, unitsPercent: 10.0, sqm: 3000.00, sqmPercent: 9.8, rub: 480000000, rubPercent: 10.1 },
      { name: 'Орсо Групп', units: 55, unitsPercent: 8.5, sqm: 2600.00, sqmPercent: 8.5, rub: 400000000, rubPercent: 8.5 },
      { name: 'Прочие', units: 237, unitsPercent: 36.5, sqm: 12200.00, sqmPercent: 39.9, rub: 1900000000, rubPercent: 40.2 },
    ],
    'Октябрь': [
      { name: 'ПЗСП', units: 115, unitsPercent: 18.0, sqm: 5000.00, sqmPercent: 16.5, rub: 750000000, rubPercent: 16.0 },
      { name: 'Девелопмент-Юг', units: 100, unitsPercent: 15.6, sqm: 4300.00, sqmPercent: 14.2, rub: 670000000, rubPercent: 14.3 },
      { name: 'СтройПанельКомплект', units: 75, unitsPercent: 11.7, sqm: 3400.00, sqmPercent: 11.2, rub: 515000000, rubPercent: 11.0 },
      { name: 'ПИК', units: 68, unitsPercent: 10.6, sqm: 3150.00, sqmPercent: 10.4, rub: 505000000, rubPercent: 10.8 },
      { name: 'Орсо Групп', units: 52, unitsPercent: 8.1, sqm: 2450.00, sqmPercent: 8.1, rub: 375000000, rubPercent: 8.0 },
      { name: 'Прочие', units: 230, unitsPercent: 35.9, sqm: 12000.00, sqmPercent: 39.6, rub: 1865000000, rubPercent: 39.8 },
    ],
    'Сентябрь': [
      { name: 'ПЗСП', units: 110, unitsPercent: 17.5, sqm: 4800.00, sqmPercent: 16.0, rub: 720000000, rubPercent: 15.5 },
      { name: 'Девелопмент-Юг', units: 98, unitsPercent: 15.6, sqm: 4200.00, sqmPercent: 14.0, rub: 655000000, rubPercent: 14.1 },
      { name: 'СтройПанельКомплект', units: 80, unitsPercent: 12.7, sqm: 3600.00, sqmPercent: 12.0, rub: 545000000, rubPercent: 11.7 },
      { name: 'ПИК', units: 62, unitsPercent: 9.9, sqm: 2900.00, sqmPercent: 9.7, rub: 465000000, rubPercent: 10.0 },
      { name: 'Орсо Групп', units: 58, unitsPercent: 9.2, sqm: 2750.00, sqmPercent: 9.2, rub: 425000000, rubPercent: 9.1 },
      { name: 'Прочие', units: 220, unitsPercent: 35.0, sqm: 11750.00, sqmPercent: 39.2, rub: 1840000000, rubPercent: 39.6 },
    ],
  },
  'Тольятти': {
    'Ноябрь': [
      { name: 'Тольяттистрой', units: 85, unitsPercent: 24.3, sqm: 3800.00, sqmPercent: 22.5, rub: 420000000, rubPercent: 21.0 },
      { name: 'Ладья', units: 65, unitsPercent: 18.6, sqm: 3000.00, sqmPercent: 17.8, rub: 360000000, rubPercent: 18.0 },
      { name: 'Автоградстрой', units: 48, unitsPercent: 13.7, sqm: 2200.00, sqmPercent: 13.0, rub: 280000000, rubPercent: 14.0 },
      { name: 'Волга-Билдинг', units: 42, unitsPercent: 12.0, sqm: 2050.00, sqmPercent: 12.1, rub: 245000000, rubPercent: 12.3 },
      { name: 'Прочие', units: 110, unitsPercent: 31.4, sqm: 5850.00, sqmPercent: 34.6, rub: 695000000, rubPercent: 34.8 },
    ],
    'Октябрь': [
      { name: 'Тольяттистрой', units: 80, unitsPercent: 23.5, sqm: 3600.00, sqmPercent: 21.8, rub: 400000000, rubPercent: 20.5 },
      { name: 'Ладья', units: 68, unitsPercent: 20.0, sqm: 3150.00, sqmPercent: 19.1, rub: 378000000, rubPercent: 19.4 },
      { name: 'Автоградстрой', units: 45, unitsPercent: 13.2, sqm: 2100.00, sqmPercent: 12.7, rub: 265000000, rubPercent: 13.6 },
      { name: 'Волга-Билдинг', units: 40, unitsPercent: 11.8, sqm: 1950.00, sqmPercent: 11.8, rub: 233000000, rubPercent: 11.9 },
      { name: 'Прочие', units: 107, unitsPercent: 31.5, sqm: 5700.00, sqmPercent: 34.5, rub: 674000000, rubPercent: 34.6 },
    ],
    'Сентябрь': [
      { name: 'Тольяттистрой', units: 78, unitsPercent: 23.1, sqm: 3500.00, sqmPercent: 21.3, rub: 390000000, rubPercent: 20.2 },
      { name: 'Ладья', units: 70, unitsPercent: 20.7, sqm: 3250.00, sqmPercent: 19.8, rub: 390000000, rubPercent: 20.2 },
      { name: 'Автоградстрой', units: 44, unitsPercent: 13.0, sqm: 2050.00, sqmPercent: 12.5, rub: 260000000, rubPercent: 13.5 },
      { name: 'Волга-Билдинг', units: 38, unitsPercent: 11.2, sqm: 1850.00, sqmPercent: 11.3, rub: 220000000, rubPercent: 11.4 },
      { name: 'Прочие', units: 108, unitsPercent: 32.0, sqm: 5770.00, sqmPercent: 35.1, rub: 670000000, rubPercent: 34.7 },
    ],
  },
};

const MONTHS = ['Сентябрь', 'Октябрь', 'Ноябрь'];
const CITIES = ['Казань', 'КА', 'Пермь', 'Тольятти'];
const METRICS = [
  { key: 'units', label: 'Доля в шт.', percentKey: 'unitsPercent', format: (v) => v.toLocaleString('ru-RU') },
  { key: 'sqm', label: 'Доля в м²', percentKey: 'sqmPercent', format: (v) => v.toLocaleString('ru-RU', { minimumFractionDigits: 2 }) + ' м²' },
  { key: 'rub', label: 'Доля в руб.', percentKey: 'rubPercent', format: (v) => (v / 1000000).toLocaleString('ru-RU', { minimumFractionDigits: 0 }) + ' млн ₽' },
];

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', 
  '#0891b2', '#be185d', '#65a30d', '#ea580c', '#4f46e5',
  '#78716c'
];

// ========== STYLES ==========
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#e2e8f0',
  },
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '32px',
  },
  loginBox: {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '24px',
    padding: '48px',
    width: '400px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  loginTitle: {
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '8px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  loginSubtitle: {
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '32px',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    background: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '12px',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    letterSpacing: '8px',
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    cursor: 'pointer',
    marginTop: '24px',
    transition: 'all 0.2s ease',
  },
  errorMessage: {
    background: 'rgba(220, 38, 38, 0.15)',
    border: '1px solid rgba(220, 38, 38, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
    fontSize: '14px',
    color: '#fca5a5',
    textAlign: 'center',
  },
  header: {
    padding: '24px 40px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    background: 'rgba(148, 163, 184, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabsContainer: {
    padding: '0 40px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
  },
  cityTabs: {
    display: 'flex',
    gap: '8px',
    paddingTop: '20px',
  },
  cityTab: {
    padding: '14px 28px',
    fontSize: '15px',
    fontWeight: '500',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px 12px 0 0',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  cityTabActive: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
  },
  metricTabs: {
    display: 'flex',
    gap: '4px',
    padding: '16px 40px',
    background: 'rgba(15, 23, 42, 0.4)',
  },
  metricTab: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  metricTabActive: {
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    border: '1px solid transparent',
    color: 'white',
  },
  content: {
    padding: '32px 40px',
  },
  monthsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  monthButton: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '500',
    background: 'rgba(30, 41, 59, 0.6)',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '8px',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  monthButtonActive: {
    background: '#1e40af',
    border: '1px solid #3b82f6',
    color: 'white',
  },
  allMonthsButton: {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
    border: '1px solid rgba(139, 92, 246, 0.3)',
  },
  allMonthsButtonActive: {
    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
    border: '1px solid transparent',
    color: 'white',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
  },
  chartCard: {
    background: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '20px',
    padding: '28px',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#f1f5f9',
  },
  dataTable: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0',
    marginTop: '24px',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
  },
  tableCell: {
    padding: '14px 16px',
    fontSize: '14px',
    borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
  },
  companyName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  colorDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  percentBar: {
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(148, 163, 184, 0.1)',
    overflow: 'hidden',
    minWidth: '100px',
  },
  percentFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
};

// ========== COMPONENTS ==========

const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '5555') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginBox}>
        <h1 style={styles.loginTitle}>Доля рынка</h1>
        <p style={styles.loginSubtitle}>Аналитика рынка недвижимости</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            style={styles.input}
            autoFocus
          />
          <button type="submit" style={styles.loginButton}>
            Войти
          </button>
        </form>
        
        {error && (
          <div style={styles.errorMessage}>
            Пароль неверный, вернитесь с правильным паролем
          </div>
        )}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, metric }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}>
        <p style={{ fontWeight: '600', marginBottom: '8px', color: '#f1f5f9' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, fontSize: '13px', margin: '4px 0' }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = ({ onLogout }) => {
  const [selectedCity, setSelectedCity] = useState('Казань');
  const [selectedMetric, setSelectedMetric] = useState(METRICS[0]);
  const [selectedMonth, setSelectedMonth] = useState('Ноябрь');
  const [showAllMonths, setShowAllMonths] = useState(false);

  const currentData = useMemo(() => {
    return marketData[selectedCity]?.[selectedMonth] || [];
  }, [selectedCity, selectedMonth]);

  const dynamicsData = useMemo(() => {
    const companies = new Set();
    MONTHS.forEach(month => {
      (marketData[selectedCity]?.[month] || []).forEach(item => {
        if (item.name !== 'Прочие') companies.add(item.name);
      });
    });

    return MONTHS.map(month => {
      const monthData = { month };
      const data = marketData[selectedCity]?.[month] || [];
      companies.forEach(company => {
        const companyData = data.find(d => d.name === company);
        monthData[company] = companyData ? companyData[selectedMetric.percentKey] : 0;
      });
      return monthData;
    });
  }, [selectedCity, selectedMetric]);

  const topCompanies = useMemo(() => {
    const companies = new Set();
    MONTHS.forEach(month => {
      (marketData[selectedCity]?.[month] || []).forEach(item => {
        if (item.name !== 'Прочие') companies.add(item.name);
      });
    });
    return Array.from(companies).slice(0, 10);
  }, [selectedCity]);

  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>📊 Доля рынка</div>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Выйти
        </button>
      </header>

      {/* City Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.cityTabs}>
          {CITIES.map(city => (
            <button
              key={city}
              style={{
                ...styles.cityTab,
                ...(selectedCity === city ? styles.cityTabActive : {}),
              }}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Tabs */}
      <div style={styles.metricTabs}>
        {METRICS.map(metric => (
          <button
            key={metric.key}
            style={{
              ...styles.metricTab,
              ...(selectedMetric.key === metric.key ? styles.metricTabActive : {}),
            }}
            onClick={() => setSelectedMetric(metric)}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Month Buttons */}
        <div style={styles.monthsContainer}>
          <button
            style={{
              ...styles.monthButton,
              ...styles.allMonthsButton,
              ...(showAllMonths ? styles.allMonthsButtonActive : {}),
            }}
            onClick={() => setShowAllMonths(!showAllMonths)}
          >
            📈 Динамика
          </button>
          {MONTHS.map(month => (
            <button
              key={month}
              style={{
                ...styles.monthButton,
                ...(!showAllMonths && selectedMonth === month ? styles.monthButtonActive : {}),
              }}
              onClick={() => {
                setSelectedMonth(month);
                setShowAllMonths(false);
              }}
            >
              {month}
            </button>
          ))}
        </div>

        <div style={styles.chartsGrid}>
          {/* Dynamics Chart */}
          {showAllMonths && (
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>
                Динамика долей рынка — {selectedCity} — {selectedMetric.label}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dynamicsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#94a3b8" 
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                  />
                  {topCompanies.map((company, index) => (
                    <Line
                      key={company}
                      type="monotone"
                      dataKey={company}
                      stroke={COLORS[index % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4, fill: COLORS[index % COLORS.length] }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bar Chart */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>
              {selectedCity} — {selectedMonth} — {selectedMetric.label}
            </h3>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={currentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" horizontal={true} vertical={false} />
                <XAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={11}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                />
                <YAxis 
                  type="number" 
                  stroke="#94a3b8" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 'dataMax + 2']}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{
                          background: 'rgba(15, 23, 42, 0.95)',
                          border: '1px solid rgba(148, 163, 184, 0.2)',
                          borderRadius: '12px',
                          padding: '16px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                        }}>
                          <p style={{ fontWeight: '600', marginBottom: '8px', color: '#f1f5f9' }}>{data.name}</p>
                          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                            {selectedMetric.label}: {selectedMetric.format(data[selectedMetric.key])}
                          </p>
                          <p style={{ fontSize: '13px', color: '#60a5fa' }}>
                            Доля: {data[selectedMetric.percentKey].toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey={selectedMetric.percentKey} 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Data Table */}
            <table style={styles.dataTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Застройщик</th>
                  <th style={styles.tableHeader}>Значение</th>
                  <th style={styles.tableHeader}>Доля</th>
                  <th style={{ ...styles.tableHeader, width: '200px' }}></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={item.name}>
                    <td style={styles.tableCell}>
                      <div style={styles.companyName}>
                        <span style={{ ...styles.colorDot, background: COLORS[index % COLORS.length] }} />
                        {item.name}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      {selectedMetric.format(item[selectedMetric.key])}
                    </td>
                    <td style={{ ...styles.tableCell, fontWeight: '600', color: '#60a5fa' }}>
                      {item[selectedMetric.percentKey].toFixed(1)}%
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.percentBar}>
                        <div 
                          style={{ 
                            ...styles.percentFill, 
                            width: `${item[selectedMetric.percentKey] * 3}%`,
                            background: COLORS[index % COLORS.length],
                          }} 
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN APP ==========
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div style={styles.container}>
      {!isAuthenticated ? (
        <LoginPage onLogin={() => setIsAuthenticated(true)} />
      ) : (
        <Dashboard onLogout={() => setIsAuthenticated(false)} />
      )}
    </div>
  );
}
