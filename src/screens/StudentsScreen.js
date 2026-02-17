import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StudentDirectoryContent } from '../components/students/StudentDirectoryContent';
import { StudentDirectorySidebar } from '../components/students/StudentDirectorySidebar';

export function StudentsScreen() {
  const rightSidebar = <StudentDirectorySidebar />;

  return (
    <DashboardLayout activeNavKey="students" rightSidebar={rightSidebar}>
      <StudentDirectoryContent />
    </DashboardLayout>
  );
}
