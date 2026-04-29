import { AlertTriangle } from "lucide-react";

export function LegalWarning() {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex items-start gap-2">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <p>
          Immigration, tax, health insurance, and pension rules depend on your exact
          facts. Confirm important decisions with official offices or qualified
          professionals.
        </p>
      </div>
    </section>
  );
}
