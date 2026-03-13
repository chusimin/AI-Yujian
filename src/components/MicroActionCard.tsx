"use client";

interface MicroActionCardProps {
  action: string;
  onDismiss?: () => void;
}

export function MicroActionCard({ action, onDismiss }: MicroActionCardProps) {
  return (
    <div className="p-5 rounded-lg bg-[var(--yj-primary-light)] border border-[var(--yj-secondary)]">
      <p className="text-xs text-[var(--yj-text-secondary)] mb-2">
        今日微行动建议
      </p>
      <p className="text-sm text-[var(--yj-text-primary)] leading-relaxed">
        {action}
      </p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-3 text-xs text-[var(--yj-text-muted)] hover:text-[var(--yj-text-secondary)] transition-colors"
        >
          知道了
        </button>
      )}
    </div>
  );
}
