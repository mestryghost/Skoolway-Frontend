import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { TeacherProfileContent } from '../components/teachers/TeacherProfileContent';

export function TeacherProfileScreen() {
  return (
    <DashboardLayout activeNavKey="teachers">
      <TeacherProfileContent />
    </DashboardLayout>
  );
}
