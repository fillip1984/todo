import type { TaskType } from "@todo/api";

import OGCard from "~/components/my-ui/og-card";

export default function MediaCard({ task }: { task: TaskType }) {
  return (
    <div className="mb-2 rounded-lg border border-gray-700 bg-gray-900 p-4">
      <h6 className="mb-1 text-lg font-semibold">{task.name}</h6>
      {task.description && (
        <p className="text-sm text-gray-400">{task.description}</p>
      )}
      <OGCard />
    </div>
  );
}
