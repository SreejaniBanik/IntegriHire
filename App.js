import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobText, setJobText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!jobText.trim()) {
      setResult("Please paste a job description first.");
      return;
    }

    setLoading(true);
    setResult('');
    
    try {
      const res = await axios.post('http://localhost:5000/analyze', {
        text: jobText,
      });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      setResult("⚠️ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Reality Job Detector 🔎</h2>
        <textarea
          rows={10}
          cols={60}
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste a job or internship posting here..."
        />
        <br />
        <button onClick={handleCheck} disabled={loading}>
          {loading ? 'Analyzing...' : 'Check Authenticity'}
        </button>

        {result && (
          <div className="result-box">
            <h3>Result:</h3>
            <p>{result}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
