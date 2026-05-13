// client/src/vite-env.d.ts
/// <reference types="vite/client" />
/// <reference path="./types/assets.d.ts" />s
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}