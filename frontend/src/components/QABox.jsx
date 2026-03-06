import {useState} from "react";
import {api} from "../services/api";

export default function QABox({setResult}){

const [q,setQ]=useState("");

const ask=async()=>{
 const res=await api.post("/qa",{question:q});
 setResult(res.data.answer);
};

return(
<>
<input
placeholder="Ask a question"
onChange={e=>setQ(e.target.value)}
/>
<button onClick={ask}>Ask</button>
</>
);
}