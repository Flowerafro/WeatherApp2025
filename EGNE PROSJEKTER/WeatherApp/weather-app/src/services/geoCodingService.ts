export interface GeoLocation {
    lat: number;
    lon: number;
    name: string;
    country?: string;
}

// src/services/geocodingService.ts

export interface GeoLocation {
    lat: number;
    lon: number;
    name: string;
    country?: string | undefined;
    admin1?: string;
}

export const getCoordinates = async (city: string): Promise<GeoLocation> => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Kunne ikke koble til geocoding-tjenesten");
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error(`Fant ingen lokasjon ved navn "${city}"`);
        }

        const result = data.results[0];

        return {
            lat: result.latitude,
            lon: result.longitude,
            name: result.name,
            country: result.country,
            admin1: result.admin1,
        };
    } catch (error) {
        console.error("Geocoding error:", error);
        throw error;
    }
};