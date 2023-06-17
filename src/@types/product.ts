import { IUserAccountGeneral } from './user';
// ----------------------------------------------------------------------

export type IProductReview = {
  id: string;
  name: string;
  avatarUrl: string;
  comment: string;
  rating: number;
  isPurchased: boolean;
  helpful: number;
  postedAt: Date | string | number;
};

export type ICategoyGroup = {
  Id: string;
  Name: string;
  Description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type ICategoy = {
  Id: string;
  Name: string;
  CategoryGroupId: string;
  Description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type IBanner = {
  Id: string;
  Title: string;
  Description: string;
  RedirectUrl: string;
  Images: any;
  ImageURL?: string;
  Type: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type IBrand = {
  Id: string;
  Name: string;
  CategoryGroupId: string;
  CategoryId: string;
  Description: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type IProduct = {
  Id: string;
  BrandId: string;
  CategoryId: string;
  CategoryGroupId: string;
  Name: string;
  Description: string;
  Price: number;
  Rate: number;
  Quantity: number;
  IsBestSeller: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  Images: any[];
  Status: boolean;
  ImageURL?: string;
};
export type IProductOver = {
  Data: IProduct;
  Pagination: IPagination;
};
export type IPagination = {
  TotalCount: number;
  TotalPages: number;
  CurrentPage: number;
  Limit: number;
};

export type IProductFilter = {
  brand: string;
  categorys: string[];
  categorygroup: string[];
  rate?: number;
  sortBy: string;
  pricerange: number[];
};

// ----------------------------------------------------------------------

export type ICheckoutCartItem = {
  Id: string;
  AccountId: string;
  ProductId: string;
  Quantity: number;
  SubTotal: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  Product: IProduct;
};

export type IInitStateProduct = {
  isLoading: boolean;
  error: any;
  products: any;
  product: any;
  checkout: {
    activeStep: number;
    Data: [];
    TotalQuantity: number;
    TotalPrice: number;
    discount: number;
    shipping: number;
    billing: any;
    totalItems: number;
  };
};

export type ICheckoutDeliveryOption = {
  value: number;
  title: string;
  description: string;
};

export type ICheckoutPaymentOption = {
  value: string;
  title: string;
  description: string;
  icons: string[];
};

export type ICheckoutCardOption = {
  value: string;
  label: string;
};

// ----------------------------------------------------------------------

export type IProductCheckoutState = {
  TotalPrice: number;
  TotalQuantity?: number;
  Data: ICheckoutCartItem[];
  Pagination?: {
    TotalCount: number;
    TotalPages: number;
    CurrentPage: number;
    Limit: number;
  };
  success?: boolean;
};

export type IProductState = {
  isLoading: boolean;
  error: Error | string | null;
  products: IProduct[];
  product: IProduct | null;
  checkout: IProductCheckoutState;
};

export type IDataAddCart = {
  ProductId: string;
  Quantity: number;
};

export type IAddress = {
  Id?: string;
  Name: string;
  IsDefault?: boolean;
  City: string;
  District: string;
  Ward: string;
  Street: string;
  ReceiverName: string;
  ReceiverPhoneNumber: string;
  CityGHNId?: string | number;
  DistrictGHNId?: string | number;
  WardGHNid: string | number;
};

export type ICheckoutBillingAddress = {
  receiver: string;
  phoneNumber: string;
  fullAddress: string;
  addressType: string;
  isDefault: boolean;
};

export type IReview = {
  Id: string;
  AccountId: string;
  ProductId: string;
  Content: string;
  Rate: string | number;
  Like?: string | number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  Account: IUserAccountGeneral;
  Product: IProduct;
  IsPurchased: boolean;
};

export type IRating = {
  name: string;
  reviewCount: number;
};

export type IReviewState = {
  reviews: IReview[],
  ratings: IRating[],
  success: boolean
}