import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, TextField } from '@mui/material';
import '../../Profile/Modal/Modal.css'
import { useDispatch } from 'react-redux';
import { updateArticleAction, uploadArticleImageAction } from '../../../Store/articleSlice';
import ProfileFormImage from '../../Profile/ProfileFormImage';
import Box from '@mui/material/Box';

const UpdateModal = ({ open, onClose, article}) => {
  const dispatch = useDispatch();
  const [description, setDescription] = useState(article.description);
  const [quantity, setQuantity] = useState(article.maxQuantity);
  const [price, setPrice] = useState(article.price);
  const imageSrc = `data:image/*;base64,` + article.photoUrl;
  const imageInput = useRef(null);
  const [displayImage, setDisplayImage] = useState(process.env.PUBLIC_URL + '/no-image.jpg');

  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [isPriceValid, setIsPriceValid] = useState(true);
  const [isMaxQValid, setIsMaxQValid] = useState(true);

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
    const imageData = new FormData();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setDisplayImage(reader.result.toString());
      };
      imageData.append('Id', article.id);
      imageData.append('File', file);
      dispatch(uploadArticleImageAction(imageData))
        .unwrap()
        .then()
        .catch((error) => {
          console.error("Image upload error: ", error);
        });
    }
   
  };


  useEffect(() => {
    setDescription(article.description);
    setQuantity(article.maxQuantity);
    setPrice(article.price);
  }, [article]);

  const handleDescriptionChange = (newDescription) => {
    setIsDescriptionValid(newDescription.trim().length > 0);
    setDescription(newDescription);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestBody = {
      id : article.id,
      description : description,
      price : price,
      maxQuantity : quantity,
    }
    const update = () => {
       dispatch(updateArticleAction(requestBody))
      .unwrap()
      .then((result) => {
        onClose(); })
      .catch((error) => {
        console.error("Update article error: ", error);
      });

    }
    update();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-container">
        <h2>Update article</h2>
        
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
            image={article.photoUrl !== "" ? imageSrc : displayImage}
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
          <TextField
            label="Name"
            defaultValue={article.name}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            margin="normal"
          />
          <TextField
            label="Description"
            defaultValue={article.description}
            error={!isDescriptionValid}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            defaultValue={article.price}
            inputProps={{ min: 0 }} 
            error={!isPriceValid}
            onChange={(e) => handlePriceChange(parseInt(e.target.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            defaultValue={article.maxQuantity}
            inputProps={{ min: 0 }} 
            error={!isMaxQValid}
            onChange={(e) => handleQuantityChange(e.target.value)}
            fullWidth
            margin="normal"
          /></Box>
          </div><Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button sx= {{mt: 1}} type="submit" variant="contained" color="primary">
            Submit
          </Button>
          <Button sx= {{ml:2, mt: 1}} onClick={onClose} variant="contained" color="secondary">
            Cancel
          </Button>
          </Box>
        </Box>
      </div>
    </Modal>
  );
};

export default UpdateModal;
