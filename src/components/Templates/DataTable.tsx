import React, { useState, ReactNode } from 'react';
import { Search, Filter, Plus, EllipsisVertical, ChevronDown } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Organisms/Table';
import { Badge } from '@/components/atoms/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/atoms/DropdownMenu';
import Pagination from '@/components/atoms/Pagination';
import DeleteDialog from '@/components/molecules/DeleteDialog';
import TableSkeleton from '@/components/Templates/TableSkeleton';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T, value: any) => ReactNode;
  className?: string;
}

export interface ActionMenuItem<T = any> {
  label: string;
  onClick: (item: T, e: React.MouseEvent) => void;
  className?: string;
  separator?: boolean;
}

export interface FilterConfig {
  searchPlaceholder?: string;
  searchFields?: string[];
  customFilters?: ReactNode;
}

export interface DataTableProps<T = any> {
  data: T[];
  loading?: boolean;

  columns: TableColumn<T>[];
  title: string;

  actions?: ActionMenuItem<T>[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  secondaryActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link' | 'foreground' | 'background' | 'slatePrimary' | 'slateSecondary' | 'negative' | 'primaryOutline' | 'secondaryOutline';
  }>;

  onRowClick?: (item: T) => void;
  getRowKey: (item: T) => string;

  filter?: FilterConfig;
  onSearch?: (searchText: string) => void;

  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems?: number; // Optional, if you want to show total items count
    onPageChange: (page: number) => void;
    showPreviousNext?: boolean;
    maxVisiblePages?: number;
  };

  deleteConfig?: {
    onDelete: (item: T) => Promise<void>;
    getDeleteTitle?: (item: T) => string;
    getDeleteDescription?: (item: T) => string;
    getItemName?: (item: T) => string;
  };

  className?: string;
  emptyStateMessage?: string;
}

export const defaultRenderers = {
  avatar: <T extends { firstName: string; lastName: string }>(item: T) => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage />
        <AvatarFallback>
          {item.firstName.charAt(0).toUpperCase()}{item.lastName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="font-medium text-gray-900">{item.firstName} {item.lastName}</div>
    </div>
  ),

  badge: (badgeConfig: { getValue: (item: any) => string; getColor: (value: string) => string }) =>
    (item: any) => {
      const value = badgeConfig.getValue(item);
      const colorClass = badgeConfig.getColor(value);
      return (
        <Badge className={`${colorClass} border-0`}>
          • {value}
        </Badge>
      );
    },

  boolean: (item: any, value: boolean) => (
    <Badge className={`${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} hover:bg-current`}>
      • {value ? 'Active' : 'Inactive'}
    </Badge>
  ),

  smoking: (item: any, value: boolean) => (
    <span className="text-gray-600">{value ? 'Smoking' : 'No Smoking'}</span>
  ),

  occupancy: (item: any) => (
    <span className="text-gray-600">
      {item.roomType?.adultOccupancy || item.adultOccupancy || 0} Adult, {item.roomType?.childOccupancy || item.childOccupancy || 0} Child
    </span>
  )
};

export const getStatusColor = (status: string | boolean): string => {
  if (typeof status === 'boolean') {
    return status
      ? 'bg-green-100 text-green-700 hover:bg-green-100'
      : 'bg-red-100 text-red-700 hover:bg-red-100';
  }

  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'inactive':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};

const DataTable = <T,>({
  data,
  loading = false,
  columns,
  title,
  actions,
  primaryAction,
  secondaryActions,
  onRowClick,
  getRowKey,
  filter,
  onSearch,
  pagination,
  deleteConfig,
  className = '',
  emptyStateMessage = 'No data found'
}: DataTableProps<T>) => {
  const [searchText, setSearchText] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Handle search
  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchText('');
    onSearch?.('');
  };

  // Handle delete
  const handleDeleteClick = (item: T, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteConfig?.onDelete) return;

    setDeleteLoading(true);
    try {
      await deleteConfig.onDelete(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Render cell content
  const renderCell = (item: T, column: TableColumn<T>) => {
    const value = (item as any)[column.key];

    if (column.render) {
      return column.render(item, value);
    }

    return value;
  };

  // Filter actions to separate delete from others
  const deleteAction = actions?.find(action => action.label.toLowerCase() === 'delete');
  const otherActions = actions?.filter(action => action.label.toLowerCase() !== 'delete');

  if (loading) {
    return <TableSkeleton title={title} />;
  }

  return (
    <>
      <div className={`p-6 bg-gray-50 min-h-screen ${className}`}>
        {/* Header Section */}
        <div className="mb-6">
          {/* Title with Count */}
          <div className="flex items-center gap-2 mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <span className="bg-hms-primary/15 text-sm font-medium px-2.5 py-0.5 rounded-full">
              {pagination?.totalItems} {pagination?.totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Search Bar and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex flex-row justify-between items-center border border-slate-300 rounded-full px-3">
              <Input
                type="text"
                placeholder={filter?.searchPlaceholder || "Search text"}
                value={searchText}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-85 h-7 border-none outline-none focus-visible:ring-0 focus:border-none bg-transparent flex-1 px-0"
              />
              {searchText && (
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 mr-2 text-sm font-medium"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <Search className="h-4 w-4 text-gray-400" />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-3 py-2 border-2 border-gray-300 hover:border-gray-400"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>

            {/* Custom Filters */}
            {showFilter && filter?.customFilters && (
              <div className="flex items-center gap-2">
                {filter.customFilters}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 ml-auto">
              {secondaryActions?.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}

              {primaryAction && (
                <Button onClick={primaryAction.onClick} className="flex items-center gap-2">
                  {primaryAction.icon || <Plus className="h-4 w-4" />}
                  {primaryAction.label}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg">
          <Table>
            <TableHeader className="bg-hms-accent/15">
              <TableRow className="border-b border-gray-200">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`text-left font-medium text-gray-900 px-6 py-2 ${column.className || ''}`}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.sortable ? (
                      <div className="flex items-center gap-1">
                        {column.label}
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
                {(actions && actions.length > 0) && (
                  <TableHead className="w-[100px]"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="py-10 text-center text-gray-600">
                    {emptyStateMessage}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={getRowKey(item)}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className={`border-b-2 hover:bg-accent ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.key}
                        className={`px-6 py-4 ${column.className || ''}`}
                      >
                        {renderCell(item, column)}
                      </TableCell>
                    ))}

                    {(actions && actions.length > 0) && (
                      <TableCell className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="bg-inherit shadow-none p-0 text-hms-accent font-bold text-xl border hover:border-hms-accent hover:bg-hms-accent/15"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="shadow-lg border-hms-accent">
                            {otherActions?.map((action, index) => (
                              <React.Fragment key={index}>
                                <DropdownMenuItem
                                  onClick={(e) => action.onClick(item, e)}
                                  className={action.className}
                                >
                                  {action.label}
                                </DropdownMenuItem>
                                {action.separator && <DropdownMenuSeparator />}
                              </React.Fragment>
                            ))}

                            {deleteAction && otherActions && otherActions.length > 0 && (
                              <DropdownMenuSeparator />
                            )}

                            {deleteConfig && (
                              <DropdownMenuItem
                                onClick={(e) => handleDeleteClick(item, e)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            showPreviousNext={pagination.showPreviousNext}
            maxVisiblePages={pagination.maxVisiblePages}
          />
        )}
      </div>

      {/* Delete Dialog */}
      {deleteConfig && (
        <DeleteDialog
          isOpen={deleteDialogOpen}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
          title={deleteConfig.getDeleteTitle?.(itemToDelete!) || 'Delete Item'}
          description={
            deleteConfig.getDeleteDescription?.(itemToDelete!) ||
            `Are you sure you want to delete ${deleteConfig.getItemName?.(itemToDelete!) || 'this item'}? This action cannot be undone.`
          }
        />
      )}
    </>
  );
};

export default DataTable;