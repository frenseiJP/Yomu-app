import { useCallback, useRef } from "react";

/**
 * Japanese IME: Enter during composition confirms conversion; Enter after sends.
 * Half-width direct input still sends on a single Enter.
 */
export function useChatInputIme() {
  const composingRef = useRef(false);

  const onCompositionStart = useCallback(() => {
    composingRef.current = true;
  }, []);

  const onCompositionEnd = useCallback(() => {
    composingRef.current = false;
  }, []);

  const handleEnterKeyDown = useCallback(
    (e: React.KeyboardEvent, onSubmit: () => void) => {
      if (e.key !== "Enter" || e.shiftKey) return;
      // IME 変換中・確定 Enter（keyCode 229 on some platforms）
      if (
        e.nativeEvent.isComposing ||
        composingRef.current ||
        e.keyCode === 229
      ) {
        return;
      }
      e.preventDefault();
      onSubmit();
    },
    [],
  );

  return {
    onCompositionStart,
    onCompositionEnd,
    handleEnterKeyDown,
  };
}
