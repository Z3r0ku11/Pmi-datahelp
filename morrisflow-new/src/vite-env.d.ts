/// <reference types="vite/client" />

declare const __BUILD_TIME__: string;

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_FRAMEWORK_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_MORRIS_FRAMEWORK: string
  readonly VITE_ENABLE_PMI_PORTAL: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_WORKFLOWS: string
  readonly VITE_MOCK_DATA: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_BRAND_PRIMARY_COLOR: string
  readonly VITE_BRAND_SECONDARY_COLOR: string
  readonly VITE_BRAND_ACCENT_COLOR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}