import { gql } from "@apollo/client";

export const GET_ACTIVE_SELLERS = gql`
{
    userQuery{
        activesellers {
          id
          fullName
          username
          email
          birthDate
          address
          type
          approved
          denied
        }
    }
}
`

export const GET_UNACTIVE_SELLERS = gql`
{
    userQuery{
        unactivesellers {
          id
          fullName
          username
          email
          birthDate
          address
          type
          approved
          denied
        }
      }
}
`

export const GET_USER = gql`
query($id: Long!){
    userQuery{
        user(id: $id) {
          id
          fullName
          username
          email
          birthDate
          address
          type
          approved
          denied
        }
      }
}
`



