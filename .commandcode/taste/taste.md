# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# documentation
- In AGENTS.md, only include stable project information — avoid adding transient details like the current working branch. Confidence: 0.65

# api
- Use Axios for HTTP API client with a base instance setup. Confidence: 0.50

# backend
- When OpenAPI spec and existing backend implementation conflict, follow the existing backend code. Confidence: 0.65

# workflow
- Lakukan implementasi secara bertahap (incremental), jangan sekaligus semua. Confidence: 0.85
- Saat wiring halaman ke API, selalu unwrap response dengan `.then(res => res.data)` karena backend membungkus data dalam `{ message, data }`. Confidence: 0.70
- Setelah wiring setiap modul (UMKM, Pengumuman, Laporan, dsb.), verifikasi dengan `npm run build -w apps/web 2>&1`. Confidence: 0.65

# api
- Use Axios for HTTP API client with a base instance setup. Confidence: 0.50
- Buat file API module terpisah per domain (misal: `businesses.api.js`, `announcements.api.js`, `dues.api.js`) yang mengekspor named functions. Confidence: 0.65

# backend
- When OpenAPI spec and existing backend implementation conflict, follow the existing backend code. Confidence: 0.65
- Backend field names in JSON responses use snake_case. Always read the backend repository/service for exact field names before wiring frontend. Confidence: 0.70

