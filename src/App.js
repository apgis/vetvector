import React, { useState, useEffect } from "react";
import { addDisease, getDiseases, predictDisease } from "./services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import VetLocator from "./VetLocator";

function App() {
    const [loading, setLoading] = useState(false);   
    const [name, setName] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [medicines, setMedicines] = useState("");
    const [homeRemedies, setHomeRemedies] = useState("");
    const [treatment, setTreatment] = useState(""); // Added state for treatment
    const [diseases, setDiseases] = useState([]);
    const [predictionSymptoms, setPredictionSymptoms] = useState("");
    const [predictedDisease, setPredictedDisease] = useState("");
    const [predictedTreatment, setPredictedTreatment] = useState(""); // State for predicted treatment

    useEffect(() => {
        fetchDiseases();
    }, []);

    const fetchDiseases = async () => {
        const data = await getDiseases();
        setDiseases(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const diseaseData = {
            name,
            symptoms: symptoms.split(",").map(s => s.trim()),
            medicines: medicines.split(",").map(m => m.trim()),
            home_remedies: homeRemedies.split(",").map(h => h.trim()),
            treatment // Include treatment in submission
        };
        await addDisease(diseaseData);
        fetchDiseases();
        setName("");
        setSymptoms("");
        setMedicines("");
        setHomeRemedies("");
        setTreatment("");
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const symptomsArray = predictionSymptoms.split(",").map(s => s.trim());
            const response = await predictDisease(symptomsArray);
            setPredictedDisease(response.disease);

            // Find matching disease for treatment
            const matchedDisease = diseases.find(d => d.name === response.disease);
            setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
        } catch (error) {
            console.error("Prediction error:", error);
        }
        setLoading(false);
    };
    
    return (
        <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
            <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
                <Typography variant="h4" style={{ color: "#2E7D32", fontWeight: "bold", marginBottom: "20px" }}>
                    🐄 VetVector: Livestock Disease Management
                </Typography>

                <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                    <TextField fullWidth label="Disease Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <TextField fullWidth label="Symptoms (comma-separated)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
                    <TextField fullWidth label="Medicines (comma-separated)" value={medicines} onChange={(e) => setMedicines(e.target.value)} required />
                    <TextField fullWidth label="Home Remedies (comma-separated)" value={homeRemedies} onChange={(e) => setHomeRemedies(e.target.value)} required />
                    <TextField fullWidth label="Treatment Suggestions" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
                        ➕ Add Disease
                    </Button>
                </form>

                <Typography variant="h5" align="center" gutterBottom>
                    📋 Stored Diseases
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Disease</strong></TableCell>
                                <TableCell><strong>Symptoms</strong></TableCell>
                                <TableCell><strong>Treatment</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diseases.length > 0 ? (
                                diseases.map((disease, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{disease.name}</TableCell>
                                        <TableCell>{disease.symptoms.join(", ")}</TableCell>
                                        <TableCell>{disease.treatment || "No treatment available"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">No diseases stored yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
                    🔮 AI Disease Prediction
                </Typography>
                <TextField fullWidth label="Enter symptoms for prediction" value={predictionSymptoms} onChange={(e) => setPredictionSymptoms(e.target.value)} />
                <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }} onClick={handlePredict}>
                    🔍 Predict Disease
                </Button>
                {loading ? (
                    <Typography variant="h6" align="center" color="blue" style={{ marginTop: "10px" }}>
                        Predicting disease... ⏳
                    </Typography>
                ) : predictedDisease && (
                    <>
                        <Typography variant="h6" align="center" color="green" style={{ marginTop: "10px" }}>
                            Predicted Disease: {predictedDisease}
                        </Typography>
                        {predictedTreatment && (
                            <Typography variant="body1" align="center" color="blue" style={{ marginTop: "10px" }}>
                                Suggested Treatment: {predictedTreatment}
                            </Typography>
                        )}
                    </>
                )}

                <VetLocator />
            </Paper>
        </Container>
    );
}

export default App;
