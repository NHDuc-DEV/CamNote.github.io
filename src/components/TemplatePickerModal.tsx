import React from 'react';
import { X, Sparkles, ArrowRight, CheckSquare, FileText } from 'lucide-react';
import { NoteTemplate } from '../types';
import { DEFAULT_TEMPLATES } from '../utils/storage';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: NoteTemplate) => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-orange-100 shadow-xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Mẫu ghi chú có sẵn</h2>
              <p className="text-xs text-neutral-500">Khởi tạo nhanh với bố cục chuẩn hóa cho công việc & đời sống</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {DEFAULT_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className="group p-4 rounded-xl border border-neutral-200/80 hover:border-orange-400 bg-white hover:bg-orange-50/30 transition-all cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                  <h3 className="font-semibold text-sm text-neutral-900 group-hover:text-orange-700">
                    {tpl.title}
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 line-clamp-2">
                  {tpl.description}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                  <span>{tpl.tags.map(t => `#${t}`).join(' ')}</span>
                  {tpl.todoItems && tpl.todoItems.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-orange-700/80">
                        <CheckSquare className="w-3 h-3" />
                        {tpl.todoItems.length} việc to-do
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-orange-600 group-hover:text-white transition-colors text-neutral-400">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
