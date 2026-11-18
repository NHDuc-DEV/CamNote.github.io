import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Pin, 
  Star, 
  Lock, 
  Unlock, 
  Trash2, 
  Share2, 
  Download, 
  Printer, 
  Tag as TagIcon, 
  CheckSquare, 
  Plus, 
  X, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Highlighter, 
  Calendar, 
  Check, 
  MoreHorizontal,
  FileDown
} from 'lucide-react';
import { Note, Folder, NoteColor, TodoItem } from '../types';
import { calculateTextStats, formatNoteDate } from '../utils/storage';

interface NoteEditorProps {
  note: Note;
  folders: Folder[];
  onUpdateNote: (updated: Note) => void;
  onBack: () => void;
  onDeleteNote: (id: string) => void;
  onRequestLockNote: (note: Note) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  folders,
  onUpdateNote,
  onBack,
  onDeleteNote,
  onRequestLockNote,
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [colorTheme, setColorTheme] = useState<NoteColor>(note.colorTheme || 'white');
  const [folderId, setFolderId] = useState(note.folderId || 'work');
  const [isPinned, setIsPinned] = useState(note.isPinned);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite);
  const [todoItems, setTodoItems] = useState<TodoItem[]>(note.todoItems || []);
  const [newTodoText, setNewTodoText] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<any>(null);

  // Sync state if active note changes from outside
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setColorTheme(note.colorTheme || 'white');
    setFolderId(note.folderId || 'work');
    setIsPinned(note.isPinned);
    setIsFavorite(note.isFavorite);
    setTodoItems(note.todoItems || []);
  }, [note.id]);

  // Autosave mechanism with debounce
  const triggerAutoSave = (changes: Partial<Note>) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const updated: Note = {
        ...note,
        title,
        content,
        tags,
        colorTheme,
        folderId,
        isPinned,
        isFavorite,
        todoItems,
        ...changes,
        updatedAt: new Date().toISOString(),
      };
      onUpdateNote(updated);
      setSaveStatus('saved');
    }, 400);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    triggerAutoSave({ title: val });
  };

  const handleContentChange = (val: string) => {
    setContent(val);
    triggerAutoSave({ content: val });
  };

  const handleFolderChange = (val: string) => {
    setFolderId(val);
    triggerAutoSave({ folderId: val });
  };

  const handleColorChange = (c: NoteColor) => {
    setColorTheme(c);
    triggerAutoSave({ colorTheme: c });
  };

  const handleTogglePin = () => {
    const next = !isPinned;
    setIsPinned(next);
    triggerAutoSave({ isPinned: next });
  };

  const handleToggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    triggerAutoSave({ isFavorite: next });
  };

  // Tag management
  const handleAddTag = () => {
    const clean = newTagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      const nextTags = [...tags, clean];
      setTags(nextTags);
      setNewTagInput('');
      setIsAddingTag(false);
      triggerAutoSave({ tags: nextTags });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const nextTags = tags.filter(t => t !== tagToRemove);
    setTags(nextTags);
    triggerAutoSave({ tags: nextTags });
  };

  // Todo Items management
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      const newItem: TodoItem = {
        id: `todo-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        text: newTodoText.trim(),
        completed: false,
      };
      const nextTodos = [...todoItems, newItem];
      setTodoItems(nextTodos);
      setNewTodoText('');
      triggerAutoSave({ todoItems: nextTodos });
    }
  };

  const handleToggleTodo = (id: string) => {
    const nextTodos = todoItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodoItems(nextTodos);
    triggerAutoSave({ todoItems: nextTodos });
  };

  const handleDeleteTodo = (id: string) => {
    const nextTodos = todoItems.filter(item => item.id !== id);
    setTodoItems(nextTodos);
    triggerAutoSave({ todoItems: nextTodos });
  };

  // Formatting helpers for textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end);

    const replacement = `${prefix}${selected || 'nội dung'}${suffix}`;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    triggerAutoSave({ content: newContent });

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 7));
    }, 50);
  };

  const insertTimestamp = () => {
    const now = new Date();
    const formatted = `\n> 🕒 Ghi nhận lúc: ${now.toLocaleTimeString('vi-VN')} ngày ${now.toLocaleDateString('vi-VN')}\n`;
    const el = textareaRef.current;
    if (!el) {
      handleContentChange(content + formatted);
      return;
    }
    const start = el.selectionStart;
    const newContent = content.substring(0, start) + formatted + content.substring(start);
    handleContentChange(newContent);
  };

  // Export functions
  const exportAsMarkdown = () => {
    let output = `# ${title || 'Ghi chú'}\n\n`;
    if (tags.length > 0) {
      output += `Tags: ${tags.map(t => `#${t}`).join(' ')}\n\n`;
    }
    output += `${content}\n\n`;

    if (todoItems.length > 0) {
      output += `## Danh sách việc cần làm (To-Do)\n`;
      todoItems.forEach(t => {
        output += `- [${t.completed ? 'x' : ' '}] ${t.text}\n`;
      });
    }

    const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'ghi-chu').toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsText = () => {
    let output = `${title || 'Ghi chú'}\n${'='.repeat(30)}\n\n${content}\n\n`;
    if (todoItems.length > 0) {
      output += `Danh sách việc cần làm:\n`;
      todoItems.forEach(t => {
        output += `[${t.completed ? 'X' : ' '}] ${t.text}\n`;
      });
    }
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'ghi-chu').toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  // Background styling
  const getContainerBg = (color: NoteColor) => {
    switch (color) {
      case 'orange-soft': return 'bg-[#FFFBF7]';
      case 'amber-soft': return 'bg-[#FFFDF7]';
      case 'peach': return 'bg-[#FFF8F5]';
      case 'creme': return 'bg-[#FAF8F5]';
      case 'white':
      default: return 'bg-white';
    }
  };

  const stats = calculateTextStats(content + ' ' + title);
  const completedTodoCount = todoItems.filter(t => t.completed).length;

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors ${getContainerBg(colorTheme)}`}>
      
      {/* Editor Top Navigation Bar */}
      <div className="h-14 px-4 md:px-6 bg-white/80 backdrop-blur-xs border-b border-orange-100/70 flex items-center justify-between gap-2 shrink-0">
        
        {/* Left: Back button & Save Status & Folder Selector */}
        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:text-orange-700 hover:bg-orange-50 transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Danh sách</span>
          </button>

          <span className="text-neutral-300 hidden sm:inline">|</span>

          {/* Folder Picker */}
          <select
            value={folderId}
            onChange={(e) => handleFolderChange(e.target.value)}
            className="text-xs font-medium text-neutral-700 bg-orange-50/60 hover:bg-orange-100/60 border border-orange-200/60 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
          >
            {folders.map(f => (
              <option key={f.id} value={f.id}>
                📁 {f.name}
              </option>
            ))}
          </select>

          {/* Auto-save status */}
          <span className="text-[11px] font-mono tabular-nums text-neutral-400 hidden md:inline">
            {saveStatus === 'saving' ? (
              <span className="text-orange-600 font-medium">Đang lưu...</span>
            ) : (
              <span>Đã lưu tự động</span>
            )}
          </span>
        </div>

        {/* Right: Color picker, Pin, Star, Lock, Export, Delete */}
        <div className="flex items-center gap-1 md:gap-2">
          
          {/* Color theme selectors */}
          <div className="hidden sm:flex items-center gap-1 mr-1">
            {(['white', 'orange-soft', 'amber-soft', 'peach', 'creme'] as NoteColor[]).map((c) => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                  c === 'white' ? 'bg-white border-neutral-300' :
                  c === 'orange-soft' ? 'bg-[#FFF9F2] border-orange-300' :
                  c === 'amber-soft' ? 'bg-[#FFFDF5] border-amber-300' :
                  c === 'peach' ? 'bg-[#FFF5F0] border-orange-300' :
                  'bg-[#FAF8F5] border-stone-300'
                } ${colorTheme === c ? 'ring-2 ring-orange-500 scale-110' : 'hover:scale-105'}`}
                title={`Đổi màu: ${c}`}
              />
            ))}
          </div>

          {/* Pin */}
          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isPinned
                ? 'bg-orange-100 text-orange-700'
                : 'text-neutral-500 hover:text-orange-600 hover:bg-orange-50'
            }`}
            title={isPinned ? 'Bỏ ghim' : 'Ghim lên đầu'}
          >
            <Pin className={`w-4 h-4 ${isPinned ? 'fill-orange-600' : ''}`} />
          </button>

          {/* Favorite */}
          <button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-amber-100 text-amber-700'
                : 'text-neutral-500 hover:text-amber-500 hover:bg-amber-50'
            }`}
            title={isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu sao'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Lock */}
          <button
            onClick={() => onRequestLockNote(note)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              note.isLocked
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100'
            }`}
            title={note.isLocked ? 'Khóa bảo mật đang bật' : 'Thiết lập mã khóa riêng tư'}
          >
            {note.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-1.5 text-neutral-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
              title="Xuất file hoặc in ấn"
            >
              <Download className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowExportMenu(false)} />
                <div className="absolute right-0 top-full mt-1.5 z-40 w-48 bg-white border border-neutral-200 rounded-xl shadow-lg py-1.5 text-xs text-neutral-700 animate-in fade-in">
                  <div className="px-3 py-1 font-semibold text-neutral-400 text-[10px] uppercase">
                    Tùy chọn xuất bản
                  </div>
                  <button
                    onClick={exportAsMarkdown}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-orange-600" />
                    <span>Tải về Markdown (.md)</span>
                  </button>
                  <button
                    onClick={exportAsText}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    <FileDown className="w-4 h-4 text-neutral-500" />
                    <span>Tải về Văn bản thuần (.txt)</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-50 hover:text-orange-900 transition-colors text-left cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-neutral-500" />
                    <span>In ấn / Lưu thành PDF</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Delete */}
          <button
            onClick={() => onDeleteNote(note.id)}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Chuyển vào thùng rác"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Formatting Toolbar */}
      <div className="px-4 md:px-6 py-2 bg-white border-b border-neutral-200/70 flex flex-wrap items-center justify-between gap-2 shrink-0">
        
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1 text-neutral-600">
          <button
            onClick={() => insertFormatting('# ')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Tiêu đề chính (H1)"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('## ')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Tiêu đề phụ (H2)"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-neutral-200 mx-1" />

          <button
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="In đậm (Bold)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="In nghiêng (Italic)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('==', '==')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Tô sáng (Highlight)"
          >
            <Highlighter className="w-4 h-4 text-orange-500" />
          </button>

          <span className="w-px h-4 bg-neutral-200 mx-1" />

          <button
            onClick={() => insertFormatting('- ')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('1. ')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Danh sách số"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('> ')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Trích dẫn (Quote)"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => insertFormatting('```\n', '\n```')}
            className="p-1.5 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
            title="Khối mã nguồn (Code block)"
          >
            <Code className="w-4 h-4" />
          </button>

          <span className="w-px h-4 bg-neutral-200 mx-1" />

          <button
            onClick={insertTimestamp}
            className="flex items-center gap-1 px-2 py-1 hover:text-orange-600 hover:bg-orange-50 rounded-md text-xs font-medium transition-colors cursor-pointer"
            title="Chèn ngày giờ hiện tại"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chèn ngày giờ</span>
          </button>
        </div>

        {/* View Switch: Edit vs Preview */}
        <div className="flex items-center p-0.5 bg-neutral-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-white text-orange-700 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Soạn thảo</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-white text-orange-700 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trước</span>
          </button>
        </div>
      </div>

      {/* Editor Content Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-12 lg:px-20 py-6 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Tiêu đề ghi chú..."
            className="w-full text-2xl md:text-3xl font-bold text-neutral-900 bg-transparent placeholder-neutral-300 focus:outline-none tracking-tight border-none p-0"
          />
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <TagIcon className="w-3.5 h-3.5 text-orange-600" />
          
          {tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-100/70 text-orange-800 rounded-md font-medium"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-orange-600 hover:text-orange-950 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {isAddingTag ? (
            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                  if (e.key === 'Escape') setIsAddingTag(false);
                }}
                placeholder="Nhập thẻ rồi ấn Enter..."
                autoFocus
                className="text-xs px-2 py-0.5 border border-orange-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 w-36"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="text-xs text-orange-600 font-semibold px-1.5 py-0.5 hover:bg-orange-100 rounded"
              >
                Thêm
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingTag(true)}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-neutral-500 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors cursor-pointer border border-dashed border-neutral-300"
            >
              <Plus className="w-3 h-3" />
              <span>Gắn thẻ nhãn</span>
            </button>
          )}
        </div>

        {/* Interactive To-Do Checklist Area */}
        <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-200/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-orange-900 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-orange-600" />
              Danh sách việc cần làm (To-Do)
            </h4>
            {todoItems.length > 0 && (
              <span className="font-mono text-xs tabular-nums text-neutral-600">
                {completedTodoCount}/{todoItems.length} hoàn thành
              </span>
            )}
          </div>

          {/* Checklist items list */}
          {todoItems.length > 0 && (
            <div className="space-y-1.5">
              {todoItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-white border border-orange-100 shadow-2xs hover:border-orange-200 transition-colors group"
                >
                  <label className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleTodo(item.id)}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-neutral-300 cursor-pointer accent-orange-600"
                    />
                    <span className={`text-xs md:text-sm text-neutral-800 break-words ${
                      item.completed ? 'line-through text-neutral-400' : ''
                    }`}>
                      {item.text}
                    </span>
                  </label>
                  <button
                    onClick={() => handleDeleteTodo(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-600 rounded transition-opacity"
                    title="Xóa mục"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Todo input */}
          <form onSubmit={handleAddTodo} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Thêm đầu việc mới (nhấn Enter để thêm)..."
              className="flex-1 text-xs px-3 py-2 bg-white border border-orange-200/80 rounded-lg placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!newTodoText.trim()}
              className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              Thêm
            </button>
          </form>
        </div>

        {/* Content Area: Edit or Preview */}
        {activeTab === 'edit' ? (
          <div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Bắt đầu viết suy nghĩ, ý tưởng, công việc của bạn tại đây... Hỗ trợ Markdown, gạch đầu dòng, trích dẫn..."
              rows={18}
              className="w-full text-sm md:text-base leading-relaxed text-neutral-800 bg-transparent placeholder-neutral-400 focus:outline-none resize-none border-none p-0"
            />
          </div>
        ) : (
          <div className="prose prose-orange max-w-none text-neutral-800 text-sm md:text-base leading-relaxed space-y-4">
            {content ? (
              <div 
                className="whitespace-pre-wrap font-sans"
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-neutral-900 mt-4 mb-2">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-neutral-900 mt-5 mb-2">$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold text-neutral-900 mt-6 mb-3">$1</h1>')
                    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                    .replace(/==(.*?)==/gim, '<mark class="bg-orange-200 text-orange-950 px-1 rounded">$1</mark>')
                    .replace(/^> (.*$)/gim, '<blockquote class="border-l-2 border-orange-400 pl-4 py-1 italic text-neutral-600 my-2">$1</blockquote>')
                    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-neutral-900 text-neutral-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">$1</pre>')
                }}
              />
            ) : (
              <p className="text-neutral-400 italic">Ghi chú chưa có nội dung nào.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Metadata & Statistics Bar */}
      <div className="h-10 px-4 md:px-6 bg-white border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono tabular-nums">
            {stats.words} từ · {stats.chars} ký tự
          </span>
          <span className="hidden sm:inline text-neutral-300">·</span>
          <span className="hidden sm:inline">
            ~{stats.readMinutes} phút đọc
          </span>
        </div>

        <div className="flex items-center gap-3 text-neutral-400 text-[11px]">
          <span>Tạo: {formatNoteDate(note.createdAt)}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">Sửa: {formatNoteDate(note.updatedAt)}</span>
        </div>
      </div>

    </div>
  );
};
