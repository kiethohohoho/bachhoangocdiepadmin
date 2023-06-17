/* eslint-disable consistent-return */
import { createSlice, Dispatch } from '@reduxjs/toolkit';
// utils
import {
  IDataAddCart,
  IProduct,
  IProductCheckoutState,
  IProductOver
} from '../../@types/product';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState: any = {
  isLoading: false,
  error: null,
  products: [],
  TotalPages: 1,
  CurrentPage: 1,
  product: null,
  reviews: [],
  reviewState: null,
  checkout: {
    activeStep: 0,
    Data: [],
    TotalQuantity: 0,
    TotalPrice: 0,
    discount: 0,
    shipping: 0,
    Address: null,
    totalItems: 0,
  },
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      const DATA: IProductOver = action.payload;
      state.isLoading = false;
      state.products = DATA.Data;
      state.CurrentPage = DATA.Pagination.CurrentPage;
      state.TotalPages = DATA.Pagination.TotalPages;
    },
    // GET REVIEWS
    getReviewSuccess(state, action) {
      console.log('getReviewSuccess:',action.payload)
      state.reviewState = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      const CHECKOUT: IProductCheckoutState = action.payload;
      state.checkout.Data = CHECKOUT.Data;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.TotalPrice = CHECKOUT.TotalPrice;
      state.checkout.TotalQuantity = CHECKOUT.TotalQuantity;
    },

    setFilterSort(state, action) {
      state.filter.sortBy = action.payload;
    },

    setFilterBrand(state, action) {
      state.filter.brand = action.payload;
    },

    // addToCart(state, action) {
    //   const cart = action.payload;

    //   addToCard(cart).then
    //   // const isEmptyCart = !state.checkout.cart.length;

    //   // if (isEmptyCart) {
    //   //   state.checkout.Data = [...state.checkout.Data, newProduct];
    //   // } else {
    //   //   state.checkout.Data = state.checkout.Data.map((item:any) => {
    //   //     const isExisted = item.ProductId === newProduct.Id;

    //   //     if (isExisted) {
    //   //       return {
    //   //         ...item,
    //   //         quantity: item.Quantity + 1,
    //   //       };
    //   //     }

    //   //     return item;
    //   //   });
    //   // }
    //   // state.checkout.cart = uniqBy([...state.checkout.cart, newProduct], 'id');
    //   // state.checkout.totalItems = sum(state.checkout.cart.map((product) => product.quantity));
    // },

    deleteCart(state, action) {
      // const updateCart = state.checkout.cart.filter((product) => product.Id !== action.payload);
      // state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },

    // increaseQuantity(state, action) {
    //   const productId = action.payload;

    //   const updateCart = state.checkout.cart.map((product) => {
    //     if (product.Id === productId) {
    //       return {
    //         ...product,
    //         quantity: product.quantity + 1,
    //       };
    //     }
    //     return product;
    //   });

    //   state.checkout.cart = updateCart;
    // },

    // decreaseQuantity(state, action) {
    //   const productId = action.payload;
    //   const updateCart = state.checkout.cart.map((product) => {
    //     if (product.Id === productId) {
    //       return {
    //         ...product,
    //         quantity: product.quantity - 1,
    //       };
    //     }
    //     return product;
    //   });

    //   state.checkout.cart = updateCart;
    // },

    createBilling(state, action) {
      state.checkout.Address = action.payload;
    },

    updateShipping(state, action) {
      state.checkout.shipping = Number(action.payload);
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.TotalQuantity += shipping;
      // state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  // addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  updateShipping,
  setFilterSort,
  // increaseQuantity,
  // decreaseQuantity,
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/products');
      dispatch(slice.actions.getProductsSuccess(response.data.Products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function sortProducts(value: string) {
  const query = value.split('&');
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('v1/products', {
        params: { sort: query[0], order: query[1] },
      }); 
      dispatch(slice.actions.getProductsSuccess(response.data.Products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

type filter = {
  brand?: string; 
  categorygroup?: string[];
  category?: string[];
  pricerange: [number, number];
  rate?: number; 
  sortBy?: string;
  page:number
};

export function sortProductsByFilter(value: filter) {

  const mapCategory = value.category?.map((a) => `filter[CategoryId][eq]=${a}`).join('&');
  const mapCategorygroup = value.categorygroup
    ?.map((a) => `filter[CategoryGroupId][eq]=${a}`)
    .join('&');
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(
        `v1/products?&page=${value.page > 0 ? value.page : 1}&limit=12`
      ); 
      dispatch(slice.actions.getProductsSuccess(response.data.Products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export const getProductByBrandId = (id: string) => {
  axios
    .get(`v1/products?filter[BrandId][eq]=${id}`)
    .then((res) => {
      if (res?.data?.success === true) {
        return res.data.Products.Data;
      }
    })
    .catch((err) => console.log(err));
};

export function getCarts() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/v1/carts');
      dispatch(slice.actions.getCart(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addToCart(data: any) {
  return axios.post('/v1/carts', data);
}

export function updateQuantity(id: string, productId: string, quantity: number) {
  const body: IDataAddCart = {
    ProductId: productId,
    Quantity: quantity,
  };
  return axios.patch(`/v1/carts/${id}`, body);
}

// bran
export function getBran() {
  return axios.get('/v1/brands');
}
// Category Group
export function getCategoryGroup() {
  return axios.get('v1/categoryGroups');
}

// ----------------------------------------------------------------------

export function getProduct(ProductId: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/v1/products/${ProductId}`);
      await dispatch(slice.actions.getProductSuccess(response.data.product));
      const responseReview = await axios.get(`/v1/reviews/product/${ProductId}`);
      
      dispatch(slice.actions.getReviewSuccess(responseReview.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// new product
export function addProduct(data: Partial<IProduct>) {
  // const body = {
  //   Brandid: data?.BrandId,
  //   CategoryId: data?.CategoryId,
  //   CategoryGroupId: data?.CategoryGroupId,
  //   Name: data?.Name,
  //   Price: data?.Price,
  //   Quantity: data?.Quantity,
  //   Images: data?.Images,

  // };
  return axios.post('/v1/products', data);
}

export function updateProduct(data: Partial<IProduct>, id?: string) {
  // const body = {
  //   Brandid: data?.BrandId,
  //   CategoryId: data?.CategoryId,
  //   CategoryGroupId: data?.CategoryGroupId,
  //   Name: data?.Name,
  //   Price: data?.Price,
  //   Quantity: data?.Quantity,
  //   Images: data?.Images,

  // };
  return axios.patch(`/v1/products/${id}`, data);
}
