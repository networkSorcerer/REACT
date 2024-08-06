import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export interface IListItemJsonResponse {
    //총수
    //리스트
    //페이지 사이즈
    //커런트 페이지
}

export interface IItemDetailList {

}

export const SupplyDetail = () =>{
    const {cust_id} = useParams();
    const navigate = useNavigate();
    
    useEffect(()=>{
        searchItemDetail();
    },[cust_id])

    const searchItemDetail = (cpage?: number) =>{
        cpage = cpage ||1;
        const postAciton : AxiosRequestConfig = {
            method : 'POST',
            url: '/',
            data : {cust_id: cust_id, currentPage : cpage, pageSize: 5},
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAciton).then((res:AxiosResponse<IListItemJsonResponse>)=>{
            
        })
    }

    return (
    
    <>
    
    </>
    
)
}