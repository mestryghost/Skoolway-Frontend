import { Pressable, StyleSheet, Text, View } from 'react-native';
import { landingCopy } from '../../constants/landing';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Logo } from './Logo';

function LinkColumn({ title, links }) {
  return (
    <View style={styles.column}>
      <Text style={styles.columnTitle}>{title}</Text>
      {links.map((label) => (
        <Pressable
          key={label}
          style={({ pressed }) => [pressed && styles.linkPressed]}
          accessibilityRole="link"
        >
          <Text style={styles.link}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Footer() {
  const { footer } = landingCopy;

  return (
    <View style={styles.wrapper} accessibilityRole="contentinfo">
      <View style={styles.inner}>
        <View style={styles.top}>
          <View style={styles.brand}>
            <Logo />
            <Text style={styles.desc}>{footer.description}</Text>
          </View>
          <LinkColumn title="Product" links={footer.product} />
          <LinkColumn title="Support" links={footer.support} />
          <LinkColumn title="Solutions for" links={footer.solutions} />
          <LinkColumn title="Legal" links={footer.legal} />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.copyright}>
            © {new Date().getFullYear()} Skoolway. All Rights Reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.footerBackground,
    paddingVertical: spacing.sectionGap,
    paddingHorizontal: spacing.pageHorizontal,
    marginTop: spacing.sectionGapLarge,
  },
  inner: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sectionGap,
  },
  brand: { flex: 1, minWidth: 200 },
  desc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 12,
  },
  column: { minWidth: 100 },
  columnTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  link: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 8,
  },
  linkPressed: { opacity: 0.7 },
  bottom: {
    marginTop: spacing.sectionGap,
    paddingTop: spacing.gutter,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  copyright: {
    ...typography.small,
    color: colors.textSecondary,
  },
});
