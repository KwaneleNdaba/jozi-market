export enum CategoryStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export interface ICategoryAttribute {
  id?: string;
  name: string;
  type: 'Text' | 'Select' | 'Color' | 'Number';
  options?: string[];
}

export interface ICategory {
  id: string;
  categoryId?: string | null; // Parent category ID (null for top-level categories)
  name: string;
  description: string;
  status: CategoryStatus | string;
  icon?: string;
  attributes?: ICategoryAttribute[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ICreateCategory {
  name: string;
  description: string;
  status: CategoryStatus | string;
  icon?: string;
  categoryId?: string | null; // Parent category ID (for subcategories)
  subcategories?: ICreateSubcategory[];
  // Note: Attributes are NOT included in category creation
  // They are linked separately via POST /api/category-attribute after category is created
}

export interface ICreateSubcategory {
  name: string;
  description: string;
  status: CategoryStatus | string;
}

export interface IUpdateCategory {
  id: string;
  name?: string;
  description?: string;
  status?: CategoryStatus | string;
  icon?: string;
  categoryId?: string | null;
  // Note: Attributes are NOT included in category update
  // They are managed separately via POST /api/category-attribute
}

export interface ICategoryWithSubcategories extends ICategory {
  subcategories?: ICategory[];
}
