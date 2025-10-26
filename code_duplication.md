Code Duplication Review Summary

I found 10 major areas of repeated logic beyond the date formatting functions we just consolidated:

High Priority (Should Extract)
Event Details Display Card - Repeated in 3 files (~170 lines)
Pattern: Similar grid layout for showing event properties
Solution: Create EventDetailsCard component with isEditable prop

Medium Priority (Good to Extract)
Empty State Template - Repeated in 3 files
Pattern: "No events found" messaging
Solution: Create EmptyEventState component
Event Selector Dropdown - Repeated in 3 files
Pattern: Identical dropdown with same styling
Solution: Create EventSelector component
Server Action Error Handling - Repeated in 3 files
Pattern: Try-catch with console.error and error response
Solution: Create error handling wrapper utility
Event ID Validation - Repeated in 2 files
Pattern: Checking for missing eventId
Solution: Create validateEventExists utility
Lower Priority
Revalidation Calls - Common paths revalidated
Input Field Styling - Repeated className strings (could use shadcn Input component)
Toast Error Handling - Similar patterns across components
Data Transformation - Firestore ↔ Event type conversions
Estimated Impact
Consolidating these patterns would eliminate approximately 395+ lines of duplicated code and make the codebase much more maintainable. Would you like me to proceed with extracting any of these patterns? I'd recommend starting with the high-priority items (EventDetailsCard and useEventSelection hook) as they provide the most value.
