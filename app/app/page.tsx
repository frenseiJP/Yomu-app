import YomuPrototypePage from "@/app/YomuPrototypePage";
import OnboardingGate from "@/components/auth/OnboardingGate";

export default function AppShellPage() {
  return (
    <OnboardingGate>
      <YomuPrototypePage />
    </OnboardingGate>
  );
}
