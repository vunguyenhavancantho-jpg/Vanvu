import React, { useState, useEffect } from 'react';
import { PuzzleQuestion, UserAnswerRecord } from '../types/puzzle';
import { TOPICS } from '../data/puzzles';
import { PuzzleDiagram } from './PuzzleDiagram';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  XCircle,
  HelpCircle,
  KeyRound,
  PenTool,
  RefreshCw,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { audioSystem } from '../utils/audio';
import confetti from 'canvas-confetti';

interface QuestionSolverProps {
  question: PuzzleQuestion;
  allQuestions: PuzzleQuestion[];
  onBackToCatalog: () => void;
  onSelectQuestion: (questionId: string) => void;
  onRecordAnswer: (record: UserAnswerRecord, earnedPoints: number) => void;
  existingRecord?: UserAnswerRecord;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenScratchpad: () => void;
}

export const QuestionSolver: React.FC<QuestionSolverProps> = ({
  question,
  allQuestions,
  onBackToCatalog,
  onSelectQuestion,
  onRecordAnswer,
  existingRecord,
  isBookmarked,
  onToggleBookmark,
  onOpenScratchpad,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [hasRevealedHint, setHasRevealedHint] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Sync state whenever question changes
  useEffect(() => {
    if (existingRecord) {
      setIsSubmitted(true);
      setIsCorrect(existingRecord.isCorrect);
      setHasRevealedHint(existingRecord.usedHint);
      if (question.type === 'input_deduction') {
        setInputAnswer(existingRecord.selectedAnswer);
      } else {
        setSelectedOption(existingRecord.selectedAnswer);
      }
    } else {
      setSelectedOption('');
      setInputAnswer('');
      setHasRevealedHint(false);
      setIsSubmitted(false);
      setIsCorrect(false);
    }
  }, [question.id, existingRecord]);

  const topicInfo = TOPICS[question.topic];

  // Find adjacent questions in same topic or across list
  const currentIndex = allQuestions.findIndex((q) => q.id === question.id);
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;

  const handleRevealHint = () => {
    if (hasRevealedHint) return;
    audioSystem.playWaxCrack();
    setHasRevealedHint(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted && isCorrect) return;

    let correct = false;
    let chosenAnswer = '';

    if (question.type === 'input_deduction') {
      chosenAnswer = inputAnswer.trim().toLowerCase();
      if (!chosenAnswer) return;

      const acceptable = question.acceptableAnswers
        ? question.acceptableAnswers.map((a) => a.trim().toLowerCase())
        : [question.correctAnswer.trim().toLowerCase()];

      correct = acceptable.includes(chosenAnswer);
    } else {
      if (!selectedOption) return;
      chosenAnswer = selectedOption;
      correct = selectedOption === question.correctAnswer;
    }

    setIsSubmitted(true);
    setIsCorrect(correct);

    const pointsMultiplier = hasRevealedHint ? 0.75 : 1.0;
    const earnedPoints = correct ? Math.round(question.points * pointsMultiplier) : 0;

    if (correct) {
      audioSystem.playSuccessChime();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ffd700', '#c99a4e', '#8b6938', '#ffffff', '#e6b75a'],
        });
      } catch (err) {
        // gracefully ignore if canvas-confetti fails
      }
    } else {
      audioSystem.playErrorDull();
    }

    onRecordAnswer(
      {
        questionId: question.id,
        selectedAnswer: chosenAnswer,
        isCorrect: correct,
        usedHint: hasRevealedHint,
        solvedAt: Date.now(),
      },
      earnedPoints
    );
  };

  const handleRetry = () => {
    audioSystem.playParchmentFlip();
    setIsSubmitted(false);
    setSelectedOption('');
    setInputAnswer('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        <button
          onClick={onBackToCatalog}
          className="flex items-center gap-1.5 text-xs font-cinzel text-[#c4b195] hover:text-[#ffd700] transition-colors cursor-pointer py-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về Tàng Thư Các</span>
        </button>

        {/* Quick Prev / Next Jump */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenScratchpad}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#241a12] hover:bg-[#312318] border border-[#b88e4a]/40 text-xs font-cinzel text-[#e6b75a] hover:text-[#ffd700] transition-colors cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Giấy Nháp Học Giả</span>
          </button>

          <button
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu bí ẩn'}
            className="p-1.5 rounded bg-[#241a12] hover:bg-[#312318] border border-[#b88e4a]/40 text-[#c4b195] hover:text-[#ffd700] transition-colors cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#ffd700] text-[#ffd700]' : ''}`} />
          </button>

          <div className="flex items-center gap-1">
            <button
              disabled={!prevQuestion}
              onClick={() => {
                if (prevQuestion) {
                  audioSystem.playParchmentFlip();
                  onSelectQuestion(prevQuestion.id);
                }
              }}
              title="Câu trước"
              className={`p-1.5 rounded border border-[#b88e4a]/30 transition-colors ${
                prevQuestion
                  ? 'bg-[#241a12] text-[#c4b195] hover:text-[#ffd700] hover:bg-[#312318] cursor-pointer'
                  : 'bg-[#18120d] text-[#554536] cursor-not-allowed border-[#382b1f]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!nextQuestion}
              onClick={() => {
                if (nextQuestion) {
                  audioSystem.playParchmentFlip();
                  onSelectQuestion(nextQuestion.id);
                }
              }}
              title="Câu tiếp theo"
              className={`p-1.5 rounded border border-[#b88e4a]/30 transition-colors ${
                nextQuestion
                  ? 'bg-[#241a12] text-[#c4b195] hover:text-[#ffd700] hover:bg-[#312318] cursor-pointer'
                  : 'bg-[#18120d] text-[#554536] cursor-not-allowed border-[#382b1f]'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Classical Parchment Manuscript Card */}
      <div className="relative rounded-2xl bg-[#f5edd6] text-[#2c2016] border-2 border-[#b88e4a] shadow-2xl p-6 sm:p-10 overflow-hidden font-garamond">
        {/* Subtle vintage parchment texture and paper burn border */}
        <div className="absolute inset-0 pointer-events-none border-4 border-[#8e6e39]/20 rounded-2xl" />
        <div className="absolute top-3 left-4 text-[#8e6e39]/40 text-lg pointer-events-none font-serif">
          ⚜
        </div>
        <div className="absolute top-3 right-4 text-[#8e6e39]/40 text-lg pointer-events-none font-serif">
          ⚜
        </div>

        {/* Header Ribbon / Ornate Stamp */}
        <div className="text-center pb-4 border-b border-[#c4a97c] mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-cinzel tracking-widest text-[#7a5829] uppercase mb-1">
            <span>{topicInfo.symbol} Khoa Mục {topicInfo.name}</span>
            <span aria-hidden="true">·</span>
            <span>Bản Thảo Số {currentIndex + 1} / {allQuestions.length}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1a120b] tracking-wide mt-1">
            {question.title}
          </h2>

          <p className="text-sm italic text-[#6e512c] font-garamond mt-1">
            {question.subTitle}
          </p>

          {question.historicalFigure && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#e8dac0] border border-[#b88e4a]/40 text-xs font-cinzel text-[#593f1d]">
              <span>Khảo cứu: {question.historicalFigure}</span>
            </div>
          )}
        </div>

        {/* Historical Context / Premise (Bối cảnh học thuật) */}
        <div className="mb-6 p-4 rounded-lg bg-[#ede1c7]/80 border-l-4 border-[#8c6b39] text-[#3d2c1c] text-sm sm:text-base leading-relaxed italic">
          <div className="font-cinzel font-semibold text-xs tracking-wider uppercase text-[#735323] mb-1 not-italic">
            Bối Cảnh Lịch Sử & Luận Đề Cổ Điển:
          </div>
          {question.storyContext}
        </div>

        {/* Embedded Schematic / Diagram if present */}
        {question.diagramType && <PuzzleDiagram type={question.diagramType} />}

        {/* Main Question Statement */}
        <div className="mb-6">
          <h3 className="font-cinzel font-bold text-base sm:text-lg text-[#1a120b] leading-relaxed">
            {question.questionText}
          </h3>
        </div>

        {/* Interactive Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {question.type === 'multiple_choice' && question.options && (
            <div className="space-y-2.5">
              {question.options.map((opt, idx) => {
                const isSelected = selectedOption === opt.id;
                let optionStyle = 'bg-[#fcf7ec] border-[#bda072] text-[#2c2016] hover:bg-[#ede1c7]';

                if (isSubmitted) {
                  if (opt.id === question.correctAnswer) {
                    optionStyle = 'bg-[#d8eed0] border-[#4e9644] text-[#1c4e16] font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-[#f8d7d4] border-[#c04d46] text-[#781f1b] line-through';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-[#3b2b1d] border-[#3b2b1d] text-[#fff7e6] font-semibold shadow-md';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isSubmitted && isCorrect}
                    onClick={() => {
                      if (!isSubmitted || !isCorrect) {
                        audioSystem.playParchmentFlip();
                        setSelectedOption(opt.id);
                      }
                    }}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className="font-cinzel text-xs font-bold px-2 py-0.5 rounded border border-current opacity-80 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm sm:text-base leading-snug flex-1">
                      {opt.label}
                    </span>
                    {isSubmitted && opt.id === question.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-[#3b7c32] shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-[#b33a34] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {question.type === 'input_deduction' && (
            <div className="space-y-2">
              <label className="block text-xs font-cinzel text-[#6d512a] uppercase tracking-wider">
                Nhập đáp số hoặc luận giải (viết bằng bút mực học giả):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  disabled={isSubmitted && isCorrect}
                  placeholder="Điền kết quả tính toán hoặc phiên âm..."
                  className="flex-1 p-3 bg-[#fdfaf3] border-2 border-[#bda072] rounded-xl text-base text-[#1f170f] font-garamond font-semibold placeholder-[#9e8b74] focus:outline-none focus:border-[#735323]"
                />
              </div>
            </div>
          )}

          {/* Action Row: Submit / Retry Button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {!isSubmitted ? (
                <button
                  type="submit"
                  disabled={question.type === 'multiple_choice' ? !selectedOption : !inputAnswer.trim()}
                  className={`px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-md ${
                    (question.type === 'multiple_choice' ? selectedOption : inputAnswer.trim())
                      ? 'bg-[#7a5829] hover:bg-[#61451f] text-[#fbf5e8] ring-2 ring-[#523916]'
                      : 'bg-[#cfbe9e] text-[#7d6c57] cursor-not-allowed'
                  }`}
                >
                  Xác Nhận Luận Điểm
                </button>
              ) : !isCorrect ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8c4238] hover:bg-[#73352c] text-[#ffffff] font-cinzel text-xs font-bold tracking-wider cursor-pointer shadow"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Thử Luận Lại</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-sm font-cinzel font-bold text-[#2d6e24]">
                  <CheckCircle2 className="w-5 h-5 text-[#2d6e24]" />
                  <span>Đã Khảo Chứng Thành Công! (+{question.points} Điểm)</span>
                </div>
              )}
            </div>

            {/* Hint Seal Mechanism (Niêm phong sáp đỏ) */}
            <div>
              {!hasRevealedHint ? (
                <button
                  type="button"
                  onClick={handleRevealHint}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#8a221a] hover:bg-[#731a13] text-[#fcf4e8] font-cinzel text-xs font-semibold tracking-wider transition-all duration-300 shadow cursor-pointer"
                  title="Phá vỡ dấu sáp để xem gợi ý cổ thư (giảm 25% điểm thưởng)"
                >
                  <span className="w-3 h-3 rounded-full bg-[#ff7368] group-hover:scale-125 transition-transform" />
                  <span>Phá Niêm Phong Sáp Gợi Ý (-25% điểm)</span>
                </button>
              ) : (
                <div className="text-xs font-cinzel text-[#8a221a] italic flex items-center gap-1">
                  <span>Dấu sáp mật thư đã mở</span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Revealed Hint Parchment Box */}
        {hasRevealedHint && (
          <div className="mt-4 p-4 rounded-xl bg-[#faecd6] border-2 border-dashed border-[#b87053] text-[#5e2b1d] text-sm leading-relaxed animate-fade-in">
            <div className="flex items-center gap-1.5 font-cinzel font-bold text-xs uppercase tracking-wider text-[#9c2f21] mb-1">
              <KeyRound className="w-4 h-4" />
              <span>Gợi Ý Mật Thư Viện Hàn Lâm:</span>
            </div>
            <p className="italic">{question.hint}</p>
          </div>
        )}

        {/* In-depth Solution & Classical Scholarly Commentary */}
        {isSubmitted && (
          <div className="mt-8 pt-6 border-t-2 border-[#bda072]/80 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#7a5829]" />
              <h4 className="font-cinzel text-lg font-bold text-[#1f170f]">
                Bản Thảo Lời Bình Giải Viện Hàn Lâm
              </h4>
            </div>

            <div className="p-5 rounded-xl bg-[#f0e4cc] border border-[#a88a56]/60 text-sm leading-relaxed text-[#2d2217] space-y-2 whitespace-pre-line">
              {question.detailedExplanation}
            </div>

            {/* Next Question Shortcut */}
            {nextQuestion && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    audioSystem.playParchmentFlip();
                    onSelectQuestion(nextQuestion.id);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b2b1d] hover:bg-[#281c12] text-[#ffd700] font-cinzel text-xs font-bold tracking-wider transition-colors cursor-pointer shadow-lg"
                >
                  <span>Khảo Thí Bản Thảo Kế Tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
