// utils/priceConversion.js
const getPriceConversionStages = () => [
  // Clean the "price" field by removing currency symbols and unwanted prefixes
  {
    $addFields: {
      priceClean: {
        $replaceAll: {
          input: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: "$price",
                          find: "INR",
                          replacement: ""
                        }
                      },
                      find: "₹",
                      replacement: ""
                    }
                  },
                  find: "Rs.",
                  replacement: ""
                }
              },
              find: "Rs",
              replacement: ""
            }
          },
          find: "RS.",
          replacement: ""
        }
      },
      // Handle salePrice similarly
      salePriceClean: {
        $cond: {
          if: { $eq: [{ $type: "$salePrice" }, "missing"] },
          then: null,
          else: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: {
                    $replaceAll: {
                      input: {
                        $replaceAll: {
                          input: {
                            $replaceAll: {
                              input: "$salePrice",
                              find: "INR",
                              replacement: ""
                            }
                          },
                          find: "₹",
                          replacement: ""
                        }
                      },
                      find: "Rs.",
                      replacement: ""
                    }
                  },
                  find: "Rs",
                  replacement: ""
                }
              },
              find: "RS.",
              replacement: ""
            }
          }
        }
      }
    }
  },
  // Trim extra spaces
  {
    $addFields: {
      priceNoSpace: { $trim: { input: "$priceClean" } },
      salePriceNoSpace: {
        $cond: {
          if: { $eq: ["$salePriceClean", null] },
          then: null,
          else: { $trim: { input: "$salePriceClean" } }
        }
      }
    }
  },
  // Remove commas from the cleaned prices
  {
    $addFields: {
      priceNumber: {
        $replaceAll: {
          input: "$priceNoSpace",
          find: ",",
          replacement: ""
        }
      },
      salePriceNumber: {
        $cond: {
          if: { $eq: ["$salePriceNoSpace", null] },
          then: null,
          else: {
            $replaceAll: {
              input: "$salePriceNoSpace",
              find: ",",
              replacement: ""
            }
          }
        }
      }
    }
  },
  // Convert the cleaned strings to numbers
  {
    $addFields: {
      regularPriceNumeric: {
        $convert: { input: "$priceNumber", to: "double", onError: 0 }
      },
      salePriceNumeric: {
        $cond: {
          if: { $eq: ["$salePriceNumber", null] },
          then: null,
          else: {
            $convert: { input: "$salePriceNumber", to: "double", onError: null }
          }
        }
      },
      // Effective price: use salePrice if available; otherwise, use regular price
      priceNumeric: {
        $cond: {
          if: { $ne: ["$salePriceNumber", null] },
          then: {
            $convert: { input: "$salePriceNumber", to: "double", onError: { $convert: { input: "$priceNumber", to: "double", onError: 0 } } }
          },
          else: {
            $convert: { input: "$priceNumber", to: "double", onError: 0 }
          }
        }
      }
    }
  },
  // Remove products where priceNumeric is 0
  {
    $match: {
      priceNumeric: { $gt: 0 }
    }
  },
  // Remove temporary fields
  {
    $project: {
      priceClean: 0,
      priceNoSpace: 0,
      priceNumber: 0,
      salePriceClean: 0,
      salePriceNoSpace: 0,
      salePriceNumber: 0
    }
  }
];

module.exports = { getPriceConversionStages };
