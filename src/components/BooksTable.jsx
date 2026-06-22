// src/components/BooksTable.jsx
import React, { useMemo } from 'react';
import Table from './Table/Table';
import TableActions from './ActionButton/TableActions';

const BooksTable = ({
  books,
  authors,
  editingRowId,
  setEditingRowId,
  editName,
  setEditName,
  setBooks,
  setInventory,
  isInventory,
  deleteBook,
  columnsConfig = ['id', 'name', 'pages', 'author', 'price', 'actions'], // Default columns
}) => {
  // Create a lookup map for authors
  const authorMap = useMemo(() => {
    return authors.reduce((map, author) => {
      map[author.id] = `${author.first_name} ${author.last_name}`;
      return map;
    }, {});
  }, [authors]);

  // Enrich books with author names
  const enrichedBooks = useMemo(() => {
    return books.map((book) => {
      const author_name = authorMap[book.author_id] || 'Unknown Author';
      
      // Only format price if it exists and we are in inventory view
      const price = isInventory && book.price !== undefined 
        ? Number(book.price).toFixed(2) 
        : undefined;

      return {
        ...book,
        author_name,
        ...(isInventory && { price }), // Only add price property if in inventory
      };
    });
  }, [books, authorMap, isInventory]);

  // Define all possible columns
  const allColumns = useMemo(
    () => ({
      id: { header: 'Book Id', accessorKey: 'id' },
      name: {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(row.original.id);
                if (e.key === 'Escape') handleCancel();
              }}
              className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            row.original.name
          ),
      },
      pages: { header: 'Pages', accessorKey: 'page_count' },
      author: { header: 'Author', accessorKey: 'author_name' },
      price: {
        header: 'Price',
        accessorKey: 'price',
        cell: ({ row }) =>
          editingRowId === row.original.id ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave(row.original.id);
                if (e.key === 'Escape') handleCancel();
              }}
              className="border border-gray-300 rounded p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            row.original.price
          ),
      },
      actions: {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <TableActions
            row={row}
            onEdit={
              editingRowId === row.original.id
                ? handleCancel
                : () => handleEdit(row.original)
            }
            onDelete={() => deleteBook(row.original.id, row.original.name)}
          />
        ),
      },
    }),
    [editingRowId, editName]
  );

  // Select columns based on columnsConfig
  const columns = useMemo(() => {
    return columnsConfig
      .filter((colKey) => {
        if (colKey === 'price' && !isInventory) return false;
        return true;
      })
      .map((colKey) => allColumns[colKey])
      .filter(Boolean);
  }, [columnsConfig, allColumns, isInventory]);

  // Handle editing
  const handleEdit = (book) => {
    setEditingRowId(book.id);
    setEditName(isInventory ? book.price : book.name);
  };

  // Save edited name
  const handleSave = (id) => {
    if (isInventory) {
      // Update Books State if books array contains the price in this view
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? { ...book, price: editName } : book
        )
      );
      
      if (typeof setInventory === 'function') {
        setInventory((prevInventory) =>
          prevInventory.map((item) =>
            item.book_id === id
              ? { ...item, price: parseFloat(editName) || 0 }
              : item
          )
        );
      }
    }
    else {
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === id ? { ...book, name: editName } : book
        )
      );
    }
    setEditingRowId(null);
    setEditName('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingRowId(null);
    setEditName('');
  };

  return <Table data={enrichedBooks} columns={columns} />;
};

export default BooksTable;