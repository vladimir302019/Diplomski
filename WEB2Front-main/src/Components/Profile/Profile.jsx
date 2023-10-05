import React, { useState, useRef } from 'react';
import { Box, Grid, Container, CssBaseline, Zoom, Card, InputLabel, Switch, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ProfileFormField from './ProfileFormField';
import ProfileFormDate from './ProfileFormDate';
import ProfileFormImage from './ProfileFormImage';
import MyModal from './Modal/Modal';
import Navbar from '../Navbar/Navbar';
import { updateUserAction, uploadImageAction, changePasswordAction } from '../../Store/userSlice';
import { UPDATE_USER } from '../../GraphQL/userMutations';
import { useMutation } from '@apollo/client';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const imageInput = useRef(null);
  let user = useSelector((state) => state.user.user);
  const imageUrl = useSelector((state) => state.user.imageUrl);
  const defaultImage = process.env.PUBLIC_URL + './no-image.jpg'

  const imageSrc = `data:image/*;base64,` + imageUrl; //(imageUrl ? defaultImage   : imageUrl);
  const [editable, setEditable] = useState(false);
  const [isSwitched, setIsSwitched] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [uploadedImage, setUploadedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handlePasswordChange = (currentPassword, newPassword) => {
    const data = new FormData();
    data.append('oldPassword', currentPassword);
    data.append('newPassword', newPassword);

    dispatch(changePasswordAction(data))
      .unwrap()
      .then()
      .catch((error) => {
        console.error("Change password error: ", error);
      });

    handleCloseModal();
  };

  let type = '';
  if (user.type === 0) {
    type = "SELLER";
  } else if (user.type === 1) {
    type = "BUYER";
  } else {
    type = "ADMIN";
  }

  let initialDateString = user.birthDate;
  let initialDatePart = initialDateString.split('T');
  let initialDateParts = initialDatePart[0].split('-');
  let initialDate = new Date(initialDateParts[0], initialDateParts[1] - 1, initialDateParts[2]);
  const [date, setDate] = useState(initialDate);

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
      setUploadedImage(file);
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setDisplayImage(reader.result.toString());
      };
     
      imageData.append('file', file);
      dispatch(uploadImageAction(imageData))
        .unwrap()
        .then(() => {editEnableHandler(); switchHandler();})
        .catch((error) => {
          console.error("Image upload error: ", error);
        });
    }
   
  };

  const editEnableHandler = (event) => {
    setEditable((editState) => !editState);
  }

  const switchHandler = (event) => {
    setIsSwitched(!isSwitched);
  }

  const dateChangeHandler = (value) => {
    setDate(value);
  }
  
  const [updateProfile,{data, loading, error}] = useMutation(UPDATE_USER);

  const submitHandler = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name1 = formData.get("name");
    const address1 = formData.get("address");
    const email1 = formData.get("email");
    const birthdate1 = date.toISOString().split('T')[0];
    const username1 = formData.get('username');

    if (!name1 || !address1 || !email1 || !birthdate1 || !username1) {
      return;
    }
    updateProfile({variables:  {address: address1, birthDate: birthdate1, email: email1, id: user.id, fullname: name1, username: username1  }})
    .then(() => { setEditable(false); setIsSwitched(false); })
    
    // const data = new FormData();
    // data.append("fullName", name);
    // data.append("username", username);
    // data.append("email", email);

    // if (date !== null) {
    //   data.append("birthdate", birthdate);
    // }
    // data.append("address", address);

    // dispatch(updateUserAction(data))
    //   .unwrap()
    //   .then(() => { setEditable(false); setIsSwitched(false) })
    //   .catch((error) => {
    //     console.error("Update error: ", error);
    //   });
  }

  
  if (user != null) {
    return (
      <div>
        <Navbar />
        <Container
          margin="normal"
          component="main"
          justifycontent="center"
          sx={{
            position: "static",
            display: "flex",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <CssBaseline />
          <Zoom in={true}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              spacing={2}
              maxHeight="70vh"
            >
              <Grid item minWidth="50rem">
                <Card
                  raised
                  sx={{
                    height: "34rem",
                  }}
                >
                  <Grid container minHeight="34rem" maxHeight="40rem">
                    <Grid item>
                      <Box
                        noValidate
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {<ProfileFormImage
                          disabled={editable}
                          image={displayImage ? displayImage : imageSrc}
                          imageInput={imageInput}
                          uploadHandler={imageChangeHandler}
                          avatarClickHandler={imageUploadHandler}
                        ></ProfileFormImage>}
                        <Box
                          sx={{
                            ml: 2,
                            mt: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              maxWidth: "500px",
                              margin: "0 auto",
                            }}
                          >
                            <ProfileFormField
                              id="role"
                              label="User type"
                              initialValue={type}
                              editable={false}
                            ></ProfileFormField>

                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                            }}
                          >
                            {user.type === 0 && (
                              <Button
                                color={user.approved ? 'success' : (user.denied ? 'error' : 'primary')}
                                variant='contained'
                                sx={{
                                  width: '20rem',
                                  fontWeight: 'bold',
                                }}
                              >
                                {user.approved ? 'APPROVED' : (user.denied ? 'DENIED' : 'PENDING')}
                              </Button>
                            )}
                            <Button
                              color="secondary"
                              variant="contained"
                              onClick={handleOpenModal}
                              sx={{
                                border: 1,
                                ":hover": {
                                  bgcolor: "#e0dcdc",
                                },
                              }}
                            >
                              Change password
                            </Button>
                            <MyModal open={modalOpen} onClose={handleCloseModal} onPasswordChange={handlePasswordChange} />
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item>
                      <Box
                        sx={{
                          ml: 1,
                          mt: 2,
                        }}
                      >
                        <Box
                          sx={{
                            ml: -1,
                            mt: -1,
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Switch checked={isSwitched} onChange={editEnableHandler} onClick={switchHandler} color="warning" />
                          <InputLabel
                            inputlabelprops={{
                              style: { color: "cadetblue" },
                            }}
                          >
                            {"Enable profile editing"}
                          </InputLabel>
                        </Box>
                        <Box component="form" onSubmit={submitHandler}>
                          <ProfileFormField
                            id="name"
                            label="Full name"
                            initialValue={user.fullName}
                            editable={editable}
                          />
                          <ProfileFormField
                            id="username"
                            label="Username"
                            initialValue={user.username}
                            editable={editable}
                          />
                          <ProfileFormField
                            id="email"
                            label="E-mail"
                            initialValue={user.email}
                            editable={editable}
                          />
                          <ProfileFormField
                            id="address"
                            label="Address"
                            initialValue={user.address}
                            editable={editable}
                          />
                          <ProfileFormDate
                            id="birthDate"
                            label="Birthday"
                            initialValue={initialDate}
                            editable={editable}
                            setValue={dateChangeHandler}
                          />
                          <Button
                            color="secondary"
                            variant="contained"
                            type="submit"
                            disabled={!editable}
                            sx={{
                              mt: 1,
                              mb: 2,
                              ml: 3,
                              border: 1,
                              ":hover": {
                                bgcolor: "#e0dcdc",
                              },
                            }}
                          >
                            Update profile information
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Zoom>
        </Container>
      </div>
    );

  }
};


export default ProfilePage;