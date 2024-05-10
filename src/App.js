import React, { useState, useEffect, useMemo, useCallback } from "react";

const fetchData = async (page = 1, limit = 10) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`
  );
  const data = await response.json();
  return data;
};

const heavyComputation = (item) => {
  // Simulating heavy computation with a timeout
  const startTime = performance.now();
  // Actual heavy computation logic can go here
  const computedDetails = `${item.title} - Computed details`;
  const endTime = performance.now();
  console.log(`Heavy computation took ${endTime - startTime} milliseconds`);
  return computedDetails;
};

const ItemDetails = ({ item, onItemClick }) => {
  const handleClick = useCallback(() => {
    onItemClick(item.id);
  }, [item.id, onItemClick]);

  // Log when the component re-renders due to prop changes
  useEffect(() => {
    console.log("ItemDetails component re-rendered");
  }, [item]);

  return (
    <div>
      <h3>{item.title}</h3>
      <button onClick={handleClick} style={{ marginBottom: "20px" }}>
        Show Details
      </button>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData(currentPage).then((result) => setData(result));
  }, [currentPage]);

  const computedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      details: heavyComputation(item),
    }));
  }, [data]);

  const handleItemClick = useCallback((itemId) => {
    setSelectedItem(itemId);
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div>
      <h1>List of Items</h1>
      <ul>
        {computedData.map((item) => (
          <li key={item.id}>
            {item.id} - {item.title}
            {selectedItem === item.id && (
              <div
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  color: "black",
                  border: "1px solid gray",
                  padding: "0.5rem",
                  borderRadius: "5px",
                }}
              >
                Details:
                {selectedItem === item.id && (
                  <span
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      color: "gray",
                      marginLeft: "20px",
                    }}
                  >
                    {item.details}
                  </span>
                )}
              </div>
            )}
            <ItemDetails item={item} onItemClick={handleItemClick} />
          </li>
        ))}
      </ul>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default App;
