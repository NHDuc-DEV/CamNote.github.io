import React from 'react';
import { X, BarChart3, FileText, CheckCircle2, Pin, Star, Hash, Folder as FolderIcon } from 'lucide-react';
import { Note, Folder } from '../types';
import { calculateTextStats } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  folders: Folder[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  notes,
  folders,
}) => {
  if (!isOpen) return null;

  const nonTrashNotes = notes.filter(n => !n.isTrash);
  const totalNotes = nonTrashNotes.length;
  const pinnedCount = nonTrashNotes.filter(n => n.isPinned).length;
  const favoriteCount = nonTrashNotes.filter(n => n.isFavorite).length;

  // Words & Chars total
  let totalWords = 0;
  let totalChars = 0;
  let totalTodos = 0;
  let completedTodos = 0;

  nonTrashNotes.forEach(note => {
    const s = calculateTextStats(note.content + ' ' + note.title);
    totalWords += s.words;
    totalChars += s.chars;
    if (note.todoItems) {
      totalTodos += note.todoItems.length;
      completedTodos += note.todoItems.filter(t => t.completed).length;
    }
  });

  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-orange-100 shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Thống kê năng suất</h2>
              <p className="text-xs text-neutral-500">Tổng quan dữ liệu ghi chú cá nhân của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200/60">
              <span className="text-[11px] font-semibold text-orange-900 uppercase tracking-wider block mb-1">
                Tổng ghi chú
              </span>
              <span className="text-2xl font-bold text-orange-700 font-mono tabular-nums">
                {totalNotes}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                Tổng số từ
              </span>
              <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                {totalWords.toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block mb-1">
                Yêu thích & Ghim
              </span>
              <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
                {favoriteCount + pinnedCount}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
              <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider block mb-1">
                Xong To-Do
              </span>
              <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Checklist Progress Details */}
          <div className="p-4 rounded-xl border border-neutral-200/80 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tiến độ công việc to-do
              </span>
              <span className="font-mono tabular-nums text-neutral-500">
                {completedTodos} / {totalTodos} mục đã hoàn tất
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Breakdown by Folder */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Phân bổ theo thư mục
            </h3>
            <div className="space-y-2">
              {folders.map(f => {
                const count = nonTrashNotes.filter(n => n.folderId === f.id && !n.isArchived).length;
                const percentage = totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;
                return (
                  <div key={f.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-neutral-700 font-medium">
                        <FolderIcon className="w-3.5 h-3.5" style={{ color: f.color || '#EA580C' }} />
                        {f.name}
                      </span>
                      <span className="font-mono tabular-nums text-neutral-500">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
