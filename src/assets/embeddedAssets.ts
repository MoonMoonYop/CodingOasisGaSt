import QRCode from 'qrcode';

// High-precision SVG replica of Gambar 1: LOGO OASIS STORE (Palm tree, island, golden sun, rocks, "OASIS - Store -", golden shopping cart, cyan ring on deep navy)
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050E1D"/>
      <stop offset="100%" stop-color="#0A192F"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="50%" stop-color="#00A8E8"/>
      <stop offset="100%" stop-color="#0052CC"/>
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF3B0"/>
      <stop offset="100%" stop-color="#FFB703"/>
    </linearGradient>
    <linearGradient id="oasisTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="55%" stop-color="#E0F2FE"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFE066"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <clipPath id="circleClip">
      <circle cx="300" cy="300" r="264"/>
    </clipPath>
  </defs>

  <!-- Outer Dark Navy Background -->
  <rect width="600" height="600" rx="300" fill="#050E1D"/>

  <!-- Main Circle Clip Content -->
  <g clip-path="url(#circleClip)">
    <rect width="600" height="600" fill="url(#bgGrad)"/>

    <!-- Warm Sunset Horizon Lines -->
    <rect x="135" y="185" width="75" height="6" rx="3" fill="#FDE68A" opacity="0.85"/>
    <rect x="165" y="176" width="45" height="6" rx="3" fill="#FDE68A" opacity="0.85"/>
    <rect x="385" y="160" width="60" height="6" rx="3" fill="#FDE68A" opacity="0.85"/>
    <rect x="400" y="188" width="68" height="6" rx="3" fill="#FDE68A" opacity="0.85"/>

    <!-- Big Tropical Golden Sun -->
    <circle cx="305" cy="215" r="92" fill="url(#sunGrad)"/>

    <!-- Left & Right Brown Island Rocks -->
    <polygon points="140,265 182,198 205,205 232,265" fill="#7C4D3A"/>
    <polygon points="182,198 205,205 225,265 185,265" fill="#9C6644"/>
    <polygon points="370,265 408,210 432,222 460,265" fill="#7C4D3A"/>
    <polygon points="408,210 432,222 448,265 412,265" fill="#9C6644"/>

    <!-- Tropical Green Bushes -->
    <circle cx="235" cy="242" r="22" fill="#15803D"/>
    <circle cx="255" cy="248" r="18" fill="#22C55E"/>
    <circle cx="362" cy="244" r="20" fill="#15803D"/>
    <circle cx="344" cy="250" r="16" fill="#22C55E"/>

    <!-- Palm Tree Trunk -->
    <path d="M298,255 Q302,195 284,138 L302,138 Q324,195 322,255 Z" fill="#6B4226"/>
    <path d="M294,165 L311,162 M297,188 L316,185 M299,212 L320,210 M300,235 L321,233" stroke="#4A2C18" stroke-width="3.5" stroke-linecap="round"/>

    <!-- Palm Leaves -->
    <path d="M292,138 Q240,102 198,132 Q245,128 292,138 Z" fill="#22C55E"/>
    <path d="M292,138 Q220,126 188,176 Q242,155 292,138 Z" fill="#16A34A"/>
    <path d="M292,138 Q248,158 242,216 Q275,178 292,138 Z" fill="#15803D"/>
    <path d="M295,136 Q268,90 238,94 Q272,112 295,136 Z" fill="#4ADE80"/>
    <path d="M295,136 Q335,84 375,98 Q335,112 295,136 Z" fill="#4ADE80"/>
    <path d="M295,138 Q365,108 405,148 Q352,134 295,138 Z" fill="#22C55E"/>
    <path d="M295,138 Q358,142 388,195 Q342,162 295,138 Z" fill="#16A34A"/>

    <!-- Cyan Water Surface -->
    <ellipse cx="300" cy="272" rx="215" ry="18" fill="#00A8E8"/>
    <ellipse cx="300" cy="288" rx="190" ry="14" fill="#0284C7"/>

    <!-- Golden Sand Island Mound -->
    <path d="M180,272 Q300,224 415,272 Q355,286 300,282 Q235,286 180,272 Z" fill="#FDE047"/>
    <path d="M215,274 Q315,244 415,272 Q355,286 215,274 Z" fill="#F59E0B" opacity="0.65"/>

    <!-- 4-Point Sparkle Stars -->
    <polygon points="102,328 107,341 120,346 107,351 102,364 97,351 84,346 97,341" fill="#FBBF24"/>
    <polygon points="498,328 503,341 516,346 503,351 498,364 493,351 480,346 493,341" fill="#FBBF24"/>

    <!-- Bold 3D "OASIS" Text -->
    <text x="300" y="388" text-anchor="middle" font-family="'Syne', 'Arial Black', sans-serif" font-weight="900" font-size="112" letter-spacing="2" fill="#041022" stroke="#041022" stroke-width="22" stroke-linejoin="round">OASIS</text>
    <text x="300" y="380" text-anchor="middle" font-family="'Syne', 'Arial Black', sans-serif" font-weight="900" font-size="112" letter-spacing="2" fill="url(#oasisTextGrad)" stroke="#0A192F" stroke-width="6">OASIS</text>

    <!-- "- Store -" Script & Horizontal Bars -->
    <rect x="160" y="422" width="42" height="7" rx="3.5" fill="url(#goldGrad)"/>
    <text x="300" y="440" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-style="italic" font-weight="800" font-size="62" fill="url(#goldGrad)">Store</text>
    <rect x="398" y="422" width="42" height="7" rx="3.5" fill="url(#goldGrad)"/>

    <!-- Golden Shopping Cart Icon -->
    <g transform="translate(262, 452)" fill="none" stroke="url(#goldGrad)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2,4 L14,4 L24,36 L58,36 L66,14 L18,14"/>
      <circle cx="28" cy="48" r="5" fill="#F59E0B" stroke="none"/>
      <circle cx="52" cy="48" r="5" fill="#F59E0B" stroke="none"/>
    </g>

    <!-- Bottom Ocean Waves -->
    <path d="M90,445 Q165,455 235,495 Q165,495 110,470 Z" fill="#0088CC"/>
    <path d="M510,445 Q435,455 365,495 Q435,495 490,470 Z" fill="#0088CC"/>
  </g>

  <!-- Outer Glowing Cyan Circular Ring -->
  <circle cx="300" cy="300" r="266" fill="none" stroke="url(#ringGrad)" stroke-width="14"/>
</svg>`;

export const LOGO_BASE64_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(LOGO_SVG)}`;

// Generate the complete Gambar 2 QRIS Poster Data URL (matching the exact uploaded OASIS Store QRIS image)
export async function generateOasisQrisDataUrl(): Promise<string> {
  // Official QRIS string structure for OASIS Store (NMID: ID1026596036610, A01, Printed by 93600915)
  const qrisPayload =
    '00020101021126610014COM.GO-JEK.WWW01189360091532659603660215ID10265960366100303UMI51440014ID.CO.QRIS.WWW0215ID10265960366100303UMI5204581653033605802ID5911OASIS Store6013JAKARTA PUSAT61051011062070703A016304A19B';

  const qrSvgString = await QRCode.toString(qrisPayload, {
    type: 'svg',
    margin: 0,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });

  // Extract inner SVG paths from QRCode output
  const innerPathMatch = qrSvgString.match(/<path[^>]*d="([^"]+)"[^>]*\/>/g);
  const qrPaths = innerPathMatch ? innerPathMatch.join('') : '';
  const viewBoxMatch = qrSvgString.match(/viewBox="([^"]+)"/);
  const qrViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 41 41';

  const fullQrisSheetSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 940" width="680" height="940">
    <!-- White Sheet Background -->
    <rect width="680" height="940" fill="#FFFFFF"/>

    <!-- Subtle Grey Geometric Watermark Pattern -->
    <g fill="#F1F5F9" opacity="0.7">
      <rect x="480" y="110" width="180" height="320" rx="8"/>
      <rect x="20" y="520" width="180" height="360" rx="8"/>
    </g>

    <!-- Left Red Triangle Accent (Official QRIS template) -->
    <polygon points="0,200 165,320 0,515" fill="#E11D2E"/>

    <!-- Bottom-Right Red Polygon Banner -->
    <polygon points="320,940 680,620 680,940" fill="#E11D2E"/>

    <!-- Top-Left QRIS Header Logo -->
    <g transform="translate(42, 42)">
      <path d="M0,18 L0,0 L18,0" fill="none" stroke="#111827" stroke-width="3"/>
      <text x="6" y="38" font-family="'Arial Black', sans-serif" font-weight="900" font-size="40" fill="#111827" letter-spacing="1">QRIS</text>
      <path d="M108,32 L124,32 L124,48" fill="none" stroke="#111827" stroke-width="3"/>
      <text x="128" y="18" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="16" fill="#111827">QR Code Standar</text>
      <text x="128" y="38" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="16" fill="#111827">Pembayaran Nasional</text>
    </g>

    <!-- Top-Right GPN Logo -->
    <g transform="translate(565, 32)">
      <path d="M12,2 C26,12 36,24 44,38 L24,42 C16,28 10,16 12,2 Z" fill="#E11D2E"/>
      <path d="M24,14 C34,22 44,30 52,38 L32,44 Z" fill="#EF4444"/>
      <text x="34" y="72" text-anchor="middle" font-family="'Arial Black', sans-serif" font-weight="900" font-size="28" fill="#0F3D6E">GPN</text>
    </g>

    <!-- Merchant Details: OASIS Store & NMID -->
    <text x="340" y="182" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="38" fill="#111827">OASIS Store</text>
    <text x="340" y="232" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="500" font-size="28" fill="#1F2937">NMID : ID1026596036610</text>
    <text x="340" y="278" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="500" font-size="28" fill="#1F2937">A01</text>

    <!-- QR Code Matrix Container -->
    <rect x="145" y="302" width="390" height="390" fill="#FFFFFF"/>
    <svg x="155" y="312" width="370" height="370" viewBox="${qrViewBox}">
      ${qrPaths}
    </svg>

    <!-- Footer Text Below QR -->
    <text x="340" y="732" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="500" font-size="27" fill="#1F2937">SATU QRIS UNTUK SEMUA</text>
    <text x="340" y="778" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="400" font-size="22" fill="#374151">Cek aplikasi penyelenggara di:</text>
    <text x="340" y="808" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="500" font-size="22" fill="#1F2937">www.aspi-qris.id</text>

    <!-- Bottom-Left Print Metadata -->
    <text x="42" y="892" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="18" fill="#111827">Dicetak oleh: 93600915</text>
    <text x="42" y="916" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="18" fill="#111827">Versi cetak: 1.0.19.09.26</text>

    <!-- Bottom-Right Instructions inside Red Triangle -->
    <text x="582" y="836" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="14" fill="#FFFFFF">Cara bayar dengan QRIS:</text>
    <circle cx="490" cy="872" r="22" fill="#FFFFFF"/>
    <rect x="482" y="858" width="16" height="28" rx="2" fill="none" stroke="#111827" stroke-width="2"/>
    <text x="490" y="908" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#FFFFFF">Buka Aplikasi</text>
    <text x="490" y="921" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#FFFFFF">Berlogo QRIS</text>

    <circle cx="560" cy="872" r="22" fill="#FFFFFF"/>
    <rect x="552" y="858" width="16" height="28" rx="2" fill="none" stroke="#111827" stroke-width="2"/>
    <text x="560" y="908" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#FFFFFF">Scan dan Cek</text>

    <circle cx="630" cy="872" r="22" fill="#FFFFFF"/>
    <rect x="622" y="858" width="16" height="28" rx="2" fill="none" stroke="#111827" stroke-width="2"/>
    <text x="630" y="908" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="11" fill="#FFFFFF">Bayar</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(fullQrisSheetSvg)}`;
}
