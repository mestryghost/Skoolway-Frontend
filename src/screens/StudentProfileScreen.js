import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { StudentProfileContent } from '../components/students/StudentProfileContent';

export function StudentProfileScreen() {
  return (
    <DashboardLayout activeNavKey="students">
      <StudentProfileContent />
    </DashboardLayout>
  );
}
