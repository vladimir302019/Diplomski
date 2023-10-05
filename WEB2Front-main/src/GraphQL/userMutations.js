import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
mutation($address: String!, $birthDate: Date!, $email: String!, $id: Long!, $fullname: String!, $username: String!){
    userMutation{
        update(address: $address, birthDate: $birthDate, email: $email,  id: $id, fullname: $fullname, username: $username) {
        fullName
        username
        email
        birthDate
        address
        }
    }
}
`