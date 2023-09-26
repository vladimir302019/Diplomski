import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
{
orderQuery{
    orders {
      id
      comment
      address
      totalPrice
      confirmed
      approved
      deliveryDate
      orderItems {
        id
        name
        orderId
        articleId
        sellerId
        price
        quantity
      }
      buyerId
    }
  }
}
`

export const GET_UNDELIVERED_ORDERS = gql`
query($userId: Long!){
    orderQuery{
        undeliveredOrders(userId: $userId){
        id
        comment
        address
        totalPrice
        confirmed
        approved
        deliveryDate
        orderItems {
          id
          name
          orderId
          articleId
          sellerId
          price
          quantity
        }
      }
    }
 }`

export const GET_NEW_ORDERS = gql`
query($userId: Long!){
    orderQuery{
        newOrders(userId: $userId){
        id
        comment
        address
        totalPrice
        confirmed
        approved
        deliveryDate
        orderItems {
          id
          name
          orderId
          articleId
          sellerId
          price
          quantity
        }
      }
    }
 }`

export const GET_OLD_ORDERS = gql`
query($userId: Long!){
    orderQuery{
        oldOrders(userId: $userId){
        id
        comment
        address
        totalPrice
        confirmed
        approved
        deliveryDate
        orderItems {
          id
          name
          orderId
          articleId
          sellerId
          price
          quantity
        }
      }
    }
 }`

export const GET_USER_ORDERS = gql`
query($userId: Long!){
    orderQuery{
        userOrders(userId: $userId){
        id
        comment
        address
        totalPrice
        confirmed
        approved
        deliveryDate
        orderItems {
          id
          name
          orderId
          articleId
          sellerId
          price
          quantity
        }
      }
    }
 }`