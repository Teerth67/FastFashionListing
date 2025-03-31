const Product = require("../models/productModel");
const escapeStringRegexp = require('escape-string-regexp');
const { getPriceConversionStages } = require("../utility/priceConversion");

const genderMap = {
  men: ["male", "Men", "unisex"],
  women: ["female", "Ladies", "unisex"],
  unisex: ["unisex"],
};
const getSortQuery = (sort) => {
  switch (sort) {
    case "priceLowHigh": return { priceNumeric: 1 }; // Price: Low to High
    case "priceHighLow": return { priceNumeric: -1 }; // Price: High to Low
    case "title_asc": return { title: 1 }; // Alphabetically A-Z
    case "title_desc": return { title: -1 }; // Alphabetically Z-A
    case "newest": return { scrapedAt: -1 }; // Oldest first
    default: return { scrapedAt: -1 }; // Default: Newest first
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    // Extract pagination and sorting parameters
    let { page, limit, sort } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Extract filter parameters
    let { brands, categories, minPrice, maxPrice, styles, gender } = req.query;

    // Build match conditions for MongoDB aggregation
    const matchConditions = {};

    // 1. Brand filter (array of brands or default all)
    if (brands && brands !== 'all') {
      // Handle brands as comma-separated list
      const brandArray = brands.split(',');
      matchConditions.source = { $in: brandArray };
    }

    // 2. Category filter
    if (categories) {
      // Handle categories as comma-separated list
      const categoryArray = categories.split(',');
      matchConditions.category = { $in: categoryArray };
    }

    // 3. Style filter (casual, streetwear, etc.)
    if (styles) {
      // Handle styles as comma-separated list
      const styleArray = styles.split(',');
      matchConditions.style = { $in: styleArray };
    }
    if (gender) {
      const genderFilter = genderMap[gender] || [gender];
      matchConditions.gender = { $in: genderFilter };
    }

    // Build price filter stages
    const priceFilter = [];

    // First apply the standard price conversion stages
    priceFilter.push(...getPriceConversionStages());

    // Then add price range filtering if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceCondition = {};
      
      if (minPrice !== undefined) {
        priceCondition.$gte = parseFloat(minPrice);
      }
      
      if (maxPrice !== undefined) {
        priceCondition.$lte = parseFloat(maxPrice);
      }
      
      // Add price filter stage, checking both regular and sale prices
      priceFilter.push({
        $match: {
          $or: [
            { priceNumeric: priceCondition },
            { salePriceNumeric: priceCondition }
          ]
        }
      });
    }

    // Execute aggregation pipeline
    const products = await Product.aggregate([
      // Initial filtering by brand, category, style
      { $match: matchConditions },
      // Price conversion and filtering
      ...priceFilter,
      // Sort results
      { $sort: getSortQuery(sort) },
      // Pagination
      { $skip: skip },
      { $limit: limit }
    ]);

    // Count total filtered products for pagination
    const totalPipeline = [
      { $match: matchConditions },
      ...priceFilter,
      { $count: 'total' }
    ];

    const totalResult = await Product.aggregate(totalPipeline);
    const totalProducts = totalResult.length > 0 ? totalResult[0].total : 0;

    // Return filtered products with pagination info
    res.json({
      success: true,
      products,
      filters: {
        brands: brands || 'all',
        categories: categories || 'all',
        priceRange: {
          min: minPrice || 'any',
          max: maxPrice || 'any'
        },
        styles: styles || 'all'
      },
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    console.error('Filtering error:', error);
    res.status(500).json({ 
      success: false,
      message: "❌ Server Error", 
      error: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
};

// Helper function to get available filter options
const getFilterOptions = async (req, res) => {
  try {
    // Get all available brands (sources)
    const brands = await Product.distinct('source');
    
    // Get all available categories
    const categories = await Product.distinct('category');
    
    // Get all available styles (you'll need to add this field to your schema)
    const styles = await Product.distinct('style');
    
    // Get price range
    const pricePipeline = [
      ...getPriceConversionStages(),
      {
        $group: {
          _id: null,
          minPrice: { $min: '$priceNumeric' },
          maxPrice: { $max: '$priceNumeric' }
        }
      }
    ];
    
    const priceRange = await Product.aggregate(pricePipeline);
    
    res.json({
      success: true,
      filterOptions: {
        brands,
        categories,
        styles,
        priceRange: priceRange.length > 0 ? {
          min: Math.floor(priceRange[0].minPrice),
          max: Math.ceil(priceRange[0].maxPrice)
        } : { min: 0, max: 1000 }
      }
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({ 
      success: false,
      message: "❌ Server Error", 
      error: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
};


const getProducts = async (req, res) => {
  try {
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      ...getPriceConversionStages(), // Reusable price conversion stages
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    console.error('Price conversion error:', error);
    res.status(500).json({ 
      success: false,
      message: "❌ Server Error", 
      error: process.env.NODE_ENV === 'development' ? error : undefined 
    });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getProductsBySource = async (req, res) => {
  try {
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      { $match: { source: req.params.source } },
      // Reuse the price conversion pipeline
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    const totalProducts = await Product.countDocuments({ source: req.params.source });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


const getProductsByGender = async (req, res) => {
  try {
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.aggregate([
      { $match: { gender: { $in: genderFilter } } },
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalProducts = await Product.countDocuments({ gender: { $in: genderFilter } });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getProductsByGenderAndCategory = async (req, res) => {
  try {
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.aggregate([
      { $match: { gender: { $in: genderFilter }, category: req.params.category } },
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalProducts = await Product.countDocuments({
      gender: { $in: genderFilter },
      category: req.params.category,
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
const getProductsBySourceAndCategory = async (req, res) => {
  try {
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      { $match: { source: req.params.source, category: req.params.category } },
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalProducts = await Product.countDocuments({
      source: req.params.source,
      category: req.params.category,
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


  const getProductsBySourceAndGender = async (req, res) => {
    try {
      let { page, limit, sort } = req.query; 
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const skip = (page - 1) * limit;
      const genderFilter = genderMap[req.params.gender] || [req.params.gender];
      const products = await Product.aggregate([
        { $match: { source: req.params.source, gender: { $in: genderFilter }, } },
        ...getPriceConversionStages(),
        { $sort: getSortQuery(sort) },
        { $skip: skip },
        { $limit: limit }
      ]);
  
      const totalProducts = await Product.countDocuments({
        source: req.params.source,
        gender: req.params.gender,
      });
  
      res.json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        hasMore: skip + limit < totalProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error });
    }
  };
  
  const deleteProductsBySource = async (req, res) => {
    try {
      const result = await Product.deleteMany({ source: req.params.source });
      res.json({
        message: "✅ Products deleted successfully",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ message: "❌ Server Error", error });
    }
  };
  

  const getProductsBySalePriceCategoryAndGender = async (req, res) => {
    try {
      let { page, limit, sort } = req.query; 
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const skip = (page - 1) * limit;
      
      const genderFilter = genderMap[req.params.gender] || [req.params.gender];
  
      // Build aggregation pipeline
      const pipeline = [
        // Filter by category and gender first
        { 
          $match: { 
            category: req.params.category,
            gender: { $in: genderFilter }
          } 
        },
        // Reuse your helper function to clean and convert price fields
        ...getPriceConversionStages(),
        // Now, filter out products that do not have a valid sale price
        // (i.e. salePriceNumeric must exist and be less than regularPriceNumeric)
        { 
          $match: { 
            salePriceNumeric: { $ne: null },
            $expr: { $lt: ["$salePriceNumeric", "$regularPriceNumeric"] }
          }
        },
        { $sort: getSortQuery(sort) },
        { $skip: skip },
        { $limit: limit }
      ];
  
      const products = await Product.aggregate(pipeline);
  
      // Note: The total count may be slightly approximate if your conversion logic
      // is complex. You can also re-run an aggregation to get the total count.
      const totalProducts = await Product.countDocuments({
        category: req.params.category,
        gender: { $in: genderFilter },
        salePrice: { $exists: true, $ne: "N/A" }
      });
  
      res.json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        hasMore: skip + limit < totalProducts,
      });
    } catch (error) {
      console.error("Price conversion error:", error);
      res.status(500).json({ 
        message: "Server Error", 
        error: process.env.NODE_ENV === 'development' ? error : undefined 
      });
    }
  };
  const getProductsBySalePrice = async (req, res) => {
    try {
        let { page, limit, sort } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const pipeline = [
            ...getPriceConversionStages(),
            { 
                $match: { 
                    salePriceNumeric: { $ne: null },
                    $expr: { $lt: ["$salePriceNumeric", "$regularPriceNumeric"] }
                } 
            },
            { $sort: getSortQuery(sort) },
            { $skip: skip },
            { $limit: limit }
        ];

        const products = await Product.aggregate(pipeline);
        const totalProducts = await Product.countDocuments({
            salePrice: { $exists: true, $ne: "N/A" }
        });

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            hasMore: skip + limit < totalProducts,
        });
    } catch (error) {
        console.error("Price conversion error:", error);
        res.status(500).json({ 
            message: "Server Error", 
            error: process.env.NODE_ENV === 'development' ? error : undefined 
        });
    }
};

const getProductsBySalePriceAndGender = async (req, res) => {
    try {
        let { page, limit, sort } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const skip = (page - 1) * limit;

        const genderFilter = genderMap[req.params.gender] || [req.params.gender];

        const pipeline = [
            { 
                $match: { 
                    gender: { $in: genderFilter }
                } 
            },
            ...getPriceConversionStages(),
            { 
                $match: { 
                    salePriceNumeric: { $ne: null },
                    $expr: { $lt: ["$salePriceNumeric", "$regularPriceNumeric"] }
                } 
            },
            { $sort: getSortQuery(sort) },
            { $skip: skip },
            { $limit: limit }
        ];

        const products = await Product.aggregate(pipeline);
        const totalProducts = await Product.countDocuments({
            gender: { $in: genderFilter },
            salePrice: { $exists: true, $ne: "N/A" }
        });

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            hasMore: skip + limit < totalProducts,
        });
    } catch (error) {
        console.error("Price conversion error:", error);
        res.status(500).json({ 
            message: "Server Error", 
            error: process.env.NODE_ENV === 'development' ? error : undefined 
        });
    }
};const searchProducts = async (req, res) => {
  try {
    const { q, page, limit, sort } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    if (!q) {
      return res.status(400).json({ 
        success: false,
        error: 'Search query parameter "q" is required' 
      });
    }

    // Normalize and split query into terms
    const terms = q.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const genderTerms = {
      'men': 'men',
      'mens': 'men',
      'male': 'men',
      'women': 'women',
      'womens': 'women',
      'ladies': 'women',
      'female': 'women',
      'unisex': 'unisex'
    };

    const genderTermsFound = [];
    const nonGenderTerms = terms.filter(term => {
      if (genderTerms[term]) {
        genderTermsFound.push(genderTerms[term]);
        return false;
      }
      return true;
    });

    const searchConditions = [];

    if (genderTermsFound.length > 0) {
      searchConditions.push({
        gender: { $in: genderMap[genderTermsFound[0]] || [genderTermsFound[0]] }
      });
    }

    if (nonGenderTerms.length > 0) {
      const termConditions = nonGenderTerms.map(term => ({
        $or: [
          { source: new RegExp(escapeStringRegexp(term), 'i') },
          { title: new RegExp(escapeStringRegexp(term), 'i') },
          { category: new RegExp(escapeStringRegexp(term), 'i') }
        ]
      }));
      searchConditions.push({ $and: termConditions });
    }

    const searchQuery = searchConditions.length > 0 ? { $and: searchConditions } : {};

    const pipeline = [
      { $match: searchQuery },
      ...getPriceConversionStages(), // <-- Add price conversions
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: parsedLimit }
    ];

    const products = await Product.aggregate(pipeline);
    const total = await Product.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      currentPage: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      hasMore: skip + parsedLimit < total
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};


module.exports = {
  getProducts,
  getProductById,
  getProductsBySource,
  getProductsByGender,
  getProductsBySourceAndGender,
  getProductsByGenderAndCategory,
  getProductsBySourceAndCategory,
  deleteProductsBySource,
  searchProducts,
  getProductsBySalePriceCategoryAndGender, // New Route
getProductsBySalePrice,
getProductsBySalePriceAndGender,
getFilteredProducts,
getFilterOptions
};