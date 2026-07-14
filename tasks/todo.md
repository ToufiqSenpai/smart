## Task 1: Create a reusable `Toast` component
**Description:** Extract the fixed position toast alert found in 11 route files into a reusable UI component.
**Acceptance criteria:**
- [ ] Component accepts `message` (string), `isVisible` (boolean), and `onClose` (function) props.
- [ ] Component renders with the exact same Tailwind classes (bg-[#0047cc], animations, etc.).
- [ ] Component handles its own entrance/exit animations properly.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** None
**Files likely touched:** `apps/web/src/components/ui/Toast.tsx`
**Estimated scope:** XS

## Task 2: Create a reusable `PageHeader` component
**Description:** Standardize the page titles and action headers found across dashboard routes.
**Acceptance criteria:**
- [ ] Component accepts `title` (string), `subtitle` (optional string), and `actions` (optional ReactNode) props.
- [ ] Preserves the `text-[#0047cc] tracking-tight` styling.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** None
**Files likely touched:** `apps/web/src/components/ui/PageHeader.tsx`
**Estimated scope:** XS

## Task 3: Create a reusable `EmptyState` component
**Description:** Standardize the empty state UI shown when a list has no items.
**Acceptance criteria:**
- [ ] Component accepts `icon`, `title`, and `description` props.
- [ ] Preserves the exact styling from the marketplace empty state.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** None
**Files likely touched:** `apps/web/src/components/ui/EmptyState.tsx`
**Estimated scope:** XS

## Checkpoint: Foundation
- [ ] Components are built and verified.
- [ ] Application builds without errors.

## Task 4: Create a reusable `Modal` wrapper component
**Description:** Extract the duplicated modal wrapper into a reusable component.
**Acceptance criteria:**
- [ ] Component accepts `isOpen`, `onClose`, `title`, and `children` props.
- [ ] Includes the backdrop (`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm`).
- [ ] Includes the modal window, header with title, and close button.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** None
**Files likely touched:** `apps/web/src/components/ui/Modal.tsx`
**Estimated scope:** S

## Task 5: Create a reusable `FileUploader` component
**Description:** Extract the drag-and-drop file uploader area used in complaints and marketplace.
**Acceptance criteria:**
- [ ] Component manages `isDragging` state internally.
- [ ] Component accepts `onFileSelected(file: File)` callback.
- [ ] Component manages or accepts preview URL state to display selected image.
- [ ] Component enforces the 5MB size limit.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** None
**Files likely touched:** `apps/web/src/components/ui/FileUploader.tsx`
**Estimated scope:** S

## Task 6: Create generic form components (Input, Select, Textarea)
**Description:** Extract the common styling for form inputs into reusable components.
**Acceptance criteria:**
- [ ] Components accept standard HTML attributes and a `label` prop.
- [ ] Standardizes the `bg-slate-50 hover:bg-slate-100/30 border-slate-200/80 focus:border-[#0047cc]` styles.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** None
**Files likely touched:** 
- `apps/web/src/components/ui/Input.tsx`
- `apps/web/src/components/ui/Select.tsx`
- `apps/web/src/components/ui/Textarea.tsx`
**Estimated scope:** M

## Checkpoint: Core Features
- [ ] All complex components handle edge cases.
- [ ] Build succeeds.

## Task 7: Refactor Complaints routes
**Description:** Update the complaints routes to use the new UI components.
**Acceptance criteria:**
- [ ] Replace inline Toast, FileUploader, Inputs, and Selects in `_dashboard.complaints.index.tsx` and `_dashboard.complaints.warga.tsx`.
- [ ] Form submission still works properly.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** Tasks 1-6
**Files likely touched:** 
- `apps/web/src/routes/_dashboard.complaints.index.tsx`
- `apps/web/src/routes/_dashboard.complaints.warga.tsx`
**Estimated scope:** S

## Task 8: Refactor Marketplace routes
**Description:** Update the marketplace routes to use the new UI components.
**Acceptance criteria:**
- [ ] Replace inline Toast, Modal, FileUploader, Inputs, and Selects in `_dashboard.marketplace.index.tsx` and `_dashboard.marketplace.validasi.tsx`.
- [ ] Registration modal works.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** Tasks 1-6
**Files likely touched:** 
- `apps/web/src/routes/_dashboard.marketplace.index.tsx`
- `apps/web/src/routes/_dashboard.marketplace.validasi.tsx`
**Estimated scope:** S

## Task 9: Refactor Contributions routes
**Description:** Update the contributions routes to use the new UI components.
**Acceptance criteria:**
- [ ] Replace inline Toast and Modals in the contributions routes.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** Tasks 1-6
**Files likely touched:** 
- `apps/web/src/routes/_dashboard.contributions.index.tsx`
- `apps/web/src/routes/_dashboard.contributions.kelola.tsx`
- `apps/web/src/routes/_dashboard.contributions.pengeluaran.tsx`
**Estimated scope:** S

## Task 10: Refactor remaining routes
**Description:** Update Announcements, Profile, and Residents routes to use the new UI components.
**Acceptance criteria:**
- [ ] Replace inline Toast and other duplicated components in the remaining files.
**Verification:**
- [ ] Build succeeds: `npm run build -w apps/web`
**Dependencies:** Tasks 1-6
**Files likely touched:** remaining `_dashboard.*.tsx` files
**Estimated scope:** M

## Checkpoint: Complete
- [ ] All routes refactored.
- [ ] Application builds without errors.
- [ ] End-to-end functionality verified.
