/*
The purpose of this file is to hold the query GET_ME, which will 
execute the me query set up using Apollo Server.
*/ 
import { gql } from "@apollo/client";
export const GET_ME = gql`
  {
    me {
        _id
        username
        email
        savedBooks {
            bookId
            authors
            description
            title
            image
            link
        }
    }
  }
`;