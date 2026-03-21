import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
import process from "process";
import "./index.css";

// Patch process.nextTick BEFORE anything else
if (typeof process.nextTick !== 'function') {
  (process as any).nextTick = (fn: (...args: any[]) => void, ...args: any[]) => {
    Promise.resolve().then(() => fn(...args));
  };
}

const globalForPolyfills = globalThis as typeof globalThis & {
  Buffer?: typeof Buffer;
  process?: typeof process;
  global?: typeof globalThis;
};

if (!globalForPolyfills.global) {
  globalForPolyfills.global = globalThis;
}
if (!globalForPolyfills.Buffer) {
  globalForPolyfills.Buffer = Buffer;
}
if (!globalForPolyfills.process) {
  globalForPolyfills.process = process;
}

// Ensure global process also has nextTick
if (globalForPolyfills.process && typeof globalForPolyfills.process.nextTick !== 'function') {
  (globalForPolyfills.process as any).nextTick = (fn: (...args: any[]) => void, ...args: any[]) => {
    Promise.resolve().then(() => fn(...args));
  };
}

const bootstrap = async () => {
  const { default: App } = await import("./App.tsx");
  createRoot(document.getElementById("root")!).render(<App />);
};

void bootstrap();
