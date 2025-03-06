import React from 'react';
import { TextField, Box } from '@mui/material';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import InputAdornment from '@mui/material/InputAdornment';

interface InputBoxProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  loading: boolean;
}

const InputBox = ({ input, setInput, onSubmit, loading }: InputBoxProps) => {
  const handleKeyDonw = (e: React.KeyboardEventHandler<HTMLDivElement> | any) => {
    e.code === 'Enter' && onSubmit();   
  }

  return (
    <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Message ChatGPT..."
        disabled={loading}
        onKeyDownCapture={handleKeyDonw}
         slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end"
                style={{ "cursor": "pointer" }}
                onClick={onSubmit}>
                <ArrowCircleUpIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      

    </Box>
  );
  };

export default InputBox;