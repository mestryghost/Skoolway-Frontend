import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const SEPARATOR = ' > ';

/**
 * @param {Object} props
 * @param {{ label: string, screen?: string }[]} props.segments - Each segment: label (required), screen (optional). If screen is set, the segment is clickable and navigates to that screen. Last segment is typically current page (no screen).
 */
export function Breadcrumb({ segments }) {
  const { goTo } = useNavigation();

  if (!segments?.length) return null;

  return (
    <View style={styles.wrap}>
      {segments.map((seg, index) => {
        const isLast = index === segments.length - 1;
        const isClickable = !isLast && seg.screen;

        return (
          <View key={index} style={styles.segmentWrap}>
            {index > 0 && <Text style={styles.separator}>{SEPARATOR}</Text>}
            {isClickable ? (
              <Pressable onPress={() => goTo(seg.screen)} style={styles.link}>
                <Text style={styles.linkText}>{seg.label}</Text>
              </Pressable>
            ) : (
              <Text style={styles.text}>{seg.label}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 },
  segmentWrap: { flexDirection: 'row', alignItems: 'center' },
  separator: { ...typography.small, color: colors.textSecondary },
  link: { paddingVertical: 2, paddingHorizontal: 0 },
  linkText: { ...typography.small, color: colors.primary, fontWeight: '500' },
  text: { ...typography.small, color: colors.textSecondary },
});
