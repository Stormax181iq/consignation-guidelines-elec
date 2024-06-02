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
  enabledButtonText,
  disabledButtonText,
  dialogButtonText,
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
        className="bg-[color:var(--enedis-green)] rounded-lg p-2 disabled:bg-slate-300 hover:ring-2 hover:ring-[color:var(--enedis-blue)] active:bg-[color:var(--enedis-blue)]"
        disabled={isDisabled}
        onClick={handleClickOpen}
      >
        {isDisabled ? disabledButtonText : enabledButtonText}
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
          <button
            onClick={handleClose}
            className="bg-slate-300 rounded-lg p-2 m-1 hover:ring-2 hover:ring-[color:var(--enedis-blue)] active:bg-[color:var(--enedis-blue)]"
          >
            Annuler
          </button>
          <button
            onClick={onAction}
            className="bg-[color:var(--enedis-green)] rounded-lg p-2 m-1 hover:ring-2 hover:ring-[color:var(--enedis-blue)] active:bg-[color:var(--enedis-blue)]"
            autoFocus
          >
            {dialogButtonText}
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
  enabledButtonText: PropTypes.string.isRequired,
  disabledButtonText: PropTypes.string.isRequired,
  dialogButtonText: PropTypes.string.isRequired,
};
