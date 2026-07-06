import FrenseiAppShell from "@/app/FrenseiAppShell";
import OnboardingGate from "@/components/auth/OnboardingGate";

export default function AppShellPage() {
  return (
    <OnboardingGate>
      <FrenseiAppShell />
    </OnboardingGate>
  );
}
