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

export const contentMaxHome = `mx-auto w-full ${shellWide}`;
export const contentMaxChat = "mx-auto w-full max-w-3xl lg:max-w-[56rem]";
export const contentMaxStandard = `mx-auto w-full ${shellStandard}`;
export const contentMaxWide = `mx-auto w-full ${shellWide}`;
