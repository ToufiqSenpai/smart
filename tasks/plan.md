# Implementation Plan: Extract Reusable UI Components

## Overview
This plan outlines the steps to extract heavily duplicated UI components across the `apps/web/src/routes` directory into reusable components in `apps/web/src/components`. Our scan found several identical inline components—such as Toast alerts, Modals, File Uploaders, and common layout elements—repeated across up to 11 different route files. Extracting these will reduce file sizes, standardize the UI, and improve maintainability.

## Architecture Decisions
- **Component Location**: All extracted components will be placed in `apps/web/src/components/ui/` (or similar standard component folder).
- **Styling**: We will preserve the existing Tailwind CSS v4 styling (colors, rounded borders, shadows, animations).
- **Props Design**: Components will be built with flexible React props (e.g., `children`, `isOpen`, `onClose`, `onFileDrop`) to support the varying contexts in which they are used.

## Task List

### Phase 1: Foundation (Global Utilities & Simple Components)
- [ ] Task 1: Create a reusable `Toast` component (used in 11 files). It should accept `message`, `isVisible`, and `onClose` props.
- [ ] Task 2: Create a reusable `PageHeader` component to standardize page titles and optional action buttons.
- [ ] Task 3: Create a reusable `EmptyState` component for lists that have no items.

### Checkpoint: Foundation
- [ ] Components are built and verified with basic mock data/storyboards (if any).
- [ ] Application builds without errors.

### Phase 2: Complex Interactive Components
- [ ] Task 4: Create a reusable `Modal` wrapper component (used in 8 instances). Must support `isOpen`, `onClose`, `title`, and `children` for the modal body.
- [ ] Task 5: Create a reusable `FileUploader` (Dropzone) component (used in 3 files). Must manage drag-and-drop state internally and expose an `onFileSelected(file: File)` callback.
- [ ] Task 6: Create generic form components (`Input`, `Select`, `Textarea`) based on the common Tailwind classes found in the routes.

### Checkpoint: Core Features
- [ ] All complex components handle edge cases (e.g., file size limits, modal backdrop clicks).
- [ ] Build succeeds.

### Phase 3: Integration (Route Refactoring)
- [ ] Task 7: Refactor `_dashboard.complaints.index.tsx` and `_dashboard.complaints.warga.tsx` to use the new reusable components.
- [ ] Task 8: Refactor `_dashboard.marketplace.index.tsx` and `_dashboard.marketplace.validasi.tsx` to use the new reusable components.
- [ ] Task 9: Refactor `_dashboard.contributions.*` to use the new reusable components.
- [ ] Task 10: Refactor remaining route files (Announcements, Profile, Residents) to use the new reusable components.

### Checkpoint: Complete
- [ ] All routes have been refactored.
- [ ] `npm run build` succeeds.
- [ ] End-to-end functionality (forms, modals, toast) works properly in the frontend.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| State management issues during refactor | High | Test each route individually after replacing inline components. Ensure state variables (like `toastMessage` or `isModalOpen`) map correctly to component props. |
| Styling regressions | Medium | Extract the exact Tailwind classes currently used. Do not alter the design aesthetics. |

## Open Questions
- Should the `Toast` component remain a state-driven component in each route, or should we migrate to a global toast provider context/library (e.g., Sonner)?
- Should `FileUploader` handle the `FileReader` base64 preview generation internally or pass the raw `File` to the parent?
