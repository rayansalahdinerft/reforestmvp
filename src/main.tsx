import { createRoot } from "react-dom/client";
import { Buffer } from "buffer";
import process from "process";
import "./index.css";

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

// Patch process.nextTick for Web3Auth's stream dependencies
if (globalForPolyfills.process && typeof globalForPolyfills.process.nextTick !== 'function') {
  (globalForPolyfills.process as any).nextTick = (fn: (...args: any[]) => void, ...args: any[]) => {
    setTimeout(() => fn(...args), 0);
  };
}

const bootstrap = async () => {
  const { default: App } = await import("./App.tsx");
  createRoot(document.getElementById("root")!).render(<App />);
};

void bootstrap();
