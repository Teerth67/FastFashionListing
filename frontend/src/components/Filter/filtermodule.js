import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilterOptions } from '../../redux/features/products/productThunk';
import { setFilters, resetFilters } from '../../redux/features/products/productSlice';
import styles from './Filter.module.scss';

const FilterBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const filterBarRef = useRef(null);
  const dispatch = useDispatch();
  
  // Simple toggle for filter visibility
  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };
  
  // Close filter panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && filterBarRef.current && !filterBarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.filterBar} ref={filterBarRef}>
      <button 
        className={`${styles.filterButton} ${isOpen ? styles.active : ''}`} 
        onClick={toggleFilter}
        type="button"
      >
        <span>FILTERS</span>
        <span className={styles.filterIcon}>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {/* Render filter panel conditionally without nesting */}
      {isOpen && <FiltersPanel closePanel={() => setIsOpen(false)} />}
    </div>
  );
};

const FiltersPanel = ({ closePanel }) => {
  const dispatch = useDispatch();
  const { 
    filterOptions, 
    filters: currentFilters
  } = useSelector(state => state.products);
  
  // Initialize state
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  });
  
  // Expanded section states - default to collapsed to reduce scrolling
  const [expandedSections, setExpandedSections] = useState({
    brands: false,
    categories: false,
    price: false
  });
  
  // Prevent event propagation to avoid panel closing
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };
  
  // Toggle expanded state for a section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Update local state when filters change
  useEffect(() => {
    if (currentFilters?.brands) {
      setSelectedBrands(Array.isArray(currentFilters.brands) 
        ? [...currentFilters.brands] 
        : currentFilters.brands.split(',').filter(brand => brand.trim() !== ''));
    } else {
      setSelectedBrands([]);
    }
    
    if (currentFilters?.categories) {
      setSelectedCategories(Array.isArray(currentFilters.categories) 
        ? [...currentFilters.categories] 
        : currentFilters.categories.split(',').filter(category => category.trim() !== ''));
    } else {
      setSelectedCategories([]);
    }
    
    if (currentFilters?.minPrice) {
      setPriceRange(prev => ({ ...prev, min: currentFilters.minPrice }));
    }
    
    if (currentFilters?.maxPrice) {
      setPriceRange(prev => ({ ...prev, max: currentFilters.maxPrice }));
    }
  }, [currentFilters]);
  
  // Apply filters and close panel
  const applyFilters = (e) => {
    e.stopPropagation();
    
    const newFilters = {};
    
    if (selectedBrands.length > 0) {
      newFilters.brands = selectedBrands.join(',');
    }
    
    if (selectedCategories.length > 0) {
      newFilters.categories = selectedCategories.join(',');
    }
    
    if (priceRange.min) {
      newFilters.minPrice = priceRange.min;
    }
    
    if (priceRange.max) {
      newFilters.maxPrice = priceRange.max;
    }
    
    dispatch(setFilters(newFilters));
    closePanel(); // Close panel after applying filters
  };
  
  // Reset all filters
  const handleResetFilters = (e) => {
    e.stopPropagation();
    
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    dispatch(resetFilters());
  };
  
  // Handle brand/category changes
  const handleItemChange = (item, collection, setCollection, e) => {
    if (e) e.stopPropagation();
    
    setCollection(prev => {
      if (prev.includes(item)) {
        return prev.filter(i => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };
  
  // Handle price range input change
  const handlePriceChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.filterPanel} onClick={handlePanelClick}>
      {/* Brands Section */}
      <div className={`${styles.filterSection} ${expandedSections.brands ? styles.expanded : ''}`}>
        <h3 onClick={(e) => { e.stopPropagation(); toggleSection('brands'); }}>
          Brands
          <span className={styles.sectionToggle}>
            {expandedSections.brands ? '▲' : '▼'}
          </span>
        </h3>
        
        {expandedSections.brands && (
          <div className={styles.filterContent}>
            <div className={styles.checkboxGroup}>
              {filterOptions?.brands && filterOptions.brands.length > 0 ? (
                filterOptions.brands.map(brand => (
                  <label key={brand} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => handleItemChange(brand, selectedBrands, setSelectedBrands, e)}
                    />
                    {brand}
                  </label>
                ))
              ) : <p>No brands available</p>}
            </div>
          </div>
        )}
      </div>
      
      {/* Categories Section */}
      <div className={`${styles.filterSection} ${expandedSections.categories ? styles.expanded : ''}`}>
        <h3 onClick={(e) => { e.stopPropagation(); toggleSection('categories'); }}>
          Categories
          <span className={styles.sectionToggle}>
            {expandedSections.categories ? '▲' : '▼'}
          </span>
        </h3>
        
        {expandedSections.categories && (
          <div className={styles.filterContent}>
            <div className={styles.checkboxGroup}>
              {filterOptions?.categories && filterOptions.categories.length > 0 ? (
                filterOptions.categories.map(category => (
                  <label key={category} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => handleItemChange(category, selectedCategories, setSelectedCategories, e)}
                    />
                    {category}
                  </label>
                ))
              ) : <p>No categories available</p>}
            </div>
          </div>
        )}
      </div>
      
      {/* Price Range Section */}
      <div className={`${styles.filterSection} ${expandedSections.price ? styles.expanded : ''}`}>
        <h3 onClick={(e) => { e.stopPropagation(); toggleSection('price'); }}>
          Price Range
          <span className={styles.sectionToggle}>
            {expandedSections.price ? '▲' : '▼'}
          </span>
        </h3>
        
        {expandedSections.price && (
          <div className={styles.filterContent}>
            <div className={styles.priceInputs}>
              <input
                type="number"
                name="min"
                value={priceRange.min}
                onChange={handlePriceChange}
                placeholder="Min"
                className={styles.priceInput}
              />
              <span>to</span>
              <input
                type="number"
                name="max"
                value={priceRange.max}
                onChange={handlePriceChange}
                placeholder="Max"
                className={styles.priceInput}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Filter Actions */}
      <div className={styles.filterActions}>
        <button 
          type="button"
          className={styles.applyButton}
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button 
          type="button"
          className={styles.resetButton}
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Main Filter Component
const Filter = () => {
  const dispatch = useDispatch();
  const { 
    filterOptionsStatus, 
    filterOptionsError
  } = useSelector(state => state.products);
  
  // Fetch filter options on component mount
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);
  
  // Loading state
  if (filterOptionsStatus === 'loading') {
    return <div className={styles.filterLoading}>Loading filters...</div>;
  }
  
  // Error state
  if (filterOptionsStatus === 'failed') {
    return (
      <div className={styles.filterError}>
        Failed to load filters. {filterOptionsError}
        <button onClick={() => dispatch(fetchFilterOptions())}>Retry</button>
      </div>
    );
  }

  return <FilterBar />;
};

export default Filter;