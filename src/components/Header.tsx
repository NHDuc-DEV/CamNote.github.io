import React from 'react';
import { 
  Menu, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Plus,
  HelpCircle,
  Folder as FolderIcon,
  Tag as TagIcon,
  CheckSquare
} from 'lucide-react';
import { ViewMode, SortOption, FilterState, Folder } from '../types';

interface HeaderProps {
  filter: FilterState;
  folders: Folder[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onCreateNewNote: () => void;
  onOpenShortcuts: () => void;
  onOpenMobileSidebar: () => void;
  totalFilteredCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  filter,
  folders,
  searchQuery,
  onSearchChange,
  viewMode,
  onToggleViewMode,
  sortOption,
  onSortChange,
  onCreateNewNote,
  onOpenShortcuts,
  onOpenMobileSidebar,
  totalFilteredCount,
}) => {
  // Determine breadcrumb label
  const getFilterTitle = () => {
    if (filter.type === 'system') {
      switch (filter.value) {
        case 'all': return 'Tất cả ghi chú';
        case 'pinned': return 'Đã ghim';
        case 'favorites': return 'Yêu thích';
        case 'todos': return 'Việc cần làm (To-Do)';
        case 'archive': return 'Kho lưu trữ';
        case 'trash': return 'Thùng rác';
        default: return 'Ghi chú';
      }
    }
    if (filter.type === 'folder') {
      const folder = folders.find(f => f.id === filter.value);
      return folder ? folder.name : 'Thư mục';
    }
    if (filter.type === 'tag') {
      return `#${filter.value}`;
    }
    return 'Ghi chú';
  };

  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-orange-100/70 flex items-center justify-between gap-3 shrink-0">
      
      {/* Zone 1: Mobile Menu Toggle & Title / Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-neutral-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
          aria-label="Mở danh mục ghi chú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <span className="text-sm font-semibold text-neutral-900 truncate">
            {getFilterTitle()}
          </span>
          <span className="text-xs text-neutral-400 font-mono tabular-nums shrink-0">
            ({totalFilteredCount})
          </span>
        </div>
      </div>

      {/* Zone 2: Real-time Search */}
      <div className="flex-1 max-w-md mx-2">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm tiêu đề, nội dung, #thẻ..."
            className="w-full pl-9 pr-8 py-1.5 bg-neutral-50 border border-neutral-200/90 rounded-lg text-xs md:text-sm text-neutral-800 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: View Toggle, Sort & Quick Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Sort Dropdown */}
        <div className="relative hidden sm:block">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs font-medium text-neutral-600 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-lg py-1.5 pl-2.5 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
            title="Sắp xếp danh sách"
          >
            <option value="updated-desc">Mới sửa gần đây</option>
            <option value="created-desc">Mới tạo nhất</option>
            <option value="updated-asc">Cũ nhất trước</option>
            <option value="title-asc">Tiêu đề (A-Z)</option>
            <option value="title-desc">Tiêu đề (Z-A)</option>
          </select>
          <ArrowUpDown className="w-3 h-3 text-neutral-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* View Mode Switcher */}
        <div className="hidden sm:flex items-center p-0.5 bg-neutral-100 rounded-lg border border-neutral-200/60">
          <button
            onClick={() => onToggleViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Xem dạng lưới"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleViewMode('list')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Xem dạng danh sách"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <button
          onClick={onOpenShortcuts}
          className="p-2 text-neutral-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer hidden md:flex items-center"
          title="Phím tắt tiện ích"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Top Bar Quick Create Button */}
        <button
          onClick={onCreateNewNote}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Viết ghi chú</span>
        </button>
      </div>
    </header>
  );
};
