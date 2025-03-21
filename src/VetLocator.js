import React, { useState } from "react";
import { TextField, Button, Typography, Container, Paper, List, ListItem, ListItemText } from "@mui/material";

function VetLocator() {
    const [location, setLocation] = useState("");
    const [vetStores, setVetStores] = useState([]);
    const handleSearch = async () => {
        if (!location.trim()) {
            alert("Please enter a location.");
            return;
        }
    
        // OpenStreetMap API request to find vet clinics in the entered location
        const url = `https://nominatim.openstreetmap.org/search?q=vet+clinic+in+$Bngalore,India&format=json`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.length === 0) {
                alert("No vet clinics found in this location.");
                setVetStores([]);
                return;
            }
    
            // Extract name and address from the API response
            const vetStores = data.map((item) => ({
                name: item.display_name.split(",")[0], // Extract first part as clinic name
                address: item.display_name,
            }));
    
            setVetStores(vetStores);
        } catch (error) {
            console.error("Error fetching vet clinics:", error);
            alert("Failed to fetch vet clinics. Please try again.");
        }
    };
    

    return (
        <Container maxWidth="md" style={{ marginTop: "30px" }}>
            <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                <Typography variant="h5" style={{ fontWeight: "bold", color: "#2E7D32", marginBottom: "20px" }}>
                    🏥 Find Nearby Vet Stores
                </Typography>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    label="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    variant="outlined"
                />
                <Button variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }} onClick={handleSearch}>
                    🔍 Search Vet Stores
                </Button>

                {/* Vet Store Results */}
                {vetStores.length > 0 && (
                    <Paper elevation={2} style={{ marginTop: "20px", padding: "10px" }}>
                        <Typography variant="h6" style={{ marginBottom: "10px" }}>
                            📍 Nearby Vet Stores:
                        </Typography>
                        <List>
                            {vetStores.map((vet, index) => (
                                <ListItem key={index} divider>
                                    <ListItemText primary={vet.name} secondary={vet.address} />
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
