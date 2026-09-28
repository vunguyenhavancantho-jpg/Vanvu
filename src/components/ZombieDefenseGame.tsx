import React, { useState, useEffect, useRef } from 'react';
import { PuzzleQuestion, TopicId, ZombieEnemy, ArsenalWeapon } from '../types/puzzle';
import { TOPICS, DEFAULT_WEAPONS } from '../data/puzzles';
import { audioSystem } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Shield,
  Zap,
  Flame,
  Crosshair,
  Skull,
  Heart,
  Coins,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  AlertTriangle,
  Award,
  ChevronRight,
  Wrench,
  BookOpen
} from 'lucide-react';

interface ZombieDefenseGameProps {
  questions: PuzzleQuestion[];
  selectedTopic: TopicId | 'all';
  onSelectTopic: (topic: TopicId | 'all') => void;
  onZombieDefeated: (rewardPoints: number, rewardCoins: number) => void;
  onNightComplete: (nightNum: number) => void;
  onOpenCatalog: () => void;
}

export const ZombieDefenseGame: React.FC<ZombieDefenseGameProps> = ({
  questions,
  selectedTopic,
  onSelectTopic,
  onZombieDefeated,
  onNightComplete,
  onOpenCatalog,
}) => {
  // Game states
  const [night, setNight] = useState<number>(1);
  const [barricadeHp, setBarricadeHp] = useState<number>(100);
  const [maxBarricadeHp, setMaxBarricadeHp] = useState<number>(100);
  const [silverCoins, setSilverCoins] = useState<number>(150);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'victory' | 'gameover'>('lobby');

  // Weapons
  const [weapons, setWeapons] = useState<ArsenalWeapon[]>(() => {
    const saved = localStorage.getItem('academia_weapons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_WEAPONS;
  });
  const [activeWeaponId, setActiveWeaponId] = useState<string>('silver_flintlock');

  // Active wave enemies
  const [enemies, setEnemies] = useState<ZombieEnemy[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<PuzzleQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [inputAnswer, setInputAnswer] = useState<string>('');
  const [combatLog, setCombatLog] = useState<{ id: string; text: string; type: 'hit' | 'damage' | 'victory' }[]>([]);
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);
  const [muzzleFlash, setMuzzleFlash] = useState<boolean>(false);

  const activeWeapon = weapons.find((w) => w.id === activeWeaponId) || weapons[0];

  // Save weapons
  useEffect(() => {
    localStorage.setItem('academia_weapons', JSON.stringify(weapons));
  }, [weapons]);

  // Pick question based on topic
  const pickNewQuestion = () => {
    const pool = questions.filter((q) => selectedTopic === 'all' || q.topic === selectedTopic);
    if (pool.length === 0) return;
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    setActiveQuestion(randomQ);
    setSelectedOption('');
    setInputAnswer('');
  };

  // Spawn wave for a given night
  const startNight = (nightNum: number) => {
    audioSystem.playParchmentFlip();
    audioSystem.playZombieGrowl();

    const waveCount = 3 + nightNum * 2;
    const generatedEnemies: ZombieEnemy[] = [];

    for (let i = 0; i < waveCount; i++) {
      const isBoss = nightNum % 3 === 0 && i === waveCount - 1;
      const isDoctor = i % 2 === 1;
      const isKnight = i % 3 === 2;

      let type: ZombieEnemy['type'] = 'crawler';
      let name = 'Xác Sống Học Đồ';
      let maxHp = 50 + nightNum * 15;
      let speed = 1.0 + Math.random() * 0.5;
      let damage = 10 + nightNum * 2;
      let avatar = '🧟‍♂️';
      let weakness: TopicId = 'math';

      if (isBoss) {
        type = 'mad_alchemist_boss';
        name = 'Viện Trưởng Biến Dị Dịch Hạch';
        maxHp = 220 + nightNum * 40;
        speed = 0.6;
        damage = 30;
        avatar = '☠️';
        weakness = 'physics';
      } else if (isKnight) {
        type = 'armored_knight';
        name = 'Hiệp Sĩ Hoàng Gia Hóa Quỷ';
        maxHp = 95 + nightNum * 20;
        speed = 0.8;
        damage = 18;
        avatar = '🪖';
        weakness = 'math';
      } else if (isDoctor) {
        type = 'plague_doctor';
        name = 'Bác Sĩ Mỏ Chim Dịch Hạch';
        maxHp = 70 + nightNum * 15;
        speed = 1.4;
        damage = 15;
        avatar = '👺';
        weakness = 'korean';
      }

      generatedEnemies.push({
        id: `zombie-${i}-${Date.now()}`,
        name,
        type,
        maxHp,
        hp: maxHp,
        speed,
        distance: 100 + i * 28, // staggered distances
        damage,
        avatar,
        rewardPoints: Math.round(maxHp * 1.5),
        weaknessTopic: weakness,
      });
    }

    setEnemies(generatedEnemies);
    setGameState('playing');
    setCombatLog([
      {
        id: `${Date.now()}`,
        text: `Đêm ${nightNum}: Bầy xác sống dịch hạch đang tràn tới cổng Viện Hàn Lâm!`,
        type: 'damage',
      },
    ]);
    pickNewQuestion();
  };

  // Zombie advance game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = window.setInterval(() => {
      setEnemies((prevEnemies) => {
        let barrierDamage = 0;
        const updated = prevEnemies.map((zombie) => {
          let newDist = zombie.distance - zombie.speed * 1.8;
          if (newDist <= 0) {
            newDist = 0;
            barrierDamage += zombie.damage;
          }
          return {
            ...zombie,
            distance: newDist,
          };
        });

        if (barrierDamage > 0) {
          audioSystem.playBarricadeHit();
          setIsScreenShaking(true);
          setTimeout(() => setIsScreenShaking(false), 300);

          setBarricadeHp((prev) => {
            const nextHp = Math.max(0, prev - barrierDamage);
            if (nextHp <= 0) {
              setGameState('gameover');
              audioSystem.playErrorDull();
            }
            return nextHp;
          });

          setCombatLog((logs) => [
            {
              id: `${Date.now()}`,
              text: `Cổng thành bị thây ma tấn công mất ${barrierDamage} độ bền!`,
              type: 'damage',
            },
            ...logs.slice(0, 4),
          ]);
        }

        return updated;
      });
    }, 1200);

    return () => window.clearInterval(interval);
  }, [gameState]);

  // Execute an attack on the closest zombie
  const handleAttack = (isAnswerCorrect: boolean) => {
    if (!isAnswerCorrect) {
      audioSystem.playErrorDull();
      setCombo(0);
      setCombatLog((logs) => [
        {
          id: `${Date.now()}`,
          text: `Luận điểm sai lầm! Vũ khí bị kẹt đạn, thây ma gầm thét xông lên!`,
          type: 'damage',
        },
        ...logs.slice(0, 4),
      ]);
      pickNewQuestion();
      return;
    }

    // Success Attack
    const targetZombie = enemies.find((z) => z.hp > 0);
    if (!targetZombie) return;

    // Calculate damage: weapon damage + topic bonus + combo bonus
    let finalDamage = activeWeapon.damage;
    let isCrit = false;

    // Check topic affinity
    if (activeQuestion && targetZombie.weaknessTopic === activeQuestion.topic) {
      finalDamage = Math.round(finalDamage * 1.5);
      isCrit = true;
    }

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    finalDamage = Math.round(finalDamage * (1 + nextCombo * 0.15));

    // Flash & sound effects
    setMuzzleFlash(true);
    setTimeout(() => setMuzzleFlash(false), 200);

    if (activeWeapon.topicAffinity === 'physics') {
      audioSystem.playTeslaZap();
    } else {
      audioSystem.playGunshot();
    }

    setEnemies((prev) => {
      const nextList = prev.map((z) => {
        if (z.id === targetZombie.id) {
          const newHp = Math.max(0, z.hp - finalDamage);
          return { ...z, hp: newHp };
        }
        return z;
      });

      // Filter dead zombies
      const killed = nextList.filter((z) => z.id === targetZombie.id && z.hp <= 0)[0];
      if (killed) {
        audioSystem.playZombieGrowl();
        const earnedCoins = Math.round(killed.rewardPoints / 10);
        setSilverCoins((c) => c + earnedCoins);
        setScore((s) => s + killed.rewardPoints);
        onZombieDefeated(killed.rewardPoints, earnedCoins);

        setCombatLog((logs) => [
          {
            id: `${Date.now()}`,
            text: `HẠ GỤC ${killed.name}! Nhận +${killed.rewardPoints} Điểm, +${earnedCoins} Bạc Hoàng Gia!`,
            type: 'victory',
          },
          ...logs.slice(0, 4),
        ]);
      } else {
        setCombatLog((logs) => [
          {
            id: `${Date.now()}`,
            text: `Bắn trúng ${targetZombie.name} gây ${finalDamage} sát thương${isCrit ? ' [CHÍ MẠNG]!' : '!'}`,
            type: 'hit',
          },
          ...logs.slice(0, 4),
        ]);
      }

      // Check if all zombies defeated
      const remaining = nextList.filter((z) => z.hp > 0);
      if (remaining.length === 0) {
        setTimeout(() => {
          setGameState('victory');
          audioSystem.playSuccessChime();
          onNightComplete(night);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ffd700', '#c99a4e', '#ffffff', '#e6b75a'],
            });
          } catch (e) {}
        }, 500);
      }

      return nextList;
    });

    pickNewQuestion();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion) return;

    if (activeQuestion.type === 'multiple_choice') {
      if (!selectedOption) return;
      handleAttack(selectedOption === activeQuestion.correctAnswer);
    } else {
      if (!inputAnswer.trim()) return;
      const clean = inputAnswer.trim().toLowerCase();
      const acceptable = activeQuestion.acceptableAnswers
        ? activeQuestion.acceptableAnswers.map((a) => a.trim().toLowerCase())
        : [activeQuestion.correctAnswer.trim().toLowerCase()];
      handleAttack(acceptable.includes(clean));
    }
  };

  const handleRepairBarricade = () => {
    const cost = 50;
    if (silverCoins < cost || barricadeHp >= maxBarricadeHp) return;
    setSilverCoins((c) => c - cost);
    setBarricadeHp((hp) => Math.min(maxBarricadeHp, hp + 40));
    audioSystem.playParchmentFlip();
  };

  const handleUnlockWeapon = (wId: string) => {
    const w = weapons.find((item) => item.id === wId);
    if (!w || silverCoins < w.cost || w.unlocked) return;
    setSilverCoins((c) => c - w.cost);
    setWeapons((prev) =>
      prev.map((item) => (item.id === wId ? { ...item, unlocked: true } : item))
    );
    setActiveWeaponId(wId);
    audioSystem.playSuccessChime();
  };

  const aliveEnemies = enemies.filter((z) => z.hp > 0);
  const nearestZombie = aliveEnemies.reduce(
    (min, z) => (z.distance < min.distance ? z : min),
    aliveEnemies[0] || null
  );

  return (
    <div
      className={`relative max-w-5xl mx-auto space-y-6 font-garamond ${
        isScreenShaking ? 'translate-x-1 translate-y-1' : ''
      } transition-transform`}
    >
      {/* HUD Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#1a130e] border border-[#b88e4a]/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#381614] border border-[#963730] flex items-center justify-center text-xl shadow-md">
            🩸
          </div>
          <div>
            <div className="text-xs font-cinzel text-[#ffd700] tracking-widest uppercase">
              Chế Độ Phòng Thủ Huyết Nguyệt
            </div>
            <h2 className="font-cinzel text-lg md:text-xl font-bold text-[#fcf4e8] leading-tight">
              Đêm {night}: Cuộc Vây Hãm Viện Hàn Lâm
            </h2>
          </div>
        </div>

        {/* Dynamic Metric Gauges */}
        <div className="flex items-center gap-4 text-xs font-cinzel">
          {/* Barricade HP */}
          <div className="flex flex-col gap-1 w-32 sm:w-40">
            <div className="flex justify-between text-[#d6b794]">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#34c759]" /> Cổng Viện:
              </span>
              <span className="font-bold tabular-nums text-[#34c759]">
                {barricadeHp}/{maxBarricadeHp}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#120e0b] border border-[#4d3a2a] overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  barricadeHp > 50
                    ? 'bg-[#34c759]'
                    : barricadeHp > 20
                    ? 'bg-[#ff9500]'
                    : 'bg-[#ff3b30] animate-pulse'
                }`}
                style={{ width: `${(barricadeHp / maxBarricadeHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Silver Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#281e16] border border-[#d4af37]/40 text-[#ffd700]">
            <Coins className="w-4 h-4 text-[#ffd700]" />
            <span className="font-bold tabular-nums text-sm">{silverCoins}</span>
            <span className="text-[10px] text-[#c4b195]">Bạc</span>
          </div>

          {/* Combo Multiplier */}
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#8a221a] text-[#fff] font-bold text-xs animate-bounce shadow">
              <span>🔥 COMBO x{combo}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Zombie Battlefield Canvas Arena */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#8e6e39] bg-[#0c0806] shadow-2xl min-h-[360px] md:min-h-[420px] flex flex-col justify-between">
        {/* Cinematic Backdrop Image with Muzzle Flash Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/gothic_zombie_academy_1790563492796.jpg"
            alt="Zombie Academy Battlefield"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-65 filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0906] via-[#0e0906]/60 to-transparent" />
          {muzzleFlash && (
            <div className="absolute inset-0 bg-[#ffd700]/30 mix-blend-screen transition-opacity duration-150 pointer-events-none" />
          )}
        </div>

        {/* Top Atmosphere Bar: Blood Moon & Topic Selector */}
        <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#120a06]/90 to-transparent">
          <div className="flex items-center gap-2 text-xs font-cinzel text-[#ff7b72] tracking-wider uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3b30] animate-ping" />
            <span>Huyết Nguyệt Chiếu Soi · Thây Ma Trỗi Dậy</span>
          </div>

          {/* Topic Focus Filter */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#221711]/90 border border-[#b88e4a]/40 text-xs font-cinzel">
            <span className="text-[#a99781] px-1 hidden sm:inline">Khắc chế:</span>
            <button
              onClick={() => onSelectTopic('all')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                selectedTopic === 'all'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold'
                  : 'text-[#c4b195] hover:text-[#f4ecd8]'
              }`}
            >
              Hỗn Hợp
            </button>
            <button
              onClick={() => onSelectTopic('math')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                selectedTopic === 'math'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold'
                  : 'text-[#c4b195] hover:text-[#f4ecd8]'
              }`}
            >
              📐 Toán Học
            </button>
            <button
              onClick={() => onSelectTopic('korean')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                selectedTopic === 'korean'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold'
                  : 'text-[#c4b195] hover:text-[#f4ecd8]'
              }`}
            >
              📜 Tiếng Hàn
            </button>
            <button
              onClick={() => onSelectTopic('physics')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                selectedTopic === 'physics'
                  ? 'bg-[#c99a4e] text-[#120e0b] font-bold'
                  : 'text-[#c4b195] hover:text-[#f4ecd8]'
              }`}
            >
              ⚖️ Vật Lý
            </button>
          </div>
        </div>

        {/* Dynamic Zombie Approach Lane (Visual Animation) */}
        <div className="relative z-10 flex-1 px-6 py-6 flex flex-col justify-end">
          {gameState === 'playing' ? (
            <div className="relative w-full h-44 border-b-2 border-dashed border-[#8c6b39]/50 flex items-end">
              {/* Defense Barricade at 0% (Left) */}
              <div className="absolute left-0 bottom-0 z-20 flex flex-col items-center">
                <div className="p-2 rounded-lg bg-[#3b2719] border-2 border-[#b88e4a] shadow-xl text-center">
                  <div className="text-2xl">🏰</div>
                  <div className="text-[10px] font-cinzel text-[#ffd700] font-bold">
                    CỔNG THÀNH
                  </div>
                </div>
                {/* Lantern */}
                <div className="text-base animate-pulse">🏮</div>
              </div>

              {/* Advancing Zombies */}
              {aliveEnemies.map((zombie) => {
                // Calculate position from distance (0% at left barricade, 100% at right edge)
                const leftPercent = Math.max(10, Math.min(90, (zombie.distance / 120) * 80 + 10));
                const isTarget = nearestZombie?.id === zombie.id;

                return (
                  <div
                    key={zombie.id}
                    className="absolute bottom-2 flex flex-col items-center transition-all duration-700"
                    style={{ left: `${leftPercent}%` }}
                  >
                    {/* HP Bar */}
                    <div className="w-14 h-1.5 bg-[#281614] rounded-full overflow-hidden border border-[#521b17] mb-1">
                      <div
                        className="h-full bg-[#ff3b30] transition-all"
                        style={{ width: `${(zombie.hp / zombie.maxHp) * 100}%` }}
                      />
                    </div>

                    {/* Target Reticle Indicator */}
                    {isTarget && (
                      <div className="text-xs text-[#ffd700] font-cinzel font-bold flex items-center gap-0.5 animate-bounce">
                        <Crosshair className="w-3.5 h-3.5 text-[#ff3b30]" />
                        <span>MỤC TIÊU</span>
                      </div>
                    )}

                    {/* Character Avatar */}
                    <div
                      className={`text-4xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] ${
                        isTarget ? 'scale-110' : 'scale-90 opacity-80'
                      } transition-transform`}
                    >
                      {zombie.avatar}
                    </div>

                    {/* Name & Weakness */}
                    <div className="text-[10px] text-[#f4ecd8] font-cinzel tracking-tight text-center bg-[#1c120c]/80 px-1.5 py-0.5 rounded border border-[#7a5829]/40 mt-0.5">
                      {zombie.name.split(' ')[0]}
                      <span className="text-[#ffd700] ml-1">
                        {zombie.weaknessTopic === 'math'
                          ? '📐'
                          : zombie.weaknessTopic === 'korean'
                          ? '📜'
                          : '⚖️'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : gameState === 'lobby' ? (
            <div className="text-center py-10 max-w-lg mx-auto bg-[#1a120b]/90 p-6 rounded-2xl border border-[#b88e4a]/40 shadow-2xl backdrop-blur-md">
              <Skull className="w-12 h-12 text-[#ff4d4f] mx-auto mb-3" />
              <h3 className="font-cinzel text-xl font-bold text-[#fbf5e8] mb-2">
                Hắc Khí Dịch Hạch Bao Trùm Cổ Viện
              </h3>
              <p className="text-sm text-[#c9b79c] leading-relaxed mb-6 font-garamond italic">
                Các viện sĩ và học đồ quá cố đã bị biến dạng bởi mầm bệnh dịch hạch thế kỷ 18. Chỉ có kiến thức tinh hoa của Toán Học, Ngôn Ngữ Huấn Dân và Định Luật Vật Lý mới có thể kích hoạt các cổ trận đồ thanh tẩy chúng!
              </p>
              <button
                onClick={() => startNight(night)}
                className="px-8 py-3 rounded-xl bg-[#8a221a] hover:bg-[#a62b22] text-[#fbf5e8] font-cinzel font-bold text-sm tracking-widest uppercase transition-all duration-200 cursor-pointer shadow-xl ring-2 ring-[#ffd700]/50"
              >
                Bắt Đầu Thủ Thành Đêm {night}
              </button>
            </div>
          ) : gameState === 'victory' ? (
            <div className="text-center py-10 max-w-lg mx-auto bg-[#1c1a0e]/95 p-6 rounded-2xl border-2 border-[#ffd700] shadow-2xl">
              <Award className="w-12 h-12 text-[#ffd700] mx-auto mb-2 animate-bounce" />
              <h3 className="font-cinzel text-2xl font-bold text-[#ffd700] mb-1">
                Chiến Thắng Đêm {night}!
              </h3>
              <p className="text-sm text-[#e8dac2] mb-5">
                Bầy xác sống dịch hạch đã bị đẩy lui vào bóng đêm. Cổng thành vẫn đứng vững!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    const nextNight = night + 1;
                    setNight(nextNight);
                    startNight(nextNight);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#7a5829] hover:bg-[#61451f] text-[#fcf4e8] font-cinzel text-xs font-bold tracking-wider cursor-pointer shadow"
                >
                  Nghênh Chiến Đêm {night + 1}
                </button>
                <button
                  onClick={onOpenCatalog}
                  className="px-5 py-2.5 rounded-xl bg-[#281e16] hover:bg-[#382b20] text-[#c4b195] border border-[#b88e4a]/40 font-cinzel text-xs font-medium cursor-pointer"
                >
                  Vào Tàng Thư Tra Cứu
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 max-w-lg mx-auto bg-[#2b100e]/95 p-6 rounded-2xl border-2 border-[#ff3b30] shadow-2xl">
              <AlertTriangle className="w-12 h-12 text-[#ff3b30] mx-auto mb-2" />
              <h3 className="font-cinzel text-2xl font-bold text-[#ff4d4f] mb-1">
                Cổng Viện Hàn Lâm Đã Thất Thủ!
              </h3>
              <p className="text-sm text-[#e8cac7] mb-5">
                Xác sống đã tràn vào phòng cổ thư... Nhưng ngọn lửa trí tuệ không bao giờ tắt.
              </p>
              <button
                onClick={() => {
                  setBarricadeHp(maxBarricadeHp);
                  startNight(night);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#8a221a] hover:bg-[#a62b22] text-[#fff] font-cinzel text-xs font-bold tracking-wider cursor-pointer shadow"
              >
                Cố Thủ Lại Đêm {night}
              </button>
            </div>
          )}
        </div>

        {/* Combat Log Ticker */}
        <div className="relative z-10 px-4 py-2 bg-[#120a06]/90 border-t border-[#b88e4a]/20 flex items-center justify-between text-xs text-[#a99781]">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[#ffd700]">⚜ Nhật Ký Chiến Địa:</span>
            <span className="italic truncate text-[#e2d5c3]">
              {combatLog[0]?.text || 'Bầu không khí tĩnh mịch trước bão giông...'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRepairBarricade}
              disabled={silverCoins < 50 || barricadeHp >= maxBarricadeHp}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-cinzel transition-colors cursor-pointer ${
                silverCoins >= 50 && barricadeHp < maxBarricadeHp
                  ? 'bg-[#3b2a1a] hover:bg-[#523b26] text-[#ffd700] border border-[#d4af37]/40'
                  : 'bg-[#1b1510] text-[#695847] border border-[#3b2c1f] cursor-not-allowed'
              }`}
              title="Dùng 50 Bạc gia cố sửa chữa Cổng Viện (+40 Máu)"
            >
              <Wrench className="w-3 h-3" />
              <span>Gia Cố Cổng (50 Bạc)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Question Puzzle Terminal to Trigger Musket / Spells */}
      {gameState === 'playing' && activeQuestion && (
        <div className="relative rounded-2xl bg-[#f7f1e1] text-[#2c2016] border-2 border-[#b88e4a] shadow-2xl p-6 font-garamond animate-fade-in">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#c4a97c] mb-4 gap-2">
            <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#7a5829] uppercase">
              <span>{TOPICS[activeQuestion.topic].symbol}</span>
              <span>Khắc Chế Bằng {TOPICS[activeQuestion.topic].name}:</span>
              <span className="text-[#1a120b]">{activeQuestion.title}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-cinzel text-[#8c6b39]">
              <span>Vũ khí hiện tại:</span>
              <span className="font-bold text-[#1a120b]">{activeWeapon.name}</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-4">
            <p className="text-base sm:text-lg font-bold text-[#1a120b] leading-snug">
              {activeQuestion.questionText}
            </p>
          </div>

          {/* Options or Deduction Input */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {activeQuestion.type === 'multiple_choice' && activeQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuestion.options.map((opt, idx) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      audioSystem.playParchmentFlip();
                      setSelectedOption(opt.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      selectedOption === opt.id
                        ? 'bg-[#3b2b1d] text-[#fff7e6] border-[#3b2b1d] font-semibold shadow-md'
                        : 'bg-[#fcf7ec] hover:bg-[#ede1c7] text-[#2c2016] border-[#cfbe9e]'
                    }`}
                  >
                    <span className="font-cinzel text-xs font-bold px-2 py-0.5 rounded border border-current opacity-80 shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm leading-snug flex-1">{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {activeQuestion.type === 'input_deduction' && (
              <div>
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  placeholder="Nhập kết quả luận giải..."
                  className="w-full p-3 bg-[#fdfbf6] border-2 border-[#cfbe9e] rounded-xl text-base text-[#1a130d] font-semibold focus:outline-none focus:border-[#7a5829]"
                />
              </div>
            )}

            {/* Fire Trigger Button */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-[#70583b] italic">
                * Trả lời chuẩn xác để khai hỏa súng kíp bạc và thần pháo tiêu diệt thây ma đang tiến gần!
              </div>

              <button
                type="submit"
                disabled={activeQuestion.type === 'multiple_choice' ? !selectedOption : !inputAnswer.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-widest uppercase transition-all shadow-lg cursor-pointer ${
                  (activeQuestion.type === 'multiple_choice' ? selectedOption : inputAnswer.trim())
                    ? 'bg-[#8a221a] hover:bg-[#701a13] text-[#fff] ring-2 ring-[#54120d]'
                    : 'bg-[#cfbe9e] text-[#7d6c57] cursor-not-allowed'
                }`}
              >
                <Zap className="w-4 h-4 text-[#ffd700]" />
                <span>Khai Hỏa Trừ Ma</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Arsenal & Armory Upgrades (Kho Quân Giới Viện Hàn Lâm) */}
      <div className="p-6 rounded-2xl bg-[#1a1410] border border-[#b88e4a]/40 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#ffd700]" />
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fbf5e8]">
              Kho Vũ Khí Khắc Chế Xác Sống
            </h3>
          </div>
          <div className="text-xs text-[#c4b195] font-cinzel">
            Tích lũy Bạc Hoàng Gia từ việc diệt thây ma để mở khóa
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weapons.map((w) => {
            const isEquipped = activeWeaponId === w.id;
            return (
              <div
                key={w.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isEquipped
                    ? 'bg-[#2b1f15] border-[#ffd700] ring-1 ring-[#ffd700]'
                    : w.unlocked
                    ? 'bg-[#211812] border-[#b88e4a]/40 hover:border-[#ffd700]/50'
                    : 'bg-[#150f0b] border-[#382b1f] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{w.icon}</span>
                    <span className="text-xs font-cinzel text-[#ffd700] font-bold">
                      {w.damage} Sát thương
                    </span>
                  </div>

                  <h5 className="font-cinzel font-bold text-sm text-[#fbf5e8] leading-tight">
                    {w.name}
                  </h5>
                  <p className="text-[11px] text-[#c99a4e] font-cinzel italic mb-1.5">
                    {w.latinName}
                  </p>
                  <p className="text-xs text-[#a99781] leading-snug line-clamp-2 mb-3">
                    {w.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#4a3929]/50">
                  {w.unlocked ? (
                    <button
                      onClick={() => {
                        audioSystem.playParchmentFlip();
                        setActiveWeaponId(w.id);
                      }}
                      className={`w-full py-1.5 rounded font-cinzel text-xs font-bold transition-colors cursor-pointer ${
                        isEquipped
                          ? 'bg-[#ffd700] text-[#120e0b]'
                          : 'bg-[#3b2d1f] hover:bg-[#4a3928] text-[#e6b75a]'
                      }`}
                    >
                      {isEquipped ? 'Đang Trang Bị' : 'Trang Bị'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlockWeapon(w.id)}
                      disabled={silverCoins < w.cost}
                      className={`w-full py-1.5 rounded font-cinzel text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                        silverCoins >= w.cost
                          ? 'bg-[#8a221a] hover:bg-[#a32a21] text-[#fff]'
                          : 'bg-[#241a13] text-[#695847] cursor-not-allowed'
                      }`}
                    >
                      <Coins className="w-3.5 h-3.5 text-[#ffd700]" />
                      <span>Mở khóa: {w.cost} Bạc</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
