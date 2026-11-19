import type { PrimeNGConfigType } from 'primeng/config';

// Above custom drawers (1005), mobile filters (2001), and the mobile header (3000).
export const primengOverlayConfig = {
  overlayAppendTo: 'body',
  zIndex: {
    modal: 4000,
    overlay: 4100,
    menu: 4100,
    tooltip: 4200,
  },
} satisfies PrimeNGConfigType;
