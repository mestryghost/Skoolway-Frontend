import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import {
  Header,
  Hero,
  LeadFormSection,
  Footer,
} from '../components/landing';

export function LandingScreen() {
  const [scrolled, setScrolled] = useState(false);

  return (
    <View style={styles.page}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={(e) => {
          const y = e.nativeEvent?.contentOffset?.y ?? 0;
          setScrolled(y > 24);
        }}
        scrollEventThrottle={16}
      >
        <Header scrolled={scrolled} />
        <Hero />
        <LeadFormSection />
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
});
