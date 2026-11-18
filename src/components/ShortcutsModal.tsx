import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl / ⌘ + N', desc: 'Tạo nhanh ghi chú mới' },
    { key: 'Ctrl / ⌘ + F', desc: 'Tìm kiếm nhanh tiêu đề, nội dung' },
    { key: 'Esc', desc: 'Đóng cửa sổ soạn thảo hoặc quay lại' },
    { key: 'Ctrl / ⌘ + B', desc: 'In đậm văn bản đang chọn' },
    { key: 'Ctrl / ⌘ + I', desc: 'In nghiêng văn bản đang chọn' },
    { key: 'Ctrl / ⌘ + P', desc: 'In ấn hoặc xuất file PDF' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-orange-100 shadow-xl overflow-hidden z-10 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Phím tắt tiện dụng</h2>
              <p className="text-xs text-neutral-500">Tăng tốc độ làm việc và thao tác</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-6 space-y-3">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-neutral-100 text-xs">
              <span className="text-neutral-700">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-neutral-100 border border-neutral-200 rounded font-mono text-[11px] text-neutral-800 font-semibold shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
