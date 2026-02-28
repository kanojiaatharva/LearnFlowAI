import { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const generateExplanation = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/explain",
      { content: text }
    );

    setResult(res.data.explanation);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🚀 LearnFlow AI</h1>

      <textarea
        rows="8"
        style={{ width: "100%" }}
        placeholder="Paste documentation or code here..."
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={generateExplanation}>
        Generate Explanation
      </button>

      <pre style={{ marginTop: "20px" }}>
        {result}
      </pre>
    </div>
  );
}

export default App;