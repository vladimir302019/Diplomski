import React, { useState } from 'react';
import { Button, Modal, TextField } from '@mui/material';
import './Modal.css'

const MyModal = ({ open, onClose, onPasswordChange }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (newPassword === confirmNewPassword) {
      onPasswordChange(currentPassword, newPassword);
      onClose();
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <Modal open={open} onClose={onClose} >
      <div className="modal-container" >
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
            sx={{display: "block"}}
            required
            margin="normal"
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
            sx={{display: "block"}}
            margin="normal"
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            required
            margin="normal"
           sx={{display: "block"}}
          />
          <Button sx= {{mt: 1}} type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button sx= {{ml:2, mt: 1}}onClick={onClose} variant="contained" color="secondary">
            Cancel
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default MyModal;
