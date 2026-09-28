/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopicId, PuzzleQuestion, ScholarStats, UserAnswerRecord } from './types/puzzle';
import { PUZZLES, TOPICS } from './data/puzzles';
import { Header } from './components/Header';
import { TopicBanner } from './components/TopicBanner';
import { QuestionListView } from './components/QuestionListView';
import { QuestionSolver } from './components/QuestionSolver';
import { ScholarProfile } from './components/ScholarProfile';
import { ScratchpadModal } from './components/ScratchpadModal';
import { ZombieDefenseGame } from './components/ZombieDefenseGame';
import { audioSystem } from './utils/audio';
import { Compass, Sparkles, BookOpen, Skull, Shield, Flame } from 'lucide-react';

const STATS_STORAGE_KEY = 'academia_enigma_scholar_stats_v2';

const defaultStats: ScholarStats = {
  score: 0,
  solvedCount: 0,
  totalAttempts: 0,
  streak: 0,
  bestStreak: 0,
  zombiesKilled: 0,
  nightsSurvived: 0,
  silverCoins: 120,
  barricadeLevel: 1,
  unlockedMedals: [],
  answeredRecords: {},
  bookmarkedIds: [],
};

export default function App() {
  const [currentView, setCurrentView] = useState<'zombie' | 'catalog' | 'solve' | 'profile'>('zombie');
  const [selectedTopic, setSelectedTopic] = useState<TopicId | 'all'>('all');
  const [activeQuestionId, setActiveQuestionId] = useState<string>(PUZZLES[0].id);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isClockTicking, setIsClockTicking] = useState<boolean>(false);

  // Load persistent scholar stats
  const [stats, setStats] = useState<ScholarStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) {
        return { ...defaultStats, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading scholar stats:', e);
    }
    return defaultStats;
  });

  // Save persistent stats
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving scholar stats:', e);
    }
  }, [stats]);

  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audioSystem.isMuted = nextMuted;
  };

  const handleToggleClock = () => {
    const nextTicking = !isClockTicking;
    setIsClockTicking(nextTicking);
    audioSystem.setClockTicking(nextTicking);
  };

  const handleSelectTopic = (topic: TopicId | 'all') => {
    audioSystem.playParchmentFlip();
    setSelectedTopic(topic);
    setCurrentView('catalog');
  };

  const handleOpenQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    setCurrentView('solve');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (questionId: string) => {
    setStats((prev) => {
      const exists = prev.bookmarkedIds.includes(questionId);
      const nextBookmarks = exists
        ? prev.bookmarkedIds.filter((id) => id !== questionId)
        : [...prev.bookmarkedIds, questionId];
      return {
        ...prev,
        bookmarkedIds: nextBookmarks,
      };
    });
  };

  const handleRecordAnswer = (record: UserAnswerRecord, earnedPoints: number) => {
    setStats((prev) => {
      const alreadyCorrect = prev.answeredRecords[record.questionId]?.isCorrect;
      const wasCorrect = record.isCorrect;

      // Update streaks
      const nextStreak = wasCorrect ? prev.streak + 1 : 0;
      const nextBestStreak = Math.max(prev.bestStreak, nextStreak);

      // Only add score if not previously solved
      const addedScore = !alreadyCorrect && wasCorrect ? earnedPoints : 0;
      const addedSolvedCount = !alreadyCorrect && wasCorrect ? 1 : 0;
      const addedCoins = wasCorrect ? 15 : 0;

      return {
        ...prev,
        score: prev.score + addedScore,
        solvedCount: prev.solvedCount + addedSolvedCount,
        totalAttempts: prev.totalAttempts + 1,
        streak: nextStreak,
        bestStreak: nextBestStreak,
        silverCoins: prev.silverCoins + addedCoins,
        answeredRecords: {
          ...prev.answeredRecords,
          [record.questionId]: record,
        },
      };
    });
  };

  // Zombie game events
  const handleZombieDefeated = (rewardPoints: number, rewardCoins: number) => {
    setStats((prev) => ({
      ...prev,
      zombiesKilled: (prev.zombiesKilled || 0) + 1,
      score: prev.score + rewardPoints,
      silverCoins: (prev.silverCoins || 0) + rewardCoins,
    }));
  };

  const handleNightComplete = (nightNum: number) => {
    setStats((prev) => ({
      ...prev,
      nightsSurvived: Math.max(prev.nightsSurvived || 0, nightNum),
      score: prev.score + nightNum * 200,
      silverCoins: (prev.silverCoins || 0) + nightNum * 50,
    }));
  };

  const activeQuestion = PUZZLES.find((q) => q.id === activeQuestionId) || PUZZLES[0];

  return (
    <div className="min-h-screen bg-[#120e0b] text-[#f2e8d5] flex flex-col font-garamond selection:bg-[#c99a4e]/30 selection:text-[#fbf5e8]">
      {/* Top Bar Navigation */}
      <Header
        currentView={currentView}
        selectedTopic={selectedTopic}
        onSelectTopic={handleSelectTopic}
        onNavigate={(view) => {
          audioSystem.playParchmentFlip();
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        isClockTicking={isClockTicking}
        onToggleClock={handleToggleClock}
        totalScore={stats.score}
        zombiesKilled={stats.zombiesKilled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Zombie Survival Defense Arena (Hero Mode) */}
        {currentView === 'zombie' && (
          <div className="space-y-6 animate-fade-in">
            <ZombieDefenseGame
              questions={PUZZLES}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
              onZombieDefeated={handleZombieDefeated}
              onNightComplete={handleNightComplete}
              onOpenCatalog={() => {
                audioSystem.playParchmentFlip();
                setCurrentView('catalog');
              }}
            />
          </div>
        )}

        {/* Catalog View by Topics: Toán Học, Tiếng Hàn, Vật Lý */}
        {currentView === 'catalog' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick banner linking to Zombie Mode */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#2c1410] to-[#1a120c] border border-[#ff4d4f]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-bounce">🧟</span>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#ff7875]">
                    Chiến Trường Huyết Nguyệt Đang Mở Cửa!
                  </h4>
                  <p className="text-xs text-[#c9b79c] font-garamond italic">
                    Ứng dụng các định lý Toán học, Tiếng Hàn và Vật lý để xả súng kíp bạc và thần pháo đẩy lui bầy xác sống.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  audioSystem.playParchmentFlip();
                  setCurrentView('zombie');
                }}
                className="px-4 py-1.5 rounded-lg bg-[#8a221a] hover:bg-[#a62b22] text-[#fff] font-cinzel text-xs font-bold tracking-wider cursor-pointer whitespace-nowrap shadow"
              >
                Vào Thủ Thành Ngay
              </button>
            </div>

            {/* Topic Showcase Banner */}
            <TopicBanner
              selectedTopic={selectedTopic}
              onSelectTopic={handleSelectTopic}
              totalPuzzles={PUZZLES.length}
              solvedCount={stats.solvedCount}
            />

            {/* Questions Catalog with Filters & Search */}
            <QuestionListView
              questions={PUZZLES}
              selectedTopic={selectedTopic}
              onSelectTopic={handleSelectTopic}
              onOpenQuestion={handleOpenQuestion}
              answeredRecords={stats.answeredRecords}
              bookmarkedIds={stats.bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {/* In-depth Question Solver Manuscript */}
        {currentView === 'solve' && (
          <div className="animate-fade-in">
            <QuestionSolver
              question={activeQuestion}
              allQuestions={
                selectedTopic === 'all'
                  ? PUZZLES
                  : PUZZLES.filter((q) => q.topic === selectedTopic)
              }
              onBackToCatalog={() => {
                audioSystem.playParchmentFlip();
                setCurrentView('catalog');
              }}
              onSelectQuestion={handleOpenQuestion}
              onRecordAnswer={handleRecordAnswer}
              existingRecord={stats.answeredRecords[activeQuestion.id]}
              isBookmarked={stats.bookmarkedIds.includes(activeQuestion.id)}
              onToggleBookmark={() => handleToggleBookmark(activeQuestion.id)}
              onOpenScratchpad={() => setIsScratchpadOpen(true)}
            />
          </div>
        )}

        {/* Scholar & Slayer Profile */}
        {currentView === 'profile' && (
          <div className="animate-fade-in">
            <ScholarProfile
              stats={stats}
              allQuestions={PUZZLES}
              onOpenQuestion={handleOpenQuestion}
              onSelectTopic={handleSelectTopic}
              onNavigateToCatalog={() => {
                audioSystem.playParchmentFlip();
                setCurrentView('catalog');
              }}
            />
          </div>
        )}
      </main>

      {/* Scholar Scratchpad Modal */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* Classical Academic Zombie Defense Footer */}
      <footer className="mt-16 border-t border-[#b88e4a]/25 bg-[#0f0b09] py-8 px-4 text-center text-xs text-[#8e7b68] font-cinzel tracking-wider">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[#c99a4e]">
            <span>⚜</span>
            <span className="text-sm font-bold tracking-widest text-[#f0e4cc]">
              Zombie Academia: Dạ Khúc Huyết Nguyệt
            </span>
            <span>⚜</span>
          </div>

          <p className="text-xs text-[#a99479] italic font-garamond max-w-lg">
            "Sapere Aude — Dùng ánh sáng khoa học và văn tự cổ để thanh tẩy bóng đêm thây ma dịch hạch."
          </p>

          <div className="flex items-center gap-4 text-[11px] text-[#786653] pt-2">
            <span>Toán Học Khắc Chế</span>
            <span aria-hidden="true">·</span>
            <span>Ngôn Ngữ Huấn Dân Thanh Tẩy</span>
            <span aria-hidden="true">·</span>
            <span>Vật Lý Lôi Điện & Hỏa Cầu</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
