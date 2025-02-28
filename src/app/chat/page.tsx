"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchFilterOptions } from "@/features/FilterSlice";
import { fetchIndexes } from "@/features/IndexesSlice";

export default function Chat() {
  const dispatch = useAppDispatch();
  
  // Get all state from Redux for debugging
  const filters = useAppSelector((state) => state.filters);
  const indexes = useAppSelector((state) => state.indexes);

  useEffect(() => {
    // Fetch filters if not already loading
    if (filters.status === 'idle') {
      dispatch(fetchFilterOptions());
    }
    
    // Fetch indexes if not already loading
    if (indexes.status === 'idle') {
      dispatch(fetchIndexes());
    }
  }, [dispatch, filters.status, indexes.status]);

  // Determine if initial data is still loading
  const isLoading = filters.status === 'loading' || indexes.status === 'loading';
  
  // Determine if there's an error with initial data
  const hasError = filters.status === 'failed' || indexes.status === 'failed';
  const errorMessage = filters.error || indexes.error;

  if (isLoading) return <p className="p-4">Loading initial data...</p>;
  if (hasError) return <p className="p-4 text-red-500">{errorMessage}</p>;

  return (
    <div className="flex flex-col h-full">
      {/* Chat content goes here */}
    </div>
  );
}