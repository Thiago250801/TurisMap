import { Product } from './../data/mockData';
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
