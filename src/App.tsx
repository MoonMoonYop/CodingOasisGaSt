import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  LogOut,
  Minus,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import {
  ASSETS,
  FISCH_ITEMS,
  formatIDR,
  GameCatalog,
  GameItem,
  GAMES_CATALOG,
  HERO_BANNERS,
  OrderRecord,
  SOCIAL_LINKS,
} from './data/catalog';
import { FischItemIcon, GameCoverArt } from './components/GameArtwork';
import { QrisPaymentModal } from './components/QrisPaymentModal';
import { AuthModal, UserProfile } from './components/AuthModal';

type QuickTab = 'Semua Game' | 'Top Up Game' | 'Item Roblox' | 'Lagi Populer' | 'Promo';
type ActiveView = 'catalog' | 'game-detail' | 'cek-transaksi';
type FischSubFilter =
  | 'Semua'
  | 'Relic'
  | 'Equipment & Bundle'
  | 'Snack & Consumable'
  | 'Vehicle & Glider';

const QUICK_TABS: QuickTab[] = [
  'Semua Game',
  'Top Up Game',
  'Item Roblox',
  'Lagi Populer',
  'Promo',
];

const INITIAL_SAMPLE_ORDER: OrderRecord = {
  invoiceId: 'OASIS-88412',
  gameTitle: 'Fisch (Roblox)',
  itemName: 'Cosmic relic',
  quantity: 10,
  unitPrice: 100,
  totalPrice: 1000,
  userId: '@OasisAngler99',
  createdAt: 'Hari ini, 14:20 WIB',
  status: 'Pesanan Diproses',
};

export default function App() {
  // Multi-Step Navigation State:
  // 'catalog' = STEP 1 (Halaman Utama / Pilihan Game saja)
  // 'game-detail' = STEP 2 (Halaman Detail Game / Input Akun + Pilihan Item + Metode QRIS)
  // 'cek-transaksi' = Halaman Lacak Pesanan
  const [activeView, setActiveView] = useState<ActiveView>('catalog');
  const [activeTab, setActiveTab] = useState<QuickTab>('Semua Game');
  const [searchQuery, setSearchQuery] = useState('');
  const [useEmbeddedLogo, setUseEmbeddedLogo] = useState(false);

  // Hero Banner state
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerImgErrors, setBannerImgErrors] = useState<Record<string, boolean>>({});

  // Selected Game & Order Form state (STEP 2)
  const [selectedGameId, setSelectedGameId] = useState<string>('fisch-roblox');
  const [selectedItemId, setSelectedItemId] = useState<string>(FISCH_ITEMS[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [fischSubFilter, setFischSubFilter] = useState<FischSubFilter>('Semua');
  const [fischSort, setFischSort] = useState<'default' | 'asc' | 'desc'>('default');
  const [itemSearch, setItemSearch] = useState<string>('');

  // Customer Account Input state (STEP 2)
  const [userIdInput, setUserIdInput] = useState<string>('');
  const [zoneIdInput, setZoneIdInput] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Orders & QRIS Modal state (STEP 3 & STEP 4)
  const [orders, setOrders] = useState<OrderRecord[]>([INITIAL_SAMPLE_ORDER]);
  const [activeOrderModal, setActiveOrderModal] = useState<OrderRecord | null>(null);
  const [invoiceSearchInput, setInvoiceSearchInput] = useState<string>('');

  // Auth Modal state
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const userIdInputRef = useRef<HTMLInputElement>(null);

  const selectedGame: GameCatalog = useMemo(() => {
    return (
      GAMES_CATALOG.find((g) => g.id === selectedGameId) || GAMES_CATALOG[0]
    );
  }, [selectedGameId]);

  const selectedItem: GameItem = useMemo(() => {
    return (
      selectedGame.items.find((i) => i.id === selectedItemId) ||
      selectedGame.items[0]
    );
  }, [selectedGame, selectedItemId]);

  // STEP 1: Filtered games for the main catalog view
  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GAMES_CATALOG.filter((game) => {
      const matchesSearch =
        !q ||
        game.title.toLowerCase().includes(q) ||
        game.publisher.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (q) return true;

      switch (activeTab) {
        case 'Semua Game':
          return true;
        case 'Top Up Game':
          return game.category === 'Top Up Game' || game.category === 'Voucher';
        case 'Item Roblox':
          return game.category === 'Item Roblox';
        case 'Lagi Populer':
          return game.isPopular;
        case 'Promo':
          return game.isPromo;
        default:
          return true;
      }
    });
  }, [activeTab, searchQuery]);

  // STEP 2: Filtered items inside the selected game's detail view
  const displayedGameItems = useMemo(() => {
    const effectiveQuery = itemSearch.trim().toLowerCase();

    let list = selectedGame.items.filter((item) => {
      const matchesSub =
        selectedGame.id !== 'fisch-roblox' ||
        fischSubFilter === 'Semua' ||
        item.subCategory === fischSubFilter;

      const matchesText =
        !effectiveQuery ||
        item.name.toLowerCase().includes(effectiveQuery) ||
        item.subCategory.toLowerCase().includes(effectiveQuery);

      return matchesSub && matchesText;
    });

    if (fischSort === 'asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (fischSort === 'desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedGame, fischSubFilter, fischSort, itemSearch]);

  // Transition from STEP 1 (Catalog) -> STEP 2 (Game Detail Page)
  const handleOpenGameDetail = (game: GameCatalog) => {
    setSelectedGameId(game.id);
    setSelectedItemId(game.items[0].id);
    setQuantity(1);
    setItemSearch('');
    setFischSubFilter('Semua');
    setFormError('');
    setActiveView('game-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // STEP 2 -> STEP 3: Checkout handler -> Opens QRIS Modal
  const handleCheckoutQris = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!userIdInput.trim()) {
      setFormError(`Harap isi ${selectedGame.userIdLabel} terlebih dahulu sebelum menekan Bayar Sekarang.`);
      userIdInputRef.current?.focus();
      return;
    }

    if (selectedGame.needsZoneId && !zoneIdInput.trim()) {
      setFormError('Harap isi Server / Zone ID Mobile Legends kamu.');
      return;
    }

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newOrder: OrderRecord = {
      invoiceId: `OASIS-${randomDigits}`,
      gameTitle: selectedGame.title,
      itemName: selectedItem.name,
      quantity,
      unitPrice: selectedItem.price,
      totalPrice: selectedItem.price * quantity,
      userId: userIdInput.trim(),
      zoneId: selectedGame.needsZoneId ? zoneIdInput.trim() : undefined,
      whatsappOrNote: orderNote.trim() || undefined,
      createdAt: 'Baru saja',
      status: 'Menunggu Pembayaran',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderModal(newOrder);
  };

  // STEP 3 -> STEP 4: Transition order status when user clicks "Saya Sudah Bayar"
  const handleConfirmPaid = (invoiceId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.invoiceId === invoiceId
          ? { ...ord, status: 'Pesanan Diproses' }
          : ord
      )
    );
    setActiveOrderModal((prev) =>
      prev && prev.invoiceId === invoiceId
        ? { ...prev, status: 'Pesanan Diproses' }
        : prev
    );
  };

  const currentBanner = HERO_BANNERS[bannerIndex];

  const filteredOrders = useMemo(() => {
    const q = invoiceSearchInput.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.invoiceId.toLowerCase().includes(q) ||
        o.userId.toLowerCase().includes(q) ||
        o.itemName.toLowerCase().includes(q)
    );
  }, [orders, invoiceSearchInput]);

  const topUpGamesList = useMemo(
    () =>
      filteredGames.filter(
        (g) => g.category === 'Top Up Game' || g.category === 'Voucher'
      ),
    [filteredGames]
  );

  const robloxGamesList = useMemo(
    () => filteredGames.filter((g) => g.category === 'Item Roblox'),
    [filteredGames]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A192F] via-[#0D233A] to-[#0A192F] text-[#F0F9FF]">
      {/* TOP NAVIGATION BAR (3-Zone Contract) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A192F]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Gambar 1 (Logo) + Brand Title */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveView('catalog');
              setSearchQuery('');
            }}
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[#00A8E8] bg-[#0D233A] shadow-sm">
              <img
                src={!useEmbeddedLogo ? 'logo.png' : ASSETS.logo}
                alt="Coding Oasis Logo"
                referrerPolicy="no-referrer"
                onError={() => setUseEmbeddedLogo(true)}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight text-white sm:text-xl whitespace-nowrap">
              Coding Oasis
            </span>
          </a>

          {/* Zone 2: Search Bar ("Cari Game...") & Navigation Links */}
          <div className="flex flex-1 items-center justify-center gap-6 max-w-2xl">
            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'catalog') setActiveView('catalog');
                }}
                placeholder="Cari Game... (misal: Fisch, Mobile Legends, Steam Wallet)"
                className="w-full rounded-xl border border-white/15 bg-[#0D233A]/90 py-2 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-400 transition-colors focus:border-[#00A8E8] focus:bg-[#0D233A] focus:outline-none"
              />
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('catalog');
                }}
                className={`transition-colors hover:text-white whitespace-nowrap ${
                  activeView === 'catalog'
                    ? 'text-[#00A8E8] underline decoration-[#00A8E8] decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                Home
              </a>
              <a
                href="#cek-transaksi"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('cek-transaksi');
                }}
                className={`transition-colors hover:text-white whitespace-nowrap ${
                  activeView === 'cek-transaksi'
                    ? 'text-[#00A8E8] underline decoration-[#00A8E8] decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                Cek Transaksi
              </a>
              <a
                href="#promo"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveView('catalog');
                  setActiveTab('Promo');
                }}
                className={`transition-colors hover:text-white whitespace-nowrap ${
                  activeView === 'catalog' && activeTab === 'Promo'
                    ? 'text-[#FFB703] underline decoration-[#FFB703] decoration-2 underline-offset-8'
                    : ''
                }`}
              >
                Promo
              </a>
            </nav>
          </div>

          {/* Zone 3: Primary Action (Masuk / Daftar or User Account) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                setActiveView(
                  activeView === 'cek-transaksi' ? 'catalog' : 'cek-transaksi'
                )
              }
              className="flex lg:hidden items-center justify-center rounded-xl border border-white/15 bg-[#0D233A] px-3 py-2 text-xs font-medium text-slate-200 hover:border-[#00A8E8] whitespace-nowrap"
            >
              {activeView === 'cek-transaksi' ? 'Katalog' : 'Cek Order'}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('cek-transaksi')}
                  className="flex items-center gap-2 rounded-xl border border-[#00A8E8]/40 bg-[#0D233A] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#00A8E8] whitespace-nowrap"
                >
                  <UserCheck className="h-4 w-4 text-[#00A8E8]" />
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentUser(null)}
                  title="Keluar Akun"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0D233A] text-slate-400 hover:text-rose-400"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="rounded-xl bg-[#FFB703] px-4 py-2 text-xs sm:text-sm font-bold text-[#0A192F] shadow-sm transition-colors hover:bg-[#ffca3a] whitespace-nowrap"
              >
                Masuk / Daftar
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        {activeView === 'cek-transaksi' && (
          /* VIEW: CEK TRANSAKSI */
          <section className="space-y-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs text-[#00A8E8]">
                  Pelacakan Pesanan · Coding Oasis
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                  Cek Status Transaksi &amp; Konfirmasi Admin
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('catalog')}
                className="flex items-center gap-2 self-start rounded-xl border border-[#00A8E8]/40 bg-[#0D233A] px-4 py-2 text-xs font-semibold text-[#00A8E8] hover:bg-[#00A8E8]/10 whitespace-nowrap"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Halaman Utama</span>
              </button>
            </div>

            {/* Search Invoice Input */}
            <div className="rounded-2xl border border-white/10 bg-[#0D233A] p-5">
              <label className="block text-xs font-medium text-slate-300">
                Cari Nomor Invoice atau Username Game
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={invoiceSearchInput}
                    onChange={(e) => setInvoiceSearchInput(e.target.value)}
                    placeholder="Masukkan Nomor Invoice (Contoh: OASIS-88412) atau Username..."
                    className="w-full rounded-xl border border-white/15 bg-[#0A192F] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
                  />
                </div>
                {invoiceSearchInput && (
                  <button
                    type="button"
                    onClick={() => setInvoiceSearchInput('')}
                    className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white whitespace-nowrap"
                  >
                    Reset Pencarian
                  </button>
                )}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0D233A]/70 p-10 text-center">
                  <p className="font-display text-lg font-bold text-white">
                    Transaksi Tidak Ditemukan
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Pastikan nomor invoice (OASIS-XXXXX) atau username yang kamu masukkan sudah benar.
                  </p>
                </div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.invoiceId}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0D233A] p-5 transition-colors hover:border-[#00A8E8]/40 lg:flex-row lg:items-center"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono-tabular font-bold text-[#00A8E8]">
                          #{ord.invoiceId}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{ord.createdAt}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#FFB703]">
                          {ord.status}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {ord.itemName} (×{ord.quantity}) — {ord.gameTitle}
                      </h3>
                      <p className="text-xs text-slate-300">
                        Target Akun:{' '}
                        <span className="font-mono-tabular font-semibold text-white">
                          {ord.userId}
                          {ord.zoneId ? ` (${ord.zoneId})` : ''}
                        </span>{' '}
                        · Metode: QRIS Resmi
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3 lg:border-t-0 lg:pt-0">
                      <div className="mr-2">
                        <p className="text-xs text-slate-400">Total Tagihan</p>
                        <p className="font-mono-tabular text-base font-bold text-[#FFB703]">
                          {formatIDR(ord.totalPrice)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveOrderModal(ord)}
                        className="rounded-xl border border-[#00A8E8]/40 bg-[#0A192F] px-3.5 py-2.5 text-xs font-semibold text-[#00A8E8] hover:bg-[#00A8E8]/15 whitespace-nowrap"
                      >
                        {ord.status === 'Menunggu Pembayaran'
                          ? 'Buka QRIS'
                          : 'Rincian & Chat Admin'}
                      </button>

                      <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-[#00A8E8] px-3.5 py-2.5 text-xs font-bold text-[#0A192F] hover:brightness-110 whitespace-nowrap"
                      >
                        <span>Chat Admin Instagram</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>

                      <a
                        href={SOCIAL_LINKS.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl border border-[#FFB703]/40 bg-[#0A192F] px-3.5 py-2.5 text-xs font-bold text-[#FFB703] hover:bg-[#FFB703]/10 whitespace-nowrap"
                      >
                        <span>Chat Admin TikTok</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeView === 'catalog' && (
          /* =====================================================================
             STEP 1: HALAMAN UTAMA (CATALOG VIEW - HANYA PILIHAN GAME)
             ===================================================================== */
          <div className="space-y-12">
            {/* Hero Banner Carousel */}
            <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D233A] shadow-xl">
              <div className="relative aspect-[16/9] max-h-[370px] w-full overflow-hidden sm:aspect-[21/9]">
                {!bannerImgErrors[currentBanner.id] ? (
                  <img
                    src={currentBanner.image}
                    alt={currentBanner.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setBannerImgErrors((prev) => ({
                        ...prev,
                        [currentBanner.id]: true,
                      }))
                    }
                    className="h-full w-full object-cover object-center transition-opacity duration-300"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-r from-[#0A192F] via-[#0D233A] to-[#0088CC]/40" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:justify-center sm:p-10 lg:p-12">
                  <div className="max-w-xl space-y-3">
                    <p className="text-xs font-semibold tracking-wide text-[#FFB703]">
                      {currentBanner.kicker}
                    </p>
                    <h1
                      className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl"
                      style={{ textWrap: 'balance' }}
                    >
                      {currentBanner.title}
                    </h1>
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-200 sm:line-clamp-none sm:text-sm">
                      {currentBanner.subtitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const target =
                            GAMES_CATALOG.find(
                              (g) => g.id === currentBanner.targetGameId
                            ) || GAMES_CATALOG[0];
                          handleOpenGameDetail(target);
                        }}
                        className="rounded-xl bg-[#FFB703] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0A192F] shadow-md transition-transform duration-150 hover:bg-[#ffca3a] active:scale-[0.99] whitespace-nowrap"
                      >
                        {currentBanner.ctaText}
                      </button>
                      <span className="text-xs font-medium text-slate-300">
                        {currentBanner.highlightText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-8">
                  <button
                    type="button"
                    onClick={() =>
                      setBannerIndex((prev) =>
                        prev === 0 ? HERO_BANNERS.length - 1 : prev - 1
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#0A192F]/80 text-white backdrop-blur-sm transition-colors hover:border-[#00A8E8] hover:text-[#00A8E8]"
                    aria-label="Banner sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5 px-2">
                    {HERO_BANNERS.map((b, idx) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBannerIndex(idx)}
                        aria-label={`Pilih slide ${idx + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          bannerIndex === idx
                            ? 'w-6 bg-[#FFB703]'
                            : 'w-2 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerIndex((prev) => (prev + 1) % HERO_BANNERS.length)
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-[#0A192F]/80 text-white backdrop-blur-sm transition-colors hover:border-[#00A8E8] hover:text-[#00A8E8]"
                    aria-label="Banner berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Category Filter Bar */}
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold text-[#00A8E8]">
                  Step 1 dari 4 · Pilih Game untuk Mulai Transaksi
                </p>
                <h2 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
                  Daftar Layanan Game Coding Oasis
                </h2>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-[#0D233A] p-1.5">
                {QUICK_TABS.map((tab) => {
                  const isActive = activeTab === tab && !searchQuery;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setSearchQuery('');
                      }}
                      className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-[#00A8E8] text-[#0A192F] shadow-sm'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KATEGORI 1: ITEM GAME (ROBLOX) */}
            {robloxGamesList.length > 0 && (
              <section className="space-y-5">
                <div>
                  <p className="text-xs text-[#FFB703]">
                    Spesialis Item &amp; Relic Trade In-Game
                  </p>
                  <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                    Item Game (Roblox)
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {robloxGamesList.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleOpenGameDetail(game)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D233A]/90 transition-all duration-200 hover:-translate-y-1 hover:border-[#00A8E8]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <GameCoverArt game={game} className="h-full w-full" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            {game.category} · {game.publisher.split('·')[0].trim()}
                          </p>
                          <h4 className="mt-1 font-display text-lg font-bold text-white group-hover:text-[#00A8E8]">
                            {game.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-300">
                            {game.deliveryType}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenGameDetail(game);
                          }}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00A8E8] px-4 py-2.5 text-xs font-bold text-[#0A192F] transition-colors group-hover:bg-[#FFB703] whitespace-nowrap"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          <span>Beli / Pilih Game</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* KATEGORI 2: TOP UP GAME */}
            {topUpGamesList.length > 0 && (
              <section className="space-y-5">
                <div>
                  <p className="text-xs text-[#00A8E8]">
                    Proses Instan Resmi · Pembayaran QRIS
                  </p>
                  <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                    Top Up Game
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 sm:gap-5">
                  {topUpGamesList.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleOpenGameDetail(game)}
                      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D233A]/90 transition-all duration-200 hover:-translate-y-1 hover:border-[#00A8E8]"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <GameCoverArt game={game} className="h-full w-full" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <p className="text-[11px] text-slate-400">
                            {game.publisher.split('·')[0].trim()}
                          </p>
                          <h4 className="mt-0.5 font-display text-sm sm:text-base font-bold text-white group-hover:text-[#00A8E8]">
                            {game.title}
                          </h4>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenGameDetail(game);
                          }}
                          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#00A8E8]/40 bg-[#0A192F] px-3 py-2 text-xs font-bold text-[#00A8E8] transition-colors group-hover:border-[#FFB703] group-hover:bg-[#FFB703] group-hover:text-[#0A192F] whitespace-nowrap"
                        >
                          <span>Beli</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty Search Fallback */}
            {filteredGames.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#0D233A]/60 p-10 text-center">
                <p className="font-display text-lg font-bold text-white">
                  Game tidak ditemukan
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Coba gunakan kata kunci lain atau tekan tombol di bawah untuk melihat semua game.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('Semua Game');
                  }}
                  className="mt-4 rounded-xl bg-[#00A8E8] px-4 py-2 text-xs font-bold text-[#0A192F]"
                >
                  Tampilkan Semua Game
                </button>
              </div>
            )}

            {/* Keunggulan Coding Oasis */}
            <section className="grid grid-cols-1 gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-[#0D233A]/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A8E8]/15 text-[#00A8E8]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-white">
                  01. Pilih Game Favoritmu
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  Klik tombol Beli pada game pilihanmu untuk membuka daftar lengkap item Fisch Roblox (42 item) atau nominal Top Up Game.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0D233A]/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFB703]/15 text-[#FFB703]">
                  <QrCode className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-white">
                  02. Bayar Praktis via QRIS
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  Kode QRIS resmi OASIS Store muncul otomatis saat checkout. Mendukung semua aplikasi E-Wallet dan Mobile Banking.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0D233A]/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00A8E8]/15 text-[#00A8E8]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-white">
                  03. Konfirmasi Langsung ke Admin
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  Setelah menekan Saya Sudah Bayar, terhubung langsung ke Instagram atau TikTok Admin untuk proses pengiriman instan.
                </p>
              </div>
            </section>
          </div>
        )}

        {activeView === 'game-detail' && (
          /* =====================================================================
             STEP 2: HALAMAN DETAIL GAME / OPSI ITEM & FORM AKUN
             ===================================================================== */
          <div className="space-y-6">
            {/* Top Bar Navigation & Step Progress Indicator */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-[#0D233A] p-4 sm:flex-row sm:items-center sm:px-6">
              <button
                type="button"
                onClick={() => setActiveView('catalog')}
                className="flex items-center gap-2 self-start rounded-xl border border-white/15 bg-[#0A192F] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#00A8E8] hover:text-white whitespace-nowrap"
              >
                <ArrowLeft className="h-4 w-4 text-[#00A8E8]" />
                <span>Kembali ke Pilihan Game (Step 1)</span>
              </button>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="text-slate-400">1. Pilih Game</span>
                <span aria-hidden="true">→</span>
                <span className="font-bold text-[#FFB703]">
                  2. Isi Akun &amp; Pilih Item
                </span>
                <span aria-hidden="true">→</span>
                <span>3. Scan QRIS</span>
                <span aria-hidden="true">→</span>
                <span>4. Chat Admin</span>
              </div>
            </div>

            {/* Game Header Banner */}
            <div className="flex flex-col justify-between gap-5 rounded-2xl border border-[#00A8E8]/30 bg-[#0D233A]/90 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <GameCoverArt game={selectedGame} className="h-full w-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#00A8E8]">
                    <Compass className="h-3.5 w-3.5 text-[#FFB703]" />
                    <span>{selectedGame.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedGame.deliveryType}</span>
                  </div>
                  <h1 className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
                    {selectedGame.title}
                  </h1>
                  <p className="mt-1 max-w-2xl text-xs text-slate-300">
                    {selectedGame.userGuide}
                  </p>
                </div>
              </div>

              {/* Switch Game Dropdown */}
              <div className="shrink-0">
                <label className="mb-1 block text-[11px] text-slate-400">
                  Ganti Game Cepat:
                </label>
                <select
                  value={selectedGame.id}
                  onChange={(e) => {
                    const g = GAMES_CATALOG.find((item) => item.id === e.target.value);
                    if (g) handleOpenGameDetail(g);
                  }}
                  className="rounded-xl border border-white/15 bg-[#0A192F] px-3.5 py-2 text-xs font-semibold text-white focus:border-[#00A8E8] focus:outline-none"
                >
                  {GAMES_CATALOG.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* STEP 2 MAIN GRID: Form Data Akun, Opsi Pilihan Item, Metode QRIS, & Tombol Bayar */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* LEFT COLUMN (7/8 cols): 1. Input Data Akun + 2. Grid Opsi Item */}
              <div className="space-y-6 lg:col-span-7 xl:col-span-8">
                {/* SECTION 1: FORM INPUT DATA AKUN */}
                <div className="rounded-2xl border border-white/10 bg-[#0D233A] p-5 sm:p-6">
                  <h2 className="font-display text-lg font-bold text-white">
                    1. Masukkan Data Akun Game
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Masukkan User ID, Server ID, atau Username akun {selectedGame.title} kamu.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className={selectedGame.needsZoneId ? '' : 'sm:col-span-2'}>
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        {selectedGame.userIdLabel} <span className="text-[#FFB703]">*</span>
                      </label>
                      <input
                        ref={userIdInputRef}
                        type="text"
                        value={userIdInput}
                        onChange={(e) => {
                          setUserIdInput(e.target.value);
                          if (formError) setFormError('');
                        }}
                        placeholder={selectedGame.userIdPlaceholder}
                        className="w-full rounded-xl border border-white/15 bg-[#0A192F] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
                      />
                    </div>

                    {selectedGame.needsZoneId && (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-300">
                          Server / Zone ID <span className="text-[#FFB703]">*</span>
                        </label>
                        <input
                          type="text"
                          value={zoneIdInput}
                          onChange={(e) => {
                            setZoneIdInput(e.target.value);
                            if (formError) setFormError('');
                          }}
                          placeholder={selectedGame.zoneIdPlaceholder}
                          className="w-full rounded-xl border border-white/15 bg-[#0A192F] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-xs font-medium text-slate-300">
                        Catatan Tambahan / Username IG atau TikTok (Opsional)
                      </label>
                      <input
                        type="text"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="Contoh: IG @username_kamu untuk mempermudah admin menghubungi"
                        className="w-full rounded-xl border border-white/15 bg-[#0A192F] px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-[#00A8E8] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: GRID OPSI PILIHAN ITEM / NOMINAL TOP UP */}
                <div className="rounded-2xl border border-white/10 bg-[#0D233A] p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="font-display text-lg font-bold text-white">
                        2. Pilih Opsi Item / Nominal ({displayedGameItems.length} Tersedia)
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-400">
                        Klik pada kartu item di bawah untuk memilih produk yang ingin dibeli.
                      </p>
                    </div>

                    {/* Search & Price Sort inside Item List */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          value={itemSearch}
                          onChange={(e) => setItemSearch(e.target.value)}
                          placeholder={`Cari item ${selectedGame.title}...`}
                          className="w-44 sm:w-52 rounded-lg border border-white/15 bg-[#0A192F] py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:border-[#00A8E8] focus:outline-none"
                        />
                      </div>

                      <select
                        value={fischSort}
                        onChange={(e) =>
                          setFischSort(e.target.value as 'default' | 'asc' | 'desc')
                        }
                        aria-label="Urutkan harga"
                        className="rounded-lg border border-white/15 bg-[#0A192F] px-2.5 py-1.5 text-xs font-medium text-slate-200 focus:border-[#00A8E8] focus:outline-none"
                      >
                        <option value="default">Urutan Default</option>
                        <option value="asc">Harga Termurah</option>
                        <option value="desc">Harga Tertinggi</option>
                      </select>
                    </div>
                  </div>

                  {/* Sub-category filter bar specifically for Fisch Roblox (42 items) */}
                  {selectedGame.id === 'fisch-roblox' && (
                    <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-[#0A192F] p-1.5">
                      {(
                        [
                          'Semua',
                          'Relic',
                          'Equipment & Bundle',
                          'Snack & Consumable',
                          'Vehicle & Glider',
                        ] as FischSubFilter[]
                      ).map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setFischSubFilter(sub)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            fischSubFilter === sub
                              ? 'bg-[#00A8E8] text-[#0A192F]'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {sub === 'Semua' ? `Semua Item (${FISCH_ITEMS.length})` : sub}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Items Grid */}
                  {displayedGameItems.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-[#0A192F]/60 p-8 text-center">
                      <p className="text-sm font-semibold text-white">
                        Item tidak ditemukan
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Coba gunakan kata kunci lain atau pilih tab &ldquo;Semua Item&rdquo;.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {displayedGameItems.map((item) => {
                        const isItemSelected = item.id === selectedItem.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedItemId(item.id)}
                            className={`group relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-150 ${
                              isItemSelected
                                ? 'border-[#FFB703] bg-[#0A192F] ring-1 ring-[#FFB703]'
                                : 'border-white/10 bg-[#0A192F]/75 hover:border-[#00A8E8]/50 hover:bg-[#0A192F]'
                            }`}
                          >
                            <FischItemIcon item={item} />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="truncate text-[11px] text-slate-400">
                                  {item.subCategory}
                                </span>
                                {isItemSelected && (
                                  <Check className="h-4 w-4 shrink-0 text-[#FFB703]" />
                                )}
                              </div>

                              <p className="mt-0.5 truncate font-display text-sm font-bold text-white group-hover:text-[#00A8E8]">
                                {item.name}
                              </p>

                              <div className="mt-1.5 flex items-baseline gap-2">
                                <span className="font-mono-tabular text-sm font-bold text-[#FFB703]">
                                  {formatIDR(item.price)}
                                </span>
                                {item.originalPrice && (
                                  <span className="font-mono-tabular text-[11px] text-slate-500 line-through">
                                    {formatIDR(item.originalPrice)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN (4/5 cols): 3. Metode Pembayaran QRIS & 4. Rincian Harga + Tombol Bayar Sekarang */}
              <div className="lg:col-span-5 xl:col-span-4">
                <form
                  onSubmit={handleCheckoutQris}
                  className="sticky top-24 space-y-5 rounded-2xl border border-[#00A8E8]/30 bg-[#0D233A] p-5 sm:p-6 shadow-2xl"
                >
                  {/* 3. Pilihan Metode Pembayaran (Hanya QRIS) */}
                  <div>
                    <h2 className="font-display text-base font-bold text-white">
                      3. Metode Pembayaran
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Pembayaran otomatis menggunakan QRIS Standar Nasional.
                    </p>

                    <div className="mt-3 rounded-xl border-2 border-[#00A8E8] bg-[#0A192F] p-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00A8E8]/15 text-[#00A8E8]">
                            <QrCode className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-display text-sm font-bold text-white">
                              QRIS Resmi (OASIS Store)
                            </p>
                            <p className="text-[11px] text-slate-300">
                              GoPay · OVO · DANA · ShopeePay · M-Banking
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#00A8E8]">
                          Terpilih
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between border-y border-white/10 py-3.5">
                    <div>
                      <p className="text-xs font-medium text-slate-300">
                        Jumlah Item
                      </p>
                      <p className="text-[11px] text-[#00A8E8] font-semibold">
                        {selectedItem.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#0A192F] text-white hover:border-[#00A8E8]"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-mono-tabular text-sm font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#0A192F] text-white hover:border-[#00A8E8]"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4. Rincian Harga */}
                  <div className="space-y-2.5 rounded-xl bg-[#0A192F] p-4">
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
                      4. Rincian Pembayaran
                    </h3>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Game</span>
                      <span className="font-semibold text-white">{selectedGame.title}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Item</span>
                      <span className="font-semibold text-[#00A8E8]">
                        {selectedItem.name} × {quantity}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Harga Satuan</span>
                      <span className="font-mono-tabular">
                        {formatIDR(selectedItem.price)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>Biaya Admin QRIS</span>
                      <span className="font-semibold text-emerald-400">Rp 0</span>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-white/10 pt-2.5">
                      <span className="text-xs font-semibold text-white">
                        Total Bayar
                      </span>
                      <span className="font-mono-tabular text-lg font-extrabold text-[#FFB703]">
                        {formatIDR(selectedItem.price * quantity)}
                      </span>
                    </div>
                  </div>

                  {formError && (
                    <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs font-medium text-rose-300">
                      {formError}
                    </p>
                  )}

                  {/* Tombol Bayar Sekarang (Memicu STEP 3 Modal QRIS) */}
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFB703] px-5 py-3.5 text-sm font-extrabold text-[#0A192F] shadow-lg transition-transform duration-150 hover:bg-[#ffca3a] active:scale-[0.99] whitespace-nowrap"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Bayar Sekarang</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER & KONTAK SOSIAL MEDIA RESMI */}
      <footer className="border-t border-white/10 bg-[#071120] py-12 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* Store Info */}
            <div className="space-y-3 md:col-span-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#00A8E8] bg-[#0D233A]">
                  <img
                    src={!useEmbeddedLogo ? 'logo.png' : ASSETS.logo}
                    alt="Coding Oasis Logo"
                    referrerPolicy="no-referrer"
                    onError={() => setUseEmbeddedLogo(true)}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-display text-lg font-extrabold text-white">
                  Coding Oasis
                </span>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-slate-400">
                Toko digital game &amp; spesialis item Fisch Roblox bernuansa pantai tropis. Transaksi aman, harga bersahabat, dan didukung pembayaran QRIS Nasional.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2.5 md:col-span-3">
              <h4 className="font-display text-sm font-bold text-white">
                Katalog Game
              </h4>
              <ul className="space-y-2 text-xs">
                {GAMES_CATALOG.slice(0, 6).map((g) => (
                  <li key={g.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenGameDetail(g)}
                      className="transition-colors hover:text-[#00A8E8]"
                    >
                      {g.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Official Social Media Links */}
            <div className="space-y-3 md:col-span-4">
              <h4 className="font-display text-sm font-bold text-white">
                Kontak &amp; Sosial Media Resmi
              </h4>
              <p className="text-xs text-slate-400">
                Hubungi Admin Coding Oasis untuk konfirmasi pesanan, cek stok item langka, atau info promo terbaru:
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col">
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-[#00A8E8]/30 bg-[#0D233A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#00A8E8] hover:text-[#00A8E8]"
                >
                  <span>Instagram · @coding_oasis_gs</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-[#FFB703]/30 bg-[#0D233A] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:border-[#FFB703] hover:text-[#FFB703]"
                >
                  <span>TikTok · @oasis.store.fisch</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
            <p>© {new Date().getFullYear()} Coding Oasis Store. Seluruh hak cipta dilindungi.</p>
            <p className="text-slate-500">
              Pembayaran Resmi QRIS · Top Up Game &amp; Item Roblox
            </p>
          </div>
        </div>
      </footer>

      {/* STEP 3 & STEP 4: MODAL PEMBAYARAN QRIS & KONFIRMASI ADMIN */}
      <QrisPaymentModal
        order={activeOrderModal}
        onClose={() => setActiveOrderModal(null)}
        onConfirmPaid={handleConfirmPaid}
      />

      {/* MODAL LOGIN & REGISTER */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccessLogin={(user) => setCurrentUser(user)}
      />
    </div>
  );
}
