import { useState, useEffect } from "react";
import {  askAI  } from "../services/aiService";

function AskAIModal({
    show,
    onClose,
    diagnosis,
    language,
    initialQuestion
}){

const [question,setQuestion]=useState("");

const [messages,setMessages]=useState([]);

const [loading,setLoading]=useState(false);
useEffect(() => {

    if (show) {
        setMessages([]);
        setQuestion("");
    }

}, [show]);
useEffect(() => {

    if (show && initialQuestion) {
        sendQuestion(initialQuestion);
    }

}, [show, initialQuestion]);

if(!show) return null;

const sendQuestion = async (customQuestion) => {

  const finalQuestion = customQuestion || question;

if (!finalQuestion.trim()) return;

    const userMessage = {
        sender: "user",
        text: finalQuestion
    };

    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {

        const res = await askAI({

            page: "leaf",

            diagnosis,

           question: finalQuestion,

            language

        });

        setMessages(prev => [

            ...prev,

            {
                sender: "ai",
                text: res.answer
            }

        ]);

       if (!customQuestion) {
    setQuestion("");
}

    } catch (err) {

        alert("AI unavailable");

    }

    setLoading(false);

};

return(

<div
className="modal fade show"
style={{display:"block",background:"rgba(0,0,0,.5)"}}
>

<div className="modal-dialog modal-lg">

<div className="modal-content">

<div className="modal-header">

<h5>

🤖 Ask AI

</h5>

<button
className="btn-close"
onClick={onClose}
/>

</div>

<div
className="modal-body"
style={{

height:"450px",
overflowY:"auto"

}}
>

<div className="mb-3">

<button
className="btn btn-outline-success me-2 mb-2"
onClick={()=>setQuestion("Can I save this crop?")}
>

Can I save this crop?

</button>

<button
className="btn btn-outline-success me-2 mb-2"
onClick={()=>setQuestion("Best pesticide?")}
>

Best pesticide?

</button>

<button
className="btn btn-outline-success me-2 mb-2"
onClick={()=>setQuestion("Organic treatment?")}
>

Organic treatment?

</button>

<button
className="btn btn-outline-success mb-2"
onClick={()=>setQuestion("Recovery time?")}
>

Recovery time?

</button>

</div>

{

messages.map((msg,index)=>(

<div

key={index}

className={`mb-3 d-flex ${msg.sender==="user"?"justify-content-end":"justify-content-start"}`}

>

<div

className={`p-3 rounded ${
msg.sender==="user"
?"bg-success text-white"
:"bg-light"
}`}

style={{maxWidth:"75%"}}

>

{msg.text}

</div>

</div>

))

}

</div>

<div className="modal-footer">

<input

className="form-control"

placeholder="Ask anything..."

value={question}

onChange={(e)=>setQuestion(e.target.value)}

/>

<button

className="btn btn-success"

onClick={() => sendQuestion()}

disabled={loading}

>

{

loading

?

"Thinking..."

:

"Send"

}

</button>

</div>

</div>

</div>

</div>

);

}

export default AskAIModal;