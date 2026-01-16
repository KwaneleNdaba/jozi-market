export interface IProductAttributeValue {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICreateProductAttributeValue {
  productId: string;
  attributeId: string;
  value: string;
}

export interface ICreateBulkProductAttributeValue {
  productId: string;
  attributes: Array<{
    attributeId: string;
    value: string;
  }>;
}

export interface IUpdateProductAttributeValue {
  id: string;
  productId?: string;
  attributeId?: string;
  value?: string;
}
