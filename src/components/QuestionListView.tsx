import React, { useState, useMemo } from 'react';
import { PuzzleQuestion, TopicId, DifficultyLevel, UserAnswerRecord } from '../types/puzzle';
import { TOPICS } from '../data/puzzles';
import { Search, Bookmark, CheckCircle2, HelpCircle, ArrowRight, BookOpen, Filter } from 'lucide-react';
import { audioSystem } from '../utils/audio';

interface QuestionListViewProps {
  questions: PuzzleQuestion[];
  selectedTopic: TopicId | 'all';
  onSelectTopic: (topic: TopicId | 'all') => void;
  onOpenQuestion: (questionId: string) => void;
  answeredRecords: Record<string, UserAnswerRecord>;
  bookmarkedIds: string[];
  onToggleBookmark: (questionId: string) => void;
}

export const QuestionListView: React.FC<QuestionListViewProps> = ({
  questions,
  selectedTopic,
  onSelectTopic,
  onOpenQuestion,
  answeredRecords,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Topic match
      if (selectedTopic !== 'all' && q.topic !== selectedTopic) {
        return false;
      }
      // Difficulty match
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      // Status match
      const record = answeredRecords[q.id];
      if (statusFilter === 'solved' && (!record || !record.isCorrect)) {
        return false;
      }
      if (statusFilter === 'unsolved' && record && record.isCorrect) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchSub = q.subTitle.toLowerCase().includes(query);
        const matchText = q.questionText.toLowerCase().includes(query);
        const matchFigure = q.historicalFigure?.toLowerCase().includes(query);
        if (!matchTitle && !matchSub && !matchText && !matchFigure) {
          return false;
        }
      }
      return true;
    });
  }, [questions, selectedTopic, selectedDifficulty, statusFilter, searchQuery, answeredRecords]);

  const getDifficultyLabel = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'apprentice':
        return { label: 'Học Đồ', latin: 'Tiro', color: 'text-[#68a063]' };
      case 'scholar':
        return { label: 'Học Giả', latin: 'Scholaris', color: 'text-[#e6b75a]' };
      case 'academician':
        return { label: 'Viện Sĩ', latin: 'Academicus', color: 'text-[#d66f68]' };
    }
  };

  const handleCardClick = (id: string) => {
    audioSystem.playParchmentFlip();
    onOpenQuestion(id);
  };

  return (
    <div className="space-y-6">
      {/* Search & Secondary Filter Toolbar */}
      <div className="p-4 rounded-xl bg-[#1a1410] border border-[#b88e4a]/30 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search input with classical quill styling */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c866d]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bí ẩn, nhà bác học, định lý (Euler, Newton, Hangul...)"
            className="w-full pl-10 pr-4 py-2.5 bg-[#120e0b] border border-[#524030] rounded-lg text-sm text-[#f4ecd8] placeholder-[#7d6c59] focus:outline-none focus:border-[#d4af37] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9c866d] hover:text-[#f4ecd8] cursor-pointer"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty filter */}
          <div className="flex items-center gap-1 bg-[#120e0b] p-1 rounded-lg border border-[#524030]">
            <span className="text-xs text-[#8e7b68] px-2 hidden sm:inline">Bậc:</span>
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedDifficulty === 'all'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedDifficulty('apprentice')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedDifficulty === 'apprentice'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Học đồ
            </button>
            <button
              onClick={() => setSelectedDifficulty('scholar')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedDifficulty === 'scholar'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Học giả
            </button>
            <button
              onClick={() => setSelectedDifficulty('academician')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedDifficulty === 'academician'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Viện sĩ
            </button>
          </div>

          {/* Solved Status filter */}
          <div className="flex items-center gap-1 bg-[#120e0b] p-1 rounded-lg border border-[#524030]">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('unsolved')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                statusFilter === 'unsolved'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Chưa giải
            </button>
            <button
              onClick={() => setStatusFilter('solved')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                statusFilter === 'solved'
                  ? 'bg-[#3d2e20] text-[#ffd700] font-semibold'
                  : 'text-[#9c866d] hover:text-[#f4ecd8]'
              }`}
            >
              Đã thông tuệ
            </button>
          </div>
        </div>
      </div>

      {/* Count & Metadata strip (Clean unboxed metadata) */}
      <div className="flex items-center justify-between text-xs text-[#a99479] px-2 font-cinzel">
        <div className="flex items-center gap-2">
          <span>Tìm thấy {filteredQuestions.length} câu hỏi khảo cứu</span>
          <span aria-hidden="true">·</span>
          <span>
            Chủ đề:{' '}
            {selectedTopic === 'all'
              ? 'Tất cả khoa mục'
              : TOPICS[selectedTopic]?.name}
          </span>
        </div>
        <div className="italic text-[#8b7660]">
          Academia Curiosa · Thế kỷ XVIII
        </div>
      </div>

      {/* Questions Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#1b1510] border border-[#524030]">
          <BookOpen className="w-12 h-12 text-[#8b7660] mx-auto mb-3 opacity-60" />
          <h3 className="font-cinzel text-lg text-[#f4ecd8] font-bold mb-1">
            Không tìm thấy bản thảo phù hợp
          </h3>
          <p className="text-sm text-[#a89882] max-w-md mx-auto">
            Không có câu đố nào khớp với bộ lọc hiện tại. Thử chọn chủ đề khác hoặc thay đổi từ khóa tìm kiếm.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
              setStatusFilter('all');
              onSelectTopic('all');
            }}
            className="mt-4 px-4 py-2 bg-[#2d2117] hover:bg-[#3d2e20] text-[#ffd700] border border-[#b88e4a]/50 rounded text-xs font-cinzel tracking-wider cursor-pointer"
          >
            Khôi phục bộ lọc toàn viện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuestions.map((q) => {
            const record = answeredRecords[q.id];
            const isSolved = record && record.isCorrect;
            const isBookmarked = bookmarkedIds.includes(q.id);
            const topicInfo = TOPICS[q.topic];
            const diffInfo = getDifficultyLabel(q.difficulty);

            return (
              <div
                key={q.id}
                onClick={() => handleCardClick(q.id)}
                className="group relative flex flex-col justify-between p-5 rounded-xl bg-[#1a1410] hover:bg-[#221b15] border border-[#b88e4a]/30 hover:border-[#ffd700]/60 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer"
              >
                {/* Antique corner filigree accents */}
                <div className="absolute top-2 left-2 text-[10px] text-[#b88e4a]/40 group-hover:text-[#ffd700]/70 pointer-events-none transition-colors">
                  ⚜
                </div>
                <div className="absolute top-2 right-2 text-[10px] text-[#b88e4a]/40 group-hover:text-[#ffd700]/70 pointer-events-none transition-colors">
                  ⚜
                </div>

                <div>
                  {/* Clean unboxed metadata strip */}
                  <div className="flex items-center justify-between text-xs text-[#9c866d] mb-3">
                    <div className="flex items-center gap-1.5 font-cinzel tracking-wider">
                      <span>{topicInfo.symbol}</span>
                      <span className="font-semibold text-[#c4b195]">{topicInfo.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className={diffInfo.color}>{diffInfo.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(q.id);
                        }}
                        title={isBookmarked ? 'Bỏ lưu' : 'Lưu vào sổ tay'}
                        className="text-[#9c866d] hover:text-[#ffd700] transition-colors p-1"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#ffd700] text-[#ffd700]' : ''}`}
                        />
                      </button>

                      {isSolved ? (
                        <div
                          title="Đã giải mã thành công"
                          className="flex items-center gap-1 text-[11px] text-[#55b352] font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#55b352]" />
                          <span className="hidden sm:inline">Thông suốt</span>
                        </div>
                      ) : (
                        <div
                          title="Chưa giải mã"
                          className="flex items-center gap-1 text-[11px] text-[#8e7a64]"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Chưa giải</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Title */}
                  <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fbf5e8] group-hover:text-[#ffd700] transition-colors leading-snug mb-1.5">
                    {q.title}
                  </h3>

                  {/* Subtitle / Theorem context */}
                  <p className="text-xs text-[#c4b195] font-garamond italic mb-3">
                    {q.subTitle}
                  </p>

                  {/* Snippet of the story / premise */}
                  <p className="text-xs text-[#a99781] leading-relaxed line-clamp-3 mb-4">
                    {q.storyContext}
                  </p>
                </div>

                {/* Card Footer: Points & Call to action */}
                <div className="pt-3 border-t border-[#b88e4a]/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#e6b75a] font-cinzel">
                    <span className="text-[10px]">⚖️</span>
                    <span className="font-semibold tabular-nums">+{q.points} Điểm</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#d8c7ad] group-hover:text-[#ffd700] font-cinzel text-xs font-semibold transition-colors">
                    <span>{isSolved ? 'Khảo Lại' : 'Phá Giải'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
