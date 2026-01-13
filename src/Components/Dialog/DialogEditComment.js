import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const DialogEditComment = ({ open, content, onChange, onClose, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Sửa Bình Luận</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          value={content}
          onChange={onChange}
          variant="outlined"
          InputProps={{ style: { width: '400px' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={onSave} color="primary">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditComment;
