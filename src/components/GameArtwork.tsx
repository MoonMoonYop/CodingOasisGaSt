import React, { useState } from 'react';
import { GameCatalog, GameItem } from '../data/catalog';

interface GameCoverProps {
  game: GameCatalog;
  className?: string;
}

export const GameCoverArt: React.FC<GameCoverProps> = ({ game, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  if (game.coverImage && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#0D233A] ${className}`}>
        <img
          src={game.coverImage}
          alt={game.title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/30 to-transparent" />
      </div>
    );
  }

  // Bespoke vector key-art illustrations for each game
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${game.themeGradient} ${className}`}
    >
      {/* Subtle ocean wave grid backdrop */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
        viewBox="0 0 200 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-20 110 C30 90, 70 130, 120 110 C170 90, 210 130, 240 110"
          stroke="#00A8E8"
          strokeWidth="1.5"
        />
        <path
          d="M-20 128 C30 108, 70 148, 120 128 C170 108, 210 148, 240 128"
          stroke="#FFB703"
          strokeWidth="1"
        />
        <circle cx="165" cy="32" r="18" fill="#FFB703" fillOpacity="0.18" />
      </svg>

      {/* Center Emblem */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 transition-transform duration-200 group-hover:scale-105">
        {game.iconType === 'mlbb' && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <polygon
              points="32,6 54,18 46,50 32,58 18,50 10,18"
              fill="#0D233A"
              stroke="#00A8E8"
              strokeWidth="2.5"
            />
            <polygon points="32,14 44,26 32,48 20,26" fill="#00A8E8" fillOpacity="0.85" />
            <circle cx="32" cy="27" r="4.5" fill="#FFB703" />
          </svg>
        )}

        {game.iconType === 'ff' && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <rect
              x="12"
              y="12"
              width="40"
              height="40"
              rx="10"
              fill="#0D233A"
              stroke="#FFB703"
              strokeWidth="2.5"
            />
            <path
              d="M24 44 L29 20 L43 20 M27 32 L39 32"
              stroke="#FFB703"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M40 16 L45 26 L36 26 Z" fill="#00A8E8" />
          </svg>
        )}

        {game.iconType === 'valorant' && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <rect
              x="10"
              y="10"
              width="44"
              height="44"
              rx="10"
              fill="#0D233A"
              stroke="#00A8E8"
              strokeWidth="2"
            />
            <path d="M18 20 L31 44 L23 44 L18 33 Z" fill="#FF4655" />
            <path d="M46 20 L35 40 L43 40 L46 33 Z" fill="#00A8E8" />
          </svg>
        )}

        {game.iconType === 'steam' && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <circle
              cx="32"
              cy="32"
              r="22"
              fill="#0D233A"
              stroke="#00A8E8"
              strokeWidth="2.5"
            />
            <circle cx="38" cy="26" r="6" stroke="#F0F9FF" strokeWidth="3" />
            <circle cx="24" cy="39" r="4.5" fill="#00A8E8" />
            <path d="M26 37 L35 29" stroke="#F0F9FF" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        )}

        {game.iconType === 'hok' && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <path
              d="M12 24 L22 16 L32 28 L42 16 L52 24 L46 48 L18 48 Z"
              fill="#0D233A"
              stroke="#FFB703"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="36" r="5" fill="#FFB703" />
            <circle cx="23" cy="34" r="2.5" fill="#00A8E8" />
            <circle cx="41" cy="34" r="2.5" fill="#00A8E8" />
          </svg>
        )}

        {game.iconType === 'pubgm' && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <path
              d="M16 24 C16 15, 48 15, 48 24 L50 44 C50 48, 14 48, 14 44 Z"
              fill="#0D233A"
              stroke="#FFB703"
              strokeWidth="2.5"
            />
            <rect x="20" y="27" width="24" height="9" rx="2" fill="#00A8E8" />
            <line x1="20" y1="31.5" x2="44" y2="31.5" stroke="#0A192F" strokeWidth="2" />
          </svg>
        )}

        {(game.iconType === 'fisch' || game.iconType === 'aut') && (
          <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="22" fill="#0D233A" stroke="#00A8E8" strokeWidth="2.5" />
            <path
              d="M20 34 C26 24, 38 24, 46 32 C38 40, 26 40, 20 34 Z"
              fill="#00A8E8"
            />
            <polygon points="15,27 22,34 15,41" fill="#FFB703" />
            <circle cx="40" cy="31" r="2" fill="#0A192F" />
          </svg>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent" />
    </div>
  );
};

interface FischItemIconProps {
  item: GameItem;
  className?: string;
}

export const FischItemIcon: React.FC<FischItemIconProps> = ({ item, className = 'h-11 w-11' }) => {
  const lower = item.name.toLowerCase();
  const isRelic = lower.includes('relic') || item.subCategory === 'Relic';
  const isSnack = item.subCategory === 'Snack & Consumable';
  const isVehicle = item.subCategory === 'Vehicle & Glider';

  if (isRelic) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-[#00A8E8]/30 bg-[#0A192F] ${className}`}
      >
        <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
          <polygon
            points="16,3 27,12 22,28 10,28 5,12"
            fill="#00A8E8"
            fillOpacity="0.2"
            stroke="#00A8E8"
            strokeWidth="2"
          />
          <polygon points="16,7 22,14 16,24 10,14" fill="#FFB703" />
        </svg>
      </div>
    );
  }

  if (isVehicle) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-[#FFB703]/30 bg-[#0A192F] ${className}`}
      >
        <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
          <path
            d="M4 20 L10 13 L23 13 L28 20 Z"
            fill="#FFB703"
            fillOpacity="0.25"
            stroke="#FFB703"
            strokeWidth="2"
          />
          <path d="M3 24 C9 22, 23 22, 29 24" stroke="#00A8E8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (isSnack) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg border border-emerald-400/30 bg-[#0A192F] ${className}`}
      >
        <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
          <path
            d="M7 17 C12 10, 21 10, 26 16 C21 22, 12 22, 7 17 Z"
            fill="#00A8E8"
            fillOpacity="0.3"
            stroke="#00A8E8"
            strokeWidth="2"
          />
          <polygon points="4,12 9,17 4,22" fill="#FFB703" />
          <circle cx="21" cy="15" r="1.5" fill="#F0F9FF" />
        </svg>
      </div>
    );
  }

  // Equipment, Staff, Lantern, Bundle
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg border border-[#00A8E8]/30 bg-[#0A192F] ${className}`}
    >
      <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none">
        <path
          d="M7 25 L23 9"
          stroke="#FFB703"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="23" cy="9" r="4" fill="#00A8E8" />
        <path d="M23 13 L23 20 C23 22, 20 22, 20 19" stroke="#F0F9FF" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
};
