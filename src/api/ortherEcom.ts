// utils
import Axios from 'axios';
import { IAddress, IBanner, IBrand, ICategoy, ICategoyGroup } from 'src/@types/product';
import { IUserAccountGeneral } from 'src/@types/user';
import axios from '../utils/axios';

// PRODUCT
export function getProductsBestSeller() {
  return axios.get('/v1/products?filter[IsBestSeller][eq]=true');
}
// BRAND
export function getBran() {
  return axios.get('/v1/brands');
}

export function getBranByCategory(id: string) {
  return axios.get(`/v1/brands/category/${id}`);
}

export function newBrand(data: Partial<IBrand>) {
  const body = {
    Name: data?.Name,
    CategoryGroupId: data?.CategoryGroupId,
    CategoryId: data?.CategoryId,
    Description: data.Description,
  };
  return axios.post('v1/brands', body);
}

export function updateBrand(data: Partial<IBrand>, id?: string) {
  const body = {
    Name: data?.Name,
    CategoryGroupId: data?.CategoryGroupId,
    CategoryId: data?.CategoryId,
    Description: data.Description,
  };
  return axios.patch(`v1/brands/${id}`, body);
}
// change passwork
export function changePasswork(data: any) {
  return axios.post('v1/auth/change-password', data);
}
export function forgotPassword(data: any) {
  return axios.post('v1/auth/forgot-password', data);
}
export function resetPassword(data: any) {
  return axios.post('v1/auth/reset-password', data);
}
// banner
export function newBanner(data: Partial<IBanner>) {
  return axios.post('v1/banners', data);
}

export function getBanner(type: string) {
  return axios.get(`v1/banners?filter[Type][eq]=${type}`);
}
export function getBannerById(id: string) {
  return axios.get(`v1/banners/${id}`);
}
// Category Group
export function getCategoryGroup() {
  return axios.get('v1/categoryGroups');
}
export function deleteCategoryGroup(id: string) {
  return axios.delete(`v1/categoryGroups/${id}`);
}

export function newCategoryGroup(data: Partial<ICategoyGroup>) {
  const body = {
    Name: data?.Name,
    Description: data.Description,
  };
  return axios.post('v1/categoryGroups', body);
}

export function updateCategoryGroup(data: Partial<ICategoyGroup>, id?: string) {
  const body = {
    Name: data?.Name,
    Description: data.Description,
  };
  return axios.patch(`v1/categoryGroups/${id}`, body);
}

// Category
export function getCategory() {
  return axios.get('v1/categories');
}

export function getCategoryById(id: string) {
  return axios.get(`v1/categories/categoryGroup/${id}`);
}

export function newCategory(data: Partial<ICategoy>) {
  const body = {
    Name: data?.Name,
    CategoryGroupId: data?.CategoryGroupId,
    Description: data.Description,
  };
  return axios.post('v1/categories', body);
}

export function updateCategory(data: Partial<ICategoy>, id?: string) {
  const body = {
    Name: data?.Name,
    CategoryGroupId: data?.CategoryGroupId,
    Description: data.Description,
  };
  return axios.patch(`v1/categories/${id}`, body);
}

export function updateProfile(data: Partial<IUserAccountGeneral>) {
  const body = {
    Firstname: data.FirstName,
    Lastname: data.LastName,
    Dateofbirth: data.DateOfBirth,
    Avatar: data.Avatar,
    Phonenumber: data.PhoneNumber,
  };
  return axios.patch('v1/users/profile', body);
}
// reviews
export function newReview(data: any) {
  return axios.post('v1/reviews', data);
}

export function getReviwByProduct(id: any) {
  return axios.get(`/v1/reviews/product/${id}`);
}
// file
export function upLoadImage(image: any) {
  const bodyFormData = new FormData();
  image?.map((e: any) => bodyFormData.append('image', e));

  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.post('v1/images', bodyFormData, config);
}

export function getImages(id: string) {
  return axios.get(`/v1/images/product/${id}`);
}

// card
export function addToCard(data: any) {
  const body = {
    ProductId: data?.Id,
    Quantity: data?.quantity,
  };
  return axios.post('/v1/carts', body);
}

export function deleteToCard(id: string) {
  return axios.delete(`/v1/carts/${id}`);
}

export function getAdress() {
  return axios.get('v1/addresses');
}

export function getProvince() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Token: '172e6bf9-e36f-11ed-bc91-ba0234fcde32',
      ShopId: '124046 - 0397516328',
    },
  };
  return Axios.get(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province',
    config
  );
}

export function getDistrict(id: any) {
  const body = {
    province_id: id,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Token: '172e6bf9-e36f-11ed-bc91-ba0234fcde32',
      ShopId: '124046 - 0397516328',
    },
  };
  return Axios.post(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district',
    body,
    config
  );
}

export function getWard(id: any) {
  const body = {
    district_id: id,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Token: '172e6bf9-e36f-11ed-bc91-ba0234fcde32',
      ShopId: '124046 - 0397516328',
    },
  };
  return Axios.post(
    `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?id=${id}`,
    body,
    config
  );
}

export function CalculateFee(districtid: number, wardid: number) {
  const body = {
    from_district_id: 2055,
    service_id: 53320,
    service_type_id: null,
    to_district_id: districtid,
    to_ward_code: wardid,
    height: 20,
    length: 10,
    weight: 800,
    width: 10,
    insurance_value: 0,
    coupon: null,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Token: '172e6bf9-e36f-11ed-bc91-ba0234fcde32',
      ShopId: '124046 - 0397516328',
    },
  };
  return Axios.post(
    'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
    body,
    config
  );
}

export function addAddress(data: IAddress) {
  return axios.post('v1/addresses', data);
}

export function updateAddress(data: IAddress, id: string) {
  return axios.patch(`v1/addresses/${id}`, data);
}

export function deleteAddress(id: string | null | undefined) {
  return axios.delete(`v1/addresses/${id}`);
}

// oder
export function newOder(data: any) {
  return axios.post('v1/orders', data);
}
export function getOder() {
  return axios.get('v1/orders');
}
export function getUsers() {
  return axios.get('v1/users');
}
export function getOderById(id: any) {
  return axios.get(`v1/orders/${id}`);
}
export function getOderBySratus1(page: number) {
  return axios.get(`v1/orders?filter[StatusCode][eq]=1&page=${page}&limit=5`);
}
export function updateStatus(id: any, data: any) {
  return axios.patch(`v1/orders/${id}`, data);
}
export function getsaleproducttoday() {
  return axios.get(`v1/analyst/saleproducttoday`);
}
export function getAmountByPaidType() {
  return axios.get(`v1/analyst/amountByPaidType`);
}
export function getThreeBestSellingProducts() {
  return axios.get(`v1/analyst/threebestsellingproducts`);
}
