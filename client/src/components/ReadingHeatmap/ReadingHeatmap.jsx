import React, { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const ReadingHeatmap = ({ books }) => {
  // Формуємо дані
  const { heatmapData, dataMap } = useMemo(() => {
    const map = {};
    books.forEach(book => {
      book.readingLog?.forEach(log => {
        const [d, m, y] = log.date.split('.');
        const dateKey = `${y}-${m}-${d}`;
        map[dateKey] = (map[dateKey] || 0) + log.pages;
      });
    });
    const data = Object.keys(map).map(date => ({ date, count: map[date] }));
    return { heatmapData: data, dataMap: map };
  }, [books]);

  // Рахуємо страйк (кількість днів поспіль)
  const calculateStreak = () => {
    let streak = 0;
    let d = new Date();
    while (true) {
      const dateStr = d.toISOString().split('T')[0];
      if (dataMap[dateStr] && dataMap[dateStr] > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h3 className="heatmap-title">Річний прогрес</h3>
        {streak > 0 && (
          <div className="streak-badge">🔥 {streak} днів поспіль</div>
        )}
      </div>

      <CalendarHeatmap
        startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
        endDate={new Date()}
        values={heatmapData}
        titleForValue={(value) => value ? `${value.date}: ${value.count} стор.` : 'Без читання'}
        classForValue={(value) => {
          if (!value || value.count === 0) return 'color-empty';
          if (value.count > 100) return 'color-scale-4';
          if (value.count > 50) return 'color-scale-3';
          if (value.count > 20) return 'color-scale-2';
          return 'color-scale-1';
        }}
      />
      <div className="heatmap-legend">
        <div className="legend-colors">
          <div className="color-empty"></div>
          <div className="color-scale-1"></div>
          <div className="color-scale-2"></div>
          <div className="color-scale-3"></div>
          <div className="color-scale-4"></div>
        </div>       
      </div>
    </div>
  );
};

export default ReadingHeatmap;