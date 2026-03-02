import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const generateTextExplanation = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/explain",
      { content: text }
    );
    setResult(res.data.explanation);
  };

  const uploadPDF = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:5000/api/explain/upload",
      formData
    );

    setResult(res.data.explanation);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>🚀 LearnFlow AI</h1>

      <h3>Explain Text</h3>
      <textarea
        rows="6"
        style={{ width: "100%" }}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste documentation..."
      />
      <br />
      <button onClick={generateTextExplanation}>
        Generate Explanation
      </button>

      <hr />

      <h3>Upload PDF</h3>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br />
      <button onClick={uploadPDF}>
        Upload & Explain PDF
      </button>

      <pre style={{ marginTop: 20 }}>
        {result}
      </pre>
    </div>
  );
}

export default App;