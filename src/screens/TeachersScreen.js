import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { TeacherManagementContent } from '../components/teachers/TeacherManagementContent';
import { TeacherManagementSidebar } from '../components/teachers/TeacherManagementSidebar';

export function TeachersScreen() {
  const rightSidebar = <TeacherManagementSidebar />;

  return (
    <DashboardLayout activeNavKey="teachers" rightSidebar={rightSidebar}>
      <TeacherManagementContent />
    </DashboardLayout>
  );
}
