import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { FC, useEffect, useState } from "react";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import { Button } from "../../../common/Button/Button";
import { ItemCodeModalStyled } from "./styled";
import { cleanup } from "@testing-library/react";

export interface IItemCodeList {
    length: number;
    company_seq?: number;
    item_code?: string;
    cust_name?: string;
}

export interface IItemCodeResponse {
    itemCodeList : IItemCodeList[];
    resultMsg : string;
}



export const ItemCodeModal :FC = () => {
    const [itemCodeList, setItemCodeList] = useState<IItemCodeList[]>([]);
    const [modal, setModal] = useRecoilState(modalState);

    // useEffect(()=>{
    //     ItemCodeList();
    // })
    
    const ItemCodeList =() =>{
        const postAciton : AxiosRequestConfig = {
            method : 'POST',
            url : '/management/selectItemCode.do',
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAciton).then((res : AxiosResponse<IItemCodeResponse>)=>{
            setItemCodeList(res.data.itemCodeList);
        })
    }


    const handlerModal = (company_seq: any) => {

    }
    return (
        <>
       
        <div className="">
            <Button
               
            >
                신규등록
            </Button>
            <StyledTable>
            <colgroup>
                    <col width="20%" />
                    <col width="10%" />
                    <col width="20%" />
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={10}>제품 코드</StyledTh>
                        <StyledTh size={5}>납품업체 명</StyledTh> 
                        <StyledTh size={10}>납품업체 코드</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {itemCodeList && itemCodeList?.length > 0 ? (
                        itemCodeList.map((a)=> {
                            return (
                                <tr>
                                    <StyledTd>{a.item_code}</StyledTd>
                                    <StyledTd>{a.cust_name}</StyledTd>
                                    <StyledTd>{a.company_seq}</StyledTd>
                                    <StyledTd>
                                        <a 
                                        onClick={(e) => {
                                            handlerModal(a.company_seq);
                                        }}>
                                        수정    
                                        </a>
                                    </StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            </div>
        
        </>
    )
}