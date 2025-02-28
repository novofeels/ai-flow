"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchFilterOptions } from "@/features/FilterSlice";
import { fetchIndexes } from "@/features/IndexesSlice";

export default function Chat() {
  const dispatch = useAppDispatch();
  const { options, status: filterStatus, error: filterError } = useAppSelector((state) => state.filters);
  const { data: indexes, status: indexesStatus, error: indexesError } = useAppSelector((state) => state.indexes);
  const selectedConversation = useAppSelector((state) => state.conversations.selectedConversation);

  useEffect(() => {
    // Fetch filters if not already loading
    if (filterStatus === 'idle') {
      dispatch(fetchFilterOptions());
    }
    
    // Fetch indexes if not already loading
    if (indexesStatus === 'idle') {
      dispatch(fetchIndexes());
    }
  }, [dispatch, filterStatus, indexesStatus]);

  // Determine if initial data is still loading
  const isInitialDataLoading = filterStatus === 'loading' || indexesStatus === 'loading';
  
  // Determine if there's an error with initial data
  const hasInitialDataError = filterStatus === 'failed' || indexesStatus === 'failed';
  const errorMessage = filterError || indexesError;

  if (isInitialDataLoading) return <p className="p-4">Loading initial data...</p>;
  if (hasInitialDataError) return <p className="p-4 text-red-500">{errorMessage}</p>;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      hello
    </div>
  );
}