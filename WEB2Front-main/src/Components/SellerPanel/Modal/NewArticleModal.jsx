import React from 'react'
import { newArticleAction } from '../../../Store/articleSlice';
import { useState, useRef } from 'react';
import { Button, CssBaseline, Modal, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import ProfileFormImage from '../../Profile/ProfileFormImage';
import Title from '../../AdminPanel/Title/Title';
import {toast} from "react-toastify";


export default function NewArticleModal({open, onClose,}) {
    const dispatch = useDispatch();

  const [isNameValid, setIsNameValid] = useState(false);
  const [isNameBlur, setIsNameBlur] = useState(false);
  
  const [isDescriptionValid, setIsDescriptionValid] = useState(false);
  const [isDescriptionBlur, setIsDescriptionBlur] = useState(false);
  
  const [isPriceValid, setIsPriceValid] = useState(false);
  const [isPriceBlur, setIsPriceBlur] = useState(false);
  
  const [isMaxQValid, setIsMaxQValid] = useState(false);
  const [isMaxQBlur, setIsMaxQBlur] = useState(false);


  const handleNameBlur = (event) => {
    setIsNameBlur(true)
  }

  const handleDescriptionBlur = (event) => {
    setIsDescriptionBlur(true)
  }

  const handlePriceBlur = (event) => {
    
    setIsPriceBlur(true);
  }
  const handleMaxQBlur = (event) => {
    setIsMaxQBlur(true)
  }

    const imageInput = useRef(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [uploadFile, setUploadFile] = useState(null);
    const [displayImage, setDisplayImage] = useState(null);
    const imgUrl = process.env.PUBLIC_URL + '/no-image.jpg';
      
      const handleDescriptionChange = (newDescription) => {
        setIsDescriptionValid(newDescription.trim().length > 0);
        if(isDescriptionValid) setDescription(newDescription);
      };
      const handlePriceChange = (newPrice) => {
       if(!isNaN(newPrice)){
        setIsPriceValid(true);
        setPrice(newPrice);
       }
       else{
        setIsPriceValid(false);
       }
      };
      const handleQuantityChange = (newQuantity) => {
        if(!isNaN(newQuantity)){
          setIsMaxQValid(true);
          setQuantity(newQuantity);
         }
         else{
          setIsMaxQValid(false);
         }
      };
      const handleNameChange = (newName) => {
        setIsNameValid(newName.trim().length > 0);
        if(isNameValid)setName(newName);
      };

      const imageUploadHandler = () => {
        if (!imageInput.current) {
          return;
        }
        imageInput.current.children[0].click();
      };

      const imageChangeHandler = (event) => {
        if (!event.target.files) {
          return;
        }
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            setDisplayImage(reader.result.toString());
          };
        }
        setUploadFile(file);
      };


    const handleSubmit = (event) => {
        event.preventDefault();
      
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("maxQuantity", quantity);
        formData.append("formFile", uploadFile);
        if(!uploadFile)
        {
          toast.error("All fields are required!",{
            position: "top-center",
            autoClose: 2500,
            closeOnClick: true,
            pauseOnHover: false,
        });
        return;
        }
        const add = () => {
              dispatch(newArticleAction(formData))
                .unwrap()
                .then(() => {
                    setDisplayImage(imgUrl);
                    onClose();
                })
                .catch((error) => {
                    console.error("Adding article error: ", error);
                });
        }
        add();
    }

    return (
        <Modal open={open} onClose={onClose} >
         
            <div className="custom-modal"> 
            <Title >ADD NEW PRODUCT</Title><br/>
            
                <Box component="form" noValidate onSubmit={handleSubmit}>
                
                    <div style={{ display: 'flex' }}>
                        <Box
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}
                        >
                            {<ProfileFormImage
                                disabled={true}
                                image={displayImage ? displayImage : imgUrl}
                                imageInput={imageInput}
                                uploadHandler={imageChangeHandler}
                                avatarClickHandler={imageUploadHandler}
                            ></ProfileFormImage>}
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            sx={{ justifyContent: 'flex-end', alignItems: 'center', mt: -2 }}
                        >
                            <TextField onBlur={handleNameBlur} error={!isNameValid && isNameBlur}  //helperText={isNameValid ? 'This field is required!' : ''}
                            label="Name" id="name" margin="normal" onChange={(e) => handleNameChange(e.target.value)} />
                            <TextField onBlur={handleDescriptionBlur} error={!isDescriptionValid && isDescriptionBlur}
                            label="Description" id="description" margin="normal"  onChange={(e) => handleDescriptionChange(e.target.value)} />
                            <TextField onBlur={handlePriceBlur} inputProps={{ min: 0 }}  error={!isPriceValid && isPriceBlur}
                            label="Price" type="number" id="price" margin="normal"  onChange={(e) => handlePriceChange(parseInt(e.target.value))} />
                            <TextField onBlur={handleMaxQBlur} inputProps={{ min: 0 }} error={!isMaxQValid && isMaxQBlur}
                            label="Quantity" type="number" id="maxQuantity" margin="normal"  onChange={(e) => handleQuantityChange(e.target.value)} />
                        </Box>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Button sx={{ mt: 1 }} type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                        <Button sx={{ ml: 2, mt: 1 }} onClick={onClose} variant="contained" color="secondary">
                            Cancel
                        </Button>
                    </Box>
               </Box>
            </div>
        </Modal>
    )
}
