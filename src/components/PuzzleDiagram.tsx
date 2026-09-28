import React from 'react';

interface PuzzleDiagramProps {
  type: string;
}

export const PuzzleDiagram: React.FC<PuzzleDiagramProps> = ({ type }) => {
  switch (type) {
    case 'euler_bridges':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Đồ Bản Sông Pregel & 7 Cây Cầu Königsberg (1736)
          </div>
          <svg viewBox="0 0 460 220" className="w-full max-w-md mx-auto stroke-[#c99a4e] fill-none">
            {/* Background water */}
            <rect x="10" y="70" width="440" height="80" fill="#1b2838" rx="6" opacity="0.6" />
            <path d="M 230 70 L 230 150" stroke="#223b56" strokeWidth="2" />
            <path d="M 120 70 C 180 90, 280 90, 340 70" stroke="#335c80" strokeWidth="1.5" strokeDasharray="3 3" />
            
            {/* 4 Landmasses */}
            {/* North Bank A */}
            <rect x="60" y="15" width="340" height="45" fill="#3a2e22" stroke="#b88e4a" strokeWidth="1.5" rx="4" />
            <text x="230" y="42" fill="#f4ebd6" fontSize="13" textAnchor="middle" fontFamily="Cinzel" fontWeight="bold">
              Bờ Bắc (A) · [Bậc 3]
            </text>

            {/* Island Kneiphof (Center C) */}
            <ellipse cx="230" cy="110" rx="90" ry="25" fill="#453526" stroke="#d4af37" strokeWidth="2" />
            <text x="230" y="115" fill="#fbf5e8" fontSize="13" textAnchor="middle" fontFamily="Cinzel" fontWeight="bold">
              Đảo Kneiphof (C) · [Bậc 5]
            </text>

            {/* South Bank B */}
            <rect x="60" y="160" width="340" height="45" fill="#3a2e22" stroke="#b88e4a" strokeWidth="1.5" rx="4" />
            <text x="230" y="188" fill="#f4ebd6" fontSize="13" textAnchor="middle" fontFamily="Cinzel" fontWeight="bold">
              Bờ Nam (B) · [Bậc 3]
            </text>

            {/* East Landmass D */}
            <rect x="375" y="75" width="70" height="70" fill="#3a2e22" stroke="#b88e4a" strokeWidth="1.5" rx="4" />
            <text x="410" y="115" fill="#f4ebd6" fontSize="11" textAnchor="middle" fontFamily="Cinzel" fontWeight="bold">
              Đông (D)
            </text>
            <text x="410" y="130" fill="#c99a4e" fontSize="9" textAnchor="middle" fontFamily="serif">
              [Bậc 3]
            </text>

            {/* 7 Bridges (Golden arches) */}
            {/* 2 bridges between North and Island */}
            <rect x="175" y="58" width="16" height="28" fill="#d4af37" rx="2" />
            <rect x="255" y="58" width="16" height="28" fill="#d4af37" rx="2" />

            {/* 2 bridges between South and Island */}
            <rect x="175" y="134" width="16" height="28" fill="#d4af37" rx="2" />
            <rect x="255" y="134" width="16" height="28" fill="#d4af37" rx="2" />

            {/* 1 bridge between North and East */}
            <rect x="350" y="52" width="32" height="14" fill="#d4af37" rx="2" />

            {/* 1 bridge between South and East */}
            <rect x="350" y="154" width="32" height="14" fill="#d4af37" rx="2" />

            {/* 1 bridge between Island and East */}
            <rect x="315" y="104" width="62" height="12" fill="#d4af37" rx="2" />
          </svg>
          <p className="text-[11px] text-[#c4b195] mt-1 italic">
            Tổng cộng: 4 vùng đất đều có số lượng cầu lẻ (3, 5, 3, 3). Không thể hình thành chu trình Euler.
          </p>
        </div>
      );

    case 'golden_spiral':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Đường Xoắn Ốc Tỉ Lệ Vàng (Spira Mirabilis - Φ ≈ 1.618)
          </div>
          <svg viewBox="0 0 340 210" className="w-full max-w-sm mx-auto stroke-[#d4af37]">
            {/* Golden rectangles */}
            <rect x="10" y="10" width="200" height="190" fill="#302319" stroke="#b88e4a" strokeWidth="1.5" />
            <rect x="210" y="10" width="120" height="120" fill="#38291e" stroke="#b88e4a" strokeWidth="1.5" />
            <rect x="260" y="130" width="70" height="70" fill="#423124" stroke="#b88e4a" strokeWidth="1.5" />
            <rect x="210" y="150" width="50" height="50" fill="#4c392a" stroke="#b88e4a" strokeWidth="1.5" />
            <rect x="210" y="130" width="20" height="20" fill="#584232" stroke="#b88e4a" strokeWidth="1.5" />
            {/* Golden spiral path */}
            <path
              d="M 10 200 A 190 190 0 0 1 200 10 A 120 120 0 0 1 330 130 A 70 70 0 0 1 260 200 A 50 50 0 0 1 210 150 A 20 20 0 0 1 230 130"
              fill="none"
              stroke="#ffd700"
              strokeWidth="2.5"
            />
            <text x="105" y="110" fill="#d4af37" fontSize="18" fontFamily="serif" textAnchor="middle">
              F₈ = 21
            </text>
            <text x="270" y="75" fill="#d4af37" fontSize="15" fontFamily="serif" textAnchor="middle">
              F₇ = 13
            </text>
            <text x="295" y="170" fill="#d4af37" fontSize="12" fontFamily="serif" textAnchor="middle">
              F₆ = 8
            </text>
          </svg>
        </div>
      );

    case 'hangul_vowels':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Triết Lý Tam Tài Cổ Điển: Thiên · Địa · Nhân
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto py-2">
            <div className="p-3 bg-[#30241b] rounded border border-[#8b6938]/40">
              <div className="text-2xl text-[#f4ecd8] font-bold">ㆍ</div>
              <div className="text-xs text-[#d4af37] font-cinzel mt-1">Trời (Thiên)</div>
              <div className="text-[11px] text-[#a89882]">Dương khí · Vòm tròn</div>
            </div>
            <div className="p-3 bg-[#30241b] rounded border border-[#8b6938]/40">
              <div className="text-2xl text-[#f4ecd8] font-bold">ㅡ</div>
              <div className="text-xs text-[#d4af37] font-cinzel mt-1">Đất (Địa)</div>
              <div className="text-[11px] text-[#a89882]">Âm khí · Bằng phẳng</div>
            </div>
            <div className="p-3 bg-[#30241b] rounded border border-[#8b6938]/40">
              <div className="text-2xl text-[#f4ecd8] font-bold">ㅣ</div>
              <div className="text-xs text-[#d4af37] font-cinzel mt-1">Người (Nhân)</div>
              <div className="text-[11px] text-[#a89882]">Trung hòa · Đứng thẳng</div>
            </div>
          </div>
          <div className="text-xs text-[#c4b195] mt-2 font-kr">
            Sự phối hợp: ㆍ + ㅣ = ㅏ (Dương tính) | ㆍ + ㅡ = ㅗ (Dương tính) | ㅡ + ㆍ = ㅜ (Âm tính)
          </div>
        </div>
      );

    case 'hangul_consonants':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Nguyên Lý Tượng Hình 5 Cơ Quan Ngữ Âm
          </div>
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto py-2 text-center">
            <div className="p-2 bg-[#2d2118] border border-[#8b6938]/30 rounded">
              <div className="text-xl text-[#f5ebd6] font-bold">ㄱ</div>
              <div className="text-[10px] text-[#c99a4e]">Cuống lưỡi</div>
            </div>
            <div className="p-2 bg-[#2d2118] border border-[#8b6938]/30 rounded">
              <div className="text-xl text-[#f5ebd6] font-bold">ㄴ</div>
              <div className="text-[10px] text-[#c99a4e]">Đầu lưỡi</div>
            </div>
            <div className="p-2 bg-[#2d2118] border border-[#ffd700] rounded ring-1 ring-[#ffd700]/50 bg-[#3d2c1f]">
              <div className="text-xl text-[#ffd700] font-bold">ㅁ</div>
              <div className="text-[10px] text-[#ffd700] font-semibold">Đôi môi khép</div>
            </div>
            <div className="p-2 bg-[#2d2118] border border-[#8b6938]/30 rounded">
              <div className="text-xl text-[#f5ebd6] font-bold">ㅅ</div>
              <div className="text-[10px] text-[#c99a4e]">Kẽ răng</div>
            </div>
            <div className="p-2 bg-[#2d2118] border border-[#8b6938]/30 rounded">
              <div className="text-xl text-[#f5ebd6] font-bold">ㅇ</div>
              <div className="text-[10px] text-[#c99a4e]">Vòm họng</div>
            </div>
          </div>
        </div>
      );

    case 'prism_spectrum':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Lăng Kính Phân Tán Ánh Sáng Của Sir Isaac Newton (1666)
          </div>
          <svg viewBox="0 0 380 180" className="w-full max-w-sm mx-auto">
            {/* White beam */}
            <line x1="20" y1="100" x2="160" y2="85" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            <text x="60" y="80" fill="#e8ded0" fontSize="10" fontFamily="serif">Tia sáng trắng</text>
            
            {/* Triangular Glass Prism */}
            <polygon points="180,30 140,140 240,140" fill="#30445c" stroke="#87b5e8" strokeWidth="1.5" opacity="0.8" />

            {/* Dispersed Rays */}
            <line x1="190" y1="90" x2="350" y2="60" stroke="#ff3b30" strokeWidth="2.5" />
            <text x="355" y="64" fill="#ff5c50" fontSize="10" fontFamily="serif">Đỏ (lệch ít nhất)</text>

            <line x1="190" y1="92" x2="350" y2="78" stroke="#ff9500" strokeWidth="2" />
            <line x1="190" y1="94" x2="350" y2="94" stroke="#ffcc00" strokeWidth="2" />
            <line x1="190" y1="96" x2="350" y2="110" stroke="#34c759" strokeWidth="2" />
            <line x1="190" y1="98" x2="350" y2="126" stroke="#007aff" strokeWidth="2" />
            <line x1="190" y1="100" x2="350" y2="145" stroke="#af52de" strokeWidth="3" />
            <text x="355" y="149" fill="#cf70ff" fontSize="10" fontFamily="serif" fontWeight="bold">Tím (lệch nhiều nhất)</text>
          </svg>
        </div>
      );

    case 'archimedes_lever':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Cân Bằng Mô-Men Lực Đòn Bẩy (F₁ × d₁ = F₂ × d₂)
          </div>
          <svg viewBox="0 0 380 150" className="w-full max-w-sm mx-auto">
            {/* Ground */}
            <line x1="20" y1="130" x2="360" y2="130" stroke="#634c38" strokeWidth="2" />
            
            {/* Fulcrum (Điểm tựa) at x = 110 */}
            <polygon points="110,80 95,130 125,130" fill="#8c6a43" stroke="#d4af37" strokeWidth="1.5" />
            <text x="110" y="145" fill="#d4af37" fontSize="10" textAnchor="middle" fontFamily="Cinzel">Điểm Tựa</text>

            {/* Lever beam */}
            <rect x="40" y="74" width="310" height="8" fill="#d4b07b" stroke="#7a5528" strokeWidth="1" rx="2" />

            {/* Left Weight: 100 kg at distance 1m (x = 55) */}
            <rect x="40" y="34" width="35" height="40" fill="#4d3826" stroke="#b88e4a" strokeWidth="1.5" rx="3" />
            <text x="57" y="58" fill="#f8f1e2" fontSize="11" textAnchor="middle" fontWeight="bold">100kg</text>
            <text x="82" y="70" fill="#c99a4e" fontSize="9" textAnchor="middle">1m</text>

            {/* Right Weight / Force: 20 kg at distance 5m (x = 330) */}
            <circle cx="330" cy="54" r="14" fill="#a43d26" stroke="#f1a391" strokeWidth="1.5" />
            <text x="330" y="58" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">20kg</text>
            <text x="220" y="70" fill="#c99a4e" fontSize="9" textAnchor="middle">d₂ = 5m (khoảng cách gấp 5 lần)</text>
          </svg>
        </div>
      );

    case 'pendulum_clock':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Mặt Phẳng Dao Động Con Lắc Foucault (1851)
          </div>
          <svg viewBox="0 0 280 160" className="w-full max-w-xs mx-auto stroke-[#c99a4e] fill-none">
            {/* Ceiling dome */}
            <path d="M 40 40 Q 140 10 240 40" stroke="#8b6938" strokeWidth="2" />
            <circle cx="140" cy="25" r="4" fill="#d4af37" />
            {/* Wire */}
            <line x1="140" y1="25" x2="140" y2="110" stroke="#f4ecd8" strokeWidth="1.5" />
            {/* Brass sphere */}
            <circle cx="140" cy="118" r="10" fill="#d4af37" stroke="#99752b" strokeWidth="1.5" />
            {/* Floor compass dial */}
            <ellipse cx="140" cy="135" rx="80" ry="18" fill="#2d2218" stroke="#8b6938" strokeWidth="1" strokeDasharray="3 3" />
            {/* Rotation arrow */}
            <path d="M 90 135 A 60 14 0 0 0 190 135" stroke="#e6b450" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <text x="140" y="152" fill="#c4b195" fontSize="10" textAnchor="middle" fontFamily="serif">
              Trái Đất quay bên dưới mặt phẳng dao động quán tính
            </text>
          </svg>
        </div>
      );

    case 'dice_fermat':
      return (
        <div className="my-4 p-4 rounded-lg bg-[#241c16]/80 border border-[#b88e4a]/30 text-center">
          <div className="text-xs uppercase tracking-wider text-[#d4af37] font-cinzel mb-2">
            Cây Xác Suất Fermat - Pascal (Tối đa 2 ván nữa)
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs py-2 max-w-sm mx-auto">
            <div className="p-2 bg-[#2d3a28] border border-[#528246] rounded text-[#e2f0d9]">
              <div className="font-bold">A - A</div>
              <div className="text-[10px] text-[#93c783]">A thắng (1/4)</div>
            </div>
            <div className="p-2 bg-[#2d3a28] border border-[#528246] rounded text-[#e2f0d9]">
              <div className="font-bold">A - B</div>
              <div className="text-[10px] text-[#93c783]">A thắng (1/4)</div>
            </div>
            <div className="p-2 bg-[#2d3a28] border border-[#528246] rounded text-[#e2f0d9]">
              <div className="font-bold">B - A</div>
              <div className="text-[10px] text-[#93c783]">A thắng (1/4)</div>
            </div>
            <div className="p-2 bg-[#3f2220] border border-[#964741] rounded text-[#f5d0cd]">
              <div className="font-bold">B - B</div>
              <div className="text-[10px] text-[#f2948c]">B thắng (1/4)</div>
            </div>
          </div>
          <div className="text-xs text-[#c4b195] mt-1">
            Tổng kết: A có 3 cơ hội (75%), B có 1 cơ hội (25%) → Tỉ lệ chia tiền 3 : 1
          </div>
        </div>
      );

    default:
      return null;
  }
};
