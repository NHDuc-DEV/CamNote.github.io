import React, { useRef, useState } from 'react';
import { X, Download, Upload, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Note, Folder } from '../types';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  folders: Folder[];
  onRestoreData: (notes: Note[], folders?: Folder[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  notes,
  folders,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Export JSON file
  const handleExport = () => {
    const backupData = {
      appName: 'CamNote',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      notes,
      folders,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `camnote-backup-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setSuccessMsg('Đã xuất tệp sao lưu JSON thành công!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Import JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.notes || !Array.isArray(parsed.notes)) {
          setErrorMsg('Tệp sao lưu không hợp lệ hoặc thiếu dữ liệu ghi chú.');
          return;
        }

        onRestoreData(parsed.notes, parsed.folders);
        setSuccessMsg(`Khôi phục thành công ${parsed.notes.length} ghi chú!`);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1500);
      } catch (err) {
        setErrorMsg('Không thể đọc tệp JSON. Vui lòng kiểm tra lại định dạng tệp.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-orange-100 shadow-xl overflow-hidden z-10 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Sao lưu & Phục hồi</h2>
              <p className="text-xs text-neutral-500">Bảo toàn dữ liệu cá nhân ngoại tuyến an toàn</p>
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
        <div className="p-6 space-y-4">
          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-xl text-xs font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Export card */}
          <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Tải về tệp sao lưu JSON</h4>
                <p className="text-xs text-neutral-500">
                  Xuất toàn bộ {notes.length} ghi chú và {folders.length} thư mục về máy tính.
                </p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất bản sao lưu</span>
            </button>
          </div>

          {/* Import card */}
          <div className="p-4 rounded-xl border border-neutral-200/90 bg-neutral-50/50 space-y-2">
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Khôi phục từ tệp đã có</h4>
              <p className="text-xs text-neutral-500">
                Chọn tệp .json đã xuất trước đó để phục hồi lại danh sách ghi chú.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-orange-50 text-orange-700 border border-orange-200/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Chọn tệp .JSON để nạp lại</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
