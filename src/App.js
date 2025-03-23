import React, { useState, useEffect } from "react";
import axios from "axios";
import { addDisease, getDiseases, predictDisease } from "./services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
    Container, TextField, Button, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Paper, Grid,
    Box, Card, CardContent, Divider, CircularProgress, Chip,
    Stepper, Step, StepLabel
} from "@mui/material";
import VetLocator from "./VetLocator";

function App() {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [medicines, setMedicines] = useState("");
    const [homeRemedies, setHomeRemedies] = useState("");
    const [treatment, setTreatment] = useState("");
    const [diseases, setDiseases] = useState([]);
    const [predictionSymptoms, setPredictionSymptoms] = useState("");
    const [predictedDisease, setPredictedDisease] = useState("");
    const [predictedTreatment, setPredictedTreatment] = useState("");
    const [image, setImage] = useState(null);
    const [activeTab, setActiveTab] = useState("predict");

    useEffect(() => {
        fetchDiseases();
    }, []);

    const fetchDiseases = async () => {
        const data = await getDiseases();
        setDiseases(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const diseaseData = {
            name,
            symptoms: symptoms.split(",").map(s => s.trim()),
            medicines: medicines.split(",").map(m => m.trim()),
            home_remedies: homeRemedies.split(",").map(h => h.trim()),
            treatment
        };
        await addDisease(diseaseData);
        fetchDiseases();
        setName("");
        setSymptoms("");
        setMedicines("");
        setHomeRemedies("");
        setTreatment("");
        setLoading(false);
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const symptomsArray = predictionSymptoms.split(",").map(s => s.trim());
            const response = await predictDisease(symptomsArray);
            setPredictedDisease(response.disease);

            const matchedDisease = diseases.find(d => d.name === response.disease);
            setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
        } catch (error) {
            console.error("Prediction error:", error);
        }
        setLoading(false);
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleImagePredict = async () => {
        if (!image) {
            alert("Please upload an image!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://127.0.0.1:8000/predict-image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setPredictedDisease(response.data.disease);
            
            const matchedDisease = diseases.find(d => d.name === response.data.disease);
            setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
        } catch (error) {
            console.error("Image Prediction Error:", error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "30px", marginBottom: "30px" }}>
            <Paper 
                elevation={4} 
                style={{ 
                    padding: "30px", 
                    borderRadius: "15px",
                    background: "linear-gradient(to right, #f5f7fa, #ffffff)"
                }}
            >
                <Box textAlign="center" mb={4}>
                    <Typography 
                        variant="h3" 
                        style={{ 
                            color: "#2E7D32", 
                            fontWeight: "bold",
                            marginBottom: "10px",
                            fontFamily: "'Montserrat', sans-serif"
                        }}
                    >
                        🐄 VetVector
                    </Typography>
                    <Typography 
                        variant="h5" 
                        style={{ 
                            color: "#555", 
                            marginBottom: "20px",
                            fontFamily: "'Montserrat', sans-serif"
                        }}
                    >
                        Intelligent Livestock Disease Management
                    </Typography>
                    <Divider style={{ margin: "20px auto", width: "60%" }} />
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center" mb={3}>
                            <Button 
                                variant={activeTab === "predict" ? "contained" : "outlined"} 
                                color="primary" 
                                onClick={() => setActiveTab("predict")}
                                style={{ margin: "0 10px", borderRadius: "20px", padding: "10px 20px" }}
                            >
                                🔍 Diagnose Disease
                            </Button>
                            <Button 
                                variant={activeTab === "database" ? "contained" : "outlined"} 
                                color="secondary" 
                                onClick={() => setActiveTab("database")}
                                style={{ margin: "0 10px", borderRadius: "20px", padding: "10px 20px" }}
                            >
                                💊 Disease Database
                            </Button>
                            <Button 
                                variant={activeTab === "locator" ? "contained" : "outlined"} 
                                color="success" 
                                onClick={() => setActiveTab("locator")}
                                style={{ margin: "0 10px", borderRadius: "20px", padding: "10px 20px" }}
                            >
                                📍 Find Veterinarians
                            </Button>
                        </Box>
                    </Grid>

                    {activeTab === "predict" && (
                        <Grid item xs={12}>
                            <Card elevation={3} style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <Box 
                                    style={{ 
                                        backgroundColor: "#2E7D32", 
                                        padding: "15px", 
                                        color: "white",
                                        textAlign: "center"
                                    }}
                                >
                                    <Typography variant="h5">
                                        Disease Diagnosis Tool
                                    </Typography>
                                </Box>
                                <CardContent style={{ padding: "25px" }}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={6}>
                                            <Box 
                                                p={3} 
                                                style={{ 
                                                    backgroundColor: "#f8f9fa", 
                                                    borderRadius: "10px",
                                                    height: "100%"
                                                }}
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    align="center" 
                                                    gutterBottom
                                                    style={{ color: "#2E7D32" }}
                                                >
                                                    🔍 Symptom-Based Diagnosis
                                                </Typography>
                                                <TextField 
                                                    fullWidth 
                                                    label="Enter symptoms for prediction" 
                                                    value={predictionSymptoms} 
                                                    onChange={(e) => setPredictionSymptoms(e.target.value)}
                                                    variant="outlined"
                                                    multiline
                                                    rows={3}
                                                    placeholder="e.g. fever, lethargy, loss of appetite"
                                                    style={{ marginTop: "15px", marginBottom: "15px" }}
                                                />
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    fullWidth 
                                                    onClick={handlePredict}
                                                    style={{ borderRadius: "10px", padding: "12px" }}
                                                    disabled={loading}
                                                >
                                                    {loading ? <CircularProgress size={24} /> : "🔍 Analyze Symptoms"}
                                                </Button>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box 
                                                p={3} 
                                                style={{ 
                                                    backgroundColor: "#f8f9fa", 
                                                    borderRadius: "10px",
                                                    height: "100%"
                                                }}
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    align="center" 
                                                    gutterBottom
                                                    style={{ color: "#2E7D32" }}
                                                >
                                                    📷 Image-Based Diagnosis
                                                </Typography>
                                                <Box 
                                                    textAlign="center" 
                                                    mt={2} 
                                                    mb={2} 
                                                    p={2}
                                                    style={{ 
                                                        border: "2px dashed #ccc", 
                                                        borderRadius: "10px",
                                                        backgroundColor: "#fff" 
                                                    }}
                                                >
                                                    <input
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        id="image-upload-button"
                                                        type="file"
                                                        onChange={handleImageChange}
                                                    />
                                                    <label htmlFor="image-upload-button">
                                                        <Button
                                                            variant="outlined"
                                                            component="span"
                                                            style={{ marginBottom: "10px" }}
                                                        >
                                                            📷 Select Image
                                                        </Button>
                                                    </label>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {image ? `Selected: ${image.name}` : "No image selected"}
                                                    </Typography>
                                                </Box>
                                                <Button 
                                                    variant="contained" 
                                                    color="secondary" 
                                                    fullWidth 
                                                    onClick={handleImagePredict}
                                                    style={{ borderRadius: "10px", padding: "12px" }}
                                                    disabled={loading || !image}
                                                >
                                                    {loading ? <CircularProgress size={24} /> : "📷 Analyze Image"}
                                                </Button>
                                            </Box>
                                        </Grid>

                                        {(predictedDisease || loading) && (
                                            <Grid item xs={12}>
                                                <Box 
                                                    p={3} 
                                                    mt={2}
                                                    style={{ 
                                                        backgroundColor: "#e8f5e9", 
                                                        borderRadius: "10px",
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    {loading ? (
                                                        <Box textAlign="center" p={3}>
                                                            <CircularProgress />
                                                            <Typography variant="h6" style={{ marginTop: "15px" }}>
                                                                Analyzing data and predicting disease...
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <>
                                                            <Typography 
                                                                variant="h5" 
                                                                style={{ color: "#2E7D32", marginBottom: "15px" }}
                                                            >
                                                                Diagnosis Results
                                                            </Typography>
                                                            <Chip 
                                                                label={`Predicted Disease: ${predictedDisease}`}
                                                                color="primary"
                                                                style={{ 
                                                                    fontSize: "16px", 
                                                                    padding: "20px 10px",
                                                                    marginBottom: "15px"
                                                                }}
                                                            />
                                                            {predictedTreatment && (
                                                                <Box mt={2}>
                                                                    <Typography 
                                                                        variant="h6" 
                                                                        style={{ marginBottom: "10px" }}
                                                                    >
                                                                        Recommended Treatment
                                                                    </Typography>
                                                                    <Paper 
                                                                        elevation={1} 
                                                                        style={{ 
                                                                            padding: "15px", 
                                                                            backgroundColor: "white",
                                                                            textAlign: "left"
                                                                        }}
                                                                    >
                                                                        <Typography variant="body1">
                                                                            {predictedTreatment}
                                                                        </Typography>
                                                                    </Paper>
                                                                </Box>
                                                            )}
                                                        </>
                                                    )}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {activeTab === "database" && (
                        <Grid item xs={12}>
                            <Card elevation={3} style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <Box 
                                    style={{ 
                                        backgroundColor: "#6a1b9a", 
                                        padding: "15px", 
                                        color: "white",
                                        textAlign: "center"
                                    }}
                                >
                                    <Typography variant="h5">
                                        Disease Database Management
                                    </Typography>
                                </Box>
                                <CardContent style={{ padding: "25px" }}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={5}>
                                            <Box 
                                                p={3} 
                                                style={{ 
                                                    backgroundColor: "#f8f9fa", 
                                                    borderRadius: "10px"
                                                }}
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    align="center" 
                                                    gutterBottom
                                                    style={{ color: "#6a1b9a", marginBottom: "20px" }}
                                                >
                                                    ➕ Add New Disease
                                                </Typography>
                                                <form onSubmit={handleSubmit}>
                                                    <Stepper alternativeLabel activeStep={0} style={{ marginBottom: "20px" }}>
                                                        <Step>
                                                            <StepLabel>Details</StepLabel>
                                                        </Step>
                                                        <Step>
                                                            <StepLabel>Treatment</StepLabel>
                                                        </Step>
                                                    </Stepper>
                                                    
                                                    <TextField 
                                                        fullWidth 
                                                        label="Disease Name" 
                                                        value={name} 
                                                        onChange={(e) => setName(e.target.value)} 
                                                        required 
                                                        variant="outlined"
                                                        style={{ marginBottom: "15px" }}
                                                    />
                                                    <TextField 
                                                        fullWidth 
                                                        label="Symptoms (comma-separated)" 
                                                        value={symptoms} 
                                                        onChange={(e) => setSymptoms(e.target.value)} 
                                                        required 
                                                        variant="outlined"
                                                        multiline
                                                        rows={2}
                                                        style={{ marginBottom: "15px" }}
                                                    />
                                                    <TextField 
                                                        fullWidth 
                                                        label="Medicines (comma-separated)" 
                                                        value={medicines} 
                                                        onChange={(e) => setMedicines(e.target.value)} 
                                                        required 
                                                        variant="outlined"
                                                        style={{ marginBottom: "15px" }}
                                                    />
                                                    <TextField 
                                                        fullWidth 
                                                        label="Home Remedies (comma-separated)" 
                                                        value={homeRemedies} 
                                                        onChange={(e) => setHomeRemedies(e.target.value)} 
                                                        required 
                                                        variant="outlined"
                                                        style={{ marginBottom: "15px" }}
                                                    />
                                                    <TextField 
                                                        fullWidth 
                                                        label="Treatment Suggestions" 
                                                        value={treatment} 
                                                        onChange={(e) => setTreatment(e.target.value)} 
                                                        required 
                                                        variant="outlined"
                                                        multiline
                                                        rows={3}
                                                        style={{ marginBottom: "15px" }}
                                                    />
                                                    <Button 
                                                        type="submit" 
                                                        variant="contained" 
                                                        color="secondary" 
                                                        fullWidth 
                                                        style={{ borderRadius: "10px", padding: "12px" }}
                                                        disabled={loading}
                                                    >
                                                        {loading ? <CircularProgress size={24} /> : "➕ Add Disease to Database"}
                                                    </Button>
                                                </form>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={7}>
                                            <Box 
                                                style={{ 
                                                    backgroundColor: "#f8f9fa", 
                                                    borderRadius: "10px",
                                                    padding: "20px"
                                                }}
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    align="center" 
                                                    gutterBottom
                                                    style={{ color: "#6a1b9a", marginBottom: "20px" }}
                                                >
                                                    📋 Disease Knowledge Base
                                                </Typography>
                                                <TableContainer 
                                                    component={Paper} 
                                                    elevation={0} 
                                                    style={{ maxHeight: "500px", overflow: "auto" }}
                                                >
                                                    <Table stickyHeader>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell style={{ backgroundColor: "#e1bee7", fontWeight: "bold" }}>Disease</TableCell>
                                                                <TableCell style={{ backgroundColor: "#e1bee7", fontWeight: "bold" }}>Symptoms</TableCell>
                                                                <TableCell style={{ backgroundColor: "#e1bee7", fontWeight: "bold" }}>Treatment</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {diseases.length > 0 ? (
                                                                diseases.map((disease, index) => (
                                                                    <TableRow 
                                                                        key={index}
                                                                        style={{ 
                                                                            backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9" 
                                                                        }}
                                                                    >
                                                                        <TableCell style={{ fontWeight: "bold", color: "#6a1b9a" }}>
                                                                            {disease.name}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {disease.symptoms.join(", ")}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {disease.treatment || "No treatment available"}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={3} align="center">
                                                                        No diseases stored yet.
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    )}

                    {activeTab === "locator" && (
                        <Grid item xs={12}>
                            <Card elevation={3} style={{ borderRadius: "15px", overflow: "hidden" }}>
                                <Box 
                                    style={{ 
                                        backgroundColor: "#2e7c67", 
                                        padding: "15px", 
                                        color: "white",
                                        textAlign: "center"
                                    }}
                                >
                                    <Typography variant="h5">
                                        Find Veterinarians Near You
                                    </Typography>
                                </Box>
                                <CardContent style={{ padding: "25px" }}>
                                    <VetLocator />
                                </CardContent>
                            </Card>
                        </Grid>
                    )}
                </Grid>

                <Box textAlign="center" mt={5} pt={2}>
                    <Divider style={{ margin: "0 auto 20px auto", width: "60%" }} />
                    <Typography variant="body2" color="textSecondary">
                        © 2025 VetVector - Intelligent Livestock Disease Management
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}

export default App;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { addDisease, getDiseases, predictDisease } from "./services/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
// import {
//     Container, TextField, Button, Typography, Table, TableBody,
//     TableCell, TableContainer, TableHead, TableRow, Paper
// } from "@mui/material";
// import VetLocator from "./VetLocator";

// function App() {
//     const [loading, setLoading] = useState(false);
//     const [name, setName] = useState("");
//     const [symptoms, setSymptoms] = useState("");
//     const [medicines, setMedicines] = useState("");
//     const [homeRemedies, setHomeRemedies] = useState("");
//     const [treatment, setTreatment] = useState("");
//     const [diseases, setDiseases] = useState([]);
//     const [predictionSymptoms, setPredictionSymptoms] = useState("");
//     const [predictedDisease, setPredictedDisease] = useState("");
//     const [predictedTreatment, setPredictedTreatment] = useState("");
//     const [image, setImage] = useState(null); // Image state

//     useEffect(() => {
//         fetchDiseases();
//     }, []);

//     const fetchDiseases = async () => {
//         const data = await getDiseases();
//         setDiseases(data);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const diseaseData = {
//             name,
//             symptoms: symptoms.split(",").map(s => s.trim()),
//             medicines: medicines.split(",").map(m => m.trim()),
//             home_remedies: homeRemedies.split(",").map(h => h.trim()),
//             treatment
//         };
//         await addDisease(diseaseData);
//         fetchDiseases();
//         setName("");
//         setSymptoms("");
//         setMedicines("");
//         setHomeRemedies("");
//         setTreatment("");
//     };

//     const handlePredict = async () => {
//         setLoading(true);
//         try {
//             const symptomsArray = predictionSymptoms.split(",").map(s => s.trim());
//             const response = await predictDisease(symptomsArray);
//             setPredictedDisease(response.disease);

//             const matchedDisease = diseases.find(d => d.name === response.disease);
//             setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
//         } catch (error) {
//             console.error("Prediction error:", error);
//         }
//         setLoading(false);
//     };

//     // 🔹 Handle Image Selection
//     const handleImageChange = (event) => {
//         setImage(event.target.files[0]);
//     };

//     // 🔹 Send Image to AI Model for Prediction
//     const handleImagePredict = async () => {
//         if (!image) {
//             alert("Please upload an image!");
//             return;
//         }

//         setLoading(true);
//         const formData = new FormData();
//         formData.append("image", image);

//         try {
//             const response = await axios.post("http://127.0.0.1:8000/predict-image", formData, {
//                 headers: { "Content-Type": "multipart/form-data" }
//             });

//             setPredictedDisease(response.data.disease);
            
//             // Find matching disease for treatment
//             const matchedDisease = diseases.find(d => d.name === response.data.disease);
//             setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
//         } catch (error) {
//             console.error("Image Prediction Error:", error);
//         }
//         setLoading(false);
//     };

//     return (
//         <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
//             <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
//                 <Typography variant="h4" style={{ color: "#2E7D32", fontWeight: "bold", marginBottom: "20px" }}>
//                     🐄 VetVector: Livestock Disease Management
//                 </Typography>

//                 <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//                     <TextField fullWidth label="Disease Name" value={name} onChange={(e) => setName(e.target.value)} required />
//                     <TextField fullWidth label="Symptoms (comma-separated)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
//                     <TextField fullWidth label="Medicines (comma-separated)" value={medicines} onChange={(e) => setMedicines(e.target.value)} required />
//                     <TextField fullWidth label="Home Remedies (comma-separated)" value={homeRemedies} onChange={(e) => setHomeRemedies(e.target.value)} required />
//                     <TextField fullWidth label="Treatment Suggestions" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />
//                     <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
//                         ➕ Add Disease
//                     </Button>
//                 </form>

//                 <Typography variant="h5" align="center" gutterBottom>
//                     📋 Stored Diseases
//                 </Typography>
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell><strong>Disease</strong></TableCell>
//                                 <TableCell><strong>Symptoms</strong></TableCell>
//                                 <TableCell><strong>Treatment</strong></TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {diseases.length > 0 ? (
//                                 diseases.map((disease, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{disease.name}</TableCell>
//                                         <TableCell>{disease.symptoms.join(", ")}</TableCell>
//                                         <TableCell>{disease.treatment || "No treatment available"}</TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={3} align="center">No diseases stored yet.</TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
//                     🔮 AI Disease Prediction (Symptoms)
//                 </Typography>
//                 <TextField fullWidth label="Enter symptoms for prediction" value={predictionSymptoms} onChange={(e) => setPredictionSymptoms(e.target.value)} />
//                 <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }} onClick={handlePredict}>
//                     🔍 Predict Disease
//                 </Button>

//                 <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
//                     🖼️ AI Disease Prediction (Image)
//                 </Typography>
//                 <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: "10px" }} />
//                 <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }} onClick={handleImagePredict}>
//                     📷 Upload & Predict
//                 </Button>

//                 {loading ? (
//                     <Typography variant="h6" align="center" color="blue" style={{ marginTop: "10px" }}>
//                         Predicting disease... ⏳
//                     </Typography>
//                 ) : predictedDisease && (
//                     <>
//                         <Typography variant="h6" align="center" color="green" style={{ marginTop: "10px" }}>
//                             Predicted Disease: {predictedDisease}
//                         </Typography>
//                         {predictedTreatment && (
//                             <Typography variant="body1" align="center" color="blue" style={{ marginTop: "10px" }}>
//                                 Suggested Treatment: {predictedTreatment}
//                             </Typography>
//                         )}
//                     </>
//                 )}

//                 <VetLocator />
//             </Paper>
//         </Container>
//     );
// }

// export default App;

// import React, { useState, useEffect } from "react";
// import { addDisease, getDiseases, predictDisease } from "./services/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import VetLocator from "./VetLocator";

// function App() {
//     const [loading, setLoading] = useState(false);   
//     const [name, setName] = useState("");
//     const [symptoms, setSymptoms] = useState("");
//     const [medicines, setMedicines] = useState("");
//     const [homeRemedies, setHomeRemedies] = useState("");
//     const [treatment, setTreatment] = useState(""); // Added state for treatment
//     const [diseases, setDiseases] = useState([]);
//     const [predictionSymptoms, setPredictionSymptoms] = useState("");
//     const [predictedDisease, setPredictedDisease] = useState("");
//     const [predictedTreatment, setPredictedTreatment] = useState(""); // State for predicted treatment

//     useEffect(() => {
//         fetchDiseases();
//     }, []);

//     const fetchDiseases = async () => {
//         const data = await getDiseases();
//         setDiseases(data);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const diseaseData = {
//             name,
//             symptoms: symptoms.split(",").map(s => s.trim()),
//             medicines: medicines.split(",").map(m => m.trim()),
//             home_remedies: homeRemedies.split(",").map(h => h.trim()),
//             treatment // Include treatment in submission
//         };
//         await addDisease(diseaseData);
//         fetchDiseases();
//         setName("");
//         setSymptoms("");
//         setMedicines("");
//         setHomeRemedies("");
//         setTreatment("");
//     };

//     const handlePredict = async () => {
//         setLoading(true);
//         try {
//             const symptomsArray = predictionSymptoms.split(",").map(s => s.trim());
//             const response = await predictDisease(symptomsArray);
//             setPredictedDisease(response.disease);

//             // Find matching disease for treatment
//             const matchedDisease = diseases.find(d => d.name === response.disease);
//             setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
//         } catch (error) {
//             console.error("Prediction error:", error);
//         }
//         setLoading(false);
//     };
    
//     return (
//         <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
//             <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
//                 <Typography variant="h4" style={{ color: "#2E7D32", fontWeight: "bold", marginBottom: "20px" }}>
//                     🐄 VetVector: Livestock Disease Management
//                 </Typography>

//                 <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//                     <TextField fullWidth label="Disease Name" value={name} onChange={(e) => setName(e.target.value)} required />
//                     <TextField fullWidth label="Symptoms (comma-separated)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
//                     <TextField fullWidth label="Medicines (comma-separated)" value={medicines} onChange={(e) => setMedicines(e.target.value)} required />
//                     <TextField fullWidth label="Home Remedies (comma-separated)" value={homeRemedies} onChange={(e) => setHomeRemedies(e.target.value)} required />
//                     <TextField fullWidth label="Treatment Suggestions" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />
//                     <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
//                         ➕ Add Disease
//                     </Button>
//                 </form>

//                 <Typography variant="h5" align="center" gutterBottom>
//                     📋 Stored Diseases
//                 </Typography>
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell><strong>Disease</strong></TableCell>
//                                 <TableCell><strong>Symptoms</strong></TableCell>
//                                 <TableCell><strong>Treatment</strong></TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {diseases.length > 0 ? (
//                                 diseases.map((disease, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{disease.name}</TableCell>
//                                         <TableCell>{disease.symptoms.join(", ")}</TableCell>
//                                         <TableCell>{disease.treatment || "No treatment available"}</TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={3} align="center">No diseases stored yet.</TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
//                     🔮 AI Disease Prediction
//                 </Typography>
//                 <TextField fullWidth label="Enter symptoms for prediction" value={predictionSymptoms} onChange={(e) => setPredictionSymptoms(e.target.value)} />
//                 <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }} onClick={handlePredict}>
//                     🔍 Predict Disease
//                 </Button>
//                 {loading ? (
//                     <Typography variant="h6" align="center" color="blue" style={{ marginTop: "10px" }}>
//                         Predicting disease... ⏳
//                     </Typography>
//                 ) : predictedDisease && (
//                     <>
//                         <Typography variant="h6" align="center" color="green" style={{ marginTop: "10px" }}>
//                             Predicted Disease: {predictedDisease}
//                         </Typography>
//                         {predictedTreatment && (
//                             <Typography variant="body1" align="center" color="blue" style={{ marginTop: "10px" }}>
//                                 Suggested Treatment: {predictedTreatment}
//                             </Typography>
//                         )}
//                     </>
//                 )}

//                 <VetLocator />
//             </Paper>
//         </Container>
//     );
// }

// export default App;




// import React, { useState, useEffect } from "react";
// import { addDisease, getDiseases, predictDisease } from "./services/api";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
// import VetLocator from "./VetLocator";

// function App() {
//     const [loading, setLoading] = useState(false);   
//     const [name, setName] = useState("");
//     const [symptoms, setSymptoms] = useState("");
//     const [medicines, setMedicines] = useState("");
//     const [homeRemedies, setHomeRemedies] = useState("");
//     const [treatment, setTreatment] = useState(""); // Added state for treatment
//     const [diseases, setDiseases] = useState([]);
//     const [predictionSymptoms, setPredictionSymptoms] = useState("");
//     const [predictedDisease, setPredictedDisease] = useState("");
//     const [predictedTreatment, setPredictedTreatment] = useState(""); // State for predicted treatment

//     useEffect(() => {
//         fetchDiseases();
//     }, []);

//     const fetchDiseases = async () => {
//         const data = await getDiseases(setLoading);
//         setDiseases(data);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const diseaseData = {
//             name,
//             symptoms: symptoms.split(",").map(s => s.trim()),
//             medicines: medicines.split(",").map(m => m.trim()),
//             home_remedies: homeRemedies.split(",").map(h => h.trim()),
//             treatment // Include treatment in submission
//         };
//         await addDisease(diseaseData, setLoading);
//         fetchDiseases();
//         setName("");
//         setSymptoms("");
//         setMedicines("");
//         setHomeRemedies("");
//         setTreatment("");
//     };

//     const handlePredict = async () => {
//         setLoading(true);
//         try {
//             const symptomsArray = predictionSymptoms.split(",").map(s => s.trim());
//             const response = await predictDisease(symptomsArray);
//             setPredictedDisease(response.disease);

//             // Find matching disease for treatment
//             const matchedDisease = diseases.find(d => d.name === response.disease);
//             setPredictedTreatment(matchedDisease ? matchedDisease.treatment : "No treatment available.");
//         } catch (error) {
//             console.error("Prediction error:", error);
//         }
//         setLoading(false);
//     };
    
//     return (
//         <Container maxWidth="md" style={{ marginTop: "20px", textAlign: "center" }}>
//             <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
//                 <Typography variant="h4" style={{ color: "#2E7D32", fontWeight: "bold", marginBottom: "20px" }}>
//                     🐄 VetVector: Livestock Disease Management
//                 </Typography>

//                 <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//                     <TextField fullWidth label="Disease Name" value={name} onChange={(e) => setName(e.target.value)} required />
//                     <TextField fullWidth label="Symptoms (comma-separated)" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} required />
//                     <TextField fullWidth label="Medicines (comma-separated)" value={medicines} onChange={(e) => setMedicines(e.target.value)} required />
//                     <TextField fullWidth label="Home Remedies (comma-separated)" value={homeRemedies} onChange={(e) => setHomeRemedies(e.target.value)} required />
//                     <TextField fullWidth label="Treatment Suggestions" value={treatment} onChange={(e) => setTreatment(e.target.value)} required />
//                     <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "10px" }}>
//                         ➕ Add Disease
//                     </Button>
//                 </form>

//                 <Typography variant="h5" align="center" gutterBottom>
//                     📋 Stored Diseases
//                 </Typography>
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell><strong>Disease</strong></TableCell>
//                                 <TableCell><strong>Symptoms</strong></TableCell>
//                                 <TableCell><strong>Treatment</strong></TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {diseases.length > 0 ? (
//                                 diseases.map((disease, index) => (
//                                     <TableRow key={index}>
//                                         <TableCell>{disease.name}</TableCell>
//                                         <TableCell>{disease.symptoms.join(", ")}</TableCell>
//                                         <TableCell>{disease.treatment || "No treatment available"}</TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan={3} align="center">No diseases stored yet.</TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>

//                 <Typography variant="h5" align="center" style={{ marginTop: "20px" }}>
//                     🔮 AI Disease Prediction
//                 </Typography>
//                 <TextField fullWidth label="Enter symptoms for prediction" value={predictionSymptoms} onChange={(e) => setPredictionSymptoms(e.target.value)} />
//                 <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }} onClick={handlePredict}>
//                     🔍 Predict Disease
//                 </Button>
//                 {loading ? (
//                     <Typography variant="h6" align="center" color="blue" style={{ marginTop: "10px" }}>
//                         Predicting disease... ⏳
//                     </Typography>
//                 ) : predictedDisease && (
//                     <>
//                         <Typography variant="h6" align="center" color="green" style={{ marginTop: "10px" }}>
//                             Predicted Disease: {predictedDisease}
//                         </Typography>
//                         {predictedTreatment && (
//                             <Typography variant="body1" align="center" color="blue" style={{ marginTop: "10px" }}>
//                                 Suggested Treatment: {predictedTreatment}
//                             </Typography>
//                         )}
//                     </>
//                 )}

//                 <VetLocator />
//             </Paper>
//         </Container>
//     );
// }

// export default App;
// import axios from "axios";

// const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Backend URL from .env
// const PREDICTION_API_URL = process.env.REACT_APP_AI_URL || "http://localhost:8000"; // AI Prediction API URL

// // Function to add a new disease
// export const addDisease = async (diseaseData, setLoading = null) => {
//     try {
//         if (setLoading) setLoading(true); // Show loading indicator
//         const response = await axios.post(`${API_URL}/add-disease`, diseaseData);
//         return response.data;
//     } catch (error) {
//         console.error("Error adding disease:", error.response?.data || error.message);
//         return { error: "Failed to add disease. Please try again." };
//     } finally {
//         if (setLoading) setLoading(false); // Hide loading indicator
//     }
// };

// // Function to get all diseases
// export const getDiseases = async (setLoading = null) => {
//     try {
//         if (setLoading) setLoading(true);
//         const response = await axios.get(`${API_URL}/diseases`);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching diseases:", error.response?.data || error.message);
//         return { error: "Failed to fetch diseases." };
//     } finally {
//         if (setLoading) setLoading(false);
//     }
// };

// // Function to predict disease using AI
// export const predictDisease = async (symptoms) => {
//     try {
//         const response = await axios.post("http://localhost:5000/api/predict", { symptoms }); // ✅ Correct port
//         return response.data;
//     } catch (error) {
//         console.error("Error predicting disease:", error);
//         return { error: "Failed to predict disease" };
//     }
// };
// App.js
// import React, { useState } from "react";
// //import { useEffect } from "react";
// import { Card, CardContent, Button, Input, Textarea } from './components/ui'; // Assuming you have Shadcn UI components

// const App = () => {
//   const [symptoms, setSymptoms] = useState("");
//   const [image, setImage] = useState(null);
//   const [prediction, setPrediction] = useState(null);
//   const [stores, setStores] = useState([]);
//   const [feedback, setFeedback] = useState("");

//   const handleImageUpload = (event) => {
//     setImage(event.target.files[0]);
//   };

//   const handleSubmit = () => {
//     // Simulating the AI prediction process
//     setPrediction({
//       disease: "Foot and Mouth Disease",
//       treatment: "Administer Penicillin and isolate affected cattle.",
//       medicine: "Penicillin injection.",
//     });

//     // Simulate store data
//     setStores([
//       { name: "VetMedic Store", distance: "2 km" },
//       { name: "Farmers Supplies", distance: "5 km" },
//     ]);
//   };

//   const handleFeedbackSubmit = () => {
//     // Send feedback to AI improvement system
//     alert("Feedback submitted!");
//     setFeedback("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col">
//       {/* Landing Section */}
//       <header className="bg-green-500 text-white py-8 text-center">
//         <h1 className="text-4xl font-semibold">AI Livestock Disease Prediction</h1>
//         <p className="mt-4 text-xl">
//           Early detection and treatment for better livestock health and food security.
//         </p>
//       </header>

//       {/* Symptom Input Form */}
//       <section className="flex flex-col items-center p-8">
//         <Card className="w-full max-w-md">
//           <CardContent>
//             <h2 className="text-xl mb-4">Input Symptoms or Upload Image</h2>
//             <Input
//               placeholder="Describe symptoms..."
//               value={symptoms}
//               onChange={(e) => setSymptoms(e.target.value)}
//               className="mb-4"
//             />
//             <input type="file" onChange={handleImageUpload} className="mb-4" />
//             <Button onClick={handleSubmit} className="w-full bg-green-500 text-white">
//               Analyze Symptoms
//             </Button>
//           </CardContent>
//         </Card>
//       </section>

//       {/* Results Section */}
//       {prediction && (
//         <section className="flex flex-col items-center p-8 bg-white shadow-md rounded-lg">
//           <h2 className="text-2xl font-semibold">Prediction Result</h2>
//           <div className="mt-4">
//             <p><strong>Predicted Disease:</strong> {prediction.disease}</p>
//             <p><strong>Treatment:</strong> {prediction.treatment}</p>
//             <p><strong>Suggested Medicine:</strong> {prediction.medicine}</p>
//           </div>
//         </section>
//       )}

//       {/* Store Locator Section */}
//       {stores.length > 0 && (
//         <section className="flex flex-col items-center p-8">
//           <h2 className="text-xl font-semibold">Nearby Veterinary Stores</h2>
//           <ul className="mt-4 space-y-2">
//             {stores.map((store, index) => (
//               <li key={index} className="flex justify-between items-center w-full max-w-md bg-gray-100 p-4 rounded-md shadow-md">
//                 <span>{store.name}</span>
//                 <span>{store.distance}</span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* Veterinarian Consultation Section */}
//       <section className="flex flex-col items-center p-8 bg-green-100 mt-8">
//         <h2 className="text-xl font-semibold">Need Expert Advice?</h2>
//         <Button className="mt-4 bg-green-500 text-white">Schedule Veterinarian Consultation</Button>
//       </section>

//       {/* Feedback Section */}
//       <section className="flex flex-col items-center p-8 bg-white mt-8">
//         <h2 className="text-xl font-semibold">Feedback for AI Improvement</h2>
//         <Textarea
//           value={feedback}
//           onChange={(e) => setFeedback(e.target.value)}
//           placeholder="Your feedback..."
//           rows="4"
//           className="mt-4 mb-4 w-full max-w-md"
//         />
//         <Button onClick={handleFeedbackSubmit} className="bg-green-500 text-white">
//           Submit Feedback
//         </Button>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center py-4 mt-8">
//         <p>© 2025 AI Livestock Disease Prediction. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default App;