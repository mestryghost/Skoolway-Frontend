import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ParentDirectoryContent } from '../components/parents/ParentDirectoryContent';
import { ParentDirectorySidebar } from '../components/parents/ParentDirectorySidebar';

export function ParentsScreen() {
  const rightSidebar = <ParentDirectorySidebar />;

  return (
    <DashboardLayout activeNavKey="parents" rightSidebar={rightSidebar}>
      <ParentDirectoryContent />
    </DashboardLayout>
  );
}
