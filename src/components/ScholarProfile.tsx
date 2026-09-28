import React from 'react';
import { ScholarStats, PuzzleQuestion, TopicId } from '../types/puzzle';
import { TOPICS, SCHOLAR_RANKS, ScholarHonorRank } from '../data/puzzles';
import { Award, BookOpen, Bookmark, CheckCircle2, Trophy, Flame, Shield, ArrowRight } from 'lucide-react';
import { audioSystem } from '../utils/audio';

interface ScholarProfileProps {
  stats: ScholarStats;
  allQuestions: PuzzleQuestion[];
  onOpenQuestion: (questionId: string) => void;
  onSelectTopic: (topic: TopicId | 'all') => void;
  onNavigateToCatalog: () => void;
}

export const ScholarProfile: React.FC<ScholarProfileProps> = ({
  stats,
  allQuestions,
  onOpenQuestion,
  onSelectTopic,
  onNavigateToCatalog,
}) => {
  // Determine current scholar rank
  const currentRank =
    SCHOLAR_RANKS.slice()
      .reverse()
      .find((r) => stats.score >= r.minPoints) || SCHOLAR_RANKS[0];

  const nextRank = SCHOLAR_RANKS.find((r) => r.minPoints > stats.score);
  const progressToNext = nextRank
    ? Math.min(100, Math.round(((stats.score - currentRank.minPoints) / (nextRank.minPoints - currentRank.minPoints)) * 100))
    : 100;

  // Topic breakdowns
  const getTopicBreakdown = (topicId: TopicId) => {
    const topicQuestions = allQuestions.filter((q) => q.topic === topicId);
    const solved = topicQuestions.filter((q) => stats.answeredRecords[q.id]?.isCorrect).length;
    return {
      total: topicQuestions.length,
      solved,
      pct: Math.round((solved / topicQuestions.length) * 100),
    };
  };

  const mathStats = getTopicBreakdown('math');
  const koreanStats = getTopicBreakdown('korean');
  const physicsStats = getTopicBreakdown('physics');

  // Bookmarked questions
  const bookmarkedQuestions = allQuestions.filter((q) => stats.bookmarkedIds.includes(q.id));

  // Honor seals definitions
  const honorMedals = [
    {
      id: 'math_master',
      title: 'Huy Hiệu Euclid',
      latin: 'Magister Mathematica',
      icon: '📐',
      desc: 'Hoàn thành toàn bộ bí ẩn Toán học hoàng gia',
      unlocked: mathStats.solved === mathStats.total && mathStats.total > 0,
    },
    {
      id: 'korean_master',
      title: 'Huy Chương Sejong',
      latin: 'Cultor Linguae Coreanae',
      icon: '📜',
      desc: 'Lĩnh hội trọn vẹn Huấn dân chính âm & Ngôn ngữ học Hàn',
      unlocked: koreanStats.solved === koreanStats.total && koreanStats.total > 0,
    },
    {
      id: 'physics_master',
      title: 'Huy Chương Newton',
      latin: 'Doctor Philosophiae Naturalis',
      icon: '⚖️',
      desc: 'Thấu suốt các định luật cơ học & quang học tự nhiên',
      unlocked: physicsStats.solved === physicsStats.total && physicsStats.total > 0,
    },
    {
      id: 'streak_master',
      title: 'Ngọn Lửa Trí Tuệ',
      latin: 'Ignis Sapientiae',
      icon: '🔥',
      desc: 'Đạt chuỗi 5 câu khảo chứng chính xác liên tiếp',
      unlocked: stats.bestStreak >= 5,
    },
    {
      id: 'zombie_slayer',
      title: 'Hiệp Sĩ Diệt Thây Ma',
      latin: 'Interfector Mortuorum',
      icon: '⚔️',
      desc: 'Tiêu diệt thành công ít nhất 10 xác sống dịch hạch',
      unlocked: (stats.zombiesKilled || 0) >= 10,
    },
    {
      id: 'blood_moon_survivor',
      title: 'Kẻ Sống Sót Huyết Nguyệt',
      latin: 'Superstes Lunae Sanguineae',
      icon: '🩸',
      desc: 'Cố thủ thành công qua Đêm 3 của trận vây hãm',
      unlocked: (stats.nightsSurvived || 0) >= 3,
    },
    {
      id: 'pure_mind',
      title: 'Ấn Tín Thuần Khiết',
      latin: 'Sigillum Purum',
      icon: '⚜️',
      desc: 'Phá giải ít nhất 5 câu hỏi mà không bẻ dấu sáp gợi ý',
      unlocked:
        Object.values(stats.answeredRecords).filter((r) => r.isCorrect && !r.usedHint).length >= 5,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in font-garamond">
      {/* Top Profile Hero Card */}
      <div className="relative rounded-2xl bg-[#1b1510] border border-[#b88e4a]/40 shadow-2xl p-6 sm:p-10 overflow-hidden">
        {/* Background watermark seal */}
        <div className="absolute right-4 -bottom-10 text-[180px] text-[#b88e4a]/5 select-none pointer-events-none font-serif">
          ⚜
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Rank Badge Emblem */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#3d2e20] to-[#1e1610] border-2 border-[#d4af37] flex flex-col items-center justify-center shadow-xl shrink-0">
            <span className="text-4xl">{currentRank.badge}</span>
            <span className="text-[10px] font-cinzel text-[#ffd700] tracking-widest mt-1">VIỆN SĨ</span>
          </div>

          {/* Rank & Stats Info */}
          <div className="flex-1 space-y-2">
            <div className="text-xs font-cinzel text-[#c99a4e] tracking-widest uppercase">
              Bằng Sắc Phong Viện Hàn Lâm Khảo Cứu
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#fbf5e8] tracking-wide">
              {currentRank.title}
            </h2>
            <p className="text-sm text-[#e6b75a] font-cinzel italic tracking-wider">
              — {currentRank.latinTitle} —
            </p>
            <p className="text-sm text-[#a99781] max-w-xl italic">
              {currentRank.description}
            </p>

            {/* Rank Progress bar */}
            {nextRank && (
              <div className="pt-3 max-w-md">
                <div className="flex justify-between text-xs text-[#c4b195] font-cinzel mb-1">
                  <span>Tiến trình đến: {nextRank.title}</span>
                  <span className="tabular-nums font-bold text-[#ffd700]">
                    {stats.score} / {nextRank.minPoints} Điểm
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#120e0b] border border-[#5a432f] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#b88e4a] to-[#ffd700] transition-all duration-700"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Metrics Cluster (Clean unboxed text) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#231b14] border border-[#b88e4a]/20 shrink-0 text-left">
            <div>
              <div className="text-[11px] text-[#8e7a64] font-cinzel">Tổng Điểm</div>
              <div className="font-cinzel text-xl font-bold text-[#ffd700] tabular-nums">
                {stats.score}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8e7a64] font-cinzel">Bí Ẩn Đã Giải</div>
              <div className="font-cinzel text-xl font-bold text-[#f4ecd8] tabular-nums">
                {stats.solvedCount} / {allQuestions.length}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8e7a64] font-cinzel">Chuỗi Khảo Chứng</div>
              <div className="font-cinzel text-xl font-bold text-[#ff9500] tabular-nums">
                {stats.bestStreak} 🔥
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8e7a64] font-cinzel">Thây Ma Đã Diệt</div>
              <div className="font-cinzel text-xl font-bold text-[#ff4d4f] tabular-nums">
                {stats.zombiesKilled || 0} 🧟
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8e7a64] font-cinzel">Đêm Vượt Qua</div>
              <div className="font-cinzel text-xl font-bold text-[#d4af37] tabular-nums">
                {stats.nightsSurvived || 0} 🌙
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8e7a64] font-cinzel">Bạc Tích Lũy</div>
              <div className="font-cinzel text-xl font-bold text-[#ffd700] tabular-nums">
                {stats.silverCoins || 0} 🪙
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Mastery Progress Cards */}
      <div>
        <h3 className="font-cinzel text-lg font-bold text-[#fbf5e8] mb-4 flex items-center gap-2">
          <span>Tiến Độ Theo Từng Khoa Mục</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Math Card */}
          <div
            onClick={() => {
              onSelectTopic('math');
              onNavigateToCatalog();
            }}
            className="p-5 rounded-xl bg-[#1b1510] hover:bg-[#231b15] border border-[#b88e4a]/30 hover:border-[#ffd700]/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📐</span>
              <span className="font-cinzel text-xs text-[#ffd700] font-bold tabular-nums">
                {mathStats.pct}%
              </span>
            </div>
            <h4 className="font-cinzel font-bold text-[#fbf5e8] group-hover:text-[#ffd700] transition-colors">
              Khoa Mục Toán Học
            </h4>
            <p className="text-xs text-[#8e7b67] italic mb-3">Mathematica & Geometria</p>
            <div className="w-full h-1.5 bg-[#120e0b] rounded-full overflow-hidden border border-[#4a3a29] mb-2">
              <div
                className="h-full bg-[#c99a4e]"
                style={{ width: `${mathStats.pct}%` }}
              />
            </div>
            <div className="text-[11px] text-[#a99781] flex justify-between">
              <span>Đã thông tuệ:</span>
              <span className="tabular-nums font-semibold text-[#f4ecd8]">
                {mathStats.solved} / {mathStats.total}
              </span>
            </div>
          </div>

          {/* Korean Card */}
          <div
            onClick={() => {
              onSelectTopic('korean');
              onNavigateToCatalog();
            }}
            className="p-5 rounded-xl bg-[#1b1510] hover:bg-[#231b15] border border-[#b88e4a]/30 hover:border-[#ffd700]/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📜</span>
              <span className="font-cinzel text-xs text-[#ffd700] font-bold tabular-nums">
                {koreanStats.pct}%
              </span>
            </div>
            <h4 className="font-cinzel font-bold text-[#fbf5e8] group-hover:text-[#ffd700] transition-colors">
              Khoa Mục Tiếng Hàn
            </h4>
            <p className="text-xs text-[#8e7b67] italic mb-3">Philologia Coreana</p>
            <div className="w-full h-1.5 bg-[#120e0b] rounded-full overflow-hidden border border-[#4a3a29] mb-2">
              <div
                className="h-full bg-[#c99a4e]"
                style={{ width: `${koreanStats.pct}%` }}
              />
            </div>
            <div className="text-[11px] text-[#a99781] flex justify-between">
              <span>Đã thông tuệ:</span>
              <span className="tabular-nums font-semibold text-[#f4ecd8]">
                {koreanStats.solved} / {koreanStats.total}
              </span>
            </div>
          </div>

          {/* Physics Card */}
          <div
            onClick={() => {
              onSelectTopic('physics');
              onNavigateToCatalog();
            }}
            className="p-5 rounded-xl bg-[#1b1510] hover:bg-[#231b15] border border-[#b88e4a]/30 hover:border-[#ffd700]/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⚖️</span>
              <span className="font-cinzel text-xs text-[#ffd700] font-bold tabular-nums">
                {physicsStats.pct}%
              </span>
            </div>
            <h4 className="font-cinzel font-bold text-[#fbf5e8] group-hover:text-[#ffd700] transition-colors">
              Khoa Mục Vật Lý
            </h4>
            <p className="text-xs text-[#8e7b67] italic mb-3">Philosophia Naturalis</p>
            <div className="w-full h-1.5 bg-[#120e0b] rounded-full overflow-hidden border border-[#4a3a29] mb-2">
              <div
                className="h-full bg-[#c99a4e]"
                style={{ width: `${physicsStats.pct}%` }}
              />
            </div>
            <div className="text-[11px] text-[#a99781] flex justify-between">
              <span>Đã thông tuệ:</span>
              <span className="tabular-nums font-semibold text-[#f4ecd8]">
                {physicsStats.solved} / {physicsStats.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Honor Medals & Seals (Huy hiệu viện sĩ) */}
      <div>
        <h3 className="font-cinzel text-lg font-bold text-[#fbf5e8] mb-4 flex items-center gap-2">
          <span>Huy Hiệu & Triện Vàng Viện Hàn Lâm</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {honorMedals.map((medal) => (
            <div
              key={medal.id}
              className={`p-4 rounded-xl border transition-all ${
                medal.unlocked
                  ? 'bg-[#221b14] border-[#ffd700]/50 shadow-md'
                  : 'bg-[#16110d] border-[#382b1f] opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 ${
                    medal.unlocked
                      ? 'bg-[#3b2d1f] border-[#ffd700] text-[#ffd700]'
                      : 'bg-[#1b1510] border-[#4a3828] filter grayscale'
                  }`}
                >
                  {medal.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5
                      className={`font-cinzel font-bold text-sm ${
                        medal.unlocked ? 'text-[#fbf5e8]' : 'text-[#8e7a64]'
                      }`}
                    >
                      {medal.title}
                    </h5>
                    {medal.unlocked && (
                      <span className="text-[10px] font-cinzel text-[#ffd700] font-bold">
                        ĐÃ ĐOẠT
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#c99a4e] font-cinzel italic">{medal.latin}</div>
                  <p className="text-xs text-[#a99781] mt-1 leading-snug">{medal.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Questions Section */}
      {bookmarkedQuestions.length > 0 && (
        <div className="pt-4 border-t border-[#b88e4a]/20">
          <h3 className="font-cinzel text-lg font-bold text-[#fbf5e8] mb-4 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#ffd700]" />
            <span>Bí Ẩn Đang Lưu Trong Sổ Tay Khảo Cứu ({bookmarkedQuestions.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bookmarkedQuestions.map((q) => (
              <div
                key={q.id}
                onClick={() => {
                  audioSystem.playParchmentFlip();
                  onOpenQuestion(q.id);
                }}
                className="p-4 rounded-xl bg-[#1b1510] hover:bg-[#241a12] border border-[#b88e4a]/30 hover:border-[#ffd700]/50 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs text-[#c99a4e] font-cinzel mb-0.5">
                    {TOPICS[q.topic].name} · +{q.points} Điểm
                  </div>
                  <h5 className="font-cinzel text-sm font-bold text-[#fbf5e8]">{q.title}</h5>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ffd700] shrink-0 ml-3" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
