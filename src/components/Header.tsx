import React from 'react';
import { Volume2, VolumeX, Clock, BookOpen, Compass, Award } from 'lucide-react';
import { TopicId } from '../types/puzzle';

export interface HeaderProps {
  currentView: 'zombie' | 'catalog' | 'solve' | 'profile';
  selectedTopic: TopicId | 'all';
  onSelectTopic: (topic: TopicId | 'all') => void;
  onNavigate: (view: 'zombie' | 'catalog' | 'solve' | 'profile') => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isClockTicking: boolean;
  onToggleClock: () => void;
  totalScore: number;
  zombiesKilled?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedTopic,
  onSelectTopic,
  onNavigate,
  isAudioMuted,
  onToggleAudio,
  isClockTicking,
  onToggleClock,
  totalScore,
  zombiesKilled = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#16110d]/95 backdrop-blur-md border-b border-[#b88e4a]/30 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => {
            onNavigate('zombie');
          }}
          className="text-left group cursor-pointer focus:outline-none flex items-center gap-2"
        >
          <span className="text-xl">🧟</span>
          <span className="font-cinzel text-lg md:text-2xl font-bold tracking-wider text-[#eed9b3] group-hover:text-[#ffd700] transition-colors">
            Zombie Academia
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with active state */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide">
          <button
            onClick={() => onNavigate('zombie')}
            className={`cursor-pointer transition-colors hover:text-[#f4ecd8] whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'zombie'
                ? 'text-[#ff6b6b] font-bold border-b-2 border-[#ff6b6b] pb-0.5'
                : 'text-[#d6a5a0] hover:text-[#ff8585]'
            }`}
          >
            <span>⚔️</span>
            <span>Thủ Thành Xác Sống</span>
          </button>

          <button
            onClick={() => {
              onNavigate('catalog');
              onSelectTopic('all');
            }}
            className={`cursor-pointer transition-colors hover:text-[#f4ecd8] whitespace-nowrap ${
              currentView === 'catalog' && selectedTopic === 'all'
                ? 'text-[#e6b75a] font-semibold border-b border-[#e6b75a] pb-0.5'
                : 'text-[#ab977e]'
            }`}
          >
            Tàng Thư Các
          </button>

          <button
            onClick={() => {
              onNavigate('catalog');
              onSelectTopic('math');
            }}
            className={`cursor-pointer transition-colors hover:text-[#f4ecd8] whitespace-nowrap ${
              currentView === 'catalog' && selectedTopic === 'math'
                ? 'text-[#e6b75a] font-semibold border-b border-[#e6b75a] pb-0.5'
                : 'text-[#ab977e]'
            }`}
          >
            Toán Học
          </button>

          <button
            onClick={() => {
              onNavigate('catalog');
              onSelectTopic('korean');
            }}
            className={`cursor-pointer transition-colors hover:text-[#f4ecd8] whitespace-nowrap ${
              currentView === 'catalog' && selectedTopic === 'korean'
                ? 'text-[#e6b75a] font-semibold border-b border-[#e6b75a] pb-0.5'
                : 'text-[#ab977e]'
            }`}
          >
            Tiếng Hàn
          </button>

          <button
            onClick={() => {
              onNavigate('catalog');
              onSelectTopic('physics');
            }}
            className={`cursor-pointer transition-colors hover:text-[#f4ecd8] whitespace-nowrap ${
              currentView === 'catalog' && selectedTopic === 'physics'
                ? 'text-[#e6b75a] font-semibold border-b border-[#e6b75a] pb-0.5'
                : 'text-[#ab977e]'
            }`}
          >
            Vật Lý
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`cursor-pointer transition-colors hover:text-[#f4ecd8] whitespace-nowrap ${
              currentView === 'profile'
                ? 'text-[#e6b75a] font-semibold border-b border-[#e6b75a] pb-0.5'
                : 'text-[#ab977e]'
            }`}
          >
            Sổ Tay Viện Sĩ
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Zombie Battle Button for Mobile */}
          <button
            onClick={() => onNavigate('zombie')}
            className={`lg:hidden px-2.5 py-1 rounded text-xs font-cinzel font-bold cursor-pointer border ${
              currentView === 'zombie'
                ? 'bg-[#8a221a] text-[#fff] border-[#ff4d4f]'
                : 'bg-[#221612] text-[#ff7875] border-[#8a221a]'
            }`}
          >
            ⚔️ Thủ Thành
          </button>

          {/* Ambient sound toggles */}
          <button
            onClick={onToggleClock}
            title={isClockTicking ? 'Tắt âm đồng hồ quả lắc' : 'Bật âm tích tắc đồng hồ quả lắc'}
            className={`p-2 rounded-md transition-colors cursor-pointer border ${
              isClockTicking
                ? 'bg-[#3b2d1f] text-[#ffd700] border-[#b88e4a]/60'
                : 'bg-[#1e1712] text-[#8e7a64] border-[#4a3a2a] hover:text-[#eed9b3]'
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Bật âm thanh học viện' : 'Tắt âm thanh học viện'}
            className={`p-2 rounded-md transition-colors cursor-pointer border ${
              !isAudioMuted
                ? 'bg-[#3b2d1f] text-[#ffd700] border-[#b88e4a]/60'
                : 'bg-[#1e1712] text-[#8e7a64] border-[#4a3a2a] hover:text-[#eed9b3]'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Scholar Score / Honor Rank Badge button */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#2d2117] hover:bg-[#382a1d] border border-[#b88e4a]/50 text-xs font-medium text-[#f4ecd8] transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#ffd700]" />
            <span className="font-cinzel tracking-wider text-[#ffd700] font-semibold tabular-nums">
              {totalScore}
            </span>
            <span className="hidden sm:inline text-[#c4b195]">Điểm</span>
          </button>
        </div>
      </div>
    </header>
  );
};

