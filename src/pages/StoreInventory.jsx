// src/pages/Inventory.jsx
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Header from '../components/Header';
import BooksTable from '../components/BooksTable';
import useLibraryData from '../hooks/useLibraryData';

const Inventory = () => {
  const view = 'books';
  const { storeId } = useParams();

  // State for UI
  const [activeTab, setActiveTab] = useState('books');
  const [showModal, setShowModal] = useState(false);
  const { storeBooks, authors, setBooks, setInventory, books, authorMap } = useLibraryData({ storeId });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [editingRowId, setEditingRowId] = useState(null);
  const [editName, setEditName] = useState('');
  const viewedData = activeTab === 'books' ? storeBooks : authors;

  const [inputBookId, setInputBookId] = useState('');
  const [inputPrice, setInputPrice] = useState('');

  // Sync search term with URL params
    useEffect(() => {
      const search = searchParams.get('search') || '';
      setSearchTerm(search);
    }, [searchParams]);

  // Set active tab based on view query param
  useEffect(() => {
    if (view === 'authors' || view === 'books') {
      setActiveTab(view);
    }
  }, [view]);

  const filteredBooks = viewedData.filter((item) => {
    if (!searchTerm.trim()) return true;
    const searchTarget = activeTab === 'books' 
     ? { ...item, author_name: authorMap[item.author_id]?.name || 'Unknown Author' } 
     : item;
    return Object.values(searchTarget).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleBooksTab = () => {
    setActiveTab('books');
  };

  const handleAuthorsTab = () => {
    setActiveTab('authors');
  };

  // Modal controls
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
  };

  // function to handle adding a book to the store inventory
  const handleAddBookToInventory = () => {
    if (!inputBookId || !inputPrice) {
      alert('Please select a book and enter a price');
      return;
    }

    if (typeof setInventory === 'function') {
      setInventory((prevInventory) => [
        ...prevInventory,
        { 
          store_id: parseInt(storeId, 10), 
          book_id: parseInt(inputBookId, 10), 
          price: parseFloat(inputPrice) || 0 
        },
      ]);
      closeModal();
    }
  };

  const deleteBook = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setInventory((prevInventory) => 
        prevInventory.filter((item) => !(item.book_id === id && item.store_id === parseInt(storeId, 10)))
      );
      setEditingRowId(null);
      setEditName('');
    }
  };

  return (
    <div className="py-6">
      <div className="flex mb-4 w-full justify-center items-center">
        <button
          onClick={handleBooksTab}
          className={`px-4 border-b-2 py-2 ${activeTab === 'books' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Books
        </button>
        <button
          onClick={handleAuthorsTab}
          className={`px-4 border-b-2 py-2 ${activeTab === 'authors' ? 'border-b-main' : 'border-b-transparent'}`}
        >
          Authors
        </button>
      </div>

      <Header addNew={openModal} title={`Store Inventory`} buttonTitle="Add to inventory" />

      {activeTab === 'books' ? (
        (filteredBooks.length > 0 ? (
          <BooksTable
            books={filteredBooks}
            authors={authors}
            editingRowId={editingRowId}
            setEditingRowId={setEditingRowId}
            editName={editName}
            setEditName={setEditName}
            setBooks={setBooks}
            setInventory={setInventory}
            isInventory={true}
            deleteBook={deleteBook}
          />
        ) : (
          <p className="text-gray-600">No books found in this store.</p>
        ))
      ) : (
        <p className="text-gray-600">No authors with books in this store.</p>
      )}

      <Modal
        title="Add/Edit Book in Store"
        save={handleAddBookToInventory}
        cancel={closeModal}
        show={showModal}
        setShow={setShowModal}
      >
        <div className="flex flex-col gap-4 w-full">
          <div>
            <label htmlFor="book_select" className="block text-gray-700 font-medium mb-1">
              Select Book
            </label>
            <select
              id="book_select"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputBookId}
              onChange={(e) => setInputBookId(e.target.value)}
            >
              <option value="">Select a book</option>
              {books.slice(0, 7).map((book) => (
                <option key={book.id} value={book.id}>
                  {book.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="text"
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter Price (e.g., 29.99)"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;