import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DialogConfirm = ({ open = false, onClose, onConfirm }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Bạn có chắc chắn muốn xóa không?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button onClick={onConfirm} autoFocus>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default DialogConfirm;
