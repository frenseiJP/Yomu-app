/** Shared responsive layout class fragments (Tailwind). */
export const pagePaddingX = "px-4 sm:px-6 lg:px-8";
export const pagePaddingY = "py-4 sm:py-6 lg:py-8";
export const pageBottomNavPad = "pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-28";

/** Centers scrollable view content on desktop within the app shell. */
export const shellViewFrame =
  "mx-auto flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto";
export const shellNarrow = "max-w-xl sm:max-w-2xl lg:max-w-3xl";
export const shellStandard = "max-w-3xl lg:max-w-4xl";
export const shellWide = "max-w-5xl";

/** Home: full-width scroll area; column width is set on the inner stack. */
export const homeScrollArea = `${shellViewFrame} ${pagePaddingX} py-4 sm:py-6 lg:py-10`;
export const homeStack =
  "mx-auto flex w-full max-w-[min(100%,28rem)] flex-col gap-3 sm:max-w-lg sm:gap-4 lg:max-w-2xl lg:gap-5 xl:max-w-3xl";
export const homeCard =
  "w-full rounded-2xl border p-4 shadow-glass sm:p-5";
export const homeCardDark = "border-slate-800/70 bg-slate-950/80";
export const homeCardLight = "border-neutral-200 bg-white shadow-sm";
export const homeMissionGrid = "grid w-full gap-3 sm:gap-4 lg:grid-cols-2 lg:gap-4";

export const contentMaxHome = `mx-auto w-full ${shellWide}`;
export const contentMaxChat = "mx-auto w-full max-w-3xl lg:max-w-[56rem]";
export const contentMaxStandard = `mx-auto w-full ${shellStandard}`;
export const contentMaxWide = `mx-auto w-full ${shellWide}`;
