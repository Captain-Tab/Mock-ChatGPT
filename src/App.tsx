import React, { useState, useRef } from 'react';
import { Container, Box, TextField } from '@mui/material';
import MessageBubble from './components/MessageBubble';
import InputBox from './components/InputBox';
import Notification from './components/Notification';

const DEFAULT_APIKEY = "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";

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>(DEFAULT_APIKEY);
  const [openNotice, SetOpenNotice] = useState(false);
  const [noticeText, SetNoticeText] = useState('');
  const [userInput, setUserInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const handleSaveApiKey = (newInput: string) => {
    if (!newInput) {
      showNotice(true, 'Please enter a valid API Key.');
      return
    }
    setApiKey(newInput.trim());
    showNotice(true, 'API Key saved!');
  };

  const showNotice = (show: boolean, text?: string) => {
    SetOpenNotice(show);
    SetNoticeText(text ? text: '');
  }

  const copyToClipboard = async (historyIdx: number): Promise<boolean> => {
    try {
    const text = chatHistory[historyIdx].content
    await navigator.clipboard.writeText(text);
    showNotice(true, 'Answers copied to clipboard');
    return true;
    } catch (error) {
    showNotice(true, 'Copy Failed');
    return false;
  }
};

  const validateInput = (): boolean => {
    if (!userInput.trim() || !apiKey.trim()) {
      alert('Please enter a message and ensure your API Key is set.');
      return false;
    }
    return true;
  };
  
  // Update Chat history
  const updateChatHistory = (role: string, content: string) => {
    setChatHistory((prev) => [...prev, { role, content }]);
  };
  
  // Request OpenRouter ApI and return Stream data
  const fetchStreamingResponse = async (messages: Array<{ role: string; content: string }>) => {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-1106',
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return response.body?.getReader();
  };
  
  // Parse the Steam Data
  const parseStreamData = (data: string): string => {
    try {
      const jsonString = data.replace(/^data: /, '').trim();
      if (jsonString === ": OPENROUTER PROCESSING") {
        return ""
      }
      const json = JSON.parse(jsonString);
      return json.choices[0].delta?.content || '';
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return '';
    }
  };
  
  // Continuously update the display response content
  const processStream = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let aiResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() === '') continue;
        const data = line.replace('data: ', '').trim();
        if (data === '[DONE]') break;
        const content = parseStreamData(data);
        // eslint-disable-next-line 
        aiResponse += content;
        // eslint-disable-next-line 
        setChatHistory((prev) => {      
          return prev[prev.length - 1].role === 'assistant' ?
            [...prev.slice(0, -1), { role: 'assistant', content: aiResponse }] :
            [...prev, { role: 'assistant', content: aiResponse }]
        });
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
      }
    }
  };

  const handleSendMessage = async () => {
    if (!validateInput()) return;

    setIsLoading(true);
    updateChatHistory('user', userInput);
    setUserInput('');

    const newChatHistory = [...chatHistory, { role: 'user', content: userInput }];
    try {
      const reader = await fetchStreamingResponse(newChatHistory);
      reader && await processStream(reader);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      alert('Failed to fetch AI response. Please check your API Key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '80vh', overflowY: 'auto', marginBottom: 2, paddingTop: 5 }}>
        <Notification open={openNotice} message={noticeText} handleClose={ ()=> showNotice(false)} />
        <TextField
          fullWidth
          type="text"
          style={{ marginBottom: 6 }}
          label="OpenRouter API Key"
          placeholder="Enter your OpenRouter API Key"
          value={apiKey}
          onChange={(e) => handleSaveApiKey(e.target.value)}
        />
         {chatHistory.map((message, idx) => (
           <MessageBubble
             key={idx}
             idx={idx}
             text={message.content}
             showLoading={isLoading && chatHistory.length -1 === idx}
             isUser={message.role === "user"}
             handleCopy={copyToClipboard}
           />
        ))}
      </Box>
      <InputBox
        input={userInput}
        loading={isLoading} 
        setInput={setUserInput}
        onSubmit={handleSendMessage}
       />
    </Container>
  );
};

export default App;
