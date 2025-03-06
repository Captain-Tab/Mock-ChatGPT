import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import logo from '../static/logo.png';
import answerLogo from '../static/answer.png';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


interface IMessageBubbleProps {
  text: string;
  isUser: boolean;
  showLoading: boolean;
  idx: number;
  handleCopy: (idx: number) => void
}

export const MessageBubble = ({ text, isUser, showLoading, idx, handleCopy }: IMessageBubbleProps) => {  
  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: 2,
        width: "100%"
      }}
    >
      <Box
        sx={{
          borderRadius: 2,
          maxWidth: '98%',
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={isUser ? logo : answerLogo } alt="_user" style={{width: "30px", height: "30px", paddingRight: "10px"}}/>
          <p>{isUser ? "You": "ChatGPT" }</p> 
        </div>
        <div style={{ width: "100%" }}>{showLoading && !isUser ? <CircularProgress style={{ width: "30px", height: "30px" }} /> : 
          <div>
            <Typography>{text}</Typography>
            {!isUser && <Tooltip title="Copy" placement='top' onClick={() => handleCopy(idx)}>
              <ContentCopyIcon style={{ cursor: "pointer", width: "15px", height: "15px" }} />
            </Tooltip>}
          </div>
        } </div>
      </Box>
    </Box>
  );
};

export default MessageBubble;