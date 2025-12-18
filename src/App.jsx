import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';

// ========== КОНСТАНТЫ ==========
const HIGHLIGHT_COMPANY = 'Унистрой';
const HIGHLIGHT_COLOR = '#4ade80'; // Светло-зеленый для Унистрой

const MONTHS = ['Октябрь', 'Ноябрь'];
const CITIES = ['Казань', 'КА', 'Тольятти', 'Пермь'];
const METRICS = [
  { key: 'units', label: 'Доля в шт.', percentKey: 'unitsPercent', format: (v) => v.toLocaleString('ru-RU') },
  { key: 'sqm', label: 'Доля в м²', percentKey: 'sqmPercent', format: (v) => v.toLocaleString('ru-RU', { minimumFractionDigits: 1 }) + ' м²' },
  { key: 'rub', label: 'Доля в руб.', percentKey: 'rubPercent', format: (v) => (v / 1000000).toLocaleString('ru-RU', { minimumFractionDigits: 0 }) + ' млн ₽' },
];

const COLORS = [
  '#2563eb', '#dc2626', '#ca8a04', '#9333ea', '#0891b2', 
  '#be185d', '#ea580c', '#4f46e5', '#78716c', '#06b6d4',
  '#f59e0b', '#ec4899'
];

// ========== DATA: ЗАСТРОЙЩИКИ ==========
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
      { name: 'ПИК', units: 220, unitsPercent: 20.4, sqm: 8847.6, sqmPercent: 18.8, rub: 1885246826, rubPercent: 16.3 },
      { name: 'Суварстроит', units: 144, unitsPercent: 13.3, sqm: 5125.4, sqmPercent: 10.9, rub: 1159171186, rubPercent: 10.0 },
      { name: 'СЗ ТЕКТУМ-1', units: 84, unitsPercent: 7.8, sqm: 3178.6, sqmPercent: 6.8, rub: 761906263, rubPercent: 6.6 },
      { name: 'Унистрой', units: 80, unitsPercent: 7.4, sqm: 3569.3, sqmPercent: 7.6, rub: 958827993, rubPercent: 8.3 },
      { name: 'Самолет', units: 78, unitsPercent: 7.2, sqm: 3357.7, sqmPercent: 7.1, rub: 843127606, rubPercent: 7.3 },
      { name: 'КамаСтройИнвест', units: 70, unitsPercent: 6.5, sqm: 3742.3, sqmPercent: 8.0, rub: 978911737, rubPercent: 8.5 },
      { name: 'Ак Барс Дом', units: 63, unitsPercent: 5.8, sqm: 3067.5, sqmPercent: 6.5, rub: 762951772, rubPercent: 6.6 },
      { name: 'СМУ 88', units: 56, unitsPercent: 5.2, sqm: 2864.7, sqmPercent: 6.1, rub: 742284315, rubPercent: 6.4 },
      { name: 'КОМОССТРОЙ', units: 46, unitsPercent: 4.3, sqm: 1878.6, sqmPercent: 4.0, rub: 446226298, rubPercent: 3.9 },
      { name: 'ТСИ', units: 33, unitsPercent: 3.1, sqm: 1425.4, sqmPercent: 3.0, rub: 331733200, rubPercent: 2.9 },
    ],
  },
  'КА': {
    'Ноябрь': [
      { name: 'Суварстроит', units: 203, unitsPercent: 16.8, sqm: 7411, sqmPercent: 12.9, rub: 1691083829, rubPercent: 12.6 },
      { name: 'ПИК', units: 148, unitsPercent: 12.3, sqm: 5537, sqmPercent: 9.6, rub: 1320703569, rubPercent: 9.8 },
      { name: 'Ак Барс Дом', units: 111, unitsPercent: 9.2, sqm: 5123, sqmPercent: 8.9, rub: 1131010148, rubPercent: 8.4 },
      { name: 'ТСИ', units: 107, unitsPercent: 8.9, sqm: 4207, sqmPercent: 7.3, rub: 926164350, rubPercent: 6.9 },
      { name: 'Унистрой', units: 76, unitsPercent: 6.3, sqm: 3209, sqmPercent: 5.6, rub: 767455993, rubPercent: 5.7 },
      { name: 'КамаСтройИнвест', units: 72, unitsPercent: 6.0, sqm: 3346, sqmPercent: 5.8, rub: 944581426, rubPercent: 7.0 },
      { name: 'СМУ 88', units: 64, unitsPercent: 5.3, sqm: 3754, sqmPercent: 6.5, rub: 1062019312, rubPercent: 7.9 },
      { name: 'СЗ ТЕКТУМ-1', units: 64, unitsPercent: 5.3, sqm: 2607, sqmPercent: 4.5, rub: 619972007, rubPercent: 4.6 },
      { name: 'GloraX', units: 51, unitsPercent: 4.2, sqm: 2042, sqmPercent: 3.5, rub: 511636220, rubPercent: 3.8 },
      { name: 'КОМОССТРОЙ', units: 37, unitsPercent: 3.1, sqm: 1426, sqmPercent: 2.5, rub: 345518754, rubPercent: 2.6 },
    ],
    'Октябрь': [
      { name: 'ПИК', units: 220, unitsPercent: 16.6, sqm: 8847.6, sqmPercent: 15.4, rub: 1885246826, rubPercent: 14.0 },
      { name: 'Суварстроит', units: 178, unitsPercent: 13.4, sqm: 6527.3, sqmPercent: 11.3, rub: 1436877222, rubPercent: 10.7 },
      { name: 'Унистрой', units: 106, unitsPercent: 8.0, sqm: 4728.5, sqmPercent: 8.2, rub: 1151880466, rubPercent: 8.6 },
      { name: 'Ак Барс Дом', units: 102, unitsPercent: 7.7, sqm: 4824.0, sqmPercent: 8.4, rub: 1092602431, rubPercent: 8.1 },
      { name: 'СЗ ТЕКТУМ-1', units: 84, unitsPercent: 6.3, sqm: 3178.6, sqmPercent: 5.5, rub: 761906263, rubPercent: 5.7 },
      { name: 'Самолет', units: 78, unitsPercent: 5.9, sqm: 3357.7, sqmPercent: 5.8, rub: 843127606, rubPercent: 6.3 },
      { name: 'КамаСтройИнвест', units: 70, unitsPercent: 5.3, sqm: 3742.3, sqmPercent: 6.5, rub: 978911737, rubPercent: 7.3 },
      { name: 'ТСИ', units: 59, unitsPercent: 4.4, sqm: 2457.7, sqmPercent: 4.3, rub: 535297200, rubPercent: 4.0 },
      { name: 'СМУ 88', units: 56, unitsPercent: 4.2, sqm: 2864.7, sqmPercent: 5.0, rub: 742284315, rubPercent: 5.5 },
      { name: 'КОМОССТРОЙ', units: 46, unitsPercent: 3.5, sqm: 1878.6, sqmPercent: 3.3, rub: 446226298, rubPercent: 3.3 },
    ],
  },
  'Тольятти': {
    'Ноябрь': [
      { name: 'Лада-Дом', units: 74, unitsPercent: 52.9, sqm: 3253.2, sqmPercent: 46.0, rub: 493219808, rubPercent: 48.5 },
      { name: 'СЗ АДРЕС', units: 25, unitsPercent: 17.9, sqm: 1343.4, sqmPercent: 19.0, rub: 143510000, rubPercent: 14.1 },
      { name: 'СЗ СТРОЙ ДОМ', units: 18, unitsPercent: 12.9, sqm: 760.4, sqmPercent: 10.7, rub: 102507470, rubPercent: 10.1 },
      { name: 'Унистрой', units: 10, unitsPercent: 7.1, sqm: 491.9, sqmPercent: 6.9, rub: 77869166, rubPercent: 7.7 },
      { name: 'СЗ ПАРК', units: 8, unitsPercent: 5.7, sqm: 881.7, sqmPercent: 12.5, rub: 148294430, rubPercent: 14.6 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 3, unitsPercent: 2.1, sqm: 249.2, sqmPercent: 3.5, rub: 40256975, rubPercent: 4.0 },
      { name: 'СЗ ТАУРЕД', units: 2, unitsPercent: 1.4, sqm: 97.9, sqmPercent: 1.4, rub: 10309950, rubPercent: 1.0 },
    ],
    'Октябрь': [
      { name: 'Лада-Дом', units: 50, unitsPercent: 51.0, sqm: 2134.4, sqmPercent: 46.2, rub: 303714960, rubPercent: 44.3 },
      { name: 'Унистрой', units: 16, unitsPercent: 16.3, sqm: 734.5, sqmPercent: 15.9, rub: 113103556, rubPercent: 16.5 },
      { name: 'СЗ СТРОЙ ДОМ', units: 11, unitsPercent: 11.2, sqm: 496.3, sqmPercent: 10.7, rub: 66826220, rubPercent: 9.7 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 9, unitsPercent: 9.2, sqm: 542.4, sqmPercent: 11.7, rub: 98309785, rubPercent: 14.3 },
      { name: 'Криптострой', units: 4, unitsPercent: 4.1, sqm: 342.8, sqmPercent: 7.4, rub: 59335660, rubPercent: 8.7 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 4, unitsPercent: 4.1, sqm: 209.4, sqmPercent: 4.5, rub: 27942000, rubPercent: 4.1 },
      { name: 'СЗ ТАУРЕД', units: 3, unitsPercent: 3.1, sqm: 127.0, sqmPercent: 2.7, rub: 13250000, rubPercent: 1.9 },
      { name: 'СЗ АДРЕС', units: 1, unitsPercent: 1.0, sqm: 36.7, sqmPercent: 0.8, rub: 3374000, rubPercent: 0.5 },
    ],
  },
  'Пермь': {
    'Ноябрь': [
      { name: 'ПЗСП', units: 120, unitsPercent: 18.5, sqm: 5200.0, sqmPercent: 17.0, rub: 780000000, rubPercent: 16.5 },
      { name: 'Девелопмент-Юг', units: 95, unitsPercent: 14.6, sqm: 4100.0, sqmPercent: 13.4, rub: 640000000, rubPercent: 13.5 },
      { name: 'ПМД', units: 78, unitsPercent: 12.0, sqm: 3500.0, sqmPercent: 11.4, rub: 530000000, rubPercent: 11.2 },
      { name: 'Застройщик М', units: 65, unitsPercent: 10.0, sqm: 3000.0, sqmPercent: 9.8, rub: 480000000, rubPercent: 10.1 },
      { name: 'СтройПанельКомплект', units: 55, unitsPercent: 8.5, sqm: 2600.0, sqmPercent: 8.5, rub: 400000000, rubPercent: 8.5 },
      { name: 'ОНИКС', units: 48, unitsPercent: 7.4, sqm: 2200.0, sqmPercent: 7.2, rub: 340000000, rubPercent: 7.2 },
      { name: 'Железно', units: 42, unitsPercent: 6.5, sqm: 1900.0, sqmPercent: 6.2, rub: 290000000, rubPercent: 6.1 },
      { name: 'ИНГРУПП', units: 35, unitsPercent: 5.4, sqm: 1600.0, sqmPercent: 5.2, rub: 245000000, rubPercent: 5.2 },
      { name: 'СЗ ИНТЭСКА-СЗ', units: 28, unitsPercent: 4.3, sqm: 1300.0, sqmPercent: 4.2, rub: 200000000, rubPercent: 4.2 },
      { name: 'Строительная компания', units: 22, unitsPercent: 3.4, sqm: 1000.0, sqmPercent: 3.3, rub: 155000000, rubPercent: 3.3 },
    ],
    'Октябрь': [
      { name: 'ПЗСП', units: 115, unitsPercent: 18.0, sqm: 5000.0, sqmPercent: 16.5, rub: 750000000, rubPercent: 16.0 },
      { name: 'Девелопмент-Юг', units: 92, unitsPercent: 14.4, sqm: 4000.0, sqmPercent: 13.2, rub: 620000000, rubPercent: 13.2 },
      { name: 'ПМД', units: 75, unitsPercent: 11.7, sqm: 3400.0, sqmPercent: 11.2, rub: 515000000, rubPercent: 11.0 },
      { name: 'Застройщик М', units: 62, unitsPercent: 9.7, sqm: 2900.0, sqmPercent: 9.6, rub: 460000000, rubPercent: 9.8 },
      { name: 'СтройПанельКомплект', units: 52, unitsPercent: 8.1, sqm: 2500.0, sqmPercent: 8.3, rub: 385000000, rubPercent: 8.2 },
      { name: 'ОНИКС', units: 45, unitsPercent: 7.0, sqm: 2100.0, sqmPercent: 6.9, rub: 325000000, rubPercent: 6.9 },
      { name: 'Железно', units: 40, unitsPercent: 6.3, sqm: 1850.0, sqmPercent: 6.1, rub: 280000000, rubPercent: 6.0 },
      { name: 'ИНГРУПП', units: 33, unitsPercent: 5.2, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 },
      { name: 'Строительная компания', units: 26, unitsPercent: 4.1, sqm: 1200.0, sqmPercent: 4.0, rub: 185000000, rubPercent: 3.9 },
      { name: 'Пермглавснаб', units: 20, unitsPercent: 3.1, sqm: 950.0, sqmPercent: 3.1, rub: 145000000, rubPercent: 3.1 },
    ],
  },
};

// ========== DATA: ЖК ==========
const residentialData = {
  'Казань': {
    'Ноябрь': [
      { name: 'Батталовский', units: 114, unitsPercent: 11.5, sqm: 3778.5, sqmPercent: 9.1, rub: 935580400, rubPercent: 8.9 },
      { name: 'Сиберово', units: 69, unitsPercent: 7.0, sqm: 2515.3, sqmPercent: 6.1, rub: 604504625, rubPercent: 5.7 },
      { name: 'Феномен будущего', units: 64, unitsPercent: 6.5, sqm: 2606.6, sqmPercent: 6.3, rub: 619972007, rubPercent: 5.9 },
      { name: 'Мой ритм', units: 55, unitsPercent: 5.6, sqm: 2470.8, sqmPercent: 6.0, rub: 634762905, rubPercent: 6.0 },
      { name: 'Сказочный лес', units: 47, unitsPercent: 4.8, sqm: 2126.1, sqmPercent: 5.1, rub: 421854000, rubPercent: 4.0 },
      { name: 'Матюшино парк', units: 36, unitsPercent: 3.6, sqm: 1250.0, sqmPercent: 3.0, rub: 236057129, rubPercent: 2.2 },
      { name: 'GloraX Урицкого', units: 33, unitsPercent: 3.3, sqm: 1334.5, sqmPercent: 3.2, rub: 342997378, rubPercent: 3.3 },
      { name: 'Унай', units: 27, unitsPercent: 2.7, sqm: 961.6, sqmPercent: 2.3, rub: 257407752, rubPercent: 2.4 },
      { name: 'TERRA', units: 24, unitsPercent: 2.4, sqm: 754.9, sqmPercent: 1.8, rub: 115352885, rubPercent: 1.1 },
      { name: 'Оригана', units: 23, unitsPercent: 2.3, sqm: 808.2, sqmPercent: 2.0, rub: 216252040, rubPercent: 2.1 },
    ],
    'Октябрь': [
      { name: 'Сиберово', units: 87, unitsPercent: 8.1, sqm: 3370.1, sqmPercent: 7.2, rub: 760334959, rubPercent: 6.6 },
      { name: 'Феномен будущего', units: 84, unitsPercent: 7.8, sqm: 3178.6, sqmPercent: 6.8, rub: 761906263, rubPercent: 6.6 },
      { name: 'Батталовский', units: 64, unitsPercent: 5.9, sqm: 2132.4, sqmPercent: 4.5, rub: 527524320, rubPercent: 4.6 },
      { name: 'Мой ритм', units: 62, unitsPercent: 5.7, sqm: 3002.8, sqmPercent: 6.4, rub: 739408650, rubPercent: 6.4 },
      { name: 'Матюшино парк', units: 62, unitsPercent: 5.7, sqm: 2285.5, sqmPercent: 4.9, rub: 383758861, rubPercent: 3.3 },
      { name: 'Сказочный лес', units: 53, unitsPercent: 4.9, sqm: 2229.3, sqmPercent: 4.7, rub: 454934178, rubPercent: 3.9 },
      { name: 'Manzara Towers', units: 46, unitsPercent: 4.3, sqm: 2167.8, sqmPercent: 4.6, rub: 516041161, rubPercent: 4.5 },
      { name: 'Нокса Парк', units: 38, unitsPercent: 3.5, sqm: 1822.2, sqmPercent: 3.9, rub: 356327325, rubPercent: 3.1 },
      { name: 'Главные роли', units: 32, unitsPercent: 3.0, sqm: 1585.9, sqmPercent: 3.4, rub: 274316932, rubPercent: 2.4 },
      { name: 'Зилант Премьер', units: 32, unitsPercent: 3.0, sqm: 1189.9, sqmPercent: 2.5, rub: 327086445, rubPercent: 2.8 },
    ],
  },
  'КА': {
    'Ноябрь': [
      { name: 'Батталовский', units: 114, unitsPercent: 9.4, sqm: 3778.5, sqmPercent: 7.5, rub: 935580400, rubPercent: 7.7 },
      { name: 'Сиберово', units: 69, unitsPercent: 5.7, sqm: 2515.3, sqmPercent: 5.0, rub: 604504625, rubPercent: 5.0 },
      { name: 'Феномен будущего', units: 64, unitsPercent: 5.3, sqm: 2606.6, sqmPercent: 5.2, rub: 619972007, rubPercent: 5.1 },
      { name: 'Новый Свет', units: 56, unitsPercent: 4.6, sqm: 2652.6, sqmPercent: 5.3, rub: 496247243, rubPercent: 4.1 },
      { name: 'Мой ритм', units: 55, unitsPercent: 4.6, sqm: 2470.8, sqmPercent: 4.9, rub: 634762905, rubPercent: 5.2 },
      { name: 'Сказочный лес', units: 47, unitsPercent: 3.9, sqm: 2126.1, sqmPercent: 4.2, rub: 421854000, rubPercent: 3.5 },
      { name: 'Радужный-2', units: 45, unitsPercent: 3.7, sqm: 1872.9, sqmPercent: 3.7, rub: 359823000, rubPercent: 3.0 },
      { name: 'Матюшино парк', units: 36, unitsPercent: 3.0, sqm: 1250.0, sqmPercent: 2.5, rub: 236057129, rubPercent: 1.9 },
      { name: 'Васильевский остров', units: 34, unitsPercent: 2.8, sqm: 1077.6, sqmPercent: 2.1, rub: 234147967, rubPercent: 1.9 },
      { name: 'GloraX Урицкого', units: 33, unitsPercent: 2.7, sqm: 1334.5, sqmPercent: 2.7, rub: 342997378, rubPercent: 2.8 },
    ],
    'Октябрь': [
      { name: 'Сиберово', units: 87, unitsPercent: 6.6, sqm: 3370.1, sqmPercent: 5.9, rub: 760334959, rubPercent: 5.7 },
      { name: 'Феномен будущего', units: 84, unitsPercent: 6.3, sqm: 3178.6, sqmPercent: 5.5, rub: 761906263, rubPercent: 5.7 },
      { name: 'Батталовский', units: 64, unitsPercent: 4.8, sqm: 2132.4, sqmPercent: 3.7, rub: 527524320, rubPercent: 3.9 },
      { name: 'Мой ритм', units: 62, unitsPercent: 4.7, sqm: 3002.8, sqmPercent: 5.2, rub: 739408650, rubPercent: 5.5 },
      { name: 'Матюшино парк', units: 62, unitsPercent: 4.7, sqm: 2285.5, sqmPercent: 4.0, rub: 383758861, rubPercent: 2.9 },
      { name: 'Сказочный лес', units: 53, unitsPercent: 4.0, sqm: 2229.3, sqmPercent: 3.9, rub: 454934178, rubPercent: 3.4 },
      { name: 'Manzara Towers', units: 46, unitsPercent: 3.5, sqm: 2167.8, sqmPercent: 3.8, rub: 516041161, rubPercent: 3.8 },
      { name: 'Новый Свет', units: 39, unitsPercent: 2.9, sqm: 1756.5, sqmPercent: 3.0, rub: 329650659, rubPercent: 2.5 },
      { name: 'Нокса Парк', units: 38, unitsPercent: 2.9, sqm: 1822.2, sqmPercent: 3.2, rub: 356327325, rubPercent: 2.6 },
      { name: 'Васильевский остров', units: 35, unitsPercent: 2.6, sqm: 1430.3, sqmPercent: 2.5, rub: 261902741, rubPercent: 1.9 },
    ],
  },
  'Тольятти': {
    'Ноябрь': [
      { name: 'ЁЛКИPARK', units: 70, unitsPercent: 50.0, sqm: 3041.6, sqmPercent: 43.0, rub: 463105679, rubPercent: 45.6 },
      { name: 'Лесная 56А', units: 25, unitsPercent: 17.9, sqm: 1343.4, sqmPercent: 19.0, rub: 143510000, rubPercent: 14.1 },
      { name: 'Юго-Западный', units: 18, unitsPercent: 12.9, sqm: 760.4, sqmPercent: 10.7, rub: 102507470, rubPercent: 10.1 },
      { name: 'Status Park', units: 8, unitsPercent: 5.7, sqm: 881.7, sqmPercent: 12.5, rub: 148294430, rubPercent: 14.6 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 6, unitsPercent: 4.3, sqm: 247.7, sqmPercent: 3.5, rub: 38154890, rubPercent: 3.8 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 4, unitsPercent: 2.9, sqm: 244.2, sqmPercent: 3.5, rub: 39714276, rubPercent: 3.9 },
      { name: 'Булгаков', units: 4, unitsPercent: 2.9, sqm: 211.6, sqmPercent: 3.0, rub: 30114129, rubPercent: 3.0 },
      { name: 'Парус', units: 3, unitsPercent: 2.1, sqm: 249.2, sqmPercent: 3.5, rub: 40256975, rubPercent: 4.0 },
      { name: 'Проспект Московский', units: 2, unitsPercent: 1.4, sqm: 97.9, sqmPercent: 1.4, rub: 10309950, rubPercent: 1.0 },
    ],
    'Октябрь': [
      { name: 'ЁЛКИPARK', units: 45, unitsPercent: 45.9, sqm: 1985.3, sqmPercent: 42.9, rub: 281123560, rubPercent: 41.0 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 12, unitsPercent: 12.2, sqm: 530.3, sqmPercent: 11.5, rub: 80722716, rubPercent: 11.8 },
      { name: 'Юго-Западный', units: 11, unitsPercent: 11.2, sqm: 496.3, sqmPercent: 10.7, rub: 66826220, rubPercent: 9.7 },
      { name: 'Парус', units: 9, unitsPercent: 9.2, sqm: 542.4, sqmPercent: 11.7, rub: 98309785, rubPercent: 14.3 },
      { name: 'Булгаков', units: 5, unitsPercent: 5.1, sqm: 149.1, sqmPercent: 3.2, rub: 22591400, rubPercent: 3.3 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 4, unitsPercent: 4.1, sqm: 204.2, sqmPercent: 4.4, rub: 32380840, rubPercent: 4.7 },
      { name: 'Квартал 18', units: 4, unitsPercent: 4.1, sqm: 209.4, sqmPercent: 4.5, rub: 27942000, rubPercent: 4.1 },
      { name: 'Status Park', units: 4, unitsPercent: 4.1, sqm: 342.8, sqmPercent: 7.4, rub: 59335660, rubPercent: 8.7 },
      { name: 'Проспект Московский', units: 3, unitsPercent: 3.1, sqm: 127.0, sqmPercent: 2.7, rub: 13250000, rubPercent: 1.9 },
      { name: 'Лесная 56А', units: 1, unitsPercent: 1.0, sqm: 36.7, sqmPercent: 0.8, rub: 3374000, rubPercent: 0.5 },
    ],
  },
  'Пермь': {
    'Ноябрь': [
      { name: 'Красное яблоко', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 },
      { name: 'Медовый', units: 30, unitsPercent: 4.6, sqm: 1300.0, sqmPercent: 4.2, rub: 205000000, rubPercent: 4.3 },
      { name: 'Камаполис', units: 28, unitsPercent: 4.3, sqm: 1260.0, sqmPercent: 4.1, rub: 190000000, rubPercent: 4.0 },
      { name: 'QUATRO', units: 25, unitsPercent: 3.8, sqm: 1150.0, sqmPercent: 3.8, rub: 185000000, rubPercent: 3.9 },
      { name: 'Моменты', units: 22, unitsPercent: 3.4, sqm: 1000.0, sqmPercent: 3.3, rub: 160000000, rubPercent: 3.4 },
      { name: 'Мир', units: 20, unitsPercent: 3.1, sqm: 920.0, sqmPercent: 3.0, rub: 145000000, rubPercent: 3.1 },
      { name: 'Новый Парковый', units: 18, unitsPercent: 2.8, sqm: 820.0, sqmPercent: 2.7, rub: 130000000, rubPercent: 2.8 },
      { name: 'Ижевская 38', units: 16, unitsPercent: 2.5, sqm: 740.0, sqmPercent: 2.4, rub: 115000000, rubPercent: 2.4 },
      { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 },
      { name: 'Юг на Беляева', units: 12, unitsPercent: 1.8, sqm: 560.0, sqmPercent: 1.8, rub: 85000000, rubPercent: 1.8 },
    ],
    'Октябрь': [
      { name: 'Красное яблоко', units: 33, unitsPercent: 5.2, sqm: 1480.0, sqmPercent: 4.9, rub: 225000000, rubPercent: 4.8 },
      { name: 'Медовый', units: 28, unitsPercent: 4.4, sqm: 1250.0, sqmPercent: 4.1, rub: 195000000, rubPercent: 4.2 },
      { name: 'Камаполис', units: 26, unitsPercent: 4.1, sqm: 1180.0, sqmPercent: 3.9, rub: 180000000, rubPercent: 3.8 },
      { name: 'QUATRO', units: 24, unitsPercent: 3.8, sqm: 1100.0, sqmPercent: 3.6, rub: 175000000, rubPercent: 3.7 },
      { name: 'Моменты', units: 20, unitsPercent: 3.1, sqm: 920.0, sqmPercent: 3.0, rub: 145000000, rubPercent: 3.1 },
      { name: 'Мир', units: 18, unitsPercent: 2.8, sqm: 840.0, sqmPercent: 2.8, rub: 130000000, rubPercent: 2.8 },
      { name: 'Новый Парковый', units: 16, unitsPercent: 2.5, sqm: 750.0, sqmPercent: 2.5, rub: 115000000, rubPercent: 2.5 },
      { name: 'Ижевская 38', units: 14, unitsPercent: 2.2, sqm: 660.0, sqmPercent: 2.2, rub: 100000000, rubPercent: 2.1 },
      { name: 'Причал', developer: 'Унистрой', units: 12, unitsPercent: 1.9, sqm: 560.0, sqmPercent: 1.8, rub: 85000000, rubPercent: 1.8 },
      { name: 'Мотовилихинский', units: 10, unitsPercent: 1.6, sqm: 470.0, sqmPercent: 1.5, rub: 72000000, rubPercent: 1.5 },
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
    borderBottom: '1px solid rgba(74, 222, 128, 0.2)',
    background: 'rgba(74, 222, 128, 0.08)',
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

// Компонент графика - выделяем Унистрой и его объекты
const DataChart = ({ data, title, selectedMetric }) => {
  const isHighlighted = (item) => item.name === HIGHLIGHT_COMPANY || item.developer === HIGHLIGHT_COMPANY;

  return (
    <div style={styles.chartCard}>
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
                    boxShadow: highlighted ? '0 0 20px rgba(74, 222, 128, 0.3)' : '0 10px 40px rgba(0,0,0,0.3)',
                  }}>
                    <p style={{ fontWeight: '600', marginBottom: '8px', color: highlighted ? '#4ade80' : '#f1f5f9' }}>
                      {item.name}
                    </p>
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
            <th style={styles.tableHeader}>{title}</th>
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
                    <span style={{ ...styles.colorDot, background: color, boxShadow: highlighted ? '0 0 8px rgba(74, 222, 128, 0.5)' : 'none' }} />
                    {item.name}
                  </div>
                </td>
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
                        boxShadow: highlighted ? '0 0 8px rgba(74, 222, 128, 0.5)' : 'none',
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
        companies.add(item.name);
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
        companies.add(item.name);
      });
    });
    return Array.from(companies).slice(0, 10);
  }, [selectedCity]);

  return (
    <div>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>Доля рынка by Унистрой 2025</div>
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
            Динамика
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
            Топ застройщиков
          </h2>
          
          <DataChart 
            data={currentDeveloperData}
            title="Застройщик"
            selectedMetric={selectedMetric}
          />

          {/* SECTION: ЖК */}
          <h2 style={styles.sectionTitle}>
            Топ жилых комплексов
          </h2>
          
          <DataChart 
            data={currentResidentialData}
            title="ЖК"
            selectedMetric={selectedMetric}
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
