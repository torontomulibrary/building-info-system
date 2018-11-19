import createFocusTrap, { FocusTrap } from 'focus-trap';

/**
 * Create a new instance of a `FocusTrap` with specific options preset.
 *
 * @param surfaceEl The element that will serve to trap focus.
 * @param focusTrapFactory A function that when called, creates a `FocusTrap`.
 * @returns An instance of `FocusTrap`.
 */
function createFocusTrapInstance(surfaceEl, focusTrapFactory = createFocusTrap): FocusTrap {
  return focusTrapFactory(surfaceEl, {
    clickOutsideDeactivates: true,
    initialFocus: undefined, // Sheet handles focusing active item.
    escapeDeactivates: false, // Sheet handles ESC.
    returnFocusOnDeactivate: false, // Sheet handles restore focus.
  });
}

export { createFocusTrapInstance };
