import axiosInstance from "../../../axiosinterceptor/axiosInstance";

export const fetchProductsApi = async ({
  source,
  gender,
  category,
  sale = false,
  page = 1,
  limit = 10,
  sort = "newest",
  // Filter parameters
  brands,
  categories,
  minPrice,
  maxPrice,
  styles
}) => {
  // Check if any filters are applied
  const hasFilters = brands || categories || minPrice || maxPrice || styles || gender;
  
  // If filters are applied, use the filtered endpoint
  if (hasFilters) {
    let endpoint = `/products/filtered?page=${page}&limit=${limit}&sort=${sort}`;
    
    // Add filter parameters
    const filterParams = new URLSearchParams();
    if (brands) filterParams.append('brands', brands);
    if (categories) filterParams.append('categories', categories);
    if (minPrice) filterParams.append('minPrice', minPrice);
    if (maxPrice) filterParams.append('maxPrice', maxPrice);
    if (styles) filterParams.append('styles', styles);
    if (gender) filterParams.append('gender', gender);

    // Add source and gender if they exist (for filtering within a specific source/gender)
    if (source) filterParams.append('source', source);
    //if (gender) filterParams.append('gender', gender);
    if (category) filterParams.append('category', category);
    
    // Append filter parameters
    const filterString = filterParams.toString();
    if (filterString) {
      endpoint += `&${filterString}`;
    }
    
    const response = await axiosInstance.get(endpoint);
    return {
      products: response.data.products,
      page,
      hasMore: response.data.hasMore,
    };
  }
  
  // If no filters, use the original endpoint logic
  let endpoint = `/products?page=${page}&limit=${limit}&sort=${sort}`;

  if (sale && gender && category) {
    endpoint = `/products/sales/gender/category/${gender}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if(sale && gender) {
    endpoint = `/products/sale/gender/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if(sale) {
    endpoint = `/products/sale?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (source && category) {
    endpoint = `/products/source/category/${source}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (gender && category) {
    endpoint = `/products/gender/category/${gender}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (source && gender) {
    endpoint = `/products/source/gender/${source}/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (source) {
    endpoint = `/products/source/${source}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (gender) {
    endpoint = `/products/gender/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  }

  const response = await axiosInstance.get(endpoint);
  return {
    products: response.data.products,
    page,
    hasMore: response.data.hasMore,
  };
};

// Keep your fetchFilterOptionsApi function as is
export const fetchFilterOptionsApi = async () => {
  try {
    const response = await axiosInstance.get('/products/filter-options');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return {
      success: false,
      filterOptions: {
        brands: [],
        categories: [],
        styles: [],
        priceRange: { min: 0, max: 1000 }
      },
      error: error.message
    };
  }
};