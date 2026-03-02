// Returns the restaurant banner url to BrowseRestaurants & UserPage/homeTab.jsx, so it is visible
export function getBannerUrl(r) {
  if (!r.bannerUrl) return null;
  const v = r.bannerUpdatedAt || 0;
  return v ? `${r.bannerUrl}?v=${v}` : r.bannerUrl;
}
