import {useState} from "react";
import {api} from "../services/api";

export default function UploadBox({setResult}){

const [text,setText]=useState("");
const [file,setFile]=useState(null);

const explainText=async()=>{
 const res=await api.post("/explain",{content:text});
 setResult(res.data.explanation);
};

const uploadPDF=async()=>{
 const fd=new FormData();
 fd.append("file",file);
 const res=await api.post("/explain/upload",fd);
 setResult(res.data.explanation);
};

return(
<>
<textarea
placeholder="Paste documentation"
onChange={e=>setText(e.target.value)}
/>

<button onClick={explainText}>
Explain Text
</button>

<input type="file"
onChange={e=>setFile(e.target.files[0])}
/>

<button onClick={uploadPDF}>
Upload PDF
</button>
</>
);
}