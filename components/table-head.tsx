"use client";
import Column from "@/schemas/Column";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSortUp } from "react-icons/fa";

interface Props {
  columns: Column[];
}

const TableHead = ({ columns }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const renderSortIcon = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return (
      params.get("orderBy") === value && <FaSortUp className="inline-block" />
    );
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              const isExist = params.get("orderBy");
              if ((isExist && isExist === column.value) || !column.value) {
                params.delete("orderBy");
              } else {
                params.set("orderBy", column.value.toString());
              }
              const query = params.toString();
              router.push("?" + query);
            }}
            key={column._id}
          >
            <div className="flex items-center gap-1 cursor-pointer">
              {column.label} {renderSortIcon(column.value)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
