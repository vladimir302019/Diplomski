import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Geocode from "react-geocode";
import { approveOrderAction, getSellerNewOrdersAction } from '../../Store/orderSlice';
import { Typography, Button } from "@mui/material";
import React from "react";
import Navbar from "../Navbar/Navbar";

// create custom icon
const customIcon = new Icon({
    iconUrl: require("./box.png"),
    iconSize: [38, 38]
});

export default function Map() {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_API);
    Geocode.setLanguage("en");
    Geocode.setRegion("rs");

    const orders = useSelector((state) => state.order.undeliveredOrders);
    const dispatch = useDispatch();
    const [updatedOrders, setUpdatedOrders] = useState([]);
    
    const refresh = async () => {
        try{
            dispatch(getSellerNewOrdersAction());
        }catch (error){
            console.error(error);
        }
    };

    const calculatePositions = async () => {
        try{
            const tempOrders = await Promise.all(
            
              orders.map(async(order) => {
                const response = await Geocode.fromAddress(order.address);
                const { lat, lng } = response.results[0].geometry.location;
                return {
                  ...order,
                  position: [lat, lng], 
                  };
              })
            );
            setUpdatedOrders(tempOrders);
        } catch (error) {
            console.error('Error calculating positions: ', error);
        }
    };

    const handleApproveOrder = (orderId) => {
      const formData = new FormData();
      formData.append("orderId", orderId);
      dispatch(approveOrderAction(formData))
        .then(() => {
          const updatedOrdersCopy = [...updatedOrders];
          const index = updatedOrdersCopy.findIndex((order) => order.id === orderId);
          if (index !== -1) {
            updatedOrdersCopy.splice(index, 1);
            setUpdatedOrders(updatedOrdersCopy);
          }
        });
    };

    useEffect(() => {
        refresh();
        calculatePositions();
    }, []);
  return (
    <React.Fragment><Navbar/>
    <MapContainer center={[45.25472833688446, 19.83317432993583]} zoom={13} style={{ width: "100vw", height: "100vh" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
       
        {updatedOrders.length !== 0 && updatedOrders.map((order) => (
          !order.approved && (<Marker position={order.position} icon={customIcon}>
            <Popup>
                <Typography>Address: {order.address}</Typography>
                <Typography>Comment: {order.comment}</Typography>
                <Typography>Total: {order.totalPrice.toFixed(2)}$</Typography>
                {!order.approved && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={(e) => handleApproveOrder(order.id)}
                    >
                      Approve
                    </Button>
                  </>
                )}</Popup>
          </Marker>)
        ))}
    </MapContainer>
    </React.Fragment>
  );
}
