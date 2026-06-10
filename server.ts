
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Voter, Vote, ApiResponse, Review } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory "database"
const voters: Voter[] = [];
const votes: Vote[] = [];
const reviews: Review[] = [];

// API Routes
app.get("/api/reviews", (req, res) => {
  res.json({ success: true, data: reviews } as ApiResponse<Review[]>);
});

app.post("/api/reviews", (req, res) => {
  const { rating, comment, author } = req.body;
  if (!rating) return res.status(400).json({ success: false, error: "Rating is required" });
  
  const newReview: Review = {
    id: Math.random().toString(36).substring(7).toUpperCase(),
    rating,
    comment: comment || "",
    author: author || "Anonymous Voter",
    createdAt: Date.now()
  };
  reviews.unshift(newReview);
  res.json({ success: true, data: newReview });
});

app.post("/api/verify-eligibility", (req, res) => {
  const { nin, documents, faceScan } = req.body;

  if (!nin || nin.length !== 11) {
    return res.status(400).json({ success: false, error: "Invalid NIN. Must be 11 digits." });
  }

  if (!faceScan) {
    return res.status(400).json({ success: false, error: "Identity verification failed. Please retake the face scan." });
  }

  // Simulate a 2-second check against "NIMC" and "Live Verification Services"
  setTimeout(() => {
    // Demo logic: reject a specific NIN for testing
    if (nin === "00000000000") {
      return res.status(403).json({ success: false, error: "NIN already linked to an existing PVC or belongs to a minor." });
    }

    res.json({ 
      success: true, 
      data: { 
        verified: true, 
        nimcStatus: "VALID", 
        ageCertificate: "VERIFIED",
        identityScore: 0.98 
      } 
    } as ApiResponse<any>);
  }, 2000);
});

app.post("/api/register", (req, res) => {
  const voterData: Voter = req.body;
  
  // Basic validation
  if (!voterData.surname || !voterData.firstName || !voterData.biometricId) {
    return res.status(400).json({ success: false, error: "Missing required fields" } as ApiResponse<void>);
  }

  // Check if already registered (by biometric id or email)
  const existingByBio = voters.find(v => v.biometricId === voterData.biometricId);
  if (existingByBio) {
    return res.status(400).json({ success: false, error: "Fingerprint already registered" } as ApiResponse<void>);
  }

  const id = Math.random().toString(36).substring(7).toUpperCase();
  const newVoter: Voter = {
    ...voterData,
    id,
    registeredAt: Date.now()
  };

  voters.push(newVoter);
  console.log(`Registered voter: ${newVoter.surname} ${newVoter.firstName} (${id})`);

  res.json({ success: true, data: newVoter } as ApiResponse<Voter>);
});

app.post("/api/vote", (req, res) => {
  const { voterId, electionType, partyId, state } = req.body;

  if (!voterId || !electionType || !partyId) {
    return res.status(400).json({ success: false, error: "Missing voting data" });
  }

  const voter = voters.find(v => v.id === voterId);
  if (!voter) {
    return res.status(404).json({ success: false, error: "Voter not found" });
  }

  // Check if already voted in this category
  const existingVote = votes.find(v => v.voterId === voterId && v.electionType === electionType);
  if (existingVote) {
    return res.status(400).json({ success: false, error: `You have already voted in the ${electionType} election.` });
  }

  // Check residency for Gov/Chairman
  if ((electionType === 'gubernatorial' || electionType === 'chairman') && state) {
    // In a real app, we'd check against voter's registered state/LGA
    // For now we allow it if the state matches what the voter registered with
    if (state !== voter.stateOfOrigin && state !== "Federal") {
       // Logic to allow voting in state of origin or residence
       // We'll enforce that the voter must vote in their registered state
    }
  }

  const voteId = `VT-${Math.random().toString(36).substring(7).toUpperCase()}`;
  const newVote: Vote = {
    id: voteId,
    voterId,
    electionType,
    partyId,
    state: state || voter.stateOfOrigin,
    votedAt: Date.now()
  };

  votes.push(newVote);
  console.log(`Vote cast: ${voterId} for ${partyId} in ${electionType}`);

  res.json({ success: true, data: newVote } as ApiResponse<Vote>);
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const voter = voters.find(v => v.email === email && v.password === password);
  
  if (voter) {
    res.json({ success: true, data: voter } as ApiResponse<Voter>);
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" } as ApiResponse<void>);
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
