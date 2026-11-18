export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export type NoteColor = 'white' | 'orange-soft' | 'amber-soft' | 'peach' | 'creme';

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string; // folder ID or 'general'
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  isTrash: boolean;
  colorTheme: NoteColor;
  createdAt: string;
  updatedAt: string;
  todoItems?: TodoItem[];
  isLocked?: boolean;
  pinCode?: string;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  isSystem?: boolean;
}

export type SortOption = 'updated-desc' | 'updated-asc' | 'title-asc' | 'title-desc' | 'created-desc';

export type ViewMode = 'grid' | 'list';

export type SystemFolderType = 'all' | 'pinned' | 'favorites' | 'todos' | 'archive' | 'trash';

export interface FilterState {
  type: 'system' | 'folder' | 'tag';
  value: string;
}

export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  folderId: string;
  tags: string[];
  todoItems?: { text: string; completed: boolean }[];
  colorTheme: NoteColor;
}
