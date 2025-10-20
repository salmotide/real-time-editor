import React, { useState, useEffect} from 'react';
import './App.css';


function App() {
  const [ documents, setDocuments ] = useState("");
  const [ sockets, setSockets ] = useState(null);
  
  useEffect(() => {
    const newsocket = new WebSocket('ws://localhost:5000');
    setSockets(newsocket);

    newsocket.onopen = () => {
      console.log('WebSocket Client nyambung');
    };

    newsocket.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === 'init') {
          setDocuments(data.documents);
          setSockets(false);
        } else if (data.type === 'update') {
          setDocuments(data.documents);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newsocket.onclose = () => {
      console.log('WebSocket Client disconnected');
    };

    newsocket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      newsocket.close();
    };
  }, []);

  const handleInputChange = (e) => {
    const newDocuments = e.target.value;
    setDocuments(newDocuments);
    if (sockets && sockets.readyState === WebSocket.OPEN) {
      sockets.send(JSON.stringify({ type: 'update', documents: newDocuments }));
    }
  };

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
