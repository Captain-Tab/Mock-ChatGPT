import Snackbar, {SnackbarOrigin} from '@mui/material/Snackbar';

interface INotificationProps {
  vertical?: SnackbarOrigin["vertical"];
  horizontal?: SnackbarOrigin["horizontal"];
  duration?: number;
  open: boolean;
  message: string;
  handleClose: () => void;
}

const Notification = ({ vertical = "bottom", horizontal = "left",  duration = 1000,open, message,handleClose }: INotificationProps) => {
  return (
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        message={message}
        key={vertical + horizontal}
        autoHideDuration={duration}
        onClose={handleClose}
    />
    );
  };

export default Notification;