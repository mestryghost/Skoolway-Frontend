import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { createTenant, updateStructure, activateTenant } from '../api/onboarding';
import { WizardStep1SchoolIdentity } from '../components/onboarding/WizardStep1SchoolIdentity';
import { WizardStep2Structure } from '../components/onboarding/WizardStep2Structure';
import { WizardStep3Import } from '../components/onboarding/WizardStep3Import';
import { WizardStep4Transport } from '../components/onboarding/WizardStep4Transport';
import { WizardStep5Confirm } from '../components/onboarding/WizardStep5Confirm';
import { Logo } from '../components/landing/Logo';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function OnboardingWizardScreen() {
  const { tenantId: authTenantId, onboardingStep: authStep, schoolName: authSchoolName, tenantCode: authTenantCode, checkAuth } = useAuth();
  const { goTo } = useNavigation();
  const [step, setStep] = useState(authStep);
  const [tenantId, setTenantId] = useState(authTenantId ?? null);
  const [tenantCode, setTenantCode] = useState(authTenantCode ?? '');
  const [schoolName, setSchoolName] = useState(authSchoolName ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleStep1Submit = async (payload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await createTenant(payload);
      setTenantId(res.tenantId);
      setTenantCode(res.tenantCode);
      setSchoolName(payload.schoolName);
      setStep(2);
      await checkAuth();
    } catch (e) {
      setError(e.message || 'Failed to create school');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Next = async (payload) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateStructure(tenantId, { levelStructures: payload.levelStructures });
      setStep(3);
      await checkAuth();
    } catch (e) {
      setError(e.message || 'Failed to save structure');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep5Complete = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await activateTenant(tenantId);
      await checkAuth();
      goTo('dashboard');
    } catch (e) {
      setError(e.message || 'Failed to activate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = tenantId ? step : 1;

  if (!tenantId && currentStep === 1) {
    return (
      <View style={styles.page}>
        <View style={styles.header}>
          <Logo />
          <Text style={styles.stepLabel}>Step 1 of 5</Text>
        </View>
        {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
        <WizardStep1SchoolIdentity onSubmit={handleStep1Submit} isSubmitting={isSubmitting} />
      </View>
    );
  }

  const stepLabels = { 2: 'Step 2 of 5', 3: 'Step 3 of 5', 4: 'Step 4 of 5', 5: 'Step 5 of 5' };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Logo />
        <Text style={styles.stepLabel}>{stepLabels[currentStep]}</Text>
      </View>
      {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text></View> : null}
      {currentStep === 2 && <WizardStep2Structure onNext={handleStep2Next} onBack={() => setStep(1)} />}
      {currentStep === 3 && <WizardStep3Import onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {currentStep === 4 && <WizardStep4Transport onNext={() => setStep(5)} onBack={() => setStep(3)} />}
      {currentStep === 5 && (
        <WizardStep5Confirm
          schoolName={schoolName}
          tenantCode={tenantCode}
          onComplete={handleStep5Complete}
          onBack={() => setStep(4)}
          isSubmitting={isSubmitting}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.pageBackground },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.pageHorizontal, paddingVertical: 16 },
  stepLabel: { fontSize: 14, color: colors.textSecondary },
  error: { backgroundColor: '#fef2f2', padding: 12, marginHorizontal: spacing.gutter },
  errorText: { color: '#b91c1c', fontSize: 14 },
});
