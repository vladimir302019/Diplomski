import React from "react";
import { InputLabel, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ProfileFormDate = (props) => {
  
  return (
    <Box>
      <InputLabel sx={{ mb: -2 }} htmlFor={props.id}>
        {props.label}
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        disabled={!props.editable}
        required
        defaultValue={dayjs(props.initialValue)}
        onChange={(value) => props.setValue(new Date(value))}
        sx={{
          mt: 2,
          mb: 1,
          width: "20rem",
        }}
        slotProps={{ textField: { variant: "standard" } }}
      />
      </LocalizationProvider>
    </Box>
  );
};

export default ProfileFormDate;