import {useState} from "react";
import UploadBox from "./components/UploadBox";
import QABox from "./components/QABox";
import ResultView from "./components/ResultView";

export default function App(){

const [result,setResult]=useState("");

return(
<div style={{padding:40}}>
<h1>🚀 LearnFlow AI</h1>

<UploadBox setResult={setResult}/>
<hr/>
<QABox setResult={setResult}/>
<ResultView result={result}/>

</div>
);
}