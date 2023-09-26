import { gql } from "@apollo/client"

export const GET_ARTICLES = gql`
{
    articleQuery{
      articles {
        id
        name
        description
        price
        maxQuantity
        photoUrl
      }
    }
  }
`

export const GET_SELLER_ARTICLES = gql`
query($userId: Long!){
  articleQuery
  {
    sellerArticles (userId: $userId )
    {
      id
      name
      description
      price
      maxQuantity
      photoUrl  
    }
  }
}`