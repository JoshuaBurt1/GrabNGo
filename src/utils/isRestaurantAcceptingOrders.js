// Function used in OrderPage.jsx. If a restaurant's autosetting variable is set to "reject", an order cannot be placed.
export function isRestaurantAcceptingOrders(autoSetting) {
  if (!autoSetting) return true;
  const setting = String(autoSetting).toLowerCase();
  if (setting === "reject") return false;
  return true;
}
