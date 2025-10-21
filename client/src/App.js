import React, { useState, useEffect} from 'react';
import './App.css';

const socket = new WebSocket('ws://localhost:5000');

const InputChange = (setter) =>{
const handleInputChange = (e) => {
    const newDocuments = e.target.value;
    setter(newDocuments);
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log("Kirim")
      socket.send(JSON.stringify({ type: 'update', data: newDocuments }));
    }
};
return handleInputChange
}


function App() {
  const [ documents, setDocuments ] = useState("");
  //const [ socket, setsocket ] = useState(null);
  
  useEffect(() => {


    socket.onopen = () => {
      console.log('WebSocket Client nyambung');
    };

    socket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === 'init') {
          setDocuments(data.data);
          // setsocket(false);
        } else if (data.type === 'update') {
          setDocuments(data.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket Client disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

  }, []);

  const handleInputChange = InputChange(setDocuments);

  return (
    <div className="App">
      <h1>Real-time Dokumen Editor</h1>
        <textarea
          value={documents}
          onChange={handleInputChange}
          rows="20"
          cols="80"
        />
    </div>
  );
}

export default App;
// ...?