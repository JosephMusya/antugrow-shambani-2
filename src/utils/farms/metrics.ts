export type Classification = {
  color: string;
  label: 'Poor' | 'Average' | 'Good' | "Unknown";
};

export const getMetricClassification = (key: string, value: number): Classification => {
  switch (key) {
    case 'NDVI':
      if (value >= 0.6) return { color: 'green-600', label: 'Good' };
      if (value >= 0.3) return { color: 'orange-300', label: 'Average' };
      return { color: 'red-500', label: 'Poor' };

    case 'GNDVI':
      if (value >= 0.5) return { color: 'green-600', label: 'Good' };
      if (value >= 0.3) return { color: 'orange-300', label: 'Average' };
      return { color: 'red-500', label: 'Poor' };

    case 'NDMI':
      if (value >= 0.4) return { color: 'green-600', label: 'Good' };
      if (value >= 0.2) return { color: 'orange-300', label: 'Average' };
      return { color: 'red-500', label: 'Poor' };

    case 'Soil_Moisture':
      if (value >= 0.6) return { color: 'green-600', label: 'Good' };
      if (value >= 0.4) return { color: 'orange-300', label: 'Average' };
      return { color: 'red-500', label: 'Poor' };

    case 'Water_Stress':
      // Lower is better for water stress
      if (value >= 0.3) return { color: 'green-600', label: 'Good' };
      if (value >= 0.2) return { color: 'orange-300', label: 'Average' };
      return { color: 'red-500', label: 'Poor' };

    default:
      return { color: 'gray-400', label: 'Unknown' };
  }
};
