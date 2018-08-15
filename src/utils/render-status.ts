/**
 * Modularized version of the Polymer.RenderStatus utility.
 */
const afterRenderQueue: any[] = [];
const beforeRenderQueue: any[] = [];
let scheduled = false;

function schedule() {
  scheduled = true;
  // before next render
  requestAnimationFrame(() => {
    scheduled = false;
    flushQueue(beforeRenderQueue);
    // after the render
    setTimeout(() => {
      runQueue(afterRenderQueue);
    });
  });
}

function flushQueue(queue: any[]) {
  while (queue.length) {
    callMethod(queue.shift());
  }
}

function runQueue(queue: any[]) {
  let i = 0;
  const l = queue.length;
  for (; i < l; i++) {
    callMethod(queue.shift());
  }
}

function callMethod(info) {
  const context = info[0];
  const callback = info[1];
  const args = info[2];
  try {
    callback.apply(context, args);
  } catch (e) {
    setTimeout(() => {
      throw e;
    });
  }
}

/**
 * Forces the queu to run immediately.
 */
function flush() {
  while (beforeRenderQueue.length || afterRenderQueue.length) {
    flushQueue(beforeRenderQueue);
    flushQueue(afterRenderQueue);
  }
  scheduled = false;
}

/**
 * Enqueues a callback which will be run before the next render, at
 * `requestAnimationFrame` timing.
 *
 * This method is useful for enqueuing work that requires DOM measurement,
 * since measurement may not be reliable in custom element callbacks before
 * the first render, as well as for batching measurement tasks in general.
 *
 * Tasks in this queue may be flushed by calling `RenderStatus.flush()`.
 */
function beforeNextRender(context: any, callback: Function, ...args: any[]) {
  if (!scheduled) {
    schedule();
  }
  beforeRenderQueue.push([context, callback, args]);
}

/**
 * Enqueues a callback which will be run after the next render, equivalent
 * to one task (`setTimeout`) after the next `requestAnimationFrame`.
 *
 * This method is useful for tuning the first-render performance of an
 * element or application by deferring non-critical work until after the
 * first paint.  Typical non-render-critical work may include adding UI
 * event listeners and aria attributes.
 *
 * Tasks in this queue may be flushed by calling `RenderStatus.flush()`.
 */
function afterNextRender(context: any, callback: Function, ...args: any[]) {
  if (!scheduled) {
    schedule();
  }
  afterRenderQueue.push([context, callback, args]);
}

export { afterNextRender, beforeNextRender, flush };
