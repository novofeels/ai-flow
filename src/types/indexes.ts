// src/types/indexes.ts

/**
 * Interface for indexes data returned from the API
 */
export interface Indexes {
    All: IndexItem[];
    // You can add other potential categories here if they might appear in the future
    [key: string]: IndexItem[]; // This allows for any string key to contain an array of IndexItem
  }
  
  export interface IndexItem {
    name: string;
    value: string;
    // Add any other properties that might be in each item
  }