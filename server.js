const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Route untuk mengecek apakah server berjalan
app.get("/", (req, res) => {
    res.send("API is running!");
});

// Endpoint untuk mengeksekusi kode
app.post("/execute", (req, res) => {
    const { code } = req.body;

    try {
        const result = eval(code); // ⚠️ Jangan gunakan eval di produksi!
        res.json({ success: true, output: result });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

// Function to try starting server on a range of ports
function startServer(port, maxAttempts = 10) {
  if (maxAttempts <= 0) {
    console.error('Failed to find an available port after multiple attempts');
    process.exit(1);
    return;
  }

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  }).on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying alternative port ${port + 1}`);
      startServer(port + 1, maxAttempts - 1);
    } else {
      console.error('Server error:', e);
    }
  });
}

// Start the server with initial port
startServer(PORT);
