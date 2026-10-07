import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  QrCode,
  ShieldCheck,
  X,
} from 'lucide-react';
import { formatIDR, OrderRecord, SOCIAL_LINKS } from '../data/catalog';
import { generateOasisQrisDataUrl } from '../assets/embeddedAssets';

interface QrisPaymentModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onConfirmPaid: (invoiceId: string) => void;
}

export const QrisPaymentModal: React.FC<QrisPaymentModalProps> = ({
  order,
  onClose,
  onConfirmPaid,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 minutes
  const [copied, setCopied] = useState(false);
  const [qrisDataUri, setQrisDataUri] = useState<string>('');
  const [useEmbeddedQris, setUseEmbeddedQris] = useState<boolean>(false);

  // STEP 3: Generate embedded QRIS sheet (Gambar 2: OASIS Store NMID ID1026596036610) only when modal opens
  useEffect(() => {
    if (!order) return;
    setSecondsLeft(900);
    setCopied(false);
    setUseEmbeddedQris(false);

    let mounted = true;
    generateOasisQrisDataUrl().then((uri) => {
      if (mounted) setQrisDataUri(uri);
    });
    return () => {
      mounted = false;
    };
  }, [order?.invoiceId]);

  useEffect(() => {
    if (!order || order.status === 'Pesanan Diproses') return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) return null;

  const isConfirmedPaid = order.status === 'Pesanan Diproses';

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const confirmationMessage = `Halo Admin Coding Oasis! Saya sudah melakukan pembayaran QRIS.\nNo. Invoice: ${order.invoiceId}\nGame: ${order.gameTitle}\nItem: ${order.itemName} (x${order.quantity})\nUsername/ID: ${order.userId}${order.zoneId ? ` (${order.zoneId})` : ''}\nTotal Bayar: ${formatIDR(order.totalPrice)}`;

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(confirmationMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1A]/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qris-modal-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#00A8E8]/30 bg-[#0D233A] p-6 text-[#F0F9FF] shadow-2xl">
        {/* Top Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs text-[#00A8E8]">
              {isConfirmedPaid
                ? `Step 4 · Status: Pesanan Diproses (#${order.invoiceId})`
                : `Step 3 · Pembayaran QRIS (#${order.invoiceId})`}
            </p>
            <h2
              id="qris-modal-title"
              className="mt-1 font-display text-xl font-bold text-white"
            >
              {isConfirmedPaid
                ? 'Pesanan Diproses — Hubungi Admin'
                : 'Scan QRIS untuk Pembayaran'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0A192F] text-slate-300 transition-colors hover:border-[#00A8E8] hover:text-white"
            aria-label="Tutup modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!isConfirmedPaid ? (
          /* STEP 3: MODAL PEMBAYARAN QRIS (GAMBAR 2) */
          <div className="mt-5 space-y-5">
            {/* Timer & Total Tagihan */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FFB703]/30 bg-[#0A192F] px-4 py-3">
              <div>
                <p className="text-xs text-slate-400">Total Tagihan</p>
                <p className="font-mono-tabular text-xl font-bold text-[#FFB703]">
                  {formatIDR(order.totalPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Batas Waktu Bayar</p>
                <div className="mt-0.5 flex items-center justify-end gap-1.5 font-mono-tabular text-base font-semibold text-[#00A8E8]">
                  <Clock className="h-4 w-4 text-[#FFB703]" />
                  <span>
                    {minutes}:{seconds}
                  </span>
                </div>
              </div>
            </div>

            {/* Gambar 2 (QRIS) - HANYA muncul saat tombol "Bayar Sekarang" diklik */}
            <div className="mx-auto max-w-xs overflow-hidden rounded-xl border border-white/20 bg-white p-2 shadow-xl">
              <img
                src={!useEmbeddedQris ? 'qris.png' : qrisDataUri}
                alt="QRIS Pembayaran Coding Oasis"
                referrerPolicy="no-referrer"
                onError={() => setUseEmbeddedQris(true)}
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>

            {/* Order Detail Recap */}
            <div className="rounded-xl border border-white/10 bg-[#0A192F]/80 p-4 text-xs text-slate-300">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Merchant Resmi</span>
                <span className="font-semibold text-white">
                  OASIS Store (NMID: ID1026596036610)
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Game</span>
                <span className="font-semibold text-white">{order.gameTitle}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Item Dipilih</span>
                <span className="font-semibold text-[#00A8E8]">
                  {order.itemName} × {order.quantity}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">User ID / Username</span>
                <span className="font-mono-tabular font-semibold text-white">
                  {order.userId}
                  {order.zoneId ? ` (${order.zoneId})` : ''}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="font-semibold text-white">Panduan Pembayaran QRIS:</p>
              <p className="text-slate-400">
                1. Buka aplikasi E-Wallet atau Mobile Banking berlogo QRIS di ponselmu.
              </p>
              <p className="text-slate-400">
                2. Scan kode QRIS <span className="font-semibold text-white">OASIS Store</span> di atas dan pastikan nominal transfer sesuai ({formatIDR(order.totalPrice)}).
              </p>
              <p className="text-slate-400">
                3. Setelah selesai membayar, tekan tombol{' '}
                <span className="font-semibold text-[#FFB703]">Saya Sudah Bayar</span> di bawah ini.
              </p>
            </div>

            {/* Primary Confirm Button */}
            <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
              <button
                type="button"
                onClick={() => onConfirmPaid(order.invoiceId)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FFB703] px-5 py-3 text-sm font-bold text-[#0A192F] transition-transform duration-150 hover:bg-[#ffca3a] active:scale-[0.99] whitespace-nowrap"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Saya Sudah Bayar</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/15 bg-[#0A192F] px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-white/30 hover:text-white whitespace-nowrap"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          /* STEP 4: KONFIRMASI & HUBUNGI ADMIN ("Pesanan Diproses") */
          <div className="mt-5 space-y-5">
            {/* Status Banner */}
            <div className="rounded-xl border border-emerald-400/40 bg-[#0A192F] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-400">
                    Status: Pesanan Diproses
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Invoice #{order.invoiceId} Berhasil Dibuat!
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    Silakan konfirmasi pembayaranmu dengan menekan salah satu tombol chat Admin di bawah ini agar item atau top up segera dikirimkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary & Copyable Format */}
            <div className="rounded-xl border border-white/10 bg-[#0A192F]/90 p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-semibold text-slate-300">
                  Rincian Pesanan
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="flex items-center gap-1.5 rounded-lg border border-[#00A8E8]/40 bg-[#00A8E8]/10 px-2.5 py-1 text-xs font-medium text-[#00A8E8] transition-colors hover:bg-[#00A8E8]/20 whitespace-nowrap"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copied ? 'Format Tersalin!' : 'Salin Format Pesanan'}</span>
                </button>
              </div>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Invoice</span>
                  <span className="font-mono-tabular font-semibold text-white">
                    {order.invoiceId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-semibold text-emerald-400">
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Game</span>
                  <span className="font-semibold text-white">{order.gameTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Item &amp; Jumlah</span>
                  <span className="font-semibold text-[#00A8E8]">
                    {order.itemName} (×{order.quantity})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">User ID / Username</span>
                  <span className="font-mono-tabular font-semibold text-white">
                    {order.userId}
                    {order.zoneId ? ` (${order.zoneId})` : ''}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-slate-300">Total Tagihan (QRIS)</span>
                  <span className="font-mono-tabular text-sm font-bold text-[#FFB703]">
                    {formatIDR(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Two Main Action Buttons (STEP 4 Requirement) */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-300">
                Pilih jalur konfirmasi Admin Coding Oasis:
              </p>

              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-[#00A8E8] to-[#0088CC] px-4 py-3.5 text-sm font-bold text-[#0A192F] shadow-md transition-transform duration-150 hover:brightness-110 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode className="h-4 w-4 shrink-0" />
                  <span>Chat Admin Instagram</span>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>

              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between rounded-xl border border-[#FFB703]/50 bg-[#0A192F] px-4 py-3.5 text-sm font-bold text-[#FFB703] transition-colors hover:bg-[#FFB703]/10"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Chat Admin TikTok</span>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </div>

            <div className="pt-1 text-right">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
