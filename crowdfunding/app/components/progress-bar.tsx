interface ProgressBarProps {
  current: number;
  goal: number;
  className?: string;
}

export function ProgressBar({ current, goal, className }: ProgressBarProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const isCompleted = current >= goal;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ease-out ${
            isCompleted ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <span>{(current / 10_000_000).toFixed(2)} XLM</span>
        <span>{percentage.toFixed(1)}%</span>
        <span>{(goal / 10_000_000).toFixed(0)} XLM</span>
      </div>
    </div>
  );
}
