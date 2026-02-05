import { IPaginationMetadata } from "./product/product";

export interface CustomResponse<T> {
    data: T;
    message: string;
    error: boolean;
    pagination?: IPaginationMetadata; // Optional pagination metadata
  }
  