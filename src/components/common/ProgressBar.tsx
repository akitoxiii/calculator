interface ProgressBarProps {
  progress: number;
  height?: string;
  color?: string;
}

export function ProgressBar({ progress, height = 'h-1', color = 'bg-primary' }: ProgressBarProps) {
  return (
    <div className={`w-full ${height} bg-gray-200 fixed top-0 left-0 z-50`}>
      <div
        className={`${height} ${color} transition-all duration-300 ease-out`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 