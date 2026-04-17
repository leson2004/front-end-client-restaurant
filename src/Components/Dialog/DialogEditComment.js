import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";

const DialogEditComment = ({ open, content, onChange, onClose, onSave, saving = false }) => {
  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Sửa bình luận</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          value={content}
          onChange={onChange}
          variant="outlined"
          placeholder="Nội dung bình luận..."
          margin="normal"
          disabled={saving}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" disabled={saving}>
          Hủy
        </Button>
        <Button onClick={onSave} color="primary" variant="contained" disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditComment;
