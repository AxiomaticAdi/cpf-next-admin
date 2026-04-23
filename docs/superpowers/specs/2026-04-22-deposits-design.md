# Deposits Feature Design

**Date:** 2026-04-22  
**Status:** Approved

## Overview

Allow admins to configure an optional deposit amount on events. Instead of paying the full ticket price upfront, customers pay a fixed deposit and settle the remainder at the event. This is configured per-event in the admin tool and stored in Firestore for the customer-facing app to read.

## Data Model

Add one optional field to both types in `types.ts`:

```ts
// FirebaseEventsDocument
DepositPrice?: number;  // absent = no deposit configured

// Event
depositPrice?: number;  // absent = no deposit configured
```

`DepositPrice` is stored as the final price (tax already applied, if applicable), exactly like `Price`. When deposits are disabled, the field is absent from the Firestore document entirely — not zero, not null, just absent.

## Form UI (Create & Modify)

Both forms get an identical deposit UI block placed below the existing sales tax checkbox:

- **"Enable deposit" checkbox** — when checked, reveals a "Deposit Amount ($)" number input
- **Tax preview** — if `addSalesTax` is also checked, the label shows the calculated final deposit amount in real-time, mirroring the existing price tax preview pattern
- **Disabling** — unchecking "Enable deposit" hides the input and clears the deposit value

**Create Event form:**
- `formData` gains a `depositPrice: string` field (empty string = no deposit)
- A `depositEnabled: boolean` controls the checkbox state
- The copy-from-existing-event flow reverse-calculates the base deposit (`event.depositPrice / (1 + SALES_TAX)`) and populates the deposit input, same as it does for the main price — so sales tax is not double-applied

**Modify Event form:**
- Deposit fields pre-populated from the existing event's `depositPrice` (if any)
- Same toggle + amount input as Create

**Preview dialog:**
- Shows "Deposit price: $X" alongside the full price when a deposit is configured

## Server Actions

**`create-event.ts`:**
- `CreateEventFormData` gains `depositPrice: string` (empty = no deposit)
- Applies sales tax to deposit amount using the same logic as the main price when `addSalesTax` is true
- Writes `DepositPrice` to Firestore only when a valid positive value is present

**`update-event.ts`:**
- Passes `depositPrice` from the `Event` object to Firestore as `DepositPrice`
- When `depositPrice` is undefined, uses `FieldValue.delete()` to remove any stale `DepositPrice` from the document

**`validate-event.ts`:**
- Adds one rule: if `depositPrice` is defined, it must satisfy `0 < depositPrice < price`

**`fetch-events.ts`:**
- Add `depositPrice: doc.DepositPrice` to the Firestore → `Event` mapping (undefined when field is absent)

**No changes needed to:**
- `delete-event.ts` — deletion doesn't care about field presence

## View All Events Display

The event detail card always shows both rows:

| Label | Value |
|---|---|
| Deposit price | $XX.XX or N/A |
| Full price | $XX.XX |

The existing "Price, including sales tax" row is replaced by these two rows. When no deposit is configured, "Deposit price" shows "N/A" and "Full price" shows the ticket price as before.
