import { useState, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopNav } from './DashboardTopNav';
import { colors } from '../../theme/colors';

const BREAKPOINT = 900;

/**
 * Reusable dashboard layout with sidebar, top navbar, and main content area.
 * Used across all dashboard pages (Dashboard, Students, Parents, etc.).
 */
export function DashboardLayout({ children, activeNavKey = 'dashboard', rightSidebar }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [narrow, setNarrow] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < BREAKPOINT;
    const { width } = Dimensions.get('window');
    return width < BREAKPOINT;
  });

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window: { width } }) => {
      setNarrow(width < BREAKPOINT);
      if (width >= BREAKPOINT) setSidebarOpen(false);
    });
    return () => sub?.remove?.();
  }, []);

  return (
    <View style={styles.page}>
      {narrow && sidebarOpen && (
        <Pressable style={styles.overlay} onPress={() => setSidebarOpen(false)} />
      )}
      {(!narrow || sidebarOpen) && (
        <View style={[styles.sidebarWrap, narrow && styles.sidebarOverlay]}>
          <DashboardSidebar activeKey={activeNavKey} onClose={narrow ? () => setSidebarOpen(false) : undefined} />
        </View>
      )}
      <View style={styles.main}>
        <DashboardTopNav onMenuPress={narrow ? () => setSidebarOpen(true) : null} />
        <View style={styles.contentArea}>
          <View style={styles.mainContent}>{children}</View>
          {rightSidebar && <View style={styles.rightSidebar}>{rightSidebar}</View>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.pageBackground,
  },
  sidebarWrap: {
    zIndex: 10,
  },
  sidebarOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 99,
  },
  main: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  mainContent: {
    flex: 1,
    minWidth: 0,
  },
  rightSidebar: {
    width: 320,
    minWidth: 280,
    backgroundColor: colors.pageBackground,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderSubtle,
  },
});
