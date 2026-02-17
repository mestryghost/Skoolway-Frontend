import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ReportsContent } from '../components/reports/ReportsContent';

export function ReportsScreen() {
  return (
    <DashboardLayout activeNavKey="dashboard">
      <ReportsContent />
    </DashboardLayout>
  );
}
