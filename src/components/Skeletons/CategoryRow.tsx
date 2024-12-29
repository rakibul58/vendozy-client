import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export default function CategoryRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="w-12 h-12 border-gray-200 dark:border-gray-700 rounded-md animate-pulse"></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton className="w-32 h-4 border-gray-200 dark:border-gray-700 rounded animate-pulse"></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton className="w-48 h-4 border-gray-200 dark:border-gray-700 rounded animate-pulse"></Skeleton>
      </TableCell>
      <TableCell>
        <Skeleton className="flex space-x-2">
          <Skeleton className="w-8 h-8 border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"></Skeleton>
          <Skeleton className="w-8 h-8 border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"></Skeleton>
        </Skeleton>
      </TableCell>
    </TableRow>
  );
}
