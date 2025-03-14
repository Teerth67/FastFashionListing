import axiosInstance from "../../../axiosinterceptor/axiosInstance";

export const fetchProductsApi = async ({
  source,
  gender,
  category,
  sale = false,
  page = 1,
  limit = 10,
  sort = "priceLowHigh", // Default sort option
}) => {
  let endpoint = `/products?page=${page}&limit=${limit}&sort=${sort}`;

  if (sale && gender && category) {
    endpoint = `/products/sales/gender/category/${gender}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  }else if(sale &gender){
    endpoint = `/products/sale/gender/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  }
  else if(sale){
 endpoint = `/products/sale?page=${page}&limit=${limit}&sort=${sort}`;
  }
   else if (source && category) {
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
