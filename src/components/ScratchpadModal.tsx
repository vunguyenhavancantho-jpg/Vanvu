import React, { useState } from 'react';
import { X, Trash2, PenTool, BookOpen } from 'lucide-react';
import { audioSystem } from '../utils/audio';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const [scratchNotes, setScratchNotes] = useState<string>(() => {
    return localStorage.getItem('academia_enigma_scratchpad') || '';
  });

  if (!isOpen) return null;

  const handleSave = (val: string) => {
    setScratchNotes(val);
    localStorage.setItem('academia_enigma_scratchpad', val);
  };

  const handleClear = () => {
    if (window.confirm('Học giả có chắc muốn xóa sạch bản thảo giấy nháp này?')) {
      handleSave('');
      audioSystem.playParchmentFlip();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#f7f2e4] text-[#2d2116] border-2 border-[#b88e4a] shadow-2xl p-6 font-garamond overflow-hidden">
        {/* Antique corner decorations */}
        <div className="absolute top-2 left-3 text-xs text-[#8e6e39]/50 font-serif">⚜</div>
        <div className="absolute top-2 right-3 text-xs text-[#8e6e39]/50 font-serif">⚜</div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#c4a97c] mb-4">
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-[#7a5829]" />
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1f170f]">
              Giấy Nháp Mực Nho Của Học Giả
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#7a5829] hover:text-[#1f170f] hover:bg-[#eadecb] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#70583b] italic mb-3">
          Nơi ghi lại công thức nhẩm tính, liên tưởng ngôn ngữ, hoặc sơ đồ phác thảo trong quá trình khảo hạch.
        </p>

        {/* Paper textarea with lined paper aesthetic */}
        <div className="relative">
          <textarea
            value={scratchNotes}
            onChange={(e) => handleSave(e.target.value)}
            rows={10}
            placeholder="Ví dụ: Diophantus: 1/6 + 1/12 + 1/7 + 1/2 = 75/84...&#10;Tiếng Hàn: Hán Hàn 謝過 (Tạ Quá) = 사과...&#10;Đòn bẩy: 100 × 1 = 20 × d2 => d2 = 5m..."
            className="w-full p-4 bg-[#fdfbf6] border border-[#cfbe9e] rounded-xl text-sm leading-relaxed text-[#1a130d] font-garamond focus:outline-none focus:border-[#7a5829] resize-none shadow-inner"
          />
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-[#c4a97c]/60 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-cinzel text-[#8c352c] hover:bg-[#f2dcd9] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tẩy sạch nháp</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-[#7a5829] hover:bg-[#61451f] text-[#fcf6eb] font-cinzel text-xs font-bold tracking-wider transition-colors cursor-pointer shadow"
          >
            Đóng Giấy Nháp
          </button>
        </div>
      </div>
    </div>
  );
};
