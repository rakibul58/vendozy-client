import { TableCell, TableRow } from "../ui/table";

export default function CategoryRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="w-12 h-12 border-gray-200 dark:border-gray-700 rounded-md animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="w-32 h-4 border-gray-200 dark:border-gray-700 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="w-48 h-4 border-gray-200 dark:border-gray-700 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <div className="w-8 h-8 border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"></div>
          <div className="w-8 h-8 border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </TableCell>
    </TableRow>
  );
}
