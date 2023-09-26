import { InputLabel, Box, TextField } from "@mui/material";
import React, { useState } from "react";

const ProfileFormField = (props) => {
    const [value, setValue] = useState(props.initialValue);

    const changeHandler = (event) =>{
        setValue(event.currentTarget.value);
    }

    return (
        <Box>
            <InputLabel sx={{mb:-2}} htmlFor={props.id}>{props.label}</InputLabel>
            <TextField
            sx={{width:'20rem'}}
            disabled={!props.editable}
            margin="normal"
            variant="outlined"
            key={props.id}
            id={props.id}
            name={props.id}
            value={value}
            onChange={changeHandler}
            InputProps={{
                disableunderline: 'true',
                style: {fontSize:18},
            }}></TextField>
        </Box>
    );
};

export default ProfileFormField;