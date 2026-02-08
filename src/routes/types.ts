export type AppStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  TouristTabs: undefined;
  SellerTabs: undefined;

  TouristHome: undefined;

  CreatePlanScreen: undefined;
  SearchScreen: undefined;
  FavoritesScreen: undefined;
  AccountScreen: undefined;
  Product: { id: string };
  Place: { id: string };
};

export type SellerTabsParamList = {
  VitrineTab: undefined;
  ProductsTab: undefined;
  AccountTab: undefined;
};

export type SellerProductsStackParamList = {
  SellerProducts: undefined;
  SellerProductForm: { id?: string; placeId?: string };
};

export type SellerStackParamList = {
  SellerTabs: undefined;
};
