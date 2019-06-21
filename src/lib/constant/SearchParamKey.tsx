/*
 * SearchParamKey defines any search params application wide. Keeping track
 * of them in a TypeScript enum allows us to assert that only declared keys
 * can be used on search params interfaces (useSearchParams hook etc.).
 *
 * This helps prevent inadvertently overwriting an already-used param or
 * accidently referencing "filters" as "filter" or "fiters" 😬
 */
export enum SearchParamKey {
  // Defines query parameter used when deferring navigation to page until some
  // condition is met. Eg. set when redirecting to the signin page after
  // attempting to reach a page that requires an authenticated user.
  redirect = "redirect-to",

  // filters and order are used by list view filtering and sorting
  filters = "filters",
  order = "order",

  // fimit and offset are used by list view pagination
  limit = "limit",
  offset = "offset",
}
