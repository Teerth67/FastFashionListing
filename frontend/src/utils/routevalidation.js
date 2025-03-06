// routeValidator.js

// Valid collections/brands from your dropdown
export const validCollections = [
    "Jaywalking", "Veloce", "huemn", "AlmostGods", 
    "TurntUp", "Outcasts", "BluOrng", "SpaceBiskit", 
    "WtFlex", "Six5Six", "DripProject", "Crayyheads", 
    "Bomaachi", "BlckOrchid", "FutureSaints", "WarpingTheories",
    "DaysforClothing", "ItGirl", "TheDapperLady","Genrage","DeadBear","Evemen","Beeglee","themerche","Bluer"
,""  ];
  
  // Valid women categories from your dropdown
  export const validWomenCategories = [
    "bottoms", "dresses", "swimwear", "accessories", "tops", 
    "playsuits", "co-ord-set", "sweatshirts", "parachute-pants", 
    "t-shirts", "shirts", "trousers", "jeans", "hoodies-sweatshirts", 
    "shorts", "bodysuits", "denim", "skirts", "corsets", "beachwear"
  ];
  
  // Valid men categories from your dropdown
  export const validMenCategories = [
    "t-shirts", "polos", "jeans", "jackets", "shirts", "bottoms", 
    "sweatpants", "sweatshirts", "accessories", "hoodies", "denim", "jersey"
  ];
  
  // Valid genders for sale routes
  export const validSaleGenders = ["men", "women"];
  
  // Function to check if a collection is valid
  export function isValidCollection(collection) {
    return validCollections.includes(collection);
  }
  
  // Function to check if a women's category is valid
 // Function to normalize category names (remove spaces & special characters)
function normalizeCategory(category) {
    return category.toLowerCase().replace(/[\s&]+/g, "-"); 
  }
  
  // Function to check if a women's category is valid
  export function isValidWomenCategory(category) {
    return validWomenCategories.includes(normalizeCategory(category));
  }
  
  // Function to check if a men's category is valid
  export function isValidMenCategory(category) {
    return validMenCategories.includes(normalizeCategory(category));
  }
  
  // Function to check if a gender is valid
  export function isValidGender(gender) {
    return validSaleGenders.includes(gender);
  }