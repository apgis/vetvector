import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText, CircularProgress, Box } from "@mui/material";

function VetLocator() {
    const [location, setLocation] = useState("");
    const [vetStores, setVetStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (!location.trim()) {
            setError("Please enter a location.");
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            // Using Overpass API (OpenStreetMap data) - a free and open alternative
            const overpassQuery = `
                [out:json];
                area[name="${location}"]->.searchArea;
                (
                  node["amenity"="veterinary"](area.searchArea);
                  way["amenity"="veterinary"](area.searchArea);
                  relation["amenity"="veterinary"](area.searchArea);
                );
                out body;
                >;
                out skel qt;
            `;
            
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data.elements || data.elements.length === 0) {
                setError("No veterinary clinics found in this location.");
                setVetStores([]);
                setLoading(false);
                return;
            }
            
            // Transform the data into a more usable format
            const vetClinics = data.elements
                .filter(element => element.tags && element.tags.name)
                .map(element => ({
                    id: element.id,
                    name: element.tags.name,
                    address: [
                        element.tags["addr:housenumber"],
                        element.tags["addr:street"],
                        element.tags["addr:city"]
                    ].filter(Boolean).join(", "),
                    phone: element.tags.phone || element.tags["contact:phone"] || "Not available"
                }));
            
            setVetStores(vetClinics);
        } catch (error) {
            console.error("Error fetching vet clinics:", error);
            setError("Failed to fetch veterinary clinics. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" style={{ marginTop: "30px" }}>
            <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                <Typography variant="h5" style={{ fontWeight: "bold", color: "#2E7D32", marginBottom: "20px" }}>
                    🏥 Find Nearby Veterinary Clinics
                </Typography>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    label="Enter your location (city, neighborhood)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                    error={!!error && !location.trim()}
                    helperText={!location.trim() && error ? error : ""}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    style={{ marginTop: "10px" }} 
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "🔍 Search Veterinary Clinics"}
                </Button>

                {/* Error Message */}
                {error && location.trim() && (
                    <Typography color="error" style={{ marginTop: "10px" }}>
                        {error}
                    </Typography>
                )}

                {/* Loading Indicator */}
                {loading && (
                    <Box display="flex" justifyContent="center" marginTop="20px">
                        <CircularProgress />
                    </Box>
                )}

                {/* Results */}
                {!loading && vetStores.length > 0 && (
                    <Paper elevation={2} style={{ marginTop: "20px", padding: "10px" }}>
                        <Typography variant="h6" style={{ marginBottom: "10px" }}>
                            📍 Veterinary Clinics in {location}:
                        </Typography>
                        <List>
                            {vetStores.map((vet) => (
                                <ListItem key={vet.id} divider>
                                    <ListItemText 
                                        primary={vet.name} 
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2">
                                                    Address: {vet.address || "Not available"}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="body2">
                                                    Phone: {vet.phone}
                                                </Typography>
                                            </>
                                        } 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Paper>
        </Container>
    );
}

export default VetLocator;