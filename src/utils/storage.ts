import { Note, Folder, NoteTemplate } from '../types';

export const DEFAULT_FOLDERS: Folder[] = [
  { id: 'work', name: 'Công việc', color: '#EA580C' },
  { id: 'personal', name: 'Cá nhân', color: '#F97316' },
  { id: 'study', name: 'Học tập', color: '#FB923C' },
  { id: 'ideas', name: 'Ý tưởng sáng tạo', color: '#F59E0B' },
  { id: 'finance', name: 'Tài chính & Chi tiêu', color: '#D97706' },
];

export const DEFAULT_TEMPLATES: NoteTemplate[] = [
  {
    id: 'meeting',
    title: 'Biên bản cuộc họp & Hành động tiếp theo',
    description: 'Ghi lại mục tiêu, nội dung thảo luận chính và các đầu việc cần làm sau cuộc họp.',
    folderId: 'work',
    tags: ['cuoc-hop', 'cong-viec', 'ke-hoach'],
    colorTheme: 'orange-soft',
    content: `## 📌 Mục tiêu cuộc họp
- Rà soát tiến độ dự án quý này.
- Thống nhất các tính năng cốt lõi cần hoàn thành.

## 👥 Thành phần tham dự
- Nguyễn Văn An (Quản lý dự án)
- Trần Mai Linh (Thiết kế UI/UX)
- Lê Hoàng Nam (Kỹ sư phát triển)

## 💬 Nội dung thảo luận chính
1. Giao diện người dùng: Tối ưu màu cam và trắng mang lại cảm giác ấm áp, tập trung và tràn đầy năng lượng.
2. Tốc độ phản hồi: Đảm bảo dữ liệu ghi chú tự động lưu tức thì.
3. Chức năng to-do: Cho phép chuyển đổi ghi chú thành danh sách công việc tiện lợi.

## 🎯 Quyết định quan trọng
- Hoàn thiện bản mẫu trước ngày 15.
- Thử nghiệm trên các thiết bị di động và máy tính bảng.`,
    todoItems: [
      { text: 'Gửi biên bản tổng hợp cho toàn đội', completed: false },
      { text: 'Cập nhật lại wireframe màn hình chỉnh sửa ghi chú', completed: true },
      { text: 'Thiết lập lịch họp đánh giá lần 2 vào thứ Sáu', completed: false },
    ],
  },
  {
    id: 'weekly-plan',
    title: 'Kế hoạch hành động tuần mới (Tuần 45)',
    description: 'Lập danh sách việc quan trọng, phân bổ thời gian và theo dõi năng suất cá nhân.',
    folderId: 'personal',
    tags: ['ke-hoach', 'nang-suat', 'tuan-moi'],
    colorTheme: 'amber-soft',
    content: `## 🌟 Tuyên ngôn tuần mới
"Tập trung vào những gì quan trọng nhất, làm việc thông minh và giữ gìn sức khỏe."

## 🎯 3 Mục tiêu lớn nhất tuần
1. Hoàn thành 100% công việc trọng điểm của dự án.
2. Đọc xong cuốn sách "Atomic Habits - Thay đổi tí hon, hiệu quả bất ngờ".
3. Duy trì 4 buổi tập thể dục buổi sáng (chạy bộ 5km).

## 📅 Phân bổ lịch trình
- **Thứ Hai - Thứ Ba**: Tập trung giải quyết công việc khó nhất, đòi hỏi tư duy sâu.
- **Thứ Tư - Thứ Năm**: Họp nhóm, rà soát kết quả và hoàn thiện tài liệu.
- **Thứ Sáu**: Đánh giá tuần, dọn dẹp hòm thư và lên kế hoạch tuần tiếp theo.
- **Cuối tuần**: Dành trọn thời gian cho gia đình và tái tạo năng lượng.`,
    todoItems: [
      { text: 'Lập danh sách việc cần làm cho mỗi ngày trước 8h sáng', completed: true },
      { text: 'Tắt thông báo điện thoại trong khung giờ làm việc sâu (9h-11h)', completed: true },
      { text: 'Tổng kết chi tiêu cá nhân trong tuần', completed: false },
      { text: 'Đi ngủ trước 23h30', completed: false },
    ],
  },
  {
    id: 'brainstorm',
    title: 'Ý tưởng khởi nghiệp & Phát triển sản phẩm',
    description: 'Không gian sáng tạo tự do để ghi nhận những lóe sáng ý tưởng bất chợt.',
    folderId: 'ideas',
    tags: ['y-tuong', 'sang-tao', 'san-pham'],
    colorTheme: 'peach',
    content: `## 💡 Vấn đề đang quan sát được
Người dùng hiện đại thường bị phân tâm bởi quá nhiều ứng dụng phức tạp với hàng tá nút bấm rườm rà. Họ cần một công cụ ghi chép tinh gọn, màu sắc tươi mới, khơi gợi cảm hứng sáng tạo mỗi ngày.

## 🚀 Giải pháp đề xuất: "CamNote"
- Tông màu: Cam ấm + Trắng tinh khôi (tạo cảm giác năng động, trẻ trung, thư thái).
- Tốc độ: Khởi động dưới 0.5s, lưu trữ ngoại tuyến tức thì không sợ mất dữ liệu.
- Tổ chức thông minh: Thư mục phân tầng, gắn thẻ tag tự do, tìm kiếm nhanh theo từ khóa.
- Bảo mật: Hỗ trợ mã PIN bảo vệ các ghi chú quan trọng.

## 📝 Các bước triển khai tiếp theo
- Khảo sát nhanh 20 người dùng mục tiêu.
- Xây dựng bản mẫu tương tác mượt mà.
- Lắng nghe phản hồi và cải tiến liên tục.`,
    todoItems: [
      { text: 'Phác thảo bản thiết kế sơ bộ giao diện mobile', completed: true },
      { text: 'Phỏng vấn 5 người bạn về thói quen ghi chú', completed: false },
      { text: 'Nghiên cứu tính năng xuất file Markdown và PDF', completed: true },
    ],
  },
  {
    id: 'reading-notes',
    title: 'Ghi chú sách: Sức mạnh của sự tập trung',
    description: 'Đúc kết những bài học quý giá từ sách vở và các nguồn tài liệu.',
    folderId: 'study',
    tags: ['sach-hay', 'hoc-tap', 'phat-trien-ban-than'],
    colorTheme: 'creme',
    content: `## 📖 Thông tin cuốn sách
- Tác giả: Cal Newport
- Chủ đề: Kỹ năng làm việc sâu trong thế giới đầy phiền nhiễu.

## 🗝️ Những bài học đắt giá
> "Khả năng làm việc sâu ngày càng trở nên hiếm hoi, nhưng chính vì thế mà nó ngày càng trở nên có giá trị trong nền kinh tế mới."

1. **Nguyên tắc 1: Làm việc sâu (Deep Work)**
   - Tạo ra những khoảng thời gian cô lập hoàn toàn không bị ngắt quãng.
   - Thói quen tạo nên sự dễ dàng: chọn thời gian và không gian cố định.

2. **Nguyên tắc 2: Chấp nhận sự buồn chán**
   - Đừng với lấy điện thoại mỗi khi bạn cảm thấy rảnh 30 giây.
   - Huấn luyện não bộ chống lại sự thèm muốn kích thích dopamine liên tục.

3. **Nguyên tắc 3: Từ bỏ mạng xã hội không thiết yếu**
   - Chỉ giữ lại những công cụ thực sự đóng góp vào mục tiêu sống của bạn.`,
    todoItems: [
      { text: 'Thực hành 90 phút làm việc sâu mỗi buổi sáng', completed: true },
      { text: 'Ghi chép lại cảm nhận sau 7 ngày áp dụng', completed: false },
    ],
  },
  {
    id: 'finance-plan',
    title: 'Kế hoạch quản lý tài chính & Tiết kiệm tháng này',
    description: 'Theo dõi dòng tiền, ngân sách chi tiêu và các quỹ đầu tư dài hạn.',
    folderId: 'finance',
    tags: ['tai-chinh', 'tiet-kiem', 'ngan-sach'],
    colorTheme: 'orange-soft',
    content: `## 💰 Quy tắc phân bổ ngân sách 50/30/20
- **50% Nhu cầu thiết yếu**: Tiền nhà, điện nước, ăn uống, xăng xe.
- **30% Mong muốn cá nhân**: Mua sắm, giải trí, cà phê gặp gỡ bạn bè.
- **20% Tiết kiệm & Tích lũy**: Quỹ khẩn cấp (3 tháng chi phí), đầu tư dài hạn.

## 📊 Mục tiêu cụ thể trong tháng
- Giữ chi phí ăn ngoài dưới mức ngân sách đề ra.
- Tự nấu ăn ít nhất 4 bữa tối/tuần.
- Trích ngay 20% thu nhập vào tài khoản tích lũy ngày nhận lương.`,
    todoItems: [
      { text: 'Rà soát các gói đăng ký dịch vụ không còn sử dụng', completed: true },
      { text: 'Tạo tài khoản tiết kiệm linh hoạt có kỳ hạn', completed: true },
      { text: 'Tổng hợp hóa đơn sinh hoạt cuối tháng', completed: false },
    ],
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '🔥 Kế hoạch công việc tuần mới & Dự án trọng điểm',
    content: `Tuần này cần tập trung cao độ vào việc hoàn thiện sản phẩm và kiểm tra kỹ lưỡng trải nghiệm người dùng.

### 📌 Các đầu việc quan trọng:
- Tối ưu hóa giao diện người dùng màu cam trắng thanh lịch.
- Kiểm tra tính năng tìm kiếm ghi chú tức thì không độ trễ.
- Đảm bảo cơ chế lưu tự động (auto-save) mượt mà vào trình duyệt.
- Thêm khả năng gắn thẻ nhãn (Tags) và tạo thư mục tùy biến.

Hãy dành 2 giờ sáng mỗi ngày để làm việc sâu (Deep Work), tránh các cuộc họp không cần thiết!`,
    folderId: 'work',
    tags: ['cong-viec', 'uu-tien-cao', 'du-an'],
    isPinned: true,
    isFavorite: true,
    isArchived: false,
    isTrash: false,
    colorTheme: 'orange-soft',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    todoItems: [
      { id: 'todo-1', text: 'Thiết kế bố cục hai cột responsive cam trắng', completed: true },
      { id: 'todo-2', text: 'Thêm thanh công cụ định dạng văn bản tiện lợi', completed: true },
      { id: 'todo-3', text: 'Xây dựng tính năng sao lưu dữ liệu JSON', completed: true },
      { id: 'todo-4', text: 'Đánh giá lại độ tương phản màu sắc đạt chuẩn WCAG', completed: false },
    ],
  },
  {
    id: 'note-2',
    title: '💡 Ý tưởng phát triển tính năng mới cho CamNote',
    content: `Dưới đây là một số ý tưởng sáng tạo nhằm nâng cấp trải nghiệm người dùng trong tương lai:

1. **Khóa ghi chú bằng mã PIN:** Giúp người dùng bảo vệ nhật ký hoặc thông tin nhạy cảm.
2. **Bộ đếm số từ và thời gian đọc:** Tiện lợi cho người viết nội dung, blog và sinh viên nghiên cứu.
3. **Thao tác nhanh bằng phím tắt:**
   - Ctrl/Cmd + N: Tạo ghi chú mới
   - Ctrl/Cmd + F: Tìm kiếm tức thì
   - Esc: Quay lại danh sách
4. **Hỗ trợ in ấn và xuất file Markdown:** Giúp lưu trữ lâu dài ở dạng văn bản mở.`,
    folderId: 'ideas',
    tags: ['y-tuong', 'tinh-nang', 'sang-tao'],
    isPinned: true,
    isFavorite: false,
    isArchived: false,
    isTrash: false,
    colorTheme: 'peach',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    todoItems: [
      { id: 'td-1', text: 'Thêm phím tắt bàn phím thông dụng', completed: true },
      { id: 'td-2', text: 'Hỗ trợ xuất ghi chú sang tệp .md', completed: true },
    ],
  },
  {
    id: 'note-3',
    title: '📚 Danh sách sách phát triển tư duy nên đọc',
    content: `Ghi chép danh sách các cuốn sách tâm đắc đã và đang đọc:

- **Atomic Habits** (James Clear): Tuyệt vời cho việc xây dựng thói quen nhỏ bền vững.
- **Deep Work** (Cal Newport): Phương pháp tập trung tối đa trong kỷ nguyên số.
- **Tâm lý học về tiền** (Morgan Housel): Những góc nhìn sâu sắc và thực tế về tài chính cá nhân.
- **Thiết kế cuộc đời đáng sống** (Bill Burnett & Dave Evans): Áp dụng tư duy thiết kế vào định hướng tương lai.

> "Thành công là sản phẩm của thói quen hàng ngày — không phải của những cuộc biến đổi một lần trong đời."`,
    folderId: 'study',
    tags: ['sach-hay', 'hoc-tap', 'thoi-quen'],
    isPinned: false,
    isFavorite: true,
    isArchived: false,
    isTrash: false,
    colorTheme: 'amber-soft',
    createdAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    todoItems: [
      { id: 'book-1', text: 'Đọc hết chương 4 cuốn Tâm lý học về tiền', completed: true },
      { id: 'book-2', text: 'Ghi lại 3 bài học áp dụng được ngay', completed: false },
    ],
  },
  {
    id: 'note-4',
    title: '🌿 Thói quen buổi sáng tràn đầy năng lượng',
    content: `Khung giờ vàng từ 6:00 đến 7:30 sáng:

- **6:00**: Thức dậy, uống 1 ly nước ấm pha chút chanh hoặc mật ong.
- **6:15**: Vận động nhẹ hoặc chạy bộ 20-30 phút ngoài trời để đón ánh nắng sớm.
- **6:45**: Tắm nước mát, chuẩn bị bữa sáng lành mạnh (yến mạch, trứng, trái cây tươi).
- **7:15**: Dành 15 phút mở CamNote lên để xem lại danh sách việc cần làm trong ngày và bắt đầu với tâm thế chủ động nhất.`,
    folderId: 'personal',
    tags: ['suc-khoe', 'thoi-quen', 'buoi-sang'],
    isPinned: false,
    isFavorite: true,
    isArchived: false,
    isTrash: false,
    colorTheme: 'creme',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    todoItems: [
      { id: 'm-1', text: 'Chuẩn bị đồ tập từ tối hôm trước', completed: true },
      { id: 'm-2', text: 'Hạn chế lướt mạng xã hội trước 8h sáng', completed: true },
    ],
  },
  {
    id: 'note-5',
    title: '🛒 Danh sách mua sắm đồ dùng gia đình & văn phòng',
    content: `Những món đồ cần bổ sung vào cuối tuần này:
- Giấy ghi chú nhớ dạng sticker màu cam và vàng.
- Bút bi mực gel đen 0.5mm nét mảnh.
- Đèn bàn bảo vệ thị lực có điều chỉnh độ sáng ấm.
- Hạt chia hữu cơ và hạt điều rang muối.`,
    folderId: 'personal',
    tags: ['mua-sam', 'gia-dinh'],
    isPinned: false,
    isFavorite: false,
    isArchived: false,
    isTrash: false,
    colorTheme: 'white',
    createdAt: new Date(Date.now() - 3600000 * 24 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    todoItems: [
      { id: 'sh-1', text: 'Giấy note sticker màu cam', completed: true },
      { id: 'sh-2', text: 'Bút mực gel đen 0.5mm', completed: false },
      { id: 'sh-3', text: 'Đèn bàn học ánh sáng vàng ấm', completed: false },
    ],
  },
];

const STORAGE_KEY_NOTES = 'camnote_notes_v1';
const STORAGE_KEY_FOLDERS = 'camnote_folders_v1';

export function loadNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) {
      saveNotesToStorage(INITIAL_NOTES);
      return INITIAL_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_NOTES;
  } catch (e) {
    console.error('Failed to load notes from localStorage', e);
    return INITIAL_NOTES;
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes to localStorage', e);
  }
}

export function loadFoldersFromStorage(): Folder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (!raw) {
      saveFoldersToStorage(DEFAULT_FOLDERS);
      return DEFAULT_FOLDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_FOLDERS;
  } catch (e) {
    console.error('Failed to load folders from localStorage', e);
    return DEFAULT_FOLDERS;
  }
}

export function saveFoldersToStorage(folders: Folder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
  } catch (e) {
    console.error('Failed to save folders to localStorage', e);
  }
}

// Utility: format relative or friendly Vietnamese date
export function formatNoteDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay === 1) return 'Hôm qua';
    if (diffDay < 7) return `${diffDay} ngày trước`;

    // Standard format DD/MM/YYYY
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${d}/${m}/${y} ${h}:${min}`;
  } catch {
    return dateStr;
  }
}

// Utility: Calculate word count & character count
export function calculateTextStats(text: string): { words: number; chars: number; readMinutes: number } {
  const clean = text.trim();
  if (!clean) return { words: 0, chars: 0, readMinutes: 0 };
  const words = clean.split(/\s+/).filter(Boolean).length;
  const chars = clean.length;
  const readMinutes = Math.max(1, Math.ceil(words / 180));
  return { words, chars, readMinutes };
}
