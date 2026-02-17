import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { NotificationsContent } from '../components/notifications/NotificationsContent';

export function NotificationsScreen() {
  return (
    <DashboardLayout activeNavKey="dashboard">
      <NotificationsContent />
    </DashboardLayout>
  );
}

