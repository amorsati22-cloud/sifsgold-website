export const SHOP_CART_COOKIE = "sg_guest_cart";
export const RESERVATION_MINUTES = 5;
export const RETURN_WINDOW_DAYS = 30;
export const PLATFORM_FEE_PERCENT = 0.08;

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const RETURN_REASONS = [
  { value: "wrong_item", label: "Wrong item received" },
  { value: "damaged", label: "Item arrived damaged" },
  { value: "changed_mind", label: "Changed my mind" },
  { value: "didnt_work", label: "Product did not work as expected" },
  { value: "allergic_reaction", label: "Allergic reaction" },
] as const;
