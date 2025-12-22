import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts';

const HIGHLIGHT_COLOR = '#22c55e';
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь'];
const CITIES = ['Казань', 'КА', 'Тольятти', 'Пермь'];
const METRICS = [
  { key: 'units', label: 'Доля в шт.', percentKey: 'unitsPercent', format: (v) => v.toLocaleString('ru-RU') },
  { key: 'sqm', label: 'Доля в м²', percentKey: 'sqmPercent', format: (v) => v.toLocaleString('ru-RU', { minimumFractionDigits: 1 }) + ' м²' },
  { key: 'rub', label: 'Доля в руб.', percentKey: 'rubPercent', format: (v) => (v / 1000000).toLocaleString('ru-RU', { minimumFractionDigits: 0 }) + ' млн ₽' },
];
const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#6366f1', '#14b8a6', '#a855f7', '#0ea5e9', '#64748b'];

const isHighlighted = (item) => item.name === 'Унистрой' || item.developer === 'Унистрой';

// ========== ДАННЫЕ ЗАСТРОЙЩИКОВ ==========
const developerData = {
  'Казань': {
    'Январь': [
      { name: 'ПИК', units: 88, unitsPercent: 16.3, sqm: 4058.6, sqmPercent: 11.5, rub: 722757875, rubPercent: 15.6 },
      { name: 'Суварстроит', units: 80, unitsPercent: 14.8, sqm: 2647.8, sqmPercent: 9.8, rub: 615284862, rubPercent: 10.2 },
      { name: 'СМУ 88', units: 66, unitsPercent: 12.2, sqm: 3782.2, sqmPercent: 14.1, rub: 881756393, rubPercent: 14.5 },
      { name: 'Ак Барс Дом', units: 46, unitsPercent: 8.5, sqm: 2206.9, sqmPercent: 7.7, rub: 479279435, rubPercent: 8.5 },
      { name: 'КамаСтройИнвест', units: 40, unitsPercent: 7.4, sqm: 2394.1, sqmPercent: 9.5, rub: 592135396, rubPercent: 9.2 },
      { name: 'Унистрой', units: 31, unitsPercent: 5.7, sqm: 1491.8, sqmPercent: 4.7, rub: 295218734, rubPercent: 5.7 },
      { name: 'GloraX', units: 30, unitsPercent: 5.5, sqm: 1133., sqmPerce7nt: 3.7, rub: 229633546, rubPercent: 4.3 },
      { name: 'ТСИ', units: 30, unitsPercent: 5.5, sqm: 1182.6, sqmPercent: 3.8, rub: 235696900, rubPercent: 4.5 },
      { name: 'СЗ Заря', units: 20, unitsPercent: 3.7, sqm: 1455.0, sqmPercent: 13.0, rub: 812991111, rubPercent: 5.6 },
      { name: 'Эталон', units: 17, unitsPercent: 3.1, sqm: 1182.6, sqmPercent: 4.0, rub: 251510623, rubPercent: 3.2 },

    ],
    'Февраль': [
      { name: 'ПИК', units: 133, unitsPercent: 16.6, sqm: 5238.7, sqmPercent: 13.6, rub: 1054494773, rubPercent: 10.9 },
      { name: 'СМУ 88', units: 101, unitsPercent: 12.6, sqm: 5806.6, sqmPercent: 15.1, rub: 1348826261, rubPercent: 14.0 },
      { name: 'Самолет', units: 77, unitsPercent: 9.6, sqm: 2814.9, sqmPercent: 7.3, rub: 735033893, rubPercent: 7.6 },
      { name: 'Ак Барс Дом', units: 71, unitsPercent: 8.9, sqm: 3733.9, sqmPercent: 9.7, rub: 822627110, rubPercent: 8.5 },
      { name: 'Унистрой', units: 65, unitsPercent: 8.1, sqm: 3449.2, sqmPercent: 9.0, rub: 748171549, rubPercent: 7.7 },
      { name: 'КамаСтройИнвест', units: 61, unitsPercent: 7.6, sqm: 3129.6, sqmPercent: 8.1, rub: 872817425, rubPercent: 9.0 },
      { name: 'Суварстроит', units: 55, unitsPercent: 6.9, sqm: 2266.6, sqmPercent: 5.9, rub: 499081593, rubPercent: 5.2 },
      { name: 'GloraX', units: 39, unitsPercent: 4.9, sqm: 1550.2, sqmPercent: 4.0, rub: 315369759, rubPercent: 3.3 },
      { name: 'СЗ Заря', units: 20, unitsPercent: 3.7, sqm: 1455.0, sqmPercent: 13.0, rub: 812991111, rubPercent: 5.6 },
      { name: 'Эталон', units: 17, unitsPercent: 3.1, sqm: 1182.6, sqmPercent: 4.0, rub: 251510623, rubPercent: 3.2 },
    ],
    'Март': [
      { name: 'ПИК', units: 172, unitsPercent: 21.7, sqm: 6684.7, sqmPercent: 19.0, rub: 1293047249, rubPercent: 15.1 },
      { name: 'Ак Барс Дом', units: 113, unitsPercent: 14.3, sqm: 5218.7, sqmPercent: 14.9, rub: 1204116758, rubPercent: 14.1 },
      { name: 'КамаСтройИнвест', units: 68, unitsPercent: 8.6, sqm: 3292.8, sqmPercent: 9.4, rub: 872024355, rubPercent: 10.2 },
      { name: 'Суварстроит', units: 61, unitsPercent: 7.7, sqm: 2093.3, sqmPercent: 6.0, rub: 506007420, rubPercent: 5.9 },
      { name: 'КОМОССТРОЙ', units: 51, unitsPercent: 6.4, sqm: 2133.7, sqmPercent: 6.1, rub: 458542768, rubPercent: 5.4 },
      { name: 'СМУ 88', units: 41, unitsPercent: 5.2, sqm: 2716.5, sqmPercent: 7.7, rub: 702135307, rubPercent: 8.2 },
      { name: 'Унистрой', units: 40, unitsPercent: 5.1, sqm: 2014.8, sqmPercent: 5.7, rub: 473311603, rubPercent: 5.5 },
      { name: 'GloraX', units: 36, unitsPercent: 4.6, sqm: 1395.2, sqmPercent: 4.0, rub: 291196736, rubPercent: 3.4 },
      { name: 'СЗ Заря', units: 20, unitsPercent: 3.7, sqm: 1455.0, sqmPercent: 13.0, rub: 812991111, rubPercent: 5.6 },
      { name: 'Эталон', units: 17, unitsPercent: 3.1, sqm: 1182.6, sqmPercent: 4.0, rub: 251510623, rubPercent: 3.2 },
    ],
    'Апрель': [
      { name: 'ПИК', units: 166, unitsPercent: 24.4, sqm: 6658.2, sqmPercent: 22.1, rub: 1352158057, rubPercent: 18.5 },
      { name: 'Суварстроит', units: 78, unitsPercent: 11.5, sqm: 2957.4, sqmPercent: 9.8, rub: 647908717, rubPercent: 8.9 },
      { name: 'КамаСтройИнвест', units: 60, unitsPercent: 8.8, sqm: 3002.5, sqmPercent: 10.0, rub: 882113329, rubPercent: 12.1 },
      { name: 'Ак Барс Дом', units: 58, unitsPercent: 8.5, sqm: 2993.4, sqmPercent: 9.9, rub: 678788337, rubPercent: 9.3 },
      { name: 'ТСИ', units: 48, unitsPercent: 7.1, sqm: 1837.2, sqmPercent: 6.1, rub: 413888000, rubPercent: 5.7 },
      { name: 'Унистрой', units: 39, unitsPercent: 5.7, sqm: 1864.0, sqmPercent: 6.2, rub: 467822163, rubPercent: 6.4 },
      { name: 'СМУ 88', units: 29, unitsPercent: 4.3, sqm: 1652.6, sqmPercent: 5.5, rub: 428706224, rubPercent: 5.9 },
      { name: 'GloraX', units: 27, unitsPercent: 4.0, sqm: 1045.1, sqmPercent: 3.5, rub: 231848537, rubPercent: 3.2 },
    ],
    'Май': [
      { name: 'ПИК', units: 109, unitsPercent: 18.3, sqm: 4662.8, sqmPercent: 17.8, rub: 954063460, rubPercent: 14.2 },
      { name: 'КамаСтройИнвест', units: 66, unitsPercent: 11.1, sqm: 2845.5, sqmPercent: 10.8, rub: 783826442, rubPercent: 11.6 },
      { name: 'Ак Барс Дом', units: 58, unitsPercent: 9.7, sqm: 2671.6, sqmPercent: 10.2, rub: 632438822, rubPercent: 9.4 },
      { name: 'Суварстроит', units: 54, unitsPercent: 9.1, sqm: 2178.9, sqmPercent: 8.3, rub: 596679243, rubPercent: 8.9 },
      { name: 'Унистрой', units: 52, unitsPercent: 8.7, sqm: 2237.1, sqmPercent: 8.5, rub: 550736375, rubPercent: 8.2 },
      { name: 'ТСИ', units: 48, unitsPercent: 8.1, sqm: 2076.8, sqmPercent: 7.9, rub: 454633300, rubPercent: 6.8 },
      { name: 'СМУ 88', units: 27, unitsPercent: 4.5, sqm: 1421.7, sqmPercent: 5.4, rub: 339957411, rubPercent: 5.0 },
      { name: 'GloraX', units: 25, unitsPercent: 4.2, sqm: 1032.5, sqmPercent: 3.9, rub: 220265539, rubPercent: 3.3 },
    ],
    'Июнь': [
      { name: 'ПИК', units: 139, unitsPercent: 22.4, sqm: 5515.8, sqmPercent: 21.1, rub: 1243638256, rubPercent: 19.0 },
      { name: 'КамаСтройИнвест', units: 80, unitsPercent: 12.9, sqm: 3391.1, sqmPercent: 13.0, rub: 868430742, rubPercent: 13.3 },
      { name: 'Унистрой', units: 75, unitsPercent: 12.1, sqm: 2730.4, sqmPercent: 10.5, rub: 705202747, rubPercent: 10.8 },
      { name: 'Ак Барс Дом', units: 66, unitsPercent: 10.6, sqm: 2852.4, sqmPercent: 10.9, rub: 674835229, rubPercent: 10.3 },
      { name: 'Суварстроит', units: 34, unitsPercent: 5.5, sqm: 1317.9, sqmPercent: 5.0, rub: 369824764, rubPercent: 5.7 },
      { name: 'СМУ 88', units: 29, unitsPercent: 4.7, sqm: 1450.0, sqmPercent: 5.6, rub: 339248618, rubPercent: 5.2 },
      { name: 'GloraX', units: 22, unitsPercent: 3.5, sqm: 937.5, sqmPercent: 3.6, rub: 201019136, rubPercent: 3.1 },
      { name: 'ТСИ', units: 18, unitsPercent: 2.9, sqm: 820.1, sqmPercent: 3.1, rub: 174132600, rubPercent: 2.7 },
    ],
    'Июль': [
      { name: 'ПИК', units: 149, unitsPercent: 19.0, sqm: 5940.5, sqmPercent: 17.4, rub: 1195827244, rubPercent: 14.7 },
      { name: 'Унистрой', units: 110, unitsPercent: 14.0, sqm: 4533.1, sqmPercent: 13.3, rub: 1077955004, rubPercent: 13.2 },
      { name: 'Ак Барс Дом', units: 109, unitsPercent: 13.9, sqm: 4709.7, sqmPercent: 13.8, rub: 1142150561, rubPercent: 14.0 },
      { name: 'КамаСтройИнвест', units: 78, unitsPercent: 9.9, sqm: 3809.5, sqmPercent: 11.2, rub: 996490640, rubPercent: 12.2 },
      { name: 'Суварстроит', units: 50, unitsPercent: 6.4, sqm: 1658.1, sqmPercent: 4.9, rub: 342599092, rubPercent: 4.2 },
      { name: 'СМУ 88', units: 37, unitsPercent: 4.7, sqm: 1710.7, sqmPercent: 5.0, rub: 410135675, rubPercent: 5.0 },
      { name: 'GloraX', units: 26, unitsPercent: 3.3, sqm: 1045.3, sqmPercent: 3.1, rub: 244380671, rubPercent: 3.0 },
      { name: 'ТСИ', units: 24, unitsPercent: 3.1, sqm: 916.4, sqmPercent: 2.7, rub: 230078300, rubPercent: 2.8 },
    ],
    'Август': [
      { name: 'ПИК', units: 149, unitsPercent: 19.8, sqm: 5921.8, sqmPercent: 17.1, rub: 1247568565, rubPercent: 14.5 },
      { name: 'Унистрой', units: 106, unitsPercent: 14.1, sqm: 4907.3, sqmPercent: 14.2, rub: 1257596805, rubPercent: 14.6 },
      { name: 'Ак Барс Дом', units: 102, unitsPercent: 13.6, sqm: 4596.8, sqmPercent: 13.3, rub: 1074262401, rubPercent: 12.4 },
      { name: 'КамаСтройИнвест', units: 73, unitsPercent: 9.7, sqm: 3876.8, sqmPercent: 11.2, rub: 1048887568, rubPercent: 12.2 },
      { name: 'Суварстроит', units: 65, unitsPercent: 8.7, sqm: 2734.3, sqmPercent: 7.9, rub: 663538214, rubPercent: 7.7 },
      { name: 'СМУ 88', units: 42, unitsPercent: 5.6, sqm: 2169.9, sqmPercent: 6.3, rub: 589913639, rubPercent: 6.8 },
      { name: 'GloraX', units: 27, unitsPercent: 3.6, sqm: 1252.3, sqmPercent: 3.6, rub: 268038267, rubPercent: 3.1 },
      { name: 'ТСИ', units: 21, unitsPercent: 2.8, sqm: 931.1, sqmPercent: 2.7, rub: 217291200, rubPercent: 2.5 },
    ],
    'Сентябрь': [
      { name: 'ПИК', units: 176, unitsPercent: 19.5, sqm: 6920.7, sqmPercent: 17.2, rub: 1492235520, rubPercent: 14.8 },
      { name: 'Суварстроит', units: 156, unitsPercent: 17.3, sqm: 5364.0, sqmPercent: 13.4, rub: 1269930124, rubPercent: 12.6 },
      { name: 'Унистрой', units: 81, unitsPercent: 9.0, sqm: 3516.1, sqmPercent: 8.8, rub: 886565935, rubPercent: 8.8 },
      { name: 'СМУ 88', units: 70, unitsPercent: 7.7, sqm: 3865.2, sqmPercent: 9.6, rub: 1013149006, rubPercent: 10.1 },
      { name: 'КамаСтройИнвест', units: 57, unitsPercent: 6.3, sqm: 2754.8, sqmPercent: 6.9, rub: 741851670, rubPercent: 7.4 },
      { name: 'Ак Барс Дом', units: 52, unitsPercent: 5.8, sqm: 2577.2, sqmPercent: 6.4, rub: 640045100, rubPercent: 6.4 },
      { name: 'Самолет', units: 47, unitsPercent: 5.2, sqm: 2166.9, sqmPercent: 5.4, rub: 508095007, rubPercent: 5.0 },
      { name: 'GloraX', units: 29, unitsPercent: 3.2, sqm: 1332.1, sqmPercent: 3.3, rub: 289190123, rubPercent: 2.9 },
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
    ],
    'Ноябрь': [
      { name: 'Суварстроит', units: 203, unitsPercent: 20.5, sqm: 7411.2, sqmPercent: 17.9, rub: 1691083829, rubPercent: 16.1 },
      { name: 'ПИК', units: 148, unitsPercent: 15.0, sqm: 5537.0, sqmPercent: 13.4, rub: 1320703569, rubPercent: 12.5 },
      { name: 'КамаСтройИнвест', units: 72, unitsPercent: 7.3, sqm: 3346.0, sqmPercent: 8.1, rub: 944581426, rubPercent: 9.0 },
      { name: 'СМУ 88', units: 64, unitsPercent: 6.5, sqm: 3754.1, sqmPercent: 9.1, rub: 1062019312, rubPercent: 10.1 },
      { name: 'СЗ ТЕКТУМ-1', units: 64, unitsPercent: 6.5, sqm: 2606.6, sqmPercent: 6.3, rub: 619972007, rubPercent: 5.9 },
      { name: 'ТСИ', units: 62, unitsPercent: 6.3, sqm: 2334.1, sqmPercent: 5.6, rub: 566341350, rubPercent: 5.4 },
      { name: 'Ак Барс Дом', units: 55, unitsPercent: 5.6, sqm: 2470.8, sqmPercent: 6.0, rub: 634762905, rubPercent: 6.0 },
      { name: 'Унистрой', units: 51, unitsPercent: 5.2, sqm: 2187.9, sqmPercent: 5.3, rub: 601388506, rubPercent: 5.7 },
    ],
  },
  'КА': {
    'Январь': [
      { name: 'ПИК', units: 88, unitsPercent: 16.3, sqm: 4058.6, sqmPercent: 15.6, rub: 722757875, rubPercent: 11.5 },
      { name: 'Суварстроит', units: 80, unitsPercent: 14.8, sqm: 2647.8, sqmPercent: 10.2, rub: 615284862, rubPercent: 9.8 },
      { name: 'СМУ 88', units: 66, unitsPercent: 12.2, sqm: 3782.2, sqmPercent: 14.5, rub: 881756393, rubPercent: 14.1 },
      { name: 'Ак Барс Дом', units: 46, unitsPercent: 8.5, sqm: 2206.9, sqmPercent: 8.5, rub: 479279435, rubPercent: 7.7 },
      { name: 'КамаСтройИнвест', units: 40, unitsPercent: 7.4, sqm: 2394.1, sqmPercent: 9.2, rub: 592135396, rubPercent: 9.5 },
      { name: 'Унистрой', units: 31, unitsPercent: 5.7, sqm: 1491.8, sqmPercent: 5.7, rub: 295218734, rubPercent: 4.7 },
      { name: 'GloraX', units: 30, unitsPercent: 5.5, sqm: 1133.7, sqmPercent: 4.3, rub: 229633546, rubPercent: 3.7 },
      { name: 'ТСИ', units: 30, unitsPercent: 5.5, sqm: 1182.6, sqmPercent: 4.5, rub: 235696900, rubPercent: 3.8 },
    ],
    'Февраль': [
      { name: 'ПИК', units: 133, unitsPercent: 14.5, sqm: 5238.7, sqmPercent: 12.0, rub: 1054494773, rubPercent: 10.1 },
      { name: 'СМУ 88', units: 101, unitsPercent: 11.0, sqm: 5806.6, sqmPercent: 13.4, rub: 1348826261, rubPercent: 12.9 },
      { name: 'Унистрой', units: 87, unitsPercent: 9.5, sqm: 4437.6, sqmPercent: 10.2, rub: 910899217, rubPercent: 8.7 },
      { name: 'Ак Барс Дом', units: 79, unitsPercent: 8.6, sqm: 4106.2, sqmPercent: 9.4, rub: 887533252, rubPercent: 8.5 },
      { name: 'Самолет', units: 77, unitsPercent: 8.4, sqm: 2814.9, sqmPercent: 6.5, rub: 735033893, rubPercent: 7.0 },
      { name: 'ТСИ', units: 62, unitsPercent: 6.8, sqm: 2370.6, sqmPercent: 5.5, rub: 477529000, rubPercent: 4.6 },
      { name: 'КамаСтройИнвест', units: 61, unitsPercent: 6.7, sqm: 3129.6, sqmPercent: 7.2, rub: 872817425, rubPercent: 8.4 },
      { name: 'Суварстроит', units: 55, unitsPercent: 6.0, sqm: 2266.6, sqmPercent: 5.2, rub: 499081593, rubPercent: 4.8 },
    ],
    'Март': [
      { name: 'ПИК', units: 172, unitsPercent: 17.7, sqm: 6684.7, sqmPercent: 15.5, rub: 1293047249, rubPercent: 13.3 },
      { name: 'Ак Барс Дом', units: 122, unitsPercent: 12.6, sqm: 5712.9, sqmPercent: 13.3, rub: 1288826113, rubPercent: 13.2 },
      { name: 'ТСИ', units: 87, unitsPercent: 9.0, sqm: 3300.7, sqmPercent: 7.7, rub: 654775600, rubPercent: 6.7 },
      { name: 'КамаСтройИнвест', units: 68, unitsPercent: 7.0, sqm: 3292.8, sqmPercent: 7.7, rub: 872024355, rubPercent: 8.9 },
      { name: 'Суварстроит', units: 61, unitsPercent: 6.3, sqm: 2093.3, sqmPercent: 4.9, rub: 506007420, rubPercent: 5.2 },
      { name: 'КОМОССТРОЙ', units: 51, unitsPercent: 5.3, sqm: 2133.7, sqmPercent: 5.0, rub: 458542768, rubPercent: 4.7 },
      { name: 'Унистрой', units: 50, unitsPercent: 5.1, sqm: 2546.2, sqmPercent: 5.9, rub: 553041642, rubPercent: 5.7 },
      { name: 'СМУ 88', units: 41, unitsPercent: 4.2, sqm: 2716.5, sqmPercent: 6.3, rub: 702135307, rubPercent: 7.2 },
    ],
    'Апрель': [
      { name: 'ПИК', units: 166, unitsPercent: 19.6, sqm: 6658.2, sqmPercent: 17.9, rub: 1352158057, rubPercent: 16.0 },
      { name: 'ТСИ', units: 107, unitsPercent: 12.6, sqm: 4181.3, sqmPercent: 11.2, rub: 846204000, rubPercent: 10.0 },
      { name: 'Суварстроит', units: 80, unitsPercent: 9.4, sqm: 3040.7, sqmPercent: 8.2, rub: 666003717, rubPercent: 7.9 },
      { name: 'Ак Барс Дом', units: 65, unitsPercent: 7.7, sqm: 3345.3, sqmPercent: 9.0, rub: 738730777, rubPercent: 8.7 },
      { name: 'КамаСтройИнвест', units: 60, unitsPercent: 7.1, sqm: 3002.5, sqmPercent: 8.1, rub: 882113329, rubPercent: 10.4 },
      { name: 'Унистрой', units: 56, unitsPercent: 6.6, sqm: 2637.5, sqmPercent: 7.1, rub: 595082324, rubPercent: 7.0 },
      { name: 'Самолет', units: 47, unitsPercent: 5.5, sqm: 1675.1, sqmPercent: 4.5, rub: 426504364, rubPercent: 5.0 },
      { name: 'СМУ 88', units: 29, unitsPercent: 3.4, sqm: 1652.6, sqmPercent: 4.4, rub: 428706224, rubPercent: 5.1 },
    ],
    'Май': [
      { name: 'ПИК', units: 109, unitsPercent: 14.6, sqm: 4662.8, sqmPercent: 14.2, rub: 954063460, rubPercent: 12.3 },
      { name: 'ТСИ', units: 98, unitsPercent: 13.1, sqm: 4121.2, sqmPercent: 12.6, rub: 830473300, rubPercent: 10.7 },
      { name: 'КамаСтройИнвест', units: 66, unitsPercent: 8.8, sqm: 2845.5, sqmPercent: 8.7, rub: 783826442, rubPercent: 10.1 },
      { name: 'Ак Барс Дом', units: 63, unitsPercent: 8.4, sqm: 2879.1, sqmPercent: 8.8, rub: 671135277, rubPercent: 8.6 },
      { name: 'Суварстроит', units: 57, unitsPercent: 7.6, sqm: 2280.6, sqmPercent: 7.0, rub: 619869243, rubPercent: 8.0 },
      { name: 'Унистрой', units: 54, unitsPercent: 7.2, sqm: 2325.0, sqmPercent: 7.1, rub: 565774805, rubPercent: 7.3 },
      { name: 'Самолет', units: 39, unitsPercent: 5.2, sqm: 1337.2, sqmPercent: 4.1, rub: 354884937, rubPercent: 4.6 },
      { name: 'СМУ 88', units: 27, unitsPercent: 3.6, sqm: 1421.7, sqmPercent: 4.3, rub: 339957411, rubPercent: 4.4 },
    ],
    'Июнь': [
      { name: 'ПИК', units: 139, unitsPercent: 18.4, sqm: 5515.8, sqmPercent: 17.3, rub: 1243638256, rubPercent: 16.6 },
      { name: 'Унистрой', units: 84, unitsPercent: 11.1, sqm: 3147.3, sqmPercent: 9.8, rub: 767336247, rubPercent: 10.3 },
      { name: 'Ак Барс Дом', units: 83, unitsPercent: 11.0, sqm: 3561.8, sqmPercent: 11.1, rub: 807446494, rubPercent: 10.8 },
      { name: 'КамаСтройИнвест', units: 80, unitsPercent: 10.6, sqm: 3391.1, sqmPercent: 10.6, rub: 868430742, rubPercent: 11.6 },
      { name: 'ТСИ', units: 42, unitsPercent: 5.6, sqm: 1739.8, sqmPercent: 5.4, rub: 349700600, rubPercent: 4.7 },
      { name: 'Суварстроит', units: 38, unitsPercent: 5.0, sqm: 1477.6, sqmPercent: 4.6, rub: 411015342, rubPercent: 5.5 },
      { name: 'СМУ 88', units: 29, unitsPercent: 3.8, sqm: 1450.0, sqmPercent: 4.5, rub: 339248618, rubPercent: 4.5 },
      { name: 'GloraX', units: 22, unitsPercent: 2.9, sqm: 937.5, sqmPercent: 2.9, rub: 201019136, rubPercent: 2.7 },
    ],
    'Июль': [
      { name: 'ПИК', units: 149, unitsPercent: 15.2, sqm: 5940.5, sqmPercent: 14.2, rub: 1195827244, rubPercent: 12.7 },
      { name: 'Ак Барс Дом', units: 127, unitsPercent: 13.0, sqm: 5551.4, sqmPercent: 13.3, rub: 1294469718, rubPercent: 13.8 },
      { name: 'Унистрой', units: 118, unitsPercent: 12.1, sqm: 4833.5, sqmPercent: 11.6, rub: 1134125041, rubPercent: 12.1 },
      { name: 'КамаСтройИнвест', units: 78, unitsPercent: 8.0, sqm: 3809.5, sqmPercent: 9.1, rub: 996490640, rubPercent: 10.6 },
      { name: 'Суварстроит', units: 64, unitsPercent: 6.5, sqm: 2069.4, sqmPercent: 5.0, rub: 451475303, rubPercent: 4.8 },
      { name: 'ТСИ', units: 59, unitsPercent: 6.0, sqm: 2319.6, sqmPercent: 5.6, rub: 501196900, rubPercent: 5.3 },
      { name: 'СМУ 88', units: 37, unitsPercent: 3.8, sqm: 1710.7, sqmPercent: 4.1, rub: 410135675, rubPercent: 4.4 },
      { name: 'Самолет', units: 36, unitsPercent: 3.7, sqm: 1409.7, sqmPercent: 3.4, rub: 356439619, rubPercent: 3.8 },
    ],
    'Август': [
      { name: 'ПИК', units: 149, unitsPercent: 16.2, sqm: 5921.8, sqmPercent: 14.4, rub: 1247568565, rubPercent: 12.6 },
      { name: 'Унистрой', units: 131, unitsPercent: 14.2, sqm: 5878.5, sqmPercent: 14.2, rub: 1434527270, rubPercent: 14.5 },
      { name: 'Ак Барс Дом', units: 117, unitsPercent: 12.7, sqm: 5311.4, sqmPercent: 12.9, rub: 1209084313, rubPercent: 12.3 },
      { name: 'Суварстроит', units: 90, unitsPercent: 9.8, sqm: 3544.2, sqmPercent: 8.6, rub: 842888267, rubPercent: 8.5 },
      { name: 'КамаСтройИнвест', units: 73, unitsPercent: 7.9, sqm: 3876.8, sqmPercent: 9.4, rub: 1048887568, rubPercent: 10.6 },
      { name: 'ТСИ', units: 52, unitsPercent: 5.6, sqm: 2291.5, sqmPercent: 5.6, rub: 469479700, rubPercent: 4.8 },
      { name: 'СМУ 88', units: 42, unitsPercent: 4.6, sqm: 2169.9, sqmPercent: 5.3, rub: 589913639, rubPercent: 6.0 },
      { name: 'GloraX', units: 27, unitsPercent: 2.9, sqm: 1252.3, sqmPercent: 3.0, rub: 268038267, rubPercent: 2.7 },
    ],
    'Сентябрь': [
      { name: 'ПИК', units: 176, unitsPercent: 16.5, sqm: 6920.7, sqmPercent: 14.8, rub: 1492235520, rubPercent: 13.3 },
      { name: 'Суварстроит', units: 169, unitsPercent: 15.8, sqm: 5779.8, sqmPercent: 12.3, rub: 1363110604, rubPercent: 12.1 },
      { name: 'Унистрой', units: 100, unitsPercent: 9.4, sqm: 4350.9, sqmPercent: 9.3, rub: 1034611365, rubPercent: 9.2 },
      { name: 'Ак Барс Дом', units: 74, unitsPercent: 6.9, sqm: 3520.5, sqmPercent: 7.5, rub: 826740413, rubPercent: 7.4 },
      { name: 'СМУ 88', units: 70, unitsPercent: 6.5, sqm: 3865.2, sqmPercent: 8.3, rub: 1013149006, rubPercent: 9.0 },
      { name: 'КамаСтройИнвест', units: 57, unitsPercent: 5.3, sqm: 2754.8, sqmPercent: 5.9, rub: 741851670, rubPercent: 6.6 },
      { name: 'Самолет', units: 47, unitsPercent: 4.4, sqm: 2166.9, sqmPercent: 4.6, rub: 508095007, rubPercent: 4.5 },
      { name: 'GloraX', units: 29, unitsPercent: 2.7, sqm: 1332.1, sqmPercent: 2.8, rub: 289190123, rubPercent: 2.6 },
    ],
    'Октябрь': [
      { name: 'ПИК', units: 220, unitsPercent: 16.6, sqm: 8847.6, sqmPercent: 15.4, rub: 1885246826, rubPercent: 14.0 },
      { name: 'Суварстроит', units: 178, unitsPercent: 13.4, sqm: 6527.3, sqmPercent: 11.3, rub: 1436877222, rubPercent: 10.7 },
      { name: 'Унистрой', units: 106, unitsPercent: 8.0, sqm: 4728.5, sqmPercent: 8.2, rub: 1151880466, rubPercent: 8.6 },
      { name: 'Ак Барс Дом', units: 102, unitsPercent: 7.7, sqm: 4824.0, sqmPercent: 8.4, rub: 1092602431, rubPercent: 8.1 },
      { name: 'СЗ ТЕКТУМ-1', units: 84, unitsPercent: 6.3, sqm: 3178.6, sqmPercent: 5.5, rub: 761906263, rubPercent: 5.7 },
      { name: 'Самолет', units: 78, unitsPercent: 5.9, sqm: 3357.7, sqmPercent: 5.8, rub: 843127606, rubPercent: 6.3 },
      { name: 'КамаСтройИнвест', units: 70, unitsPercent: 5.3, sqm: 3742.3, sqmPercent: 6.5, rub: 978911737, rubPercent: 7.3 },
      { name: 'СМУ 88', units: 56, unitsPercent: 4.2, sqm: 2864.7, sqmPercent: 5.0, rub: 742284315, rubPercent: 5.5 },
    ],
    'Ноябрь': [
      { name: 'Суварстроит', units: 203, unitsPercent: 16.8, sqm: 7411.2, sqmPercent: 12.9, rub: 1691083829, rubPercent: 12.6 },
      { name: 'ПИК', units: 148, unitsPercent: 12.3, sqm: 5537.0, sqmPercent: 9.6, rub: 1320703569, rubPercent: 9.8 },
      { name: 'Ак Барс Дом', units: 111, unitsPercent: 9.2, sqm: 5123.4, sqmPercent: 8.9, rub: 1131010148, rubPercent: 8.4 },
      { name: 'ТСИ', units: 107, unitsPercent: 8.9, sqm: 4207.1, sqmPercent: 7.3, rub: 926164350, rubPercent: 6.9 },
      { name: 'Унистрой', units: 76, unitsPercent: 6.3, sqm: 3208.8, sqmPercent: 5.6, rub: 767455993, rubPercent: 5.7 },
      { name: 'КамаСтройИнвест', units: 72, unitsPercent: 6.0, sqm: 3346.0, sqmPercent: 5.8, rub: 944581426, rubPercent: 7.0 },
      { name: 'СМУ 88', units: 64, unitsPercent: 5.3, sqm: 3754.1, sqmPercent: 6.5, rub: 1062019312, rubPercent: 7.9 },
      { name: 'СЗ ТЕКТУМ-1', units: 64, unitsPercent: 5.3, sqm: 2606.6, sqmPercent: 4.5, rub: 619972007, rubPercent: 4.6 },
    ],
  },
  'Тольятти': {
    'Январь': [
      { name: 'Лада-Дом', units: 20, unitsPercent: 37.7, sqm: 895.5, sqmPercent: 27.6, rub: 120116345, rubPercent: 27.0 },
      { name: 'Унистрой', units: 10, unitsPercent: 18.9, sqm: 579.2, sqmPercent: 17.8, rub: 68921750, rubPercent: 15.5 },
      { name: 'СЗ СТРОЙ ДОМ', units: 7, unitsPercent: 13.2, sqm: 342.3, sqmPercent: 10.5, rub: 34859690, rubPercent: 7.8 },
      { name: 'Криптострой', units: 5, unitsPercent: 9.4, sqm: 574.5, sqmPercent: 17.7, rub: 94449400, rubPercent: 21.2 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 4, unitsPercent: 7.5, sqm: 195.0, sqmPercent: 6.0, rub: 22686000, rubPercent: 5.1 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 4, unitsPercent: 7.5, sqm: 321.2, sqmPercent: 9.9, rub: 53873635, rubPercent: 12.1 },
    ],
    'Февраль': [
      { name: 'Лада-Дом', units: 33, unitsPercent: 41.3, sqm: 1465.4, sqmPercent: 34.9, rub: 198918975, rubPercent: 36.1 },
      { name: 'СЗ СТРОЙ ДОМ', units: 25, unitsPercent: 31.3, sqm: 1197.3, sqmPercent: 28.5, rub: 123493820, rubPercent: 22.4 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 9, unitsPercent: 11.3, sqm: 811.0, sqmPercent: 19.3, rub: 137094480, rubPercent: 24.9 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 8, unitsPercent: 10.0, sqm: 413.7, sqmPercent: 9.8, rub: 50039000, rubPercent: 9.1 },
      { name: 'Унистрой', units: 3, unitsPercent: 3.8, sqm: 207.9, sqmPercent: 4.9, rub: 22452750, rubPercent: 4.1 },
    ],
    'Март': [
      { name: 'Лада-Дом', units: 29, unitsPercent: 30.9, sqm: 1419.2, sqmPercent: 27.5, rub: 194354234, rubPercent: 27.8 },
      { name: 'Унистрой', units: 27, unitsPercent: 28.7, sqm: 1448.8, sqmPercent: 28.1, rub: 177788920, rubPercent: 25.4 },
      { name: 'СЗ СТРОЙ ДОМ', units: 14, unitsPercent: 14.9, sqm: 650.7, sqmPercent: 12.6, rub: 73141920, rubPercent: 10.4 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 9, unitsPercent: 9.6, sqm: 502.2, sqmPercent: 9.7, rub: 63639000, rubPercent: 9.1 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 6, unitsPercent: 6.4, sqm: 607.0, sqmPercent: 11.8, rub: 109787445, rubPercent: 15.7 },
    ],
    'Апрель': [
      { name: 'Лада-Дом', units: 27, unitsPercent: 38.6, sqm: 1206.7, sqmPercent: 32.1, rub: 167521309, rubPercent: 33.2 },
      { name: 'Унистрой', units: 13, unitsPercent: 18.6, sqm: 774.4, sqmPercent: 20.6, rub: 109308464, rubPercent: 21.7 },
      { name: 'СЗ СТРОЙ ДОМ', units: 12, unitsPercent: 17.1, sqm: 596.4, sqmPercent: 15.9, rub: 63313620, rubPercent: 12.6 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 7, unitsPercent: 10.0, sqm: 369.3, sqmPercent: 9.8, rub: 48309000, rubPercent: 9.6 },
      { name: 'СЗ СТРОНЖ', units: 5, unitsPercent: 7.1, sqm: 320.8, sqmPercent: 8.5, rub: 34164000, rubPercent: 6.8 },
    ],
    'Май': [
      { name: 'СЗ СТРОЙ ДОМ', units: 37, unitsPercent: 36.6, sqm: 1835.9, sqmPercent: 36.0, rub: 195359930, rubPercent: 29.2 },
      { name: 'Лада-Дом', units: 27, unitsPercent: 26.7, sqm: 1217.8, sqmPercent: 23.9, rub: 171006091, rubPercent: 25.5 },
      { name: 'Унистрой', units: 20, unitsPercent: 19.8, sqm: 946.0, sqmPercent: 18.6, rub: 138545104, rubPercent: 20.7 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 7, unitsPercent: 6.9, sqm: 292.0, sqmPercent: 5.7, rub: 38647200, rubPercent: 5.8 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 4, unitsPercent: 4.0, sqm: 318.0, sqmPercent: 6.2, rub: 55460995, rubPercent: 8.3 },
    ],
    'Июнь': [
      { name: 'СЗ СТРОЙ ДОМ', units: 26, unitsPercent: 28.9, sqm: 1274.1, sqmPercent: 25.4, rub: 142397370, rubPercent: 20.9 },
      { name: 'Лада-Дом', units: 24, unitsPercent: 26.7, sqm: 1048.5, sqmPercent: 20.9, rub: 151132326, rubPercent: 22.2 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 15, unitsPercent: 16.7, sqm: 893.6, sqmPercent: 17.8, rub: 115943880, rubPercent: 17.0 },
      { name: 'Унистрой', units: 15, unitsPercent: 16.7, sqm: 927.7, sqmPercent: 18.5, rub: 125983041, rubPercent: 18.5 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 6, unitsPercent: 6.7, sqm: 478.3, sqmPercent: 9.5, rub: 83620820, rubPercent: 12.3 },
    ],
    'Июль': [
      { name: 'СЗ СТРОЙ ДОМ', units: 21, unitsPercent: 32.3, sqm: 974.0, sqmPercent: 29.2, rub: 112093090, rubPercent: 25.4 },
      { name: 'Лада-Дом', units: 18, unitsPercent: 27.7, sqm: 777.1, sqmPercent: 23.3, rub: 111795103, rubPercent: 25.4 },
      { name: 'СЗ ТАУРЕД', units: 9, unitsPercent: 13.8, sqm: 442.4, sqmPercent: 13.2, rub: 41476300, rubPercent: 9.4 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 8, unitsPercent: 12.3, sqm: 674.3, sqmPercent: 20.2, rub: 111751545, rubPercent: 25.4 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 6, unitsPercent: 9.2, sqm: 310.7, sqmPercent: 9.3, rub: 39438080, rubPercent: 8.9 },
      { name: 'Унистрой', units: 2, unitsPercent: 3.1, sqm: 92.2, sqmPercent: 2.8, rub: 12764000, rubPercent: 2.9 },
    ],
    'Август': [
      { name: 'Лада-Дом', units: 20, unitsPercent: 32.8, sqm: 822.6, sqmPercent: 28.7, rub: 117739749, rubPercent: 28.6 },
      { name: 'Унистрой', units: 17, unitsPercent: 27.9, sqm: 821.7, sqmPercent: 28.7, rub: 127590054, rubPercent: 31.0 },
      { name: 'СЗ СТРОЙ ДОМ', units: 10, unitsPercent: 16.4, sqm: 465.2, sqmPercent: 16.2, rub: 57444140, rubPercent: 13.9 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 5, unitsPercent: 8.2, sqm: 264.0, sqmPercent: 9.2, rub: 34350000, rubPercent: 8.3 },
      { name: 'СЗ ТАУРЕД', units: 4, unitsPercent: 6.6, sqm: 144.8, sqmPercent: 5.1, rub: 14442000, rubPercent: 3.5 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 3, unitsPercent: 4.9, sqm: 233.5, sqmPercent: 8.2, rub: 40892690, rubPercent: 9.9 },
    ],
    'Сентябрь': [
      { name: 'Лада-Дом', units: 39, unitsPercent: 47.0, sqm: 1679.3, sqmPercent: 38.1, rub: 240557880, rubPercent: 36.2 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 18, unitsPercent: 21.7, sqm: 1354.1, sqmPercent: 30.7, rub: 221317125, rubPercent: 33.3 },
      { name: 'СЗ СТРОЙ ДОМ', units: 7, unitsPercent: 8.4, sqm: 310.6, sqmPercent: 7.0, rub: 42676095, rubPercent: 6.4 },
      { name: 'Унистрой', units: 7, unitsPercent: 8.4, sqm: 397.1, sqmPercent: 9.0, rub: 58977240, rubPercent: 8.9 },
      { name: 'СЗ ПАРК', units: 5, unitsPercent: 6.0, sqm: 320.1, sqmPercent: 7.3, rub: 54272968, rubPercent: 8.2 },
    ],
    'Октябрь': [
      { name: 'Лада-Дом', units: 50, unitsPercent: 51.0, sqm: 2134.4, sqmPercent: 46.2, rub: 303714960, rubPercent: 44.3 },
      { name: 'Унистрой', units: 16, unitsPercent: 16.3, sqm: 734.5, sqmPercent: 15.9, rub: 113103556, rubPercent: 16.5 },
      { name: 'СЗ СТРОЙ ДОМ', units: 11, unitsPercent: 11.2, sqm: 496.3, sqmPercent: 10.7, rub: 66826220, rubPercent: 9.7 },
      { name: 'СЗ СТРОЙ-ИНВЕСТИЦИИ', units: 9, unitsPercent: 9.2, sqm: 542.4, sqmPercent: 11.7, rub: 98309785, rubPercent: 14.3 },
      { name: 'Криптострой', units: 4, unitsPercent: 4.1, sqm: 342.8, sqmPercent: 7.4, rub: 59335660, rubPercent: 8.7 },
      { name: 'СЗ ЕДИНЕНИЕ', units: 4, unitsPercent: 4.1, sqm: 209.4, sqmPercent: 4.5, rub: 27942000, rubPercent: 4.1 },
    ],
    'Ноябрь': [
      { name: 'Лада-Дом', units: 74, unitsPercent: 52.9, sqm: 3253.2, sqmPercent: 46.0, rub: 493219808, rubPercent: 48.5 },
      { name: 'СЗ АДРЕС', units: 25, unitsPercent: 17.9, sqm: 1343.4, sqmPercent: 19.0, rub: 143510000, rubPercent: 14.1 },
      { name: 'СЗ СТРОЙ ДОМ', units: 18, unitsPercent: 12.9, sqm: 760.4, sqmPercent: 10.7, rub: 102507470, rubPercent: 10.1 },
      { name: 'Унистрой', units: 10, unitsPercent: 7.1, sqm: 491.9, sqmPercent: 6.9, rub: 77869166, rubPercent: 7.7 },
      { name: 'СЗ ПАРК', units: 8, unitsPercent: 5.7, sqm: 881.7, sqmPercent: 12.5, rub: 148294430, rubPercent: 14.6 },
    ],
  },
  'Пермь': {
    'Январь': [
      { name: 'ПЗСП', units: 120, unitsPercent: 18.5, sqm: 5200.0, sqmPercent: 17.0, rub: 780000000, rubPercent: 16.5 },
      { name: 'Девелопмент-Юг', units: 95, unitsPercent: 14.6, sqm: 4100.0, sqmPercent: 13.4, rub: 640000000, rubPercent: 13.5 },
      { name: 'ПМД', units: 85, unitsPercent: 13.1, sqm: 3800.0, sqmPercent: 12.4, rub: 580000000, rubPercent: 12.2 },
      { name: 'ОНИКС', units: 70, unitsPercent: 10.8, sqm: 3000.0, sqmPercent: 9.8, rub: 480000000, rubPercent: 10.1 },
      { name: 'Орсо групп', units: 50, unitsPercent: 7.7, sqm: 2200.0, sqmPercent: 7.2, rub: 350000000, rubPercent: 7.4 },
    ],
    'Февраль': [{ name: 'ПЗСП', units: 115, unitsPercent: 17.2, sqm: 5000.0, sqmPercent: 16.0, rub: 760000000, rubPercent: 15.7 }, { name: 'Девелопмент-Юг', units: 100, unitsPercent: 15.0, sqm: 4300.0, sqmPercent: 13.8, rub: 680000000, rubPercent: 14.0 }, { name: 'СтройПанельКомплект', units: 90, unitsPercent: 13.5, sqm: 3900.0, sqmPercent: 12.5, rub: 600000000, rubPercent: 12.4 }, { name: 'ПМД', units: 70, unitsPercent: 10.5, sqm: 3100.0, sqmPercent: 9.9, rub: 490000000, rubPercent: 10.1 }, { name: 'ОНИКС', units: 60, unitsPercent: 9.0, sqm: 2700.0, sqmPercent: 8.7, rub: 430000000, rubPercent: 8.9 }],
    'Март': [{ name: 'ПЗСП', units: 110, unitsPercent: 16.5, sqm: 4700.0, sqmPercent: 15.0, rub: 720000000, rubPercent: 14.8 }, { name: 'Девелопмент-Юг', units: 95, unitsPercent: 14.3, sqm: 4100.0, sqmPercent: 13.1, rub: 640000000, rubPercent: 13.2 }, { name: 'ПМД', units: 85, unitsPercent: 12.8, sqm: 3700.0, sqmPercent: 11.8, rub: 580000000, rubPercent: 11.9 }, { name: 'ОНИКС', units: 70, unitsPercent: 10.5, sqm: 3000.0, sqmPercent: 9.6, rub: 480000000, rubPercent: 9.9 }],
    'Апрель': [{ name: 'Девелопмент-Юг', units: 105, unitsPercent: 15.5, sqm: 4500.0, sqmPercent: 14.2, rub: 700000000, rubPercent: 14.0 }, { name: 'ПЗСП', units: 100, unitsPercent: 14.8, sqm: 4300.0, sqmPercent: 13.6, rub: 670000000, rubPercent: 13.4 }, { name: 'СтройПанельКомплект', units: 90, unitsPercent: 13.3, sqm: 3900.0, sqmPercent: 12.3, rub: 610000000, rubPercent: 12.2 }, { name: 'ОНИКС', units: 80, unitsPercent: 11.8, sqm: 3500.0, sqmPercent: 11.1, rub: 550000000, rubPercent: 11.0 }],
    'Май': [{ name: 'ПЗСП', units: 120, unitsPercent: 17.8, sqm: 5200.0, sqmPercent: 16.5, rub: 800000000, rubPercent: 16.0 }, { name: 'Девелопмент-Юг', units: 100, unitsPercent: 14.8, sqm: 4300.0, sqmPercent: 13.7, rub: 680000000, rubPercent: 13.6 }, { name: 'ПМД', units: 85, unitsPercent: 12.6, sqm: 3700.0, sqmPercent: 11.8, rub: 590000000, rubPercent: 11.8 }, { name: 'ОНИКС', units: 75, unitsPercent: 11.1, sqm: 3300.0, sqmPercent: 10.5, rub: 520000000, rubPercent: 10.4 }],
    'Июнь': [{ name: 'ПЗСП', units: 115, unitsPercent: 17.0, sqm: 5000.0, sqmPercent: 15.8, rub: 770000000, rubPercent: 15.4 }, { name: 'СтройПанельКомплект', units: 100, unitsPercent: 14.8, sqm: 4300.0, sqmPercent: 13.6, rub: 680000000, rubPercent: 13.6 }, { name: 'Девелопмент-Юг', units: 90, unitsPercent: 13.3, sqm: 3900.0, sqmPercent: 12.3, rub: 620000000, rubPercent: 12.4 }, { name: 'ПМД', units: 80, unitsPercent: 11.9, sqm: 3500.0, sqmPercent: 11.1, rub: 560000000, rubPercent: 11.2 }],
    'Июль': [{ name: 'Девелопмент-Юг', units: 110, unitsPercent: 16.2, sqm: 4700.0, sqmPercent: 14.8, rub: 740000000, rubPercent: 14.8 }, { name: 'ПЗСП', units: 105, unitsPercent: 15.4, sqm: 4500.0, sqmPercent: 14.2, rub: 700000000, rubPercent: 14.0 }, { name: 'СтройПанельКомплект', units: 95, unitsPercent: 14.0, sqm: 4100.0, sqmPercent: 12.9, rub: 650000000, rubPercent: 13.0 }, { name: 'ПМД', units: 85, unitsPercent: 12.5, sqm: 3700.0, sqmPercent: 11.7, rub: 590000000, rubPercent: 11.8 }],
    'Август': [{ name: 'Девелопмент-Юг', units: 105, unitsPercent: 15.8, sqm: 4500.0, sqmPercent: 14.4, rub: 710000000, rubPercent: 14.2 }, { name: 'ПЗСП', units: 100, unitsPercent: 15.0, sqm: 4300.0, sqmPercent: 13.7, rub: 680000000, rubPercent: 13.6 }, { name: 'СтройПанельКомплект', units: 90, unitsPercent: 13.5, sqm: 3900.0, sqmPercent: 12.5, rub: 620000000, rubPercent: 12.4 }, { name: 'ПМД', units: 80, unitsPercent: 12.0, sqm: 3500.0, sqmPercent: 11.2, rub: 560000000, rubPercent: 11.2 }],
    'Сентябрь': [{ name: 'ПЗСП', units: 130, unitsPercent: 18.5, sqm: 5500.0, sqmPercent: 17.2, rub: 850000000, rubPercent: 17.0 }, { name: 'ПМД', units: 100, unitsPercent: 14.2, sqm: 4300.0, sqmPercent: 13.4, rub: 680000000, rubPercent: 13.6 }, { name: 'Девелопмент-Юг', units: 85, unitsPercent: 12.1, sqm: 3700.0, sqmPercent: 11.6, rub: 590000000, rubPercent: 11.8 }, { name: 'ОНИКС', units: 65, unitsPercent: 9.2, sqm: 2900.0, sqmPercent: 9.1, rub: 460000000, rubPercent: 9.2 }],
    'Октябрь': [{ name: 'ПЗСП', units: 125, unitsPercent: 17.8, sqm: 5400.0, sqmPercent: 17.0, rub: 830000000, rubPercent: 16.6 }, { name: 'Девелопмент-Юг', units: 105, unitsPercent: 15.0, sqm: 4500.0, sqmPercent: 14.2, rub: 710000000, rubPercent: 14.2 }, { name: 'ПМД', units: 90, unitsPercent: 12.8, sqm: 3900.0, sqmPercent: 12.3, rub: 620000000, rubPercent: 12.4 }, { name: 'СтройПанельКомплект', units: 70, unitsPercent: 10.0, sqm: 3100.0, sqmPercent: 9.8, rub: 490000000, rubPercent: 9.8 }],
    'Ноябрь': [{ name: 'ПЗСП', units: 120, unitsPercent: 17.5, sqm: 5200.0, sqmPercent: 16.5, rub: 800000000, rubPercent: 16.0 }, { name: 'ПМД', units: 100, unitsPercent: 14.5, sqm: 4300.0, sqmPercent: 13.7, rub: 680000000, rubPercent: 13.6 }, { name: 'ОНИКС', units: 85, unitsPercent: 12.4, sqm: 3700.0, sqmPercent: 11.8, rub: 590000000, rubPercent: 11.8 }, { name: 'СтройПанельКомплект', units: 75, unitsPercent: 10.9, sqm: 3300.0, sqmPercent: 10.5, rub: 520000000, rubPercent: 10.4 }],
  },
};

// ========== ДАННЫЕ ЖК ==========
const projectData = {
  'Казань': {
    'Январь': [
      { name: 'Мой ритм', units: 45, unitsPercent: 8.3, sqm: 2100, sqmPercent: 7.8, rub: 520000000, rubPercent: 8.0 },
      { name: 'Сиберово', units: 38, unitsPercent: 7.0, sqm: 1800, sqmPercent: 6.7, rub: 430000000, rubPercent: 6.6 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 18, unitsPercent: 3.3, sqm: 850, sqmPercent: 3.2, rub: 180000000, rubPercent: 2.8 },
      { name: 'Оригана', developer: 'Унистрой', units: 13, unitsPercent: 2.4, sqm: 640, sqmPercent: 2.4, rub: 115000000, rubPercent: 1.8 },
    ],
    'Февраль': [
      { name: 'Мой ритм', units: 52, unitsPercent: 6.5, sqm: 2400, sqmPercent: 6.2, rub: 580000000, rubPercent: 6.0 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 35, unitsPercent: 4.4, sqm: 1700, sqmPercent: 4.4, rub: 380000000, rubPercent: 3.9 },
      { name: 'Оригана', developer: 'Унистрой', units: 30, unitsPercent: 3.8, sqm: 1750, sqmPercent: 4.5, rub: 370000000, rubPercent: 3.8 },
    ],
    'Март': [
      { name: 'Мой ритм', units: 60, unitsPercent: 7.6, sqm: 2800, sqmPercent: 8.0, rub: 680000000, rubPercent: 8.0 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 22, unitsPercent: 2.8, sqm: 1100, sqmPercent: 3.1, rub: 260000000, rubPercent: 3.0 },
      { name: 'Оригана', developer: 'Унистрой', units: 18, unitsPercent: 2.3, sqm: 910, sqmPercent: 2.6, rub: 215000000, rubPercent: 2.5 },
    ],
    'Апрель': [
      { name: 'Мой ритм', units: 55, unitsPercent: 8.1, sqm: 2550, sqmPercent: 8.5, rub: 620000000, rubPercent: 8.5 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 20, unitsPercent: 2.9, sqm: 950, sqmPercent: 3.2, rub: 240000000, rubPercent: 3.3 },
      { name: 'Оригана', developer: 'Унистрой', units: 19, unitsPercent: 2.8, sqm: 910, sqmPercent: 3.0, rub: 230000000, rubPercent: 3.1 },
    ],
    'Май': [
      { name: 'Мой ритм', units: 48, unitsPercent: 8.1, sqm: 2200, sqmPercent: 8.4, rub: 530000000, rubPercent: 7.9 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 28, unitsPercent: 4.7, sqm: 1200, sqmPercent: 4.6, rub: 300000000, rubPercent: 4.5 },
      { name: 'Оригана', developer: 'Унистрой', units: 24, unitsPercent: 4.0, sqm: 1040, sqmPercent: 4.0, rub: 250000000, rubPercent: 3.7 },
    ],
    'Июнь': [
      { name: 'Мой ритм', units: 58, unitsPercent: 9.4, sqm: 2700, sqmPercent: 10.3, rub: 650000000, rubPercent: 9.9 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 40, unitsPercent: 6.5, sqm: 1450, sqmPercent: 5.6, rub: 380000000, rubPercent: 5.8 },
      { name: 'Оригана', developer: 'Унистрой', units: 35, unitsPercent: 5.6, sqm: 1280, sqmPercent: 4.9, rub: 325000000, rubPercent: 5.0 },
    ],
    'Июль': [
      { name: 'Мой ритм', units: 62, unitsPercent: 7.9, sqm: 2900, sqmPercent: 8.5, rub: 700000000, rubPercent: 8.6 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 55, unitsPercent: 7.0, sqm: 2300, sqmPercent: 6.7, rub: 550000000, rubPercent: 6.7 },
      { name: 'Оригана', developer: 'Унистрой', units: 45, unitsPercent: 5.7, sqm: 1850, sqmPercent: 5.4, rub: 440000000, rubPercent: 5.4 },
      { name: 'Унай', developer: 'Унистрой', units: 10, unitsPercent: 1.3, sqm: 380, sqmPercent: 1.1, rub: 90000000, rubPercent: 1.1 },
    ],
    'Август': [
      { name: 'Мой ритм', units: 60, unitsPercent: 8.0, sqm: 2800, sqmPercent: 8.1, rub: 680000000, rubPercent: 7.9 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 52, unitsPercent: 6.9, sqm: 2450, sqmPercent: 7.1, rub: 630000000, rubPercent: 7.3 },
      { name: 'Оригана', developer: 'Унистрой', units: 44, unitsPercent: 5.9, sqm: 2050, sqmPercent: 5.9, rub: 530000000, rubPercent: 6.1 },
      { name: 'Унай', developer: 'Унистрой', units: 10, unitsPercent: 1.3, sqm: 410, sqmPercent: 1.2, rub: 100000000, rubPercent: 1.2 },
    ],
    'Сентябрь': [
      { name: 'Мой ритм', units: 70, unitsPercent: 7.7, sqm: 3200, sqmPercent: 8.0, rub: 780000000, rubPercent: 7.8 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 40, unitsPercent: 4.4, sqm: 1750, sqmPercent: 4.4, rub: 450000000, rubPercent: 4.5 },
      { name: 'Оригана', developer: 'Унистрой', units: 35, unitsPercent: 3.9, sqm: 1500, sqmPercent: 3.7, rub: 380000000, rubPercent: 3.8 },
      { name: 'Унай', developer: 'Унистрой', units: 6, unitsPercent: 0.7, sqm: 270, sqmPercent: 0.7, rub: 60000000, rubPercent: 0.6 },
    ],
    'Октябрь': [
      { name: 'Мой ритм', units: 85, unitsPercent: 7.9, sqm: 3900, sqmPercent: 8.3, rub: 950000000, rubPercent: 8.2 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 42, unitsPercent: 3.9, sqm: 1900, sqmPercent: 4.0, rub: 510000000, rubPercent: 4.4 },
      { name: 'Оригана', developer: 'Унистрой', units: 32, unitsPercent: 3.0, sqm: 1400, sqmPercent: 3.0, rub: 380000000, rubPercent: 3.3 },
      { name: 'Унай', developer: 'Унистрой', units: 6, unitsPercent: 0.6, sqm: 270, sqmPercent: 0.6, rub: 70000000, rubPercent: 0.6 },
    ],
    'Ноябрь': [
      { name: 'Мой ритм', units: 90, unitsPercent: 9.1, sqm: 4100, sqmPercent: 9.9, rub: 1000000000, rubPercent: 9.5 },
      { name: 'Q на Кулагина', developer: 'Унистрой', units: 28, unitsPercent: 2.8, sqm: 1200, sqmPercent: 2.9, rub: 330000000, rubPercent: 3.1 },
      { name: 'Оригана', developer: 'Унистрой', units: 20, unitsPercent: 2.0, sqm: 860, sqmPercent: 2.1, rub: 240000000, rubPercent: 2.3 },
      { name: 'Унай', developer: 'Унистрой', units: 3, unitsPercent: 0.3, sqm: 130, sqmPercent: 0.3, rub: 35000000, rubPercent: 0.3 },
    ],
  },
  'КА': {
    'Январь': [{ name: 'Мой ритм', units: 45, unitsPercent: 8.3, sqm: 2100, sqmPercent: 7.8, rub: 520000000, rubPercent: 8.0 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 18, unitsPercent: 3.3, sqm: 850, sqmPercent: 3.2, rub: 180000000, rubPercent: 2.8 }],
    'Февраль': [{ name: 'Мой ритм', units: 52, unitsPercent: 5.7, sqm: 2400, sqmPercent: 5.5, rub: 580000000, rubPercent: 5.6 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 45, unitsPercent: 4.9, sqm: 2200, sqmPercent: 5.1, rub: 450000000, rubPercent: 4.3 }, { name: 'Оригана', developer: 'Унистрой', units: 42, unitsPercent: 4.6, sqm: 2240, sqmPercent: 5.2, rub: 460000000, rubPercent: 4.4 }],
    'Март': [{ name: 'Мой ритм', units: 60, unitsPercent: 6.2, sqm: 2800, sqmPercent: 6.5, rub: 680000000, rubPercent: 7.0 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 28, unitsPercent: 2.9, sqm: 1400, sqmPercent: 3.3, rub: 300000000, rubPercent: 3.1 }, { name: 'Оригана', developer: 'Унистрой', units: 22, unitsPercent: 2.3, sqm: 1150, sqmPercent: 2.7, rub: 250000000, rubPercent: 2.6 }],
    'Апрель': [{ name: 'Мой ритм', units: 55, unitsPercent: 6.5, sqm: 2550, sqmPercent: 6.9, rub: 620000000, rubPercent: 7.3 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 30, unitsPercent: 3.5, sqm: 1400, sqmPercent: 3.8, rub: 320000000, rubPercent: 3.8 }, { name: 'Оригана', developer: 'Унистрой', units: 26, unitsPercent: 3.1, sqm: 1240, sqmPercent: 3.3, rub: 280000000, rubPercent: 3.3 }],
    'Май': [{ name: 'Мой ритм', units: 48, unitsPercent: 6.4, sqm: 2200, sqmPercent: 6.7, rub: 530000000, rubPercent: 6.8 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 30, unitsPercent: 4.0, sqm: 1300, sqmPercent: 4.0, rub: 320000000, rubPercent: 4.1 }, { name: 'Оригана', developer: 'Унистрой', units: 24, unitsPercent: 3.2, sqm: 1030, sqmPercent: 3.1, rub: 250000000, rubPercent: 3.2 }],
    'Июнь': [{ name: 'Мой ритм', units: 58, unitsPercent: 7.7, sqm: 2700, sqmPercent: 8.4, rub: 650000000, rubPercent: 8.7 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 45, unitsPercent: 6.0, sqm: 1700, sqmPercent: 5.3, rub: 420000000, rubPercent: 5.6 }, { name: 'Оригана', developer: 'Унистрой', units: 39, unitsPercent: 5.2, sqm: 1450, sqmPercent: 4.5, rub: 350000000, rubPercent: 4.7 }],
    'Июль': [{ name: 'Мой ритм', units: 62, unitsPercent: 6.3, sqm: 2900, sqmPercent: 6.9, rub: 700000000, rubPercent: 7.4 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 60, unitsPercent: 6.1, sqm: 2500, sqmPercent: 6.0, rub: 590000000, rubPercent: 6.3 }, { name: 'Оригана', developer: 'Унистрой', units: 48, unitsPercent: 4.9, sqm: 1950, sqmPercent: 4.7, rub: 470000000, rubPercent: 5.0 }, { name: 'Унай', developer: 'Унистрой', units: 10, unitsPercent: 1.0, sqm: 380, sqmPercent: 0.9, rub: 80000000, rubPercent: 0.9 }],
    'Август': [{ name: 'Мой ритм', units: 60, unitsPercent: 6.5, sqm: 2800, sqmPercent: 6.8, rub: 680000000, rubPercent: 6.9 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 65, unitsPercent: 7.1, sqm: 2950, sqmPercent: 7.2, rub: 720000000, rubPercent: 7.3 }, { name: 'Оригана', developer: 'Унистрой', units: 54, unitsPercent: 5.9, sqm: 2480, sqmPercent: 6.0, rub: 620000000, rubPercent: 6.3 }, { name: 'Унай', developer: 'Унистрой', units: 12, unitsPercent: 1.3, sqm: 450, sqmPercent: 1.1, rub: 95000000, rubPercent: 1.0 }],
    'Сентябрь': [{ name: 'Мой ритм', units: 70, unitsPercent: 6.5, sqm: 3200, sqmPercent: 6.8, rub: 780000000, rubPercent: 6.9 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 50, unitsPercent: 4.7, sqm: 2200, sqmPercent: 4.7, rub: 530000000, rubPercent: 4.7 }, { name: 'Оригана', developer: 'Унистрой', units: 42, unitsPercent: 3.9, sqm: 1850, sqmPercent: 3.9, rub: 440000000, rubPercent: 3.9 }, { name: 'Унай', developer: 'Унистрой', units: 8, unitsPercent: 0.7, sqm: 300, sqmPercent: 0.6, rub: 65000000, rubPercent: 0.6 }],
    'Октябрь': [{ name: 'Мой ритм', units: 85, unitsPercent: 6.4, sqm: 3900, sqmPercent: 6.8, rub: 950000000, rubPercent: 7.1 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 55, unitsPercent: 4.2, sqm: 2500, sqmPercent: 4.3, rub: 610000000, rubPercent: 4.5 }, { name: 'Оригана', developer: 'Унистрой', units: 42, unitsPercent: 3.2, sqm: 1900, sqmPercent: 3.3, rub: 470000000, rubPercent: 3.5 }, { name: 'Унай', developer: 'Унистрой', units: 9, unitsPercent: 0.7, sqm: 330, sqmPercent: 0.6, rub: 70000000, rubPercent: 0.5 }],
    'Ноябрь': [{ name: 'Мой ритм', units: 90, unitsPercent: 7.5, sqm: 4100, sqmPercent: 7.1, rub: 1000000000, rubPercent: 7.5 }, { name: 'Q на Кулагина', developer: 'Унистрой', units: 42, unitsPercent: 3.5, sqm: 1700, sqmPercent: 3.0, rub: 420000000, rubPercent: 3.1 }, { name: 'Оригана', developer: 'Унистрой', units: 30, unitsPercent: 2.5, sqm: 1300, sqmPercent: 2.3, rub: 310000000, rubPercent: 2.3 }, { name: 'Унай', developer: 'Унистрой', units: 4, unitsPercent: 0.3, sqm: 210, sqmPercent: 0.4, rub: 40000000, rubPercent: 0.3 }],
  },
  'Тольятти': {
    'Январь': [
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 10, unitsPercent: 18.9, sqm: 579.2, sqmPercent: 17.8, rub: 68921750, rubPercent: 15.5 },
      { name: 'GREENWOOD', units: 10, unitsPercent: 18.9, sqm: 452.4, sqmPercent: 13.9, rub: 57929852, rubPercent: 13.0 },
      { name: 'Юго-Западный', units: 7, unitsPercent: 13.2, sqm: 342.3, sqmPercent: 10.5, rub: 34859690, rubPercent: 7.8 },
      { name: 'ЁЛКИPARK', units: 6, unitsPercent: 11.3, sqm: 280.1, sqmPercent: 8.6, rub: 39503477, rubPercent: 8.9 },
      { name: 'Status Park', units: 5, unitsPercent: 9.4, sqm: 574.5, sqmPercent: 17.7, rub: 94449400, rubPercent: 21.2 },
    ],
    'Февраль': [
      { name: 'Юго-Западный', units: 25, unitsPercent: 31.3, sqm: 1197.3, sqmPercent: 28.5, rub: 123493820, rubPercent: 22.4 },
      { name: 'Булгаков', units: 12, unitsPercent: 15.0, sqm: 547.5, sqmPercent: 13.0, rub: 72617670, rubPercent: 13.2 },
      { name: 'ЁЛКИPARK', units: 11, unitsPercent: 13.8, sqm: 468.5, sqmPercent: 11.1, rub: 66338385, rubPercent: 12.0 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 3, unitsPercent: 3.8, sqm: 207.9, sqmPercent: 4.9, rub: 22452750, rubPercent: 4.1 },
    ],
    'Март': [
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 26, unitsPercent: 27.7, sqm: 1386.9, sqmPercent: 26.9, rub: 168368920, rubPercent: 24.0 },
      { name: 'Юго-Западный', units: 14, unitsPercent: 14.9, sqm: 650.7, sqmPercent: 12.6, rub: 73141920, rubPercent: 10.4 },
      { name: 'ЁЛКИPARK', units: 12, unitsPercent: 12.8, sqm: 602.5, sqmPercent: 11.7, rub: 86406982, rubPercent: 12.3 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 1, unitsPercent: 1.1, sqm: 61.9, sqmPercent: 1.2, rub: 9420000, rubPercent: 1.3 },
    ],
    'Апрель': [
      { name: 'ЁЛКИPARK', units: 14, unitsPercent: 21.2, sqm: 710.4, sqmPercent: 20.1, rub: 98941908, rubPercent: 20.9 },
      { name: 'Юго-Западный', units: 12, unitsPercent: 18.2, sqm: 596.4, sqmPercent: 16.9, rub: 63313620, rubPercent: 13.4 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 9, unitsPercent: 13.6, sqm: 514.2, sqmPercent: 14.5, rub: 68609514, rubPercent: 14.5 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 4, unitsPercent: 6.1, sqm: 260.2, sqmPercent: 7.4, rub: 40698950, rubPercent: 8.6 },
    ],
    'Май': [
      { name: 'Юго-Западный', units: 37, unitsPercent: 36.6, sqm: 1835.9, sqmPercent: 36.0, rub: 195359930, rubPercent: 29.2 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 18, unitsPercent: 17.8, sqm: 822.2, sqmPercent: 16.1, rub: 119110104, rubPercent: 17.8 },
      { name: 'ЁЛКИPARK', units: 14, unitsPercent: 13.9, sqm: 625.1, sqmPercent: 12.3, rub: 89276722, rubPercent: 13.3 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 2, unitsPercent: 2.0, sqm: 123.9, sqmPercent: 2.4, rub: 19435000, rubPercent: 2.9 },
    ],
    'Июнь': [
      { name: 'Юго-Западный', units: 26, unitsPercent: 28.9, sqm: 1274.1, sqmPercent: 25.4, rub: 142397370, rubPercent: 20.9 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 13, unitsPercent: 14.4, sqm: 824.7, sqmPercent: 16.4, rub: 109232041, rubPercent: 16.0 },
      { name: 'Булгаков', units: 11, unitsPercent: 12.2, sqm: 496.7, sqmPercent: 9.9, rub: 69745717, rubPercent: 10.2 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 2, unitsPercent: 2.2, sqm: 103.0, sqmPercent: 2.1, rub: 16750000, rubPercent: 2.5 },
    ],
    'Июль': [
      { name: 'Юго-Западный', units: 21, unitsPercent: 32.3, sqm: 974.0, sqmPercent: 29.2, rub: 112093090, rubPercent: 25.4 },
      { name: 'ЁЛКИPARK', units: 7, unitsPercent: 10.8, sqm: 292.1, sqmPercent: 8.7, rub: 42837934, rubPercent: 9.7 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 2, unitsPercent: 3.1, sqm: 92.2, sqmPercent: 2.8, rub: 12764000, rubPercent: 2.9 },
    ],
    'Август': [
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 14, unitsPercent: 23.0, sqm: 675.4, sqmPercent: 23.6, rub: 108189505, rubPercent: 26.3 },
      { name: 'Булгаков', units: 11, unitsPercent: 18.0, sqm: 441.9, sqmPercent: 15.4, rub: 63181069, rubPercent: 15.3 },
      { name: 'Юго-Западный', units: 10, unitsPercent: 16.4, sqm: 465.2, sqmPercent: 16.2, rub: 57444140, rubPercent: 13.9 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 3, unitsPercent: 4.9, sqm: 146.3, sqmPercent: 5.1, rub: 19400549, rubPercent: 4.7 },
    ],
    'Сентябрь': [
      { name: 'ЁЛКИPARK', units: 33, unitsPercent: 39.8, sqm: 1419.2, sqmPercent: 32.2, rub: 203174600, rubPercent: 30.6 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 4, unitsPercent: 4.8, sqm: 219.0, sqmPercent: 5.0, rub: 32603620, rubPercent: 4.9 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 3, unitsPercent: 3.6, sqm: 178.1, sqmPercent: 4.0, rub: 26373620, rubPercent: 4.0 },
    ],
    'Октябрь': [
      { name: 'ЁЛКИPARK', units: 45, unitsPercent: 45.9, sqm: 1985.3, sqmPercent: 42.9, rub: 281123560, rubPercent: 41.0 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 12, unitsPercent: 12.2, sqm: 530.3, sqmPercent: 11.5, rub: 80722716, rubPercent: 11.8 },
      { name: 'Юго-Западный', units: 11, unitsPercent: 11.2, sqm: 496.3, sqmPercent: 10.7, rub: 66826220, rubPercent: 9.7 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 4, unitsPercent: 4.1, sqm: 204.2, sqmPercent: 4.4, rub: 32380840, rubPercent: 4.7 },
    ],
    'Ноябрь': [
      { name: 'ЁЛКИPARK', units: 70, unitsPercent: 50.0, sqm: 3041.6, sqmPercent: 43.0, rub: 463105679, rubPercent: 45.6 },
      { name: 'Лесная 56А', units: 25, unitsPercent: 17.9, sqm: 1343.4, sqmPercent: 19.0, rub: 143510000, rubPercent: 14.1 },
      { name: 'Юго-Западный', units: 18, unitsPercent: 12.9, sqm: 760.4, sqmPercent: 10.7, rub: 102507470, rubPercent: 10.1 },
      { name: 'Южный Бульвар', developer: 'Унистрой', units: 6, unitsPercent: 4.3, sqm: 247.7, sqmPercent: 3.5, rub: 38154890, rubPercent: 3.8 },
      { name: 'Уникум на Ленинском', developer: 'Унистрой', units: 4, unitsPercent: 2.9, sqm: 244.2, sqmPercent: 3.5, rub: 39714276, rubPercent: 3.9 },
    ],
  },
  'Пермь': {
    'Январь': [{ name: 'Мост', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Февраль': [{ name: 'Мост', units: 33, unitsPercent: 5.2, sqm: 1480.0, sqmPercent: 4.9, rub: 225000000, rubPercent: 4.8 }, { name: 'Причал', developer: 'Унистрой', units: 12, unitsPercent: 1.9, sqm: 560.0, sqmPercent: 1.8, rub: 85000000, rubPercent: 1.8 }],
    'Март': [{ name: 'Мост', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Апрель': [{ name: 'Погода', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Май': [{ name: 'Мост', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Июнь': [{ name: 'Мост', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Июль': [{ name: 'Погода', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Август': [{ name: 'Погода', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
    'Сентябрь': [{ name: 'Мост', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 12, unitsPercent: 1.9, sqm: 560.0, sqmPercent: 1.8, rub: 85000000, rubPercent: 1.8 }],
    'Октябрь': [{ name: 'ПЗСП', units: 40, unitsPercent: 5.7, sqm: 1700.0, sqmPercent: 5.4, rub: 260000000, rubPercent: 5.2 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.0, sqm: 600.0, sqmPercent: 1.9, rub: 90000000, rubPercent: 1.8 }],
    'Ноябрь': [{ name: 'Красное яблоко', units: 35, unitsPercent: 5.4, sqm: 1550.0, sqmPercent: 5.1, rub: 235000000, rubPercent: 5.0 }, { name: 'Причал', developer: 'Унистрой', units: 14, unitsPercent: 2.2, sqm: 650.0, sqmPercent: 2.1, rub: 100000000, rubPercent: 2.1 }],
  },
};

// ========== UI КОМПОНЕНТЫ ==========
const DataChart = ({ data, selectedMetric }) => {
  const metric = METRICS.find(m => m.key === selectedMetric);
  const chartData = data.map((item, idx) => ({
    ...item,
    fill: isHighlighted(item) ? HIGHLIGHT_COLOR : COLORS[idx % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-green-100">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" domain={[0, 'auto']} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 11 }} />
          <Tooltip 
            formatter={(value, name, props) => {
              const item = props.payload;
              return [`${item[metric.key]} (${value.toFixed(1)}%)`, metric.label];
            }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #22c55e', borderRadius: '8px' }}
          />
          <Bar dataKey={metric.percentKey} radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DataTable = ({ data, selectedMetric }) => {
  const metric = METRICS.find(m => m.key === selectedMetric);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-green-50 to-green-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-green-800">Название</th>
            <th className="px-4 py-3 text-right font-semibold text-green-800">Значение</th>
            <th className="px-4 py-3 text-right font-semibold text-green-800">Доля</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className={`border-b border-green-50 ${isHighlighted(item) ? 'bg-green-100 font-semibold' : 'hover:bg-green-50'}`}>
              <td className="px-4 py-2">
                <span className={isHighlighted(item) ? 'text-green-700' : ''}>{item.name}</span>
                {item.developer === 'Унистрой' && <span className="ml-2 text-xs text-green-600">(Унистрой)</span>}
              </td>
              <td className="px-4 py-2 text-right">{metric.format(item[metric.key])}</td>
              <td className="px-4 py-2 text-right">{item[metric.percentKey].toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TrendChart = ({ city, dataType, selectedMetric }) => {
  const data = dataType === 'developers' ? developerData : projectData;
  const metric = METRICS.find(m => m.key === selectedMetric);
  
  const entities = useMemo(() => {
    const entitySet = new Set();
    MONTHS.forEach(month => {
      const monthData = data[city]?.[month] || [];
      monthData.forEach(item => entitySet.add(item.name));
    });
    return Array.from(entitySet);
  }, [city, dataType]);

  const chartData = MONTHS.map(month => {
    const monthData = data[city]?.[month] || [];
    const point = { month: month.substring(0, 3) };
    monthData.forEach(item => {
      point[item.name] = item[metric.percentKey];
    });
    return point;
  });

  const checkHighlight = (name) => {
    if (name === 'Унистрой') return true;
    const allData = Object.values(data[city] || {}).flat();
    return allData.some(item => item.name === name && item.developer === 'Унистрой');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-green-100">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v) => `${v?.toFixed(1)}%`} contentStyle={{ backgroundColor: '#fff', border: '1px solid #22c55e', borderRadius: '8px' }} />
          <Legend />
          {entities.slice(0, 8).map((entity, idx) => (
            <Line
              key={entity}
              type="monotone"
              dataKey={entity}
              stroke={checkHighlight(entity) ? HIGHLIGHT_COLOR : COLORS[idx % COLORS.length]}
              strokeWidth={checkHighlight(entity) ? 3 : 1.5}
              dot={{ r: checkHighlight(entity) ? 5 : 3, fill: checkHighlight(entity) ? HIGHLIGHT_COLOR : COLORS[idx % COLORS.length] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '5555') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-green-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-3xl text-white font-bold">🛀</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Доля рынка</h1>
          <p className="text-gray-500 mt-2">Аналитика недвижимости</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className={`w-full px-4 py-3 rounded-xl border-2 ${error ? 'border-red-400 bg-red-50' : 'border-green-200'} focus:border-green-500 focus:outline-none transition-all text-center text-lg`}
          />
          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Казань');
  const [selectedMonth, setSelectedMonth] = useState('Ноябрь');
  const [selectedMetric, setSelectedMetric] = useState('units');
  const [dataType, setDataType] = useState('developers');

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const currentData = dataType === 'developers' 
    ? (developerData[selectedCity]?.[selectedMonth] || [])
    : (projectData[selectedCity]?.[selectedMonth] || []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <header className="bg-white shadow-md border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold"></span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Доля рынка</h1>
            </div>
            <button onClick={() => setIsAuthenticated(false)} className="text-gray-500 hover:text-green-600 transition-colors">Выход</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-green-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Город</label>
              <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-green-200 focus:border-green-500 focus:outline-none bg-white">
                {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Месяц</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-green-200 focus:border-green-500 focus:outline-none bg-white">
                {MONTHS.map(month => <option key={month} value={month}>{month}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Метрика</label>
              <select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-green-200 focus:border-green-500 focus:outline-none bg-white">
                {METRICS.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Тип данных</label>
              <div className="flex rounded-lg overflow-hidden border border-green-200">
                <button onClick={() => setDataType('developers')} className={`flex-1 py-2 text-sm font-medium transition-all ${dataType === 'developers' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}>
                  Застройщики
                </button>
                <button onClick={() => setDataType('projects')} className={`flex-1 py-2 text-sm font-medium transition-all ${dataType === 'projects' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}>
                  ЖК
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <DataChart data={currentData} selectedMetric={selectedMetric} />
          <DataTable data={currentData} selectedMetric={selectedMetric} />
        </div>

        <div className="mb-6">
          <TrendChart city={selectedCity} dataType={dataType} selectedMetric={selectedMetric} />
        </div>
      </div>
    </div>
  );
}
