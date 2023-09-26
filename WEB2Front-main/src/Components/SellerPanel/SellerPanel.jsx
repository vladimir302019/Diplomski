import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import { getSellerArticlesAction, deleteArticleAction } from '../../Store/articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import { Paper, Button, Avatar } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../AdminPanel/Title/Title';
import Typography from '@mui/material/Typography';
import UpdateModal from './Modal/UpdateModal';
import Box from '@mui/material/Box';
import NewArticleModal from './Modal/NewArticleModal';
import CssBaseline from '@mui/material/CssBaseline';
import { GET_SELLER_ARTICLES } from '../../GraphQL/articleQueries';
import { useQuery } from '@apollo/client';

export default function SellerPanel() {
    const dispatch = useDispatch();
    //const articles = useSelector((state) => state.article.sellerArticles);
    const [isInitial, setIsInitial] = useState(true);
    const img = "data:image/*;base64,";
    const imgUrl = process.env.PUBLIC_URL + '/no-image.jpg';
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const [modalNewOpen, setModalNewOpen] = useState(false);
    var userId = useSelector((state) => state.user.user.id);
    
    const {loading, error, data , refetch} = useQuery(GET_SELLER_ARTICLES, {
        variables: { userId } 
    });

    const handleCloseModal = () => {
        setModalOpen(false);
        const execute =  () => {
             //dispatch(getSellerArticlesAction());
             refetch({userId});
        };
       execute();
    };

    const handleCloseNewModal = () => {
        setModalNewOpen(false);
        const execute =  () => {
             //dispatch(getSellerArticlesAction());
             refetch({userId});
        };
       execute();
    };
    const handleUpdateArticle = (article) => {
       
        setSelectedArticle(article);
        setModalOpen(true);
    };
    const handleAddProduct =() =>{
        setModalNewOpen(true);
    }
    const handleDeleteArticle = (articleId) => {
        const data = new FormData();
        data.append('id', articleId);
        const deleteArticle =  () => {
            dispatch(deleteArticleAction(data)).then(() => {
            try {
                //dispatch(getSellerArticlesAction());
                refetch({userId});
              } catch (error) {
                console.error('Delete article error: ', error);
              }
            });
        }
        deleteArticle();

    }
    useEffect(() => {
        if (!isInitial) {
            return;
        }
        
        const execute = () => {
            //dispatch(getSellerArticlesAction());
        };
       execute(); 
        setIsInitial(false);
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInitial]);

    useEffect(()=>{
        console.log(loading,error,data);
    })

    if (isInitial || loading) {
        return <div>Loading...</div>
    } else
        return (
            <React.Fragment>
                <Navbar />
                <CssBaseline/>
                <Grid container justifyContent="center" mt={4}>
                    
                    <Grid item xs={12} sm={8} md={6} lg={10}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title >MY PRODUCTS</Title>
                    <Button
                        variant="contained"
                        color="secondary"
                        className="addButton"
                        onClick={() => handleAddProduct()}
                        sx={{mt:0}}
                    > 
                        Add New Product
                    </Button>
                    <CssBaseline/>
                    <NewArticleModal open={modalNewOpen} onClose={handleCloseNewModal} />
                </Box>
                {data.articleQuery.sellerArticles.length === 0 ? (
    <Typography  variant="h6" component="p">
     You don't have any product yet.
    </Typography>
  ) : (
                            <Table size="medium" >
                                <TableHead >
                                    <TableRow >
                                        <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }} >Image</TableCell>
                                        <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }} >Name</TableCell>
                                        <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }}>Price</TableCell>
                                        <TableCell sx={{ fontSize: 20, fontWeight: 'bold' }}>Max Quantity</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.articleQuery.sellerArticles.map((article) => (
                                        <TableRow key={article.id} >
                                            <TableCell style={{ width: '20%', height: '20%' }}>
                                                <Avatar 
                                                    src={article.photoUrl !== "" ? img + article.photoUrl : imgUrl}
                                                    style={{ width: '20vh', height: '15vh' }}
                                                >
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>{article.name}</TableCell>
                                            <TableCell>{article.description}</TableCell>
                                            <TableCell>{article.price}</TableCell>
                                            <TableCell>{article.maxQuantity}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className="approveButton"
                                                    onClick={() => handleUpdateArticle(article)}
                                                >
                                                    Update
                                                </Button>
                                                <Button
                                                    sx={{ ml: 2 }}
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDeleteArticle(article.id)}
                                                >
                                                    Delete
                                                </Button>
                                                {selectedArticle && (
                                                    <UpdateModal open={modalOpen} onClose={handleCloseModal} article={selectedArticle} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>)}
                        </Paper>
                    </Grid>
                </Grid>

            </React.Fragment>
        )
}