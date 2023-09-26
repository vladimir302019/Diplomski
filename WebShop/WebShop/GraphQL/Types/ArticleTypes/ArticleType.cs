﻿using GraphQL.Types;
using System.Reflection.Metadata.Ecma335;
using WebShop.DTO.ArticleDTOs;
using WebShop.Models;

namespace WebShop.GraphQL.Types.ArticleTypes
{
    public class ArticleType : ObjectGraphType<ArticleDTO>
    {
        public ArticleType()
        {
            Field(a => a.Name);
            Field(a => a.Description);
            Field(a => a.Price, type: typeof(DecimalGraphType));
            Field(a => a.MaxQuantity, type: typeof(IntGraphType));
        }
        private string ConvertByteArrToString(byte[] byteArr)
        {
            if (byteArr == null || byteArr.Length == 0)
            {
                return null; // Handle the case where the byte array is null or empty.
            }

            // Convert the byte array to a Base64-encoded string.
            string base64String = Convert.ToBase64String(byteArr);

            return base64String;
        }
    }
}
