# SSR render errors are dropped silently in production (not logged, never passed to `next`)

1. `pnpm install && pnpm preview` (production build)
2. Open the preview URL. The page is Qwik's "500 Internal Server Error" page, served with HTTP 200.
3. Look at the terminal: nothing is logged.

`src/routes/index.tsx` renders a component that throws:

```tsx
const Broken = component$(() => {
  throw new Error("render failed");
});
```

In `@qwik.dev/router/middleware/node`, the error from rendering is checked only after `headersSent`, and streaming SSR has always sent the headers by then:

```ts
const err = await handled.completion;
if (handled.requestEv.headersSent) {
  return;
}
if (err) {
  throw err; // → console.error(e); next(e)
}
```

So the error is never logged and never reaches `next(err)`, where adapters hook error reporting (Sentry etc.). 1.x checked `err` first. Swapping the two checks back in the built `server/entry.preview.js` logs `Error: render failed` with its stack.

The order changed in 375559368 "fix: honor node streaming backpressure" (#8557, first in `@qwik.dev/router` 2.0.0-beta.34).

Version: 2.0.0-rc.4 (first reported on 2.0.0-rc.2).
