import { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { ManageScheduleContent } from '../components/schedule/ManageScheduleContent';
import { ScheduleDetailPanel } from '../components/schedule/ScheduleDetailPanel';

export function ManageScheduleScreen() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const openSlotEditRef = useRef(null);

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

  const handleRegisterOpenSlotEdit = useCallback((fn) => {
    openSlotEditRef.current = fn;
  }, []);

  const handleEditSlot = useCallback((slot) => {
    if (slot?.selectedSlot) openSlotEditRef.current?.(slot.selectedSlot);
  }, []);

  const rightSidebar =
    selectedSlot || selectedEvent ? (
      <ScheduleDetailPanel
        slot={selectedSlot}
        event={selectedEvent}
        onClose={handleClosePanel}
        onEditSlot={handleEditSlot}
      />
    ) : null;

  return (
    <DashboardLayout activeNavKey="manage-schedule" rightSidebar={rightSidebar}>
      <ManageScheduleContent
        selectedSlot={selectedSlot}
        selectedEvent={selectedEvent}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onRegisterOpenSlotEdit={handleRegisterOpenSlotEdit}
      />
    </DashboardLayout>
  );
}
