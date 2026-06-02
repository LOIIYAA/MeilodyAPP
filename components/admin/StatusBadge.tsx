interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const baseClass = "px-2 py-1 rounded text-sm font-medium";
  let colorClass = "";

  switch (status) {
    case "Pending":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
    case "On Progress":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case "Done":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "Cancelled":
      colorClass = "bg-red-100 text-red-800";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800";
  }

  return <span className={`${baseClass} ${colorClass}`}>{status}</span>;
}