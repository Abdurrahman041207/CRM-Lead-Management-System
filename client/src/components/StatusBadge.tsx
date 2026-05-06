const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/20 text-blue-400',
  CONTACTED: 'bg-yellow-500/20 text-yellow-400',
  QUALIFIED: 'bg-purple-500/20 text-purple-400',
  LOST: 'bg-red-500/20 text-red-400',
  WON: 'bg-green-500/20 text-green-400',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
}
