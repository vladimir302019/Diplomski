import React, {useEffect, useState} from 'react'
import Orders from './Orders'
import Navbar from '../Navbar/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { getSellerNewOrdersAction, getUndeliveredOrdersAction, getUserOrdersAction, getOrdersAction, getSellerOldOrdersAction } from '../../Store/orderSlice';
import { CssBaseline } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_NEW_ORDERS, GET_OLD_ORDERS, GET_ORDERS, GET_UNDELIVERED_ORDERS, GET_USER_ORDERS } from '../../GraphQL/orderQueries';

export default function OrdersPanel() {
    const dispatch = useDispatch();
    //const deliveredOrders = JSON.parse(localStorage.getItem("deliveredOrders"));
    //const undeliveredOrders = useSelector((state) => state.order.undeliveredOrders);
    const user = useSelector((state) => state.user.user);
    const [isInitial, setIsInitial] = useState(true);

    

    let isAdmin = false;
    if(user.type === 2){
        isAdmin = true;
    }
    let isBuyer = false;
    if(user.type === 1)
    {
        isBuyer = true;
    }
    var userId = useSelector((state) => state.user.user.id);
    console.log(userId);
    var {loading: loading1, error: error1, data: data1, refetch: refetch_orders} = useQuery(GET_ORDERS);
    var {loading: loading2, error: error2, data: data2, refetch: refetch_user} = useQuery(GET_USER_ORDERS, {
      variables: { userId } 
  });
    var {loading: loading3, error: error3, data: data3, refetch: refetch_undelivered} = useQuery(GET_UNDELIVERED_ORDERS, {
      variables: { userId } 
  });
    var {loading: loading4, error: error4, data: data4, refetch: refetch_new} = useQuery(GET_NEW_ORDERS, {
      variables: { userId } 
  });
    var {loading: loading5, error: error5, data: data5, refetch: refetch_old} = useQuery(GET_OLD_ORDERS, {
      variables: { userId } 
  });
  useEffect(() => {
    const waitForUser = async () => {
      while (user === null) {
        await new Promise((resolve) => setTimeout(resolve, 100)); 
      }
      //execute();
      setIsInitial(false);
    };
    
    // const execute =  () => {
    //   if (user.type === 2) {
    //     //dispatch(getOrdersAction()); 
    //      var {loading: loading, error: error, data: data, refetch: refetch_orders} = useQuery(GET_ORDERS);
    //   } else if (user.type === 1) {
    //      //dispatch(getUserOrdersAction());
    //      var {loading: loading, error: error, data: data, refetch: refetch_user} = useQuery(GET_USER_ORDERS);
    //     // dispatch(getUndeliveredOrdersAction());
    //      var {loading: loading1, error: error1, data: data1, refetch: refetch_orders} = useQuery(GET_UNDELIVERED_ORDERS);
    //   } else {
    //      //dispatch(getSellerNewOrdersAction());
    //      var {loading: loading1, error: error1, data: data1, refetch: refetch_user} = useQuery(GET_NEW_ORDERS);
    //     // dispatch(getSellerOldOrdersAction());
    //      var {loading: loading, error: error, data: data, refetch: refetch_orders} = useQuery(GET_OLD_ORDERS);
    //   }
    // };
  
    if (isInitial || (loading1 && loading2 && loading3 && loading4 && loading5)) {
      waitForUser();
    } else {
      return;
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitial,user]);
  
  const handleUpdateOrders = () =>
  {
    if(user.type === 1){
    //dispatch(getUndeliveredOrdersAction());
    refetch_orders();
    }
    else if(user.type === 0){
    //dispatch(getSellerNewOrdersAction());
    refetch_undelivered();
    refetch_new();
    }
  }

  if(loading1 || loading2 || loading3 || loading4 || loading5){
    return <div>Loading</div>
  }
  
  console.log(data4.orderQuery.newOrders);
  return (
  <React.Fragment>
    <Navbar/>
    <CssBaseline/>
    {!isAdmin && !isBuyer && data4.orderQuery !== null && data5.orderQuery !== null  &&
    <Orders orders={data4.orderQuery.newOrders ? data4.orderQuery.newOrders : ""} 
    undelivered={true} header={"Undelivered orders"} isBuyer={isBuyer} handleUpdateOrders = {handleUpdateOrders}/> &&
    <Orders orders={data5.orderQuery.oldOrders ? data5.orderQuery.oldOrders : ""}/>}
    
    {isBuyer && data2.orderQuery !== null && data3.orderQuery !== null && 
    (<Orders orders={data3.orderQuery.undeliveredOrders ? data3.orderQuery.undeliveredOrders : ""} 
    undelivered={true} header={"Undelivered orders"} isBuyer={isBuyer} handleUpdateOrders = {handleUpdateOrders}/> &&
    <Orders orders={data2.orderQuery.userOrders ? data2.orderQuery.userOrders : ""}/>)}
    
    {isAdmin && data1.orderQuery !== null && <Orders orders={data1.orderQuery.orders ? data1.orderQuery.orders : "" }/>}
    
 </React.Fragment>
  )
}