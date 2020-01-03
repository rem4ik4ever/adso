import React, { useEffect, useState } from "react";

export const useFilters = routerQuery => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    let newFilters = {};
    if (routerQuery.search) {
      newFilters.searchTerm = routerQuery.search;
    }
    if (routerQuery.location) {
      newFilters.location = {
        latitude: +routerQuery.location[0],
        longitude: +routerQuery.location[1],
        distance: +routerQuery.location[2]
      };
    }
    if (routerQuery.priceRange) {
      newFilters.priceRange = {
        from: +routerQuery.priceRange[0],
        to: +routerQuery.priceRange[1]
      };
    }
    setFilters(newFilters);
  }, [routerQuery]);

  return filters;
};
