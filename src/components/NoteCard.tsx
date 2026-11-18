import React, { useState } from 'react';
import { 
  Pin, 
  Star, 
  MoreVertical, 
  CheckSquare, 
  Lock, 
  Trash2, 
  RotateCcw, 
  Archive, 
  ArchiveRestore, 
  Copy, 
  Palette,
  Folder as FolderIcon
} from 'lucide-react';
import { Note, Folder, ViewMode, NoteColor } from '../types';
import { formatNoteDate } from '../utils/storage';

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  viewMode: ViewMode;
  isSelected: boolean;
  onSelect: (note: Note) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onRestoreNote: (id: string, e: React.MouseEvent) => void;
  onPermanentDeleteNote: (id: string, e: React.MouseEvent) => void;
  onToggleArchive: (id: string, e: React.MouseEvent) => void;
  onDuplicateNote: (note: Note, e: React.MouseEvent) => void;
  onChangeColor: (id: string, color: NoteColor, e: React.MouseEvent) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  folders,
  viewMode,
  isSelected,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onDeleteNote,
  onRestoreNote,
  onPermanentDeleteNote,
  onToggleArchive,
  onDuplicateNote,
  onChangeColor,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const folder = folders.find(f => f.id === note.folderId);

  // Background styling according to colorTheme
  const getColorStyles = (color: NoteColor) => {
    switch (color) {
      case 'orange-soft':
        return 'bg-[#FFF9F2] border-orange-200/80 hover:border-orange-300';
      case 'amber-soft':
        return 'bg-[#FFFDF5] border-amber-200/80 hover:border-amber-300';
      case 'peach':
        return 'bg-[#FFF5F0] border-orange-200/70 hover:border-orange-300';
      case 'creme':
        return 'bg-[#FAF8F5] border-stone-200/80 hover:border-stone-300';
      case 'white':
      default:
        return 'bg-white border-neutral-200/80 hover:border-orange-200';
    }
  };

  // Calculate To-Do progress
  const todos = note.todoItems || [];
  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;

  // Clean preview text without markdown hash/bullet clutter
  const getCleanSnippet = (text: string) => {
    return text
      .replace(/#+\s+/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/>\s+/g, '')
      .replace(/-\s+/g, '')
      .trim();
  };

  const previewSnippet = getCleanSnippet(note.content);

  return (
    <div
      onClick={() => onSelect(note)}
      className={`group relative rounded-xl border p-4 transition-all duration-150 cursor-pointer text-left flex flex-col justify-between ${getColorStyles(
        note.colorTheme
      )} ${
        isSelected
          ? 'ring-2 ring-orange-500 border-orange-400 shadow-sm'
          : 'hover:shadow-xs'
      } ${viewMode === 'list' ? 'md:flex-row md:items-center md:gap-4 md:py-3' : 'min-h-[160px]'}`}
    >
      {/* Card Content Section */}
      <div className="flex-1 min-w-0">
        {/* Header: Title + Pin/Favorite status */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-neutral-900 text-sm md:text-base leading-snug line-clamp-1 group-hover:text-orange-700 transition-colors">
            {note.isLocked && (
              <Lock className="w-3.5 h-3.5 inline mr-1.5 text-neutral-500" />
            )}
            {note.title || 'Ghi chú không tiêu đề'}
          </h3>

          {/* Pin & Favorite indicators / Quick buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {note.isPinned && (
              <span title="Đã ghim lên đầu">
                <Pin className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
              </span>
            )}
            {note.isFavorite && (
              <span title="Đã đánh dấu yêu thích">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              </span>
            )}
          </div>
        </div>

        {/* Content Snippet or To-Do checklist indicator */}
        {note.isLocked ? (
          <p className="text-xs text-neutral-400 italic mb-3">
            Nội dung được bảo vệ bằng mật mã cá nhân
          </p>
        ) : (
          <>
            {previewSnippet && (
              <p className={`text-xs text-neutral-600 leading-relaxed mb-3 ${
                viewMode === 'list' ? 'line-clamp-1 md:line-clamp-1' : 'line-clamp-3'
              }`}>
                {previewSnippet}
              </p>
            )}

            {/* Checklist items summary */}
            {totalTodos > 0 && (
              <div className="mb-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckSquare className="w-3 h-3 text-orange-600" />
                    Việc cần làm
                  </span>
                  <span className="font-mono tabular-nums text-neutral-600">
                    {completedTodos}/{totalTodos} ({Math.round((completedTodos / totalTodos) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-1 bg-neutral-200/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Metadata in unboxed text format (§1.A Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 pt-1 border-t border-neutral-200/40">
          {folder && (
            <span className="font-medium text-neutral-700 flex items-center gap-1">
              <FolderIcon className="w-3 h-3 text-orange-600" />
              {folder.name}
            </span>
          )}

          {folder && <span aria-hidden="true" className="text-neutral-300">·</span>}

          <span className="font-mono tabular-nums text-neutral-400">
            {formatNoteDate(note.updatedAt)}
          </span>

          {note.tags.length > 0 && (
            <>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-orange-700/80 font-medium truncate max-w-[160px]">
                {note.tags.map(t => `#${t}`).join(' ')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Floating Action Menu Button */}
      <div 
        className="mt-2 md:mt-0 flex items-center justify-end gap-1 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {note.isTrash ? (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onRestoreNote(note.id, e)}
              className="p-1.5 text-neutral-600 hover:text-orange-600 hover:bg-orange-100/50 rounded-lg transition-colors cursor-pointer"
              title="Khôi phục ghi chú"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => onPermanentDeleteNote(note.id, e)}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Xóa vĩnh viễn"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="Thao tác"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Context Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => {
                    setShowMenu(false);
                    setShowColorPicker(false);
                  }}
                />
                <div className="absolute right-0 bottom-full mb-1 z-40 w-44 bg-white border border-neutral-200/90 rounded-xl shadow-lg py-1 text-xs text-neutral-700 animate-in fade-in zoom-in-95">
                  <button
                    onClick={(e) => {
                      onTogglePin(note.id, e);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'text-orange-600 fill-orange-500' : 'text-neutral-400'}`} />
                    <span>{note.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      onToggleFavorite(note.id, e);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    <Star className={`w-3.5 h-3.5 ${note.isFavorite ? 'text-amber-500 fill-amber-400' : 'text-neutral-400'}`} />
                    <span>{note.isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu sao'}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      onDuplicateNote(note, e);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Nhân bản ghi chú</span>
                  </button>

                  <button
                    onClick={(e) => {
                      onToggleArchive(note.id, e);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    {note.isArchived ? (
                      <>
                        <ArchiveRestore className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Bỏ lưu trữ</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Chuyển vào lưu trữ</span>
                      </>
                    )}
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  {/* Color Picker trigger */}
                  <div className="px-3 py-1.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      Màu nền thẻ
                    </span>
                    <div className="flex items-center gap-1.5">
                      {(['white', 'orange-soft', 'amber-soft', 'peach', 'creme'] as NoteColor[]).map((c) => (
                        <button
                          key={c}
                          onClick={(e) => {
                            onChangeColor(note.id, c, e);
                            setShowMenu(false);
                          }}
                          className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                            c === 'white' ? 'bg-white border-neutral-300' :
                            c === 'orange-soft' ? 'bg-[#FFF9F2] border-orange-300' :
                            c === 'amber-soft' ? 'bg-[#FFFDF5] border-amber-300' :
                            c === 'peach' ? 'bg-[#FFF5F0] border-orange-300' :
                            'bg-[#FAF8F5] border-stone-300'
                          } ${note.colorTheme === c ? 'ring-2 ring-orange-500 scale-105' : ''}`}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={(e) => {
                      onDeleteNote(note.id, e);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-red-50 text-red-600 transition-colors text-left cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Chuyển vào thùng rác</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
