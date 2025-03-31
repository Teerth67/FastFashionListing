import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilterOptions } from '../../redux/features/products/productThunk';
import { setFilters, resetFilters } from '../../redux/features/products/productSlice';
import styles from './Filter.module.scss';

const Filter = () => {
  const dispatch = useDispatch();
  const { 
    filterOptions, 
    filters: currentFilters,
    filterOptionsStatus, 
    filterOptionsError
  } = useSelector(state => state.products);
  
  const [expandedSections, setExpandedSections] = useState({
    brands: true,
    categories: true,
    price: true,
    gender: true
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGender, setSelectedGender] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isFilterOverlayVisible, setFilterOverlayVisible] = useState(false);
  
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);
  
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
    
    if (currentFilters?.gender) {
      setSelectedGender(currentFilters.gender);
    } else {
      setSelectedGender('');
    }
    
    if (currentFilters?.minPrice) {
      setPriceRange(prev => ({ ...prev, min: currentFilters.minPrice }));
    } else {
      setPriceRange(prev => ({ ...prev, min: '' }));
    }
    
    if (currentFilters?.maxPrice) {
      setPriceRange(prev => ({ ...prev, max: currentFilters.maxPrice }));
    } else {
      setPriceRange(prev => ({ ...prev, max: '' }));
    }
  }, [currentFilters]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Fixed gender handling
  const handleGenderChange = (gender) => {
    setSelectedGender(prev => prev === gender ? '' : gender);
  };

  const applyFilters = () => {
    const newFilters = {};
    
    if (selectedBrands.length > 0) newFilters.brands = selectedBrands.join(',');
    if (selectedCategories.length > 0) newFilters.categories = selectedCategories.join(',');
    if (selectedGender) newFilters.gender = selectedGender;  // Only add if selected
    if (priceRange.min) newFilters.minPrice = priceRange.min;
    if (priceRange.max) newFilters.maxPrice = priceRange.max;
    
    dispatch(setFilters(newFilters));
    setFilterOverlayVisible(false);
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedGender('');
    setPriceRange({ min: '', max: '' });
    dispatch(resetFilters());
  };

  const handleItemChange = (item, collection, setCollection) => {
    setCollection(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
  };

  const filterOptionsBySearch = (options) => {
    if (!searchTerm || !options) return options;
    return options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  // Corrected gender filter section
  const renderGenderFilter = () => (
    <div className={styles.filterSection}>
      <h3 onClick={() => toggleSection('gender')}>
        Gender
        <span className={styles.sectionToggle}>
          {expandedSections.gender ? '▲' : '▼'}
        </span>
      </h3>
      
      {expandedSections.gender && (
        <div className={styles.filterContent}>
          <div className={styles.checkboxGroup}>
            {['men', 'women', 'unisex'].map(gender => (
              <label key={gender} className={styles.checkboxLabel}>
                <input
                  type="radio"
                  name="gender"
                  checked={selectedGender === gender}
                  onChange={() => handleGenderChange(gender)}
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (currentFilters?.brands) count += currentFilters.brands.split(',').length;
    if (currentFilters?.categories) count += currentFilters.categories.split(',').length;
    if (currentFilters?.minPrice || currentFilters?.maxPrice) count += 1;
    if (currentFilters?.gender) count += 1;  // Correct count
    return count;
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  if (filterOptionsStatus === 'loading') return <div className={styles.filterLoading}>Loading filters...</div>;
  if (filterOptionsStatus === 'failed') return (
    <div className={styles.filterError}>
      Failed to load filters. {filterOptionsError}
      <button onClick={() => dispatch(fetchFilterOptions())}>Retry</button>
    </div>
  );

  const filterContent = (
    <>
      {appliedFiltersCount > 0 && (
        <div className={styles.appliedFiltersCount}>
          {appliedFiltersCount} filter{appliedFiltersCount > 1 ? 's' : ''} applied
          <button onClick={handleResetFilters} className={styles.clearAllButton}>
            CLEAR ALL
          </button>
        </div>
      )}
      
      {renderGenderFilter()}
      
      <div className={styles.filterSection}>
        <h3 onClick={() => toggleSection('brands')}>
          Brands
          <span className={styles.sectionToggle}>
            {expandedSections.brands ? '▲' : '▼'}
          </span>
        </h3>
        {expandedSections.brands && (
          <div className={styles.filterContent}>
            {filterOptions?.brands?.length > 10 && (
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search brands"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            <div className={styles.checkboxGroup}>
              {filterOptionsBySearch(filterOptions?.brands)?.map(brand => (
                <label key={brand} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleItemChange(brand, selectedBrands, setSelectedBrands)}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.filterSection}>
        <h3 onClick={() => toggleSection('categories')}>
          Categories
          <span className={styles.sectionToggle}>
            {expandedSections.categories ? '▲' : '▼'}
          </span>
        </h3>
        {expandedSections.categories && (
          <div className={styles.filterContent}>
            {filterOptions?.categories?.length > 10 && (
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search categories"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
            <div className={styles.checkboxGroup}>
              {filterOptionsBySearch(filterOptions?.categories)?.map(category => (
                <label key={category} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleItemChange(category, selectedCategories, setSelectedCategories)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.filterSection}>
        <h3 onClick={() => toggleSection('price')}>
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
      
      <div className={styles.filterActions}>
        <button type="button" className={styles.applyButton} onClick={applyFilters}>
          Apply Filters
        </button>
        <button type="button" className={styles.resetButton} onClick={handleResetFilters}>
          Reset
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className={styles.sideFilter}>{filterContent}</div>
      
      <button 
        className={styles.mobileFilterButton}
        onClick={() => setFilterOverlayVisible(true)}
      >
        FILTERS
      </button>
      
      <div className={`${styles.filterOverlay} ${isFilterOverlayVisible ? styles.visible : ''}`}>
        <div className={styles.overlayHeader}>
          <h2>FILTERS</h2>
          <button 
            className={styles.closeButton}
            onClick={() => setFilterOverlayVisible(false)}
          >
            ×
          </button>
        </div>
        {filterContent}
        <div className={styles.overlayFooter}>
          <button className={styles.clearButton} onClick={handleResetFilters}>
            CLEAR ALL
          </button>
          <button className={styles.applyButton} onClick={applyFilters}>
            APPLY
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;