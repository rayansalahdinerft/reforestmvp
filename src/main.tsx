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

const bootstrap = async () => {
  const { default: App } = await import("./App.tsx");
  createRoot(document.getElementById("root")!).render(<App />);
};

void bootstrap();
