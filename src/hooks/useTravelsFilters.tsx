import { useTravelsQuery } from "@/graphql/__generated__/gql";
import { useState } from "react";

export interface TravelFilters {
  transportId: string | null;
  activityIds: string[];
  travelName: string;
  startDate: Date | null;
  endDate: Date | null;
  countryName: string;
}

export function useTravelFilters() {
  const defaultFilters = {
    transportId: null,
    activityIds: [] as string[],
    travelName: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    countryName: "",
  }

  const [filters, setFilters] = useState<TravelFilters>(defaultFilters);

  const { data, loading, refetch: refetchTravels } = useTravelsQuery({
    fetchPolicy: 'cache-and-network'
  })

  const updateFilters = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = (newFilters: TravelFilters) => {
    refetchTravels(newFilters);
  };

  return {
    filters,
    updateFilters,
    applyFilters,
    defaultFilters,
    data,
    loading,
  };
}
