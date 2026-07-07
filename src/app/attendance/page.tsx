import { AttendanceHeader } from '@/components/attendance/AttendanceHeader';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { AttendanceLegend } from '@/components/attendance/AttendanceLegend';
import { SummaryCard } from '@/components/attendance/SummaryCard';
import { AttendanceInfoAlert } from '@/components/attendance/AttendanceInfoAlert';
import { attendanceService } from '@/services';
import { requireRouteAccess } from '@/lib/requireRouteAccess';
import styles from './page.module.css';

export default async function AttendancePage() {
  await requireRouteAccess('/attendance');
  const { monthLabel, days, employees, summary } = await attendanceService.getMonth();

  return (
    <>
      <AttendanceHeader monthLabel={monthLabel} />

      <AttendanceTable employees={employees} days={days} />
      <AttendanceLegend />

      <div className={styles.summaryGrid}>
        {summary.map((metric) => (
          <SummaryCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={styles.alertWrap}>
        <AttendanceInfoAlert />
      </div>
    </>
  );
}
