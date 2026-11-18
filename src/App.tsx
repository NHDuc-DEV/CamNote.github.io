/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, 
  FileText, 
  Trash2, 
  Sparkles, 
  FolderOpen, 
  Search, 
  Tag as TagIcon,
  CheckCircle,
  Pin
} from 'lucide-react';
import { Note, Folder, FilterState, ViewMode, SortOption, NoteTemplate, NoteColor } from './types';
import { 
  loadNotesFromStorage, 
  saveNotesToStorage, 
  loadFoldersFromStorage, 
  saveFoldersToStorage 
} from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NoteCard } from './components/NoteCard';
import { NoteEditor } from './components/NoteEditor';
import { TemplatePickerModal } from './components/TemplatePickerModal';
import { StatsModal } from './components/StatsModal';
import { LockModal } from './components/LockModal';
import { BackupModal } from './components/BackupModal';
import { ShortcutsModal } from './components/ShortcutsModal';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotesFromStorage());
  const [folders, setFolders] = useState<Folder[]>(() => loadFoldersFromStorage());
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>({ type: 'system', value: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('updated-desc');

  // Modals state
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [lockModal, setLockModal] = useState<{
    isOpen: boolean;
    note: Note | null;
    mode: 'set' | 'unlock';
    pendingAction?: () => void;
  }>({
    isOpen: false,
    note: null,
    mode: 'unlock',
  });

  // Persistent storage syncing
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  useEffect(() => {
    saveFoldersToStorage(folders);
  }, [folders]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N -> Create new note
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreateNewNote();
      }
      // Esc -> Close active modals or exit editor
      if (e.key === 'Escape') {
        if (isTemplatePickerOpen) setIsTemplatePickerOpen(false);
        else if (isStatsOpen) setIsStatsOpen(false);
        else if (isBackupOpen) setIsBackupOpen(false);
        else if (isShortcutsOpen) setIsShortcutsOpen(false);
        else if (lockModal.isOpen) setLockModal(prev => ({ ...prev, isOpen: false }));
        else if (selectedNoteId) setSelectedNoteId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNoteId, isTemplatePickerOpen, isStatsOpen, isBackupOpen, isShortcutsOpen, lockModal]);

  // Selected note object
  const activeNote = useMemo(() => {
    return notes.find(n => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Filtered & Sorted notes
  const filteredNotes = useMemo(() => {
    let result = notes.filter(n => {
      // System trash filtering
      if (filter.type === 'system' && filter.value === 'trash') {
        return n.isTrash;
      }
      // If not in trash view, exclude trash notes
      if (n.isTrash) return false;

      // System archive filtering
      if (filter.type === 'system' && filter.value === 'archive') {
        return n.isArchived;
      }
      // If not in archive view, exclude archived notes
      if (n.isArchived) return false;

      // Other system filters
      if (filter.type === 'system') {
        if (filter.value === 'pinned') return n.isPinned;
        if (filter.value === 'favorites') return n.isFavorite;
        if (filter.value === 'todos') return n.todoItems && n.todoItems.length > 0;
        return true; // 'all'
      }

      // Folder filter
      if (filter.type === 'folder') {
        return n.folderId === filter.value;
      }

      // Tag filter
      if (filter.type === 'tag') {
        return n.tags.some(t => t.toLowerCase() === filter.value.toLowerCase());
      }

      return true;
    });

    // Search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort order
    result.sort((a, b) => {
      // Pinned notes bubble up only in 'all' view
      if (filter.type === 'system' && filter.value === 'all' && !searchQuery) {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }

      switch (sortOption) {
        case 'updated-desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'updated-asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'created-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title, 'vi');
        case 'title-desc':
          return b.title.localeCompare(a.title, 'vi');
        default:
          return 0;
      }
    });

    return result;
  }, [notes, filter, searchQuery, sortOption]);

  // Note CRUD Actions
  const handleCreateNewNote = useCallback((folderOverride?: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: '',
      content: '',
      folderId: folderOverride || (filter.type === 'folder' ? filter.value : 'work'),
      tags: filter.type === 'tag' ? [filter.value] : [],
      isPinned: filter.type === 'system' && filter.value === 'pinned',
      isFavorite: filter.type === 'system' && filter.value === 'favorites',
      isArchived: false,
      isTrash: false,
      colorTheme: 'white',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      todoItems: [],
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
  }, [filter]);

  const handleCreateFromTemplate = (template: NoteTemplate) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: template.title,
      content: template.content,
      folderId: template.folderId,
      tags: [...template.tags],
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      isTrash: false,
      colorTheme: template.colorTheme,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      todoItems: template.todoItems?.map((t, idx) => ({
        id: `td-tpl-${Date.now()}-${idx}`,
        text: t.text,
        completed: t.completed,
      })) || [],
    };

    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsTemplatePickerOpen(false);
  };

  const handleUpdateNote = (updated: Note) => {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isTrash: true, isPinned: false } : n));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const handleRestoreNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isTrash: false } : n));
  };

  const handlePermanentDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const handleEmptyTrash = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn toàn bộ ghi chú trong thùng rác không?')) {
      setNotes(prev => prev.filter(n => !n.isTrash));
    }
  };

  const handleTogglePin = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n));
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite, updatedAt: new Date().toISOString() } : n));
  };

  const handleToggleArchive = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isArchived: !n.isArchived, isPinned: false, updatedAt: new Date().toISOString() } : n));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  };

  const handleDuplicateNote = (noteToDuplicate: Note, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const duplicated: Note = {
      ...noteToDuplicate,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: `${noteToDuplicate.title} (Bản sao)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
    };
    setNotes(prev => [duplicated, ...prev]);
  };

  const handleChangeColor = (id: string, colorTheme: NoteColor, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, colorTheme, updatedAt: new Date().toISOString() } : n));
  };

  // Select note handler with security lock checking
  const handleSelectNote = (note: Note) => {
    if (note.isLocked) {
      setLockModal({
        isOpen: true,
        note,
        mode: 'unlock',
        pendingAction: () => setSelectedNoteId(note.id),
      });
    } else {
      setSelectedNoteId(note.id);
    }
  };

  const handleRequestLockNote = (note: Note) => {
    if (note.isLocked) {
      // Unlock / Remove protection
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, isLocked: false, pinCode: undefined } : n));
    } else {
      // Open set PIN modal
      setLockModal({
        isOpen: true,
        note,
        mode: 'set',
      });
    }
  };

  const handleLockSuccess = (pin?: string) => {
    if (lockModal.mode === 'set' && lockModal.note && pin) {
      setNotes(prev => prev.map(n => n.id === lockModal.note!.id ? { ...n, isLocked: true, pinCode: pin } : n));
    } else if (lockModal.mode === 'unlock' && lockModal.pendingAction) {
      lockModal.pendingAction();
    }
  };

  // Folder Actions
  const handleAddFolder = (name: string, color?: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      color: color || '#EA580C',
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
    // Move notes in this folder to general/work
    setNotes(prev => prev.map(n => n.folderId === folderId ? { ...n, folderId: 'work' } : n));
    if (filter.type === 'folder' && filter.value === folderId) {
      setFilter({ type: 'system', value: 'all' });
    }
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: newName } : f));
  };

  const handleRestoreData = (newNotes: Note[], newFolders?: Folder[]) => {
    setNotes(newNotes);
    if (newFolders && newFolders.length > 0) {
      setFolders(newFolders);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FFFBF7] overflow-hidden text-neutral-800">
      
      {/* Left Sidebar Navigation */}
      <Sidebar
        folders={folders}
        notes={notes}
        filter={filter}
        onSelectFilter={(newFilter) => {
          setFilter(newFilter);
          setSelectedNoteId(null);
        }}
        onCreateNewNote={() => handleCreateNewNote()}
        onOpenTemplatePicker={() => setIsTemplatePickerOpen(true)}
        onAddFolder={handleAddFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onEmptyTrash={handleEmptyTrash}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#FFFBF7]">
        
        {/* If a note is selected in focused editor mode */}
        {activeNote ? (
          <NoteEditor
            note={activeNote}
            folders={folders}
            onUpdateNote={handleUpdateNote}
            onBack={() => setSelectedNoteId(null)}
            onDeleteNote={handleDeleteNote}
            onRequestLockNote={handleRequestLockNote}
          />
        ) : (
          <>
            {/* Top Bar Header */}
            <Header
              filter={filter}
              folders={folders}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              sortOption={sortOption}
              onSortChange={setSortOption}
              onCreateNewNote={() => handleCreateNewNote()}
              onOpenShortcuts={() => setIsShortcutsOpen(true)}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
              totalFilteredCount={filteredNotes.length}
            />

            {/* Notes List / Grid View Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              
              {/* Header banner if inside trash or archive */}
              {filter.type === 'system' && filter.value === 'trash' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200/80 flex items-center justify-between text-xs text-red-800">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Các ghi chú trong thùng rác sẽ được lưu giữ tại đây cho đến khi bạn dọn sạch.</span>
                  </div>
                  {filteredNotes.length > 0 && (
                    <button
                      onClick={handleEmptyTrash}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors cursor-pointer shrink-0 ml-2"
                    >
                      Dọn sạch tất cả
                    </button>
                  )}
                </div>
              )}

              {/* Empty State */}
              {filteredNotes.length === 0 ? (
                <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-orange-200/60 bg-white/50">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 shadow-xs">
                    {searchQuery ? (
                      <Search className="w-8 h-8" />
                    ) : filter.type === 'system' && filter.value === 'trash' ? (
                      <Trash2 className="w-8 h-8 text-neutral-400" />
                    ) : (
                      <FileText className="w-8 h-8" />
                    )}
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 mb-1">
                    {searchQuery
                      ? `Không tìm thấy kết quả cho "${searchQuery}"`
                      : filter.type === 'system' && filter.value === 'trash'
                      ? 'Thùng rác hiện đang trống'
                      : filter.type === 'system' && filter.value === 'favorites'
                      ? 'Chưa có ghi chú yêu thích nào'
                      : filter.type === 'system' && filter.value === 'pinned'
                      ? 'Chưa có ghi chú nào được ghim'
                      : 'Không có ghi chú nào ở đây'}
                  </h3>

                  <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">
                    {searchQuery
                      ? 'Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm để xem toàn bộ danh sách.'
                      : 'Bắt đầu ghi lại ý tưởng, kế hoạch làm việc hoặc những suy nghĩ thú vị của bạn ngay bây giờ.'}
                  </p>

                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 text-xs font-semibold text-orange-800 bg-orange-100 hover:bg-orange-200/80 rounded-xl transition-colors cursor-pointer"
                    >
                      Xóa tìm kiếm
                    </button>
                  ) : (
                    filter.type !== 'system' || filter.value !== 'trash' ? (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCreateNewNote()}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tạo ghi chú mới</span>
                        </button>
                        <button
                          onClick={() => setIsTemplatePickerOpen(true)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-orange-800 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 rounded-xl transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-orange-600" />
                          <span>Dùng mẫu có sẵn</span>
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                /* Populated Cards Container */
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max'
                      : 'flex flex-col gap-2.5'
                  }
                >
                  {filteredNotes.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      folders={folders}
                      viewMode={viewMode}
                      isSelected={selectedNoteId === note.id}
                      onSelect={handleSelectNote}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                      onDeleteNote={handleDeleteNote}
                      onRestoreNote={handleRestoreNote}
                      onPermanentDeleteNote={handlePermanentDeleteNote}
                      onToggleArchive={handleToggleArchive}
                      onDuplicateNote={handleDuplicateNote}
                      onChangeColor={handleChangeColor}
                    />
                  ))}
                </div>
              )}

            </div>
          </>
        )}

      </main>

      {/* Modals */}
      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelectTemplate={handleCreateFromTemplate}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        notes={notes}
        folders={folders}
      />

      <LockModal
        isOpen={lockModal.isOpen}
        onClose={() => setLockModal(prev => ({ ...prev, isOpen: false }))}
        note={lockModal.note}
        mode={lockModal.mode}
        onSuccess={handleLockSuccess}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        notes={notes}
        folders={folders}
        onRestoreData={handleRestoreData}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

    </div>
  );
}
