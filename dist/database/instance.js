import { request } from 'graphql-request';
import '../config';
export const qfetch = async (req, body = {
})=>{
    try {
        const url = process.env.ENDPOINT;
        const data = await request("http://localhost:8080/v1/graphql", req, body, {
            "x-hasura-admin-secret": process.env.SECRET
        });
        return data;
    } catch (e) {
        return null;
    }
};
