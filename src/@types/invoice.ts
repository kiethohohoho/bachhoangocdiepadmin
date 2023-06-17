// ----------------------------------------------------------------------

export type IInvoiceAddress = {
  id: string;
  name: string;
  address: string;
  company: string;
  email: string;
  phone: string;
};

export type IInvoiceItem = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  service: string;
};

export type IInvoice = {
  Id: string;
  AccountId: string;
  InvoiceNumber?:string;
  ShopBankNumber?: string;
  UserBankNumber?: string;
  ShopBankName?: string;
  UserBankName?: string;
  TransferContent: string;
  FullAddress: string;
  ReceiverName: string;
  ReceiverPhoneNumber: string;
  SubAmount: string;
  ShippingCost: string;
  VAT?: 1;
  TotalAmount: string;
  PaidType: string;
  StatusCode: 1;
  Status: string;
  DeliveryDate?: null;
  Notes?: null;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type IInvoiceDetaill = {
  order: IInvoice;
  carts: any;
}
  // export type IInvoice = {
//   id: string;
//   sent: number;
//   status: string;
//   totalPrice: number;
//   invoiceNumber: string;
//   subTotalPrice: number;
//   taxes: number | string;
//   discount: number | string;
//   invoiceFrom: IInvoiceAddress;
//   invoiceTo: IInvoiceAddress;
//   createDate: Date | number;
//   dueDate: Date | number;
//   items: IInvoiceItem[];
// };
