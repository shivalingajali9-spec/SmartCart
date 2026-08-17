import { createContext, useState, useContext } from 'react';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  const addToCompare = (product) => {
    if (compareItems.find(item => item.product_id === product.product_id)) {
      alert("Already added to comparison.");
      return;
    }
    if (compareItems.length >= 4) {
      alert("You can compare up to 4 products at a time. Remove a product to add another.");
      return;
    }
    setCompareItems([...compareItems, product]);
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter(item => item.product_id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};
