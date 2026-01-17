import type { ListType } from "@todo/api";

export default function ListCard({ list }: { list: ListType }) {
  return (
    <div className="border-b p-4">
      <h2 className="text-lg font-semibold">{list.name}</h2>
      <p className="text-sm text-gray-600">{list.description}</p>
    </div>
  );
}
