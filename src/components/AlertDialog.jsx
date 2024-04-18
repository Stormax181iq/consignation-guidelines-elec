import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({ validConsignation }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button className="bg-emerald-500 p-2" onClick={handleClickOpen}>
        Valider
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Valider la consignation ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            La consignation actuelle sera supprimée. Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose} className="bg-slate-200 p-1 m-1">
            Annuler
          </button>
          <button
            onClick={validConsignation}
            className="bg-slate-200 p-1 m-1"
            autoFocus
          >
            Valider
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
}
