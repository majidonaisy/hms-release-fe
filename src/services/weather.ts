export const weatherApi = async (latitude?: number, longitude?: number) => {
  const lat = latitude || 52.52; // Default to Berlin
  const lon = longitude || 13.419998;
  
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&timezone=auto`;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }
    
    return response.json();
    
  } catch (error:any) {
    const errorMessage = error.response.data.message || "An error occurred";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
   }
};