import { IUserFilter } from "./user.interface";
export interface IAPIResponse<T> {
  code: string;
  message: string;
  data: T | unknown;
}

export interface IPaginationOptions {
  page?: number;
  page_size?: number;
  host?: string;
}

export interface IPaginationLinks {
  next: string | null;
  previous: string | null;
}

export interface IPaginationResponse<T> {
  links: IPaginationLinks;
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  rows: T;
}

export interface IDateFilterOptions {
  created_at?: string;
  updated_at?: string;
  // "created_at" | "updated_at"
  range_filter_field?: string;
  created_after?: string;
  updated_after?: string;
  created_before?: string;
  updated_before?: string;
  start?: string;
  end?: string;
}
