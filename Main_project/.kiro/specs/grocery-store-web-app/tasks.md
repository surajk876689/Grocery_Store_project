# Implementation Plan: Grocery Store Web App

## Overview

Implement a full-stack grocery store web application with a FastAPI/SQLite backend and a React 18 + TypeScript frontend. Tasks are ordered so each step builds on the previous, ending with full integration.

## Tasks

- [x] 1. Set up backend project structure and database layer
  - Create `backend/` directory with `database.py`, `models.py`, `schemas.py`, `crud.py`, `main.py`
  - Implement `database.py`: SQLAlchemy engine, `SessionLocal`, `Base`, `get_db` dependency
  - Implement `Item` ORM model in `models.py` (id, name, price, stock)
  - Implement all Pydantic schemas in `schemas.py`: `ItemCreate`, `ItemResponse`, `CheckoutItem`, `CheckoutRequest`, `ReceiptLineItem`, `CheckoutResponse`, `ErrorResponse`
  - Create `backend/seed.py` to populate 100 grocery items on first run
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 2. Implement backend CRUD and API endpoints
  - [x] 2.1 Implement CRUD operations in `crud.py`
    - `get_items(db, search, sort_by, order, page, page_size)` — list with filtering/sorting/pagination
    - `get_item(db, item_id)` — single item fetch
    - `create_item(db, item)` — raises `DuplicateNameError` on conflict
    - `update_item(db, item_id, item)` — raises `ItemNotFoundError` if missing
    - `checkout(db, request)` — transactional stock deduction with row-level lock; raises `StockConflictError` or `EmptyCartError`
    - _Requirements: 2.2, 3.3, 5.1, 6.3_

  - [x] 2.2 Implement FastAPI routes and exception handlers in `main.py`
    - `GET /items`, `POST /items`, `PUT /items/{id}`, `GET /items/{id}`, `POST /checkout`
    - CORS middleware for frontend origin
    - Exception handlers mapping domain errors to structured `{ error_code, message }` JSON responses
    - Global 500 handler for unhandled exceptions
    - _Requirements: 2.2, 3.3, 5.1, 8.3_

  - [ ]* 2.3 Write unit tests for CRUD operations (`backend/tests/test_crud.py`)
    - Test create, read, update with valid inputs
    - Test `DuplicateNameError`, `ItemNotFoundError`, `StockConflictError`, `EmptyCartError`
    - Test partial checkout rollback (no stock deducted when conflict occurs)
    - _Requirements: 2.2, 2.5, 3.3, 5.1, 5.6_

  - [ ]* 2.4 Write unit tests for API routes (`backend/tests/test_routes.py`)
    - Test all endpoints with valid and invalid inputs using `TestClient`
    - Test structured error response shape for each error code
    - _Requirements: 8.3_

- [x] 3. Implement backend property-based tests (`backend/tests/test_properties.py`)
  - [ ]* 3.1 Write property test for add item round-trip
    - **Property 5: Add item persistence round-trip**
    - **Validates: Requirements 2.2, 6.1, 6.3**

  - [ ]* 3.2 Write property test for duplicate name rejection
    - **Property 8: Duplicate item name rejected**
    - **Validates: Requirements 2.5**

  - [ ]* 3.3 Write property test for edit item round-trip
    - **Property 11: Edit item persistence round-trip**
    - **Validates: Requirements 3.3**

  - [ ]* 3.4 Write property test for checkout stock deduction
    - **Property 15: Checkout deducts stock correctly**
    - **Validates: Requirements 5.1**

  - [ ]* 3.5 Write property test for stock conflict at checkout
    - **Property 17: Stock conflict at checkout returns error**
    - **Validates: Requirements 5.6**

  - [ ]* 3.6 Write property test for structured error response
    - **Property 19: API returns structured error on unexpected failure**
    - **Validates: Requirements 8.3**

- [x] 4. Checkpoint — backend complete
  - Run `pytest backend/tests/ -v` and ensure all tests pass. Ask the user if questions arise.

- [x] 5. Set up frontend project structure
  - Scaffold Vite + React 18 + TypeScript project in `frontend/`
  - Install and configure Tailwind CSS, Zustand, Axios, Vitest, fast-check
  - Create directory structure: `src/api/`, `src/components/`, `src/store/`, `src/types/`, `src/tests/`
  - Define all TypeScript interfaces in `src/types/index.ts`: `Item`, `CartItem`, `ReceiptLineItem`, `Receipt`, `SortConfig`
  - Configure Axios base URL and response interceptors (error extraction + loading state clear)
  - _Requirements: 8.1, 8.2, 8.4_

- [x] 6. Implement Zustand stores
  - [x] 6.1 Implement `src/store/inventoryStore.ts`
    - State: `items`, `loading`, `sortConfig`, `searchQuery`, `currentPage`
    - Actions: `fetchItems`, `addItem`, `updateItem`
    - _Requirements: 1.1, 2.6, 3.5_

  - [x] 6.2 Implement `src/store/cartStore.ts`
    - State: `customerName`, `cart`, `total`
    - Actions: `setCustomerName`, `addToCart`, `removeFromCart`, `updateQty`, `clearCart`
    - Pure `cartTotal` function: `cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)`
    - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.8_

  - [x] 6.3 Implement `src/store/notificationStore.ts` and `src/store/loadingStore.ts`
    - Notification store: `message`, `type`, `setError`, `setSuccess`, `clear`
    - Loading store: `isLoading`, `setLoading`
    - _Requirements: 7.4, 8.1, 8.2, 8.4_

  - [ ]* 6.4 Write property test for cart total invariant
    - **Property 14: Cart total invariant**
    - **Validates: Requirements 4.5, 4.6, 4.8**
    - File: `src/tests/properties/cart.test.ts`

- [x] 7. Implement API client functions
  - Create `src/api/items.ts`: `getItems(params)`, `getItem(id)`, `createItem(data)`, `updateItem(id, data)`
  - Create `src/api/checkout.ts`: `postCheckout(request)`
  - Wire Axios interceptors: set `loadingStore.setLoading(true)` on request, `false` on response/error; extract `err.response?.data?.message` for notification
  - _Requirements: 8.1, 8.2, 8.4_

- [x] 8. Implement Inventory page components
  - [x] 8.1 Implement `SearchBar` component with 300ms debounce
    - Controlled input that calls `onSearch` after 300ms idle
    - _Requirements: 1.3_

  - [x] 8.2 Implement `InventoryTable` and `ItemRow` components
    - Sortable column headers (toggle asc/desc via `onSort`)
    - Paginated display (page controls)
    - Low-stock row highlight when `item.stock < 10`
    - Edit button per row triggering `onEdit`
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [x] 8.3 Implement `AddItemModal` component
    - Form fields: name, price (₹), stock
    - Client-side validation: non-empty name, price > 0, stock > 0
    - On submit: call `createItem`, dispatch `addItem` to store, close modal
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6_

  - [x] 8.4 Implement `EditItemModal` component
    - Pre-populate fields from selected `Item`
    - Same validation rules as `AddItemModal`
    - On submit: call `updateItem`, dispatch `updateItem` to store, close modal
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 8.5 Assemble `InventoryPage` wiring all sub-components together
    - Fetch items on mount via `inventoryStore.fetchItems`
    - Pass `sortConfig` and `onSort` to `InventoryTable`
    - Pass `searchQuery` to `SearchBar` and filter items client-side
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ]* 8.6 Write property tests for inventory UI
    - **Property 1: Search filter correctness** — `src/tests/properties/search.test.ts`
    - **Validates: Requirements 1.3, 4.2**
    - **Property 2: Sort ordering correctness** — `src/tests/properties/sort.test.ts`
    - **Validates: Requirements 1.4**
    - **Property 3: Low-stock highlight** — `src/tests/properties/lowstock.test.ts`
    - **Validates: Requirements 1.5**
    - **Property 4: Inventory table renders all item fields** — `src/tests/properties/table.test.ts`
    - **Validates: Requirements 1.1**

  - [ ]* 8.7 Write property tests for validation and form state
    - **Property 6: Empty or whitespace name rejected** — `src/tests/properties/validation.test.ts`
    - **Validates: Requirements 2.3**
    - **Property 7: Non-positive price or stock rejected** — `src/tests/properties/validation.test.ts`
    - **Validates: Requirements 2.4, 3.4**
    - **Property 10: Edit form pre-populated with current values** — `src/tests/properties/editform.test.ts`
    - **Validates: Requirements 3.2**

  - [ ]* 8.8 Write property test for inventory state mutations
    - **Property 9: Inventory state reflects mutations** — `src/tests/properties/store.test.ts`
    - **Validates: Requirements 2.6, 3.5**

- [x] 9. Implement Purchase page components
  - [x] 9.1 Implement `CustomerNameForm` component
    - Text input for customer name; validates non-empty before enabling item search
    - On submit: call `cartStore.setCustomerName`
    - _Requirements: 4.1_

  - [x] 9.2 Implement `ItemSearch` component
    - Search input filtering inventory items by name
    - Display matching items with price and stock
    - Quantity input + "Add to Cart" button per result
    - Validate quantity ≤ available stock before dispatching `addToCart`
    - _Requirements: 4.2, 4.3, 4.4, 4.7_

  - [x] 9.3 Implement `CartItem` and `CartPanel` components
    - `CartItem`: quantity stepper (validates against stock), remove button
    - `CartPanel`: list of `CartItem` components + `CartTotal` showing running total
    - _Requirements: 4.5, 4.6, 4.8_

  - [x] 9.4 Implement `CheckoutButton` and wire `PurchasePage`
    - Disable checkout when cart is empty; show validation message on attempt
    - On checkout: call `postCheckout`, navigate to `ReceiptPage` with receipt data
    - _Requirements: 5.3, 5.5_

  - [ ]* 9.5 Write property tests for cart operations
    - **Property 12: Valid cart addition** — `src/tests/properties/cart.test.ts`
    - **Validates: Requirements 4.3**
    - **Property 13: Over-stock quantity rejected from cart** — `src/tests/properties/cart.test.ts`
    - **Validates: Requirements 4.4**

- [x] 10. Implement Receipt page components
  - [x] 10.1 Implement `ReceiptTable` component
    - Display customer name, line items (name, unit price, qty, line total), grand total
    - _Requirements: 5.2, 5.3_

  - [x] 10.2 Implement `PrintButton` component
    - Button that calls `window.print()`; add `@media print` CSS to hide non-receipt elements
    - _Requirements: 5.4_

  - [x] 10.3 Assemble `ReceiptPage` with `ReceiptTable` and `PrintButton`
    - Receive receipt data from navigation state or store
    - _Requirements: 5.2, 5.3, 5.4_

  - [ ]* 10.4 Write property test for receipt rendering
    - **Property 16: Receipt renders all required fields** — `src/tests/properties/receipt.test.ts`
    - **Validates: Requirements 5.2**

- [x] 11. Implement error handling and accessibility components
  - [x] 11.1 Implement `NotificationBanner` component
    - Renders message from `notificationStore`; wraps in `<div aria-live="polite">`
    - Auto-dismisses after 5 seconds or on manual close
    - _Requirements: 7.4, 8.1, 8.2_

  - [x] 11.2 Implement `LoadingOverlay` or inline loading indicators
    - Reads `loadingStore.isLoading`; shows spinner during pending requests
    - _Requirements: 8.4_

  - [x] 11.3 Audit keyboard navigation and focus indicators across all interactive elements
    - Ensure all buttons, inputs, and table actions are reachable via Tab
    - Add visible `:focus-visible` styles via Tailwind `ring` utilities
    - _Requirements: 7.2, 7.3_

  - [ ]* 11.4 Write property tests for error display and loading state
    - **Property 18: API error message displayed to user** — `src/tests/properties/errors.test.ts`
    - **Validates: Requirements 8.1**
    - **Property 20: Loading state active during pending requests** — `src/tests/properties/loading.test.ts`
    - **Validates: Requirements 8.4**

- [x] 12. Wire application routing and final integration
  - Set up React Router with routes: `/inventory`, `/purchase`, `/receipt`
  - Add navigation bar linking all three pages
  - Ensure `NotificationBanner` and `LoadingOverlay` are mounted at app root
  - Verify responsive layout renders correctly at 320px and 2560px widths (Tailwind breakpoints)
  - _Requirements: 7.1, 7.2_

- [x] 13. Final checkpoint — full stack integration
  - Run `pytest backend/tests/ -v` and `vitest run` and ensure all tests pass. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests reference design document property numbers for direct traceability
- Backend property tests use `pytest + Hypothesis`; frontend property tests use `Vitest + fast-check`
- Checkpoints at tasks 4 and 13 validate incremental progress
