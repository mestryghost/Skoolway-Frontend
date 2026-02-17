import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { TransportContent } from '../components/transport/TransportContent';
import { TransportSidebar } from '../components/transport/TransportSidebar';

export function TransportScreen() {
  const rightSidebar = <TransportSidebar />;

  return (
    <DashboardLayout activeNavKey="transport" rightSidebar={rightSidebar}>
      <TransportContent />
    </DashboardLayout>
  );
}
