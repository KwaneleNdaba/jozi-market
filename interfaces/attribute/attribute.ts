export enum AttributeType {
  TEXT = "text",
  NUMBER = "number",
  SELECT = "select",
  BOOLEAN = "boolean",
  TEXTAREA = "textarea",
}

export interface IAttribute {
  id: string;
  name: string;
  slug: string;
  type: AttributeType | string;
  unit?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICreateAttribute {
  name: string;
  slug: string;
  type: AttributeType | string;
  unit?: string;
}

export interface IUpdateAttribute {
  id: string;
  name?: string;
  slug?: string;
  type?: AttributeType | string;
  unit?: string;
}

export interface ICategoryAttribute {
  id: string;
  categoryId: string;
  attributeId: string;
  isRequired: boolean;
  options?: string[];
  displayOrder: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  // Populated attribute data (when fetched with relations)
  attribute?: IAttribute;
}

export interface ICreateCategoryAttribute {
  categoryId: string;
  attributeId: string;
  isRequired?: boolean;
  options?: string[];
  displayOrder?: number;
}

export interface IUpdateCategoryAttribute {
  id: string;
  categoryId?: string;
  attributeId?: string;
  isRequired?: boolean;
  options?: string[];
  displayOrder?: number;
}
