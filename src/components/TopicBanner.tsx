import React from 'react';
import { TOPICS, TopicInfo } from '../data/puzzles';
import { TopicId } from '../types/puzzle';
import { Compass, BookOpen, Atom, Sparkles } from 'lucide-react';

interface TopicBannerProps {
  selectedTopic: TopicId | 'all';
  onSelectTopic: (topic: TopicId | 'all') => void;
  totalPuzzles: number;
  solvedCount: number;
}

export const TopicBanner: React.FC<TopicBannerProps> = ({
  selectedTopic,
  onSelectTopic,
  totalPuzzles,
  solvedCount,
}) => {
  const currentTopicInfo = selectedTopic !== 'all' ? TOPICS[selectedTopic] : null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#b88e4a]/40 bg-[#1b1510] shadow-2xl mb-8">
      {/* Background Image with antique scrim overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={
            currentTopicInfo
              ? currentTopicInfo.bannerImage
              : '/src/assets/images/antique_academy_hall_1790562697638.jpg'
          }
          alt="Viện Hàn Lâm Học Thuật Cổ Điển"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-all duration-700 filter saturate-[0.85] contrast-[1.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-[#120e0b]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120e0b]/90 via-[#120e0b]/60 to-[#120e0b]/40" />
      </div>

      <div className="relative z-10 px-6 py-8 md:px-10 md:py-10">
        {/* Top classical Latin Motto kicker */}
        <div className="flex items-center gap-2 text-xs text-[#c99a4e] tracking-widest uppercase font-cinzel mb-2">
          <span>Học Viện Khảo Cứu Cổ Điển Thế Kỷ 18</span>
          <span aria-hidden="true">·</span>
          <span>
            {currentTopicInfo ? currentTopicInfo.latinName : 'Scientia et Sapientia Universalis'}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold text-[#fbf5e8] tracking-wide leading-tight mb-3">
              {currentTopicInfo ? currentTopicInfo.name : 'Kho Tàng Câu Hỏi Viện Hàn Lâm'}
            </h1>
            <p className="text-sm md:text-base text-[#d8c7ad] leading-relaxed font-garamond italic">
              {currentTopicInfo
                ? currentTopicInfo.description
                : 'Nơi lưu giữ các bí ẩn toán học cổ điển, cấu trúc ngôn ngữ học tượng hình phương Đông và những định luật tự nhiên vĩ đại đã định hình nền văn minh nhân loại.'}
            </p>
          </div>

          {/* Topic Selector Tabs (Interactive Buttons) */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#251b14]/90 border border-[#b88e4a]/30 rounded-lg backdrop-blur-md self-start lg:self-end">
            <button
              onClick={() => onSelectTopic('all')}
              className={`px-3 py-1.5 text-xs font-cinzel tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'all'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold shadow-md'
                  : 'text-[#c4b195] hover:text-[#f4ecd8] hover:bg-[#34261c]'
              }`}
            >
              Tất Cả Thư Mục ({totalPuzzles})
            </button>

            <button
              onClick={() => onSelectTopic('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'math'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold shadow-md'
                  : 'text-[#c4b195] hover:text-[#f4ecd8] hover:bg-[#34261c]'
              }`}
            >
              <span>📐</span>
              <span>Toán Học</span>
            </button>

            <button
              onClick={() => onSelectTopic('korean')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'korean'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold shadow-md'
                  : 'text-[#c4b195] hover:text-[#f4ecd8] hover:bg-[#34261c]'
              }`}
            >
              <span>📜</span>
              <span>Tiếng Hàn</span>
            </button>

            <button
              onClick={() => onSelectTopic('physics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                selectedTopic === 'physics'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold shadow-md'
                  : 'text-[#c4b195] hover:text-[#f4ecd8] hover:bg-[#34261c]'
              }`}
            >
              <span>⚖️</span>
              <span>Vật Lý</span>
            </button>
          </div>
        </div>

        {/* Bottom subtle progress line */}
        <div className="mt-6 pt-4 border-t border-[#b88e4a]/20 flex flex-wrap items-center justify-between text-xs text-[#a99479] gap-4">
          <div className="flex items-center gap-3">
            <span>Tiến độ khảo hạch:</span>
            <span className="font-cinzel text-[#ffd700] font-semibold tabular-nums">
              {solvedCount} / {totalPuzzles} bí ẩn đã thông suốt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34c759] inline-block"></span>
            <span>Chế độ: Khảo Thí Viện Sĩ Tự Do</span>
          </div>
        </div>
      </div>
    </div>
  );
};
