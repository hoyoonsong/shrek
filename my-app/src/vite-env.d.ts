/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Get a key at https://web3forms.com — register with hoyoon@stanford.edu to receive submissions */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
