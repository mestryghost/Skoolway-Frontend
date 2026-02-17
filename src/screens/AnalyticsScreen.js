import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AnalyticsContent } from '../components/analytics/AnalyticsContent';

export function AnalyticsScreen() {
  return (
    <DashboardLayout activeNavKey="analytics">
      <AnalyticsContent />
    </DashboardLayout>
  );
}
