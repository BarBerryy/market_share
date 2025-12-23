import React from 'react';
import { CONFIG } from '../config';
import { isUnistroy } from '../utils/parser';
import styles from './DataTable.module.css';

const DataTable = ({ data, metric, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <div>Нет данных для отображения</div>
      </div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) => (b[metric.percentKey] || 0) - (a[metric.percentKey] || 0)
  );

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>
              {type === 'developers' ? 'Застройщик' : 'Проект'}
            </th>
            <th className={styles.th}>{metric.label}</th>
            <th className={styles.th}>Доля</th>
            <th className={`${styles.th} ${styles.thBar}`}></th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => {
            const isUni = isUnistroy(item.name);
            const color = isUni 
              ? CONFIG.UNISTROY_COLOR 
              : CONFIG.COLORS[index % CONFIG.COLORS.length];
            const percent = item[metric.percentKey] || 0;

            return (
              <tr 
                key={item.name} 
                className={`${styles.row} ${isUni ? styles.rowHighlight : ''}`}
              >
                <td className={styles.td}>
                  <div className={styles.companyName}>
                    <span 
                      className={styles.rank}
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </span>
                    <span className={isUni ? styles.nameHighlight : styles.name}>
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className={`${styles.td} ${styles.value}`}>
                  {metric.format(item[metric.key])}
                </td>
                <td className={`${styles.td} ${styles.percent} ${isUni ? styles.percentHighlight : ''}`}>
                  {percent.toFixed(1)}%
                </td>
                <td className={styles.td}>
                  <div className={styles.percentBar}>
                    <div
                      className={styles.percentFill}
                      style={{
                        width: `${Math.min(percent * 2.5, 100)}%`,
                        background: `linear-gradient(90deg, ${color}, ${color}dd)`,
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

export default DataTable;
