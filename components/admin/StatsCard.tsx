interface StatCardProps {
  title: string;
  count: number;
  subtitle: string;
}

export default function StatCard({ title, count, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-[#013B09]">{count}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}