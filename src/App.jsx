import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';

// ========== КОНСТАНТЫ ==========
const HIGHLIGHT_COMPANY = 'Унистрой';
const HIGHLIGHT_COLOR = '#4ade80'; // Светло-зеленый для Унистрой

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

// Функция для получения цвета — Унистрой всегда золотой
const getColor = (name, index) => {
  if (name === HIGHLIGHT_COMPANY) return HIGHLIGHT_COLOR;
  return COLORS[index % COLORS.length];
};

// ========== DEMO DATA: ЗАСТРОЙЩИКИ ==========
const developerData = {
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
      
    ],
  },
  'КА': {
    'Ноябрь': [
      { name: 'Суварстроит', units: 250, unitsPercent: 22.0, sqm: 9200.00, sqmPercent: 19.5, rub: 2100000000, rubPercent: 18.0 },
      { name: 'ПИК', units: 180, unitsPercent: 15.8, sqm: 6800.00, sqmPercent: 14.4, rub: 1650000000, rubPercent: 14.1 },
      { name: 'КамаСтройИнвест', units: 85, unitsPercent: 7.5, sqm: 4000.00, sqmPercent: 8.5, rub: 1130000000, rubPercent: 9.7 },
      { name: 'СМУ 88', units: 78, unitsPercent: 6.9, sqm: 4500.00, sqmPercent: 9.5, rub: 1280000000, rubPercent: 11.0 },
      { name: 'Унистрой', units: 72, unitsPercent: 6.3, sqm: 3100.00, sqmPercent: 6.6, rub: 850000000, rubPercent: 7.3 },
      
    ],
    'Октябрь': [
      { name: 'Суварстроит', units: 240, unitsPercent: 21.5, sqm: 8900.00, sqmPercent: 19.0, rub: 2030000000, rubPercent: 17.5 },
      { name: 'ПИК', units: 175, unitsPercent: 15.7, sqm: 6600.00, sqmPercent: 14.1, rub: 1600000000, rubPercent: 13.8 },
      { name: 'КамаСтройИнвест', units: 82, unitsPercent: 7.3, sqm: 3850.00, sqmPercent: 8.2, rub: 1090000000, rubPercent: 9.4 },
      { name: 'СМУ 88', units: 80, unitsPercent: 7.2, sqm: 4600.00, sqmPercent: 9.8, rub: 1310000000, rubPercent: 11.3 },
      { name: 'Унистрой', units: 68, unitsPercent: 6.1, sqm: 2950.00, sqmPercent: 6.3, rub: 810000000, rubPercent: 7.0 },
      
    ],
    'Сентябрь': [
      { name: 'Суварстроит', units: 235, unitsPercent: 21.2, sqm: 8700.00, sqmPercent: 18.7, rub: 1980000000, rubPercent: 17.2 },
      { name: 'ПИК', units: 182, unitsPercent: 16.4, sqm: 6900.00, sqmPercent: 14.8, rub: 1680000000, rubPercent: 14.6 },
      { name: 'КамаСтройИнвест', units: 78, unitsPercent: 7.0, sqm: 3700.00, sqmPercent: 8.0, rub: 1050000000, rubPercent: 9.1 },
      { name: 'СМУ 88', units: 82, unitsPercent: 7.4, sqm: 4700.00, sqmPercent: 10.1, rub: 1340000000, rubPercent: 11.6 },
      { name: 'Унистрой', units: 65, unitsPercent: 5.9, sqm: 2820.00, sqmPercent: 6.1, rub: 780000000, rubPercent: 6.8 },
      
    ],
  },
  'Пермь': {
    'Ноябрь': [
      { name: 'ПЗСП', units: 120, unitsPercent: 18.5, sqm: 5200.00, sqmPercent: 17.0, rub: 780000000, rubPercent: 16.5 },
      { name: 'Девелопмент-Юг', units: 95, unitsPercent: 14.6, sqm: 4100.00, sqmPercent: 13.4, rub: 640000000, rubPercent: 13.5 },
      { name: 'СтройПанельКомплект', units: 78, unitsPercent: 12.0, sqm: 3500.00, sqmPercent: 11.4, rub: 530000000, rubPercent: 11.2 },
      { name: 'ПИК', units: 65, unitsPercent: 10.0, sqm: 3000.00, sqmPercent: 9.8, rub: 480000000, rubPercent: 10.1 },
      { name: 'Орсо Групп', units: 55, unitsPercent: 8.5, sqm: 2600.00, sqmPercent: 8.5, rub: 400000000, rubPercent: 8.5 },
      
    ],
    'Октябрь': [
      { name: 'ПЗСП', units: 115, unitsPercent: 18.0, sqm: 5000.00, sqmPercent: 16.5, rub: 750000000, rubPercent: 16.0 },
      { name: 'Девелопмент-Юг', units: 100, unitsPercent: 15.6, sqm: 4300.00, sqmPercent: 14.2, rub: 670000000, rubPercent: 14.3 },
      { name: 'СтройПанельКомплект', units: 75, unitsPercent: 11.7, sqm: 3400.00, sqmPercent: 11.2, rub: 515000000, rubPercent: 11.0 },
      { name: 'ПИК', units: 68, unitsPercent: 10.6, sqm: 3150.00, sqmPercent: 10.4, rub: 505000000, rubPercent: 10.8 },
      { name: 'Орсо Групп', units: 52, unitsPercent: 8.1, sqm: 2450.00, sqmPercent: 8.1, rub: 375000000, rubPercent: 8.0 },
      
    ],
    'Сентябрь': [
      { name: 'ПЗСП', units: 110, unitsPercent: 17.5, sqm: 4800.00, sqmPercent: 16.0, rub: 720000000, rubPercent: 15.5 },
      { name: 'Девелопмент-Юг', units: 98, unitsPercent: 15.6, sqm: 4200.00, sqmPercent: 14.0, rub: 655000000, rubPercent: 14.1 },
      { name: 'СтройПанельКомплект', units: 80, unitsPercent: 12.7, sqm: 3600.00, sqmPercent: 12.0, rub: 545000000, rubPercent: 11.7 },
      { name: 'ПИК', units: 62, unitsPercent: 9.9, sqm: 2900.00, sqmPercent: 9.7, rub: 465000000, rubPercent: 10.0 },
      { name: 'Орсо Групп', units: 58, unitsPercent: 9.2, sqm: 2750.00, sqmPercent: 9.2, rub: 425000000, rubPercent: 9.1 },
      
    ],
  },
  'Тольятти': {
    'Ноябрь': [
      { name: 'Тольяттистрой', units: 85, unitsPercent: 24.3, sqm: 3800.00, sqmPercent: 22.5, rub: 420000000, rubPercent: 21.0 },
      { name: 'Ладья', units: 65, unitsPercent: 18.6, sqm: 3000.00, sqmPercent: 17.8, rub: 360000000, rubPercent: 18.0 },
      { name: 'Автоградстрой', units: 48, unitsPercent: 13.7, sqm: 2200.00, sqmPercent: 13.0, rub: 280000000, rubPercent: 14.0 },
      { name: 'Волга-Билдинг', units: 42, unitsPercent: 12.0, sqm: 2050.00, sqmPercent: 12.1, rub: 245000000, rubPercent: 12.3 },
      
    ],
    'Октябрь': [
      { name: 'Тольяттистрой', units: 80, unitsPercent: 23.5, sqm: 3600.00, sqmPercent: 21.8, rub: 400000000, rubPercent: 20.5 },
      { name: 'Ладья', units: 68, unitsPercent: 20.0, sqm: 3150.00, sqmPercent: 19.1, rub: 378000000, rubPercent: 19.4 },
      { name: 'Автоградстрой', units: 45, unitsPercent: 13.2, sqm: 2100.00, sqmPercent: 12.7, rub: 265000000, rubPercent: 13.6 },
      { name: 'Волга-Билдинг', units: 40, unitsPercent: 11.8, sqm: 1950.00, sqmPercent: 11.8, rub: 233000000, rubPercent: 11.9 },
      
    ],
    'Сентябрь': [
      { name: 'Тольяттистрой', units: 78, unitsPercent: 23.1, sqm: 3500.00, sqmPercent: 21.3, rub: 390000000, rubPercent: 20.2 },
      { name: 'Ладья', units: 70, unitsPercent: 20.7, sqm: 3250.00, sqmPercent: 19.8, rub: 390000000, rubPercent: 20.2 },
      { name: 'Автоградстрой', units: 44, unitsPercent: 13.0, sqm: 2050.00, sqmPercent: 12.5, rub: 260000000, rubPercent: 13.5 },
      { name: 'Волга-Билдинг', units: 38, unitsPercent: 11.2, sqm: 1850.00, sqmPercent: 11.3, rub: 220000000, rubPercent: 11.4 },
      
    ],
  },
};

// ========== DEMO DATA: ==========
const residentialData = {
  'Казань': {
    'Ноябрь': [
      { name: 'Светлая долина', developer: 'Суварстроит', units: 45, unitsPercent: 4.5, sqm: 1850.00, sqmPercent: 4.5, rub: 420000000, rubPercent: 4.0 },
      { name: 'Мой ритм', developer: 'ПИК', units: 42, unitsPercent: 4.2, sqm: 1680.00, sqmPercent: 4.1, rub: 400000000, rubPercent: 3.8 },
      { name: 'Март', developer: 'КамаСтройИнвест', units: 38, unitsPercent: 3.8, sqm: 1750.00, sqmPercent: 4.2, rub: 490000000, rubPercent: 4.7 },
      { name: 'Петрополь', developer: 'Суварстроит', units: 35, unitsPercent: 3.5, sqm: 1420.00, sqmPercent: 3.4, rub: 330000000, rubPercent: 3.1 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 32, unitsPercent: 3.2, sqm: 1380.00, sqmPercent: 3.3, rub: 380000000, rubPercent: 3.6 },
      { name: 'Счастье', developer: 'СМУ 88', units: 30, unitsPercent: 3.0, sqm: 1650.00, sqmPercent: 4.0, rub: 470000000, rubPercent: 4.5 },
      { name: 'Легенда', developer: 'ТСИ', units: 28, unitsPercent: 2.8, sqm: 1050.00, sqmPercent: 2.5, rub: 250000000, rubPercent: 2.4 },
      { name: 'Новые горки', developer: 'Ак Барс Дом', units: 26, unitsPercent: 2.6, sqm: 1180.00, sqmPercent: 2.9, rub: 300000000, rubPercent: 2.9 },
      { name: 'Арт Сити', developer: 'Унистрой', units: 19, unitsPercent: 1.9, sqm: 807.89, sqmPercent: 2.0, rub: 221388506, rubPercent: 2.1 },
      
    ],
    'Октябрь': [
      { name: 'Светлая долина', developer: 'Суварстроит', units: 43, unitsPercent: 4.4, sqm: 1780.00, sqmPercent: 4.3, rub: 405000000, rubPercent: 3.9 },
      { name: 'Мой ритм', developer: 'ПИК', units: 40, unitsPercent: 4.1, sqm: 1600.00, sqmPercent: 3.9, rub: 385000000, rubPercent: 3.7 },
      { name: 'Март', developer: 'КамаСтройИнвест', units: 35, unitsPercent: 3.6, sqm: 1620.00, sqmPercent: 3.9, rub: 455000000, rubPercent: 4.4 },
      { name: 'Петрополь', developer: 'Суварстроит', units: 33, unitsPercent: 3.4, sqm: 1350.00, sqmPercent: 3.3, rub: 315000000, rubPercent: 3.1 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 30, unitsPercent: 3.1, sqm: 1300.00, sqmPercent: 3.2, rub: 360000000, rubPercent: 3.5 },
      { name: 'Счастье', developer: 'СМУ 88', units: 32, unitsPercent: 3.3, sqm: 1750.00, sqmPercent: 4.2, rub: 495000000, rubPercent: 4.8 },
      { name: 'Легенда', developer: 'ТСИ', units: 30, unitsPercent: 3.1, sqm: 1130.00, sqmPercent: 2.7, rub: 270000000, rubPercent: 2.6 },
      { name: 'Новые горки', developer: 'Ак Барс Дом', units: 24, unitsPercent: 2.4, sqm: 1100.00, sqmPercent: 2.7, rub: 285000000, rubPercent: 2.8 },
      { name: 'Арт Сити', developer: 'Унистрой', units: 18, unitsPercent: 1.8, sqm: 750.00, sqmPercent: 1.8, rub: 210000000, rubPercent: 2.0 },
      
    ],
    'Сентябрь': [
      { name: 'Светлая долина', developer: 'Суварстроит', units: 41, unitsPercent: 4.2, sqm: 1700.00, sqmPercent: 4.1, rub: 385000000, rubPercent: 3.8 },
      { name: 'Мой ритм', developer: 'ПИК', units: 45, unitsPercent: 4.6, sqm: 1800.00, sqmPercent: 4.4, rub: 430000000, rubPercent: 4.2 },
      { name: 'Март', developer: 'КамаСтройИнвест', units: 33, unitsPercent: 3.4, sqm: 1550.00, sqmPercent: 3.8, rub: 435000000, rubPercent: 4.3 },
      { name: 'Петрополь', developer: 'Суварстроит', units: 35, unitsPercent: 3.6, sqm: 1430.00, sqmPercent: 3.5, rub: 335000000, rubPercent: 3.3 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 28, unitsPercent: 2.9, sqm: 1200.00, sqmPercent: 2.9, rub: 330000000, rubPercent: 3.2 },
      { name: 'Счастье', developer: 'СМУ 88', units: 34, unitsPercent: 3.5, sqm: 1880.00, sqmPercent: 4.6, rub: 530000000, rubPercent: 5.2 },
      { name: 'Легенда', developer: 'ТСИ', units: 27, unitsPercent: 2.8, sqm: 1020.00, sqmPercent: 2.5, rub: 245000000, rubPercent: 2.4 },
      { name: 'Новые горки', developer: 'Ак Барс Дом', units: 28, unitsPercent: 2.9, sqm: 1280.00, sqmPercent: 3.1, rub: 330000000, rubPercent: 3.2 },
      { name: 'Арт Сити', developer: 'Унистрой', units: 17, unitsPercent: 1.7, sqm: 750.00, sqmPercent: 1.8, rub: 210000000, rubPercent: 2.1 },
      
    ],
  },
  'КА': {
    'Ноябрь': [
      { name: 'Светлая долина', developer: 'Суварстроит', units: 55, unitsPercent: 4.8, sqm: 2200.00, sqmPercent: 4.7, rub: 510000000, rubPercent: 4.4 },
      { name: 'Мой ритм', developer: 'ПИК', units: 48, unitsPercent: 4.2, sqm: 1920.00, sqmPercent: 4.1, rub: 470000000, rubPercent: 4.0 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 40, unitsPercent: 3.5, sqm: 1720.00, sqmPercent: 3.6, rub: 475000000, rubPercent: 4.1 },
      { name: 'Арт Сити', developer: 'Унистрой', units: 32, unitsPercent: 2.8, sqm: 1380.00, sqmPercent: 2.9, rub: 375000000, rubPercent: 3.2 },
      
    ],
    'Октябрь': [
      { name: 'Светлая долина', developer: 'Суварстроит', units: 52, unitsPercent: 4.7, sqm: 2100.00, sqmPercent: 4.5, rub: 485000000, rubPercent: 4.2 },
      { name: 'Мой ритм', developer: 'ПИК', units: 45, unitsPercent: 4.0, sqm: 1800.00, sqmPercent: 3.8, rub: 440000000, rubPercent: 3.8 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 38, unitsPercent: 3.4, sqm: 1640.00, sqmPercent: 3.5, rub: 455000000, rubPercent: 3.9 },
      { name: 'Арт Сити', developer: 'Унистрой', units: 30, unitsPercent: 2.7, sqm: 1310.00, sqmPercent: 2.8, rub: 355000000, rubPercent: 3.1 },
      
    ],
    'Сентябрь': [
      { name: 'Светлая долина', developer: 'Суварстроит', units: 50, unitsPercent: 4.5, sqm: 2000.00, sqmPercent: 4.3, rub: 465000000, rubPercent: 4.0 },
      { name: 'Мой ритм', developer: 'ПИК', units: 48, unitsPercent: 4.3, sqm: 1920.00, sqmPercent: 4.1, rub: 470000000, rubPercent: 4.1 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 36, unitsPercent: 3.2, sqm: 1560.00, sqmPercent: 3.4, rub: 435000000, rubPercent: 3.8 },
      { name: 'Арт Сити', developer: 'Унистрой', units: 29, unitsPercent: 2.6, sqm: 1260.00, sqmPercent: 2.7, rub: 345000000, rubPercent: 3.0 },
      
    ],
  },
  'Пермь': {
    'Ноябрь': [
      { name: 'Гулливер', developer: 'ПЗСП', units: 35, unitsPercent: 5.4, sqm: 1550.00, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 },
      { name: 'Грибоедов', developer: 'Девелопмент-Юг', units: 30, unitsPercent: 4.6, sqm: 1300.00, sqmPercent: 4.2, rub: 205000000, rubPercent: 4.3 },
      { name: 'Триумф', developer: 'СтройПанельКомплект', units: 28, unitsPercent: 4.3, sqm: 1260.00, sqmPercent: 4.1, rub: 190000000, rubPercent: 4.0 },
      { name: 'Лайм', developer: 'ПИК', units: 25, unitsPercent: 3.8, sqm: 1150.00, sqmPercent: 3.8, rub: 185000000, rubPercent: 3.9 },
      
    ],
    'Октябрь': [
      { name: 'Гулливер', developer: 'ПЗСП', units: 33, unitsPercent: 5.2, sqm: 1480.00, sqmPercent: 4.9, rub: 225000000, rubPercent: 4.8 },
      { name: 'Грибоедов', developer: 'Девелопмент-Юг', units: 32, unitsPercent: 5.0, sqm: 1380.00, sqmPercent: 4.6, rub: 215000000, rubPercent: 4.6 },
      { name: 'Триумф', developer: 'СтройПанельКомплект', units: 26, unitsPercent: 4.1, sqm: 1180.00, sqmPercent: 3.9, rub: 180000000, rubPercent: 3.8 },
      { name: 'Лайм', developer: 'ПИК', units: 27, unitsPercent: 4.2, sqm: 1240.00, sqmPercent: 4.1, rub: 200000000, rubPercent: 4.3 },
      
    ],
    'Сентябрь': [
      { name: 'Гулливер', developer: 'ПЗСП', units: 32, unitsPercent: 5.1, sqm: 1420.00, sqmPercent: 4.7, rub: 215000000, rubPercent: 4.6 },
      { name: 'Грибоедов', developer: 'Девелопмент-Юг', units: 30, unitsPercent: 4.8, sqm: 1300.00, sqmPercent: 4.3, rub: 200000000, rubPercent: 4.3 },
      { name: 'Триумф', developer: 'СтройПанельКомплект', units: 28, unitsPercent: 4.4, sqm: 1260.00, sqmPercent: 4.2, rub: 190000000, rubPercent: 4.1 },
      { name: 'Лайм', developer: 'ПИК', units: 24, unitsPercent: 3.8, sqm: 1100.00, sqmPercent: 3.7, rub: 175000000, rubPercent: 3.8 },
      
    ],
  },
  'Тольятти': {
    'Ноябрь': [
      { name: 'Волжские паруса', developer: 'Тольяттистрой', units: 28, unitsPercent: 8.0, sqm: 1260.00, sqmPercent: 7.5, rub: 140000000, rubPercent: 7.0 },
      { name: 'Ладья', developer: 'Ладья', units: 25, unitsPercent: 7.1, sqm: 1150.00, sqmPercent: 6.8, rub: 138000000, rubPercent: 6.9 },
      { name: 'Автоград', developer: 'Автоградстрой', units: 20, unitsPercent: 5.7, sqm: 920.00, sqmPercent: 5.4, rub: 117000000, rubPercent: 5.9 },
      
    ],
    'Октябрь': [
      { name: 'Волжские паруса', developer: 'Тольяттистрой', units: 26, unitsPercent: 7.6, sqm: 1180.00, sqmPercent: 7.2, rub: 132000000, rubPercent: 6.8 },
      { name: 'Ладья', developer: 'Ладья', units: 27, unitsPercent: 7.9, sqm: 1250.00, sqmPercent: 7.6, rub: 150000000, rubPercent: 7.7 },
      { name: 'Автоград', developer: 'Автоградстрой', units: 18, unitsPercent: 5.3, sqm: 850.00, sqmPercent: 5.2, rub: 107000000, rubPercent: 5.5 },
      
    ],
    'Сентябрь': [
      { name: 'Волжские паруса', developer: 'Тольяттистрой', units: 25, unitsPercent: 7.4, sqm: 1130.00, sqmPercent: 6.9, rub: 126000000, rubPercent: 6.5 },
      { name: 'Ладья', developer: 'Ладья', units: 28, unitsPercent: 8.3, sqm: 1300.00, sqmPercent: 7.9, rub: 156000000, rubPercent: 8.1 },
      { name: 'Автоград', developer: 'Автоградстрой', units: 17, unitsPercent: 5.0, sqm: 800.00, sqmPercent: 4.9, rub: 100000000, rubPercent: 5.2 },
      
    ],
  },
};

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
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '20px',
    marginTop: '40px',
    color: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  tableCellHighlight: {
    padding: '14px 16px',
    fontSize: '14px',
    borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
    background: 'rgba(251, 191, 36, 0.08)',
  },
  companyName: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  companyNameHighlight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '600',
    color: '#4ade80',
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
  developerTag: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(148, 163, 184, 0.15)',
    color: '#94a3b8',
  },
  developerTagHighlight: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(251, 191, 36, 0.2)',
    color: '#4ade80',
    fontWeight: '600',
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

const CustomTooltip = ({ active, payload, label }) => {
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
          <p key={index} style={{ 
            color: entry.name === HIGHLIGHT_COMPANY ? HIGHLIGHT_COLOR : entry.color, 
            fontSize: '13px', 
            margin: '4px 0',
            fontWeight: entry.name === HIGHLIGHT_COMPANY ? '600' : '400'
          }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Компонент графика
const DataChart = ({ data, title, selectedMetric, showDeveloper = false }) => {
  const isHighlighted = (item) => {
    return item.name === HIGHLIGHT_COMPANY || item.developer === HIGHLIGHT_COMPANY;
  };

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={data}
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
                const item = payload[0].payload;
                const highlighted = isHighlighted(item);
                return (
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: highlighted ? '2px solid #4ade80' : '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: highlighted ? '0 0 20px rgba(251, 191, 36, 0.3)' : '0 10px 40px rgba(0,0,0,0.3)',
                  }}>
                    <p style={{ fontWeight: '600', marginBottom: '8px', color: highlighted ? '#4ade80' : '#f1f5f9' }}>
                      {item.name}
                    </p>
                    {showDeveloper && item.developer && (
                      <p style={{ fontSize: '12px', color: item.developer === HIGHLIGHT_COMPANY ? '#4ade80' : '#94a3b8', marginBottom: '8px' }}>
                        Застройщик: {item.developer}
                      </p>
                    )}
                    <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                      {selectedMetric.label}: {selectedMetric.format(item[selectedMetric.key])}
                    </p>
                    <p style={{ fontSize: '13px', color: highlighted ? '#4ade80' : '#60a5fa' }}>
                      Доля: {item[selectedMetric.percentKey].toFixed(1)}%
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
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={isHighlighted(entry) ? HIGHLIGHT_COLOR : COLORS[index % COLORS.length]}
                stroke={isHighlighted(entry) ? '#4ade80' : 'none'}
                strokeWidth={isHighlighted(entry) ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Data Table */}
      <table style={styles.dataTable}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>{showDeveloper ? 'ЖК' : 'Застройщик'}</th>
            {showDeveloper && <th style={styles.tableHeader}>Застройщик</th>}
            <th style={styles.tableHeader}>Значение</th>
            <th style={styles.tableHeader}>Доля</th>
            <th style={{ ...styles.tableHeader, width: '200px' }}></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const highlighted = isHighlighted(item);
            const cellStyle = highlighted ? styles.tableCellHighlight : styles.tableCell;
            const color = highlighted ? HIGHLIGHT_COLOR : COLORS[index % COLORS.length];
            
            return (
              <tr key={item.name}>
                <td style={cellStyle}>
                  <div style={highlighted ? styles.companyNameHighlight : styles.companyName}>
                    <span style={{ ...styles.colorDot, background: color, boxShadow: highlighted ? '0 0 8px rgba(251, 191, 36, 0.5)' : 'none' }} />
                    {item.name}
                  </div>
                </td>
                {showDeveloper && (
                  <td style={cellStyle}>
                    <span style={item.developer === HIGHLIGHT_COMPANY ? styles.developerTagHighlight : styles.developerTag}>
                      {item.developer || '—'}
                    </span>
                  </td>
                )}
                <td style={cellStyle}>
                  {selectedMetric.format(item[selectedMetric.key])}
                </td>
                <td style={{ ...cellStyle, fontWeight: '600', color: highlighted ? '#4ade80' : '#60a5fa' }}>
                  {item[selectedMetric.percentKey].toFixed(1)}%
                </td>
                <td style={cellStyle}>
                  <div style={styles.percentBar}>
                    <div 
                      style={{ 
                        ...styles.percentFill, 
                        width: `${Math.min(item[selectedMetric.percentKey] * 3, 100)}%`,
                        background: color,
                        boxShadow: highlighted ? '0 0 8px rgba(251, 191, 36, 0.5)' : 'none',
                      }} 
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const [selectedCity, setSelectedCity] = useState('Казань');
  const [selectedMetric, setSelectedMetric] = useState(METRICS[0]);
  const [selectedMonth, setSelectedMonth] = useState('Ноябрь');
  const [showAllMonths, setShowAllMonths] = useState(false);

  const currentDeveloperData = useMemo(() => {
    return developerData[selectedCity]?.[selectedMonth] || [];
  }, [selectedCity, selectedMonth]);

  const currentResidentialData = useMemo(() => {
    return residentialData[selectedCity]?.[selectedMonth] || [];
  }, [selectedCity, selectedMonth]);

  const dynamicsData = useMemo(() => {
    const companies = new Set();
    MONTHS.forEach(month => {
      (developerData[selectedCity]?.[month] || []).forEach(item => {
        if (item.name !== 'Прочие') companies.add(item.name);
      });
    });

    return MONTHS.map(month => {
      const monthData = { month };
      const data = developerData[selectedCity]?.[month] || [];
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
      (developerData[selectedCity]?.[month] || []).forEach(item => {
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
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => (
                      <span style={{ 
                        color: value === HIGHLIGHT_COMPANY ? '#4ade80' : '#94a3b8', 
                        fontSize: '12px',
                        fontWeight: value === HIGHLIGHT_COMPANY ? '600' : '400'
                      }}>
                        {value}
                      </span>
                    )}
                  />
                  {topCompanies.map((company, index) => (
                    <Line
                      key={company}
                      type="monotone"
                      dataKey={company}
                      stroke={company === HIGHLIGHT_COMPANY ? HIGHLIGHT_COLOR : COLORS[index % COLORS.length]}
                      strokeWidth={company === HIGHLIGHT_COMPANY ? 3 : 2}
                      dot={{ 
                        r: company === HIGHLIGHT_COMPANY ? 6 : 4, 
                        fill: company === HIGHLIGHT_COMPANY ? HIGHLIGHT_COLOR : COLORS[index % COLORS.length] 
                      }}
                      activeDot={{ r: company === HIGHLIGHT_COMPANY ? 8 : 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* SECTION: Застройщики */}
          <h2 style={styles.sectionTitle}>
            🏗️ Топ застройщиков
          </h2>
          
          <DataChart 
            data={currentDeveloperData}
            title={`${selectedCity} — ${selectedMonth} — ${selectedMetric.label}`}
            selectedMetric={selectedMetric}
            showDeveloper={false}
          />

          {/* SECTION: */}
          <h2 style={styles.sectionTitle}>
            🏠 Топ жилых комплексов
          </h2>
          
          <DataChart 
            data={currentResidentialData}
            title={`${selectedCity} — ${selectedMonth} — ${selectedMetric.label}`}
            selectedMetric={selectedMetric}
            showDeveloper={true}
          />
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
