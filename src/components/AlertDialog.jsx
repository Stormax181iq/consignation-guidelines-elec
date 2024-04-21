import { useState } from "react";
import PropTypes from "prop-types";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  onAction,
  isDisabled,
  title,
  content,
  buttonText,
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        className="bg-emerald-500 p-2 disabled:bg-slate-300"
        disabled={isDisabled}
        onClick={handleClickOpen}
      >
        Valider
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="bg-slate-200 p-1 m-1">
            Annuler
          </button>
          <button onClick={onAction} className="bg-slate-200 p-1 m-1" autoFocus>
            {buttonText}
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AlertDialog.propTypes = {
  onAction: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
};
