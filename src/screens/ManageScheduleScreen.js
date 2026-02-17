import { useState } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ManageScheduleContent } from '../components/schedule/ManageScheduleContent';
import { ScheduleDetailPanel } from '../components/schedule/ScheduleDetailPanel';

export function ManageScheduleScreen() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
  };

  const handleClosePanel = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
  };

  const rightSidebar =
    selectedSlot || selectedEvent ? (
      <ScheduleDetailPanel
        slot={selectedSlot}
        event={selectedEvent}
        onClose={handleClosePanel}
      />
    ) : null;

  return (
    <DashboardLayout activeNavKey="dashboard" rightSidebar={rightSidebar}>
      <ManageScheduleContent
        selectedSlot={selectedSlot}
        selectedEvent={selectedEvent}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </DashboardLayout>
  );
}
