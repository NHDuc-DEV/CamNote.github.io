import React, { useState } from 'react';
import { 
  FileText, 
  Pin, 
  Star, 
  CheckSquare, 
  Archive, 
  Trash2, 
  Folder as FolderIcon, 
  Plus, 
  Tag as TagIcon, 
  BarChart3, 
  Download, 
  Upload, 
  Sparkles, 
  FolderPlus, 
  Trash,
  X,
  Edit2
} from 'lucide-react';
import { Folder, FilterState, Note } from '../types';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  filter: FilterState;
  onSelectFilter: (filter: FilterState) => void;
  onCreateNewNote: () => void;
  onOpenTemplatePicker: () => void;
  onAddFolder: (name: string, color?: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onOpenStats: () => void;
  onOpenBackup: () => void;
  onEmptyTrash: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  notes,
  filter,
  onSelectFilter,
  onCreateNewNote,
  onOpenTemplatePicker,
  onAddFolder,
  onDeleteFolder,
  onRenameFolder,
  onOpenStats,
  onOpenBackup,
  onEmptyTrash,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  // Calculate counts
  const nonTrashNotes = notes.filter(n => !n.isTrash);
  const allCount = nonTrashNotes.filter(n => !n.isArchived).length;
  const pinnedCount = nonTrashNotes.filter(n => n.isPinned && !n.isArchived).length;
  const favoriteCount = nonTrashNotes.filter(n => n.isFavorite && !n.isArchived).length;
  const todoCount = nonTrashNotes.filter(n => n.todoItems && n.todoItems.length > 0 && !n.isArchived).length;
  const archivedCount = nonTrashNotes.filter(n => n.isArchived).length;
  const trashCount = notes.filter(n => n.isTrash).length;

  // Extract all unique tags
  const tagsMap = new Map<string, number>();
  nonTrashNotes.forEach(note => {
    note.tags.forEach(t => {
      const clean = t.trim().toLowerCase();
      if (clean) {
        tagsMap.set(clean, (tagsMap.get(clean) || 0) + 1);
      }
    });
  });
  const allTags = Array.from(tagsMap.entries()).sort((a, b) => b[1] - a[1]);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName('');
      setIsAddingFolder(false);
    }
  };

  const handleSaveRenameFolder = (id: string) => {
    if (editingFolderName.trim()) {
      onRenameFolder(id, editingFolderName.trim());
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-72 bg-white border-r border-orange-100/80 flex flex-col h-full
        transition-transform duration-200 ease-out
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-orange-100/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-neutral-900 tracking-tight flex items-center gap-1.5 leading-none">
                CamNote
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-sm bg-orange-100 text-orange-800">
                  Ghi chú
                </span>
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5 font-normal">Quản lý cá nhân tinh gọn</p>
            </div>
          </div>
          
          <button 
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            aria-label="Đóng thanh điều hướng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="p-3.5 space-y-2 shrink-0">
          <button
            onClick={() => {
              onCreateNewNote();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition-all shadow-sm shadow-orange-600/20 hover:shadow-orange-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo ghi chú mới</span>
          </button>

          <button
            onClick={() => {
              onOpenTemplatePicker();
              if (isOpenMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-orange-800 bg-orange-50 hover:bg-orange-100/80 border border-orange-200/60 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Mẫu ghi chú có sẵn</span>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 text-sm text-neutral-700">
          
          {/* Main Navigation */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1.5">
              Phân loại chính
            </div>
            <nav className="space-y-0.5">
              <button
                onClick={() => {
                  onSelectFilter({ type: 'system', value: 'all' });
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter.type === 'system' && filter.value === 'all'
                    ? 'bg-orange-50 text-orange-900 font-semibold'
                    : 'text-neutral-700 hover:bg-orange-50/50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${filter.type === 'system' && filter.value === 'all' ? 'text-orange-600' : 'text-neutral-400'}`} />
                  <span>Tất cả ghi chú</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                  {allCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter({ type: 'system', value: 'pinned' });
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter.type === 'system' && filter.value === 'pinned'
                    ? 'bg-orange-50 text-orange-900 font-semibold'
                    : 'text-neutral-700 hover:bg-orange-50/50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Pin className={`w-4 h-4 ${filter.type === 'system' && filter.value === 'pinned' ? 'text-orange-600 fill-orange-500' : 'text-neutral-400'}`} />
                  <span>Đã ghim</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                  {pinnedCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter({ type: 'system', value: 'favorites' });
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter.type === 'system' && filter.value === 'favorites'
                    ? 'bg-orange-50 text-orange-900 font-semibold'
                    : 'text-neutral-700 hover:bg-orange-50/50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Star className={`w-4 h-4 ${filter.type === 'system' && filter.value === 'favorites' ? 'text-amber-500 fill-amber-400' : 'text-neutral-400'}`} />
                  <span>Yêu thích</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                  {favoriteCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter({ type: 'system', value: 'todos' });
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter.type === 'system' && filter.value === 'todos'
                    ? 'bg-orange-50 text-orange-900 font-semibold'
                    : 'text-neutral-700 hover:bg-orange-50/50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className={`w-4 h-4 ${filter.type === 'system' && filter.value === 'todos' ? 'text-orange-600' : 'text-neutral-400'}`} />
                  <span>Việc cần làm (To-Do)</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                  {todoCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter({ type: 'system', value: 'archive' });
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter.type === 'system' && filter.value === 'archive'
                    ? 'bg-orange-50 text-orange-900 font-semibold'
                    : 'text-neutral-700 hover:bg-orange-50/50 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Archive className={`w-4 h-4 ${filter.type === 'system' && filter.value === 'archive' ? 'text-orange-600' : 'text-neutral-400'}`} />
                  <span>Kho lưu trữ</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                  {archivedCount}
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter({ type: 'system', value: 'trash' });
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  filter.type === 'system' && filter.value === 'trash'
                    ? 'bg-red-50 text-red-900 font-semibold'
                    : 'text-neutral-700 hover:bg-red-50/40 hover:text-red-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Trash2 className={`w-4 h-4 ${filter.type === 'system' && filter.value === 'trash' ? 'text-red-600' : 'text-neutral-400'}`} />
                  <span>Thùng rác</span>
                </div>
                <span className="font-mono text-[11px] tabular-nums text-neutral-400">
                  {trashCount}
                </span>
              </button>
            </nav>
          </div>

          {/* User Folders */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Thư mục cá nhân
              </span>
              <button
                onClick={() => setIsAddingFolder(true)}
                className="text-orange-600 hover:text-orange-700 p-0.5 rounded-sm hover:bg-orange-50 cursor-pointer"
                title="Thêm thư mục mới"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inline Add Folder Input */}
            {isAddingFolder && (
              <form onSubmit={handleCreateFolder} className="px-3 py-1.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Tên thư mục..."
                    autoFocus
                    className="flex-1 text-xs px-2.5 py-1.5 border border-orange-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1.5 bg-orange-600 text-white rounded-md text-xs font-medium hover:bg-orange-700 cursor-pointer"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingFolder(false);
                      setNewFolderName('');
                    }}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-md hover:bg-neutral-100"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-0.5">
              {folders.map((folder) => {
                const folderCount = nonTrashNotes.filter(n => n.folderId === folder.id && !n.isArchived).length;
                const isSelected = filter.type === 'folder' && filter.value === folder.id;

                if (editingFolderId === folder.id) {
                  return (
                    <div key={folder.id} className="px-3 py-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRenameFolder(folder.id);
                          if (e.key === 'Escape') setEditingFolderId(null);
                        }}
                        className="flex-1 text-xs px-2 py-1 border border-orange-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <button
                        onClick={() => handleSaveRenameFolder(folder.id)}
                        className="text-xs text-orange-600 font-semibold px-2 py-1 hover:bg-orange-50 rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingFolderId(null)}
                        className="text-xs text-neutral-400 p-1 hover:bg-neutral-100 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={folder.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-orange-50 text-orange-900 font-semibold'
                        : 'text-neutral-700 hover:bg-orange-50/50 hover:text-neutral-900'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectFilter({ type: 'folder', value: folder.id });
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className="flex-1 flex items-center gap-2.5 truncate text-left cursor-pointer"
                    >
                      <FolderIcon 
                        className="w-4 h-4 shrink-0" 
                        style={{ color: folder.color || '#EA580C' }} 
                      />
                      <span className="truncate">{folder.name}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[11px] tabular-nums text-neutral-400 group-hover:hidden">
                        {folderCount}
                      </span>
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <button
                          onClick={() => {
                            setEditingFolderId(folder.id);
                            setEditingFolderName(folder.name);
                          }}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100"
                          title="Đổi tên"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onDeleteFolder(folder.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50"
                          title="Xóa thư mục"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tags Cloud */}
          {allTags.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <TagIcon className="w-3 h-3" />
                <span>Thẻ nhãn (Tags)</span>
              </div>
              <div className="flex flex-wrap gap-1 px-3">
                {allTags.map(([tag, count]) => {
                  const isSelected = filter.type === 'tag' && filter.value === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        onSelectFilter({ type: 'tag', value: tag });
                        if (isOpenMobile) onCloseMobile();
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600 text-white font-medium'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-orange-100 hover:text-orange-800'
                      }`}
                    >
                      <span>#{tag}</span>
                      <span className="opacity-60 font-mono tabular-nums text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-orange-100/60 bg-neutral-50/50 space-y-1 shrink-0">
          {filter.type === 'system' && filter.value === 'trash' && trashCount > 0 && (
            <button
              onClick={onEmptyTrash}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-red-600 hover:bg-red-100/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Dọn sạch thùng rác ({trashCount})</span>
            </button>
          )}

          <div className="flex items-center justify-between gap-1 text-xs text-neutral-600">
            <button
              onClick={onOpenStats}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition-colors cursor-pointer"
              title="Xem thống kê ghi chú"
            >
              <BarChart3 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Thống kê</span>
            </button>

            <button
              onClick={onOpenBackup}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-neutral-200/50 hover:text-neutral-900 transition-colors cursor-pointer"
              title="Sao lưu & Phục hồi dữ liệu"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Sao lưu</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
