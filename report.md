### Code Review & Analysis

#### What was done well (Good Architecture):
- **Performance Optimization**: Efficient use of `useMemo` for computation-intensive functions (e.g., enriching store data and managing complex lookups).
- **Data Management**: Use of a custom hook (`useLibraryData`) to centralize data fetching and processing, keeping components clean.
- **Component Structure**: Clean separation of UI elements like `Modal`, `Header`, and table components.

#### What could be improved (Bugs & Architecture):
- **Duplicate Inventory Entries**: The "Add to Inventory" logic does not check if a book already exists in the store before adding it, allowing duplicates.

#### Summary of implemented changes:
- Created the inventory page with proper navigation using the `storeId` parameter.
- Displayed specific store columns including the inline "Price" edit.
- Added conditional re-rendering in the books table component to separate the display of data in inventory and data in the books page.
- Implemented the 'add new book to the inventory' feature via a custom Modal.
- Integrated delete logic for removing books from a specific store.