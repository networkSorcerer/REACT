import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentBox } from '../../../common/ContentBox/ContentBox';
import { Button } from '../../../common/Button/Button';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { ComnCodMgrDetailStyled } from './styled';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ComnCodeMgrDetailModal } from '../ComnCodeMgrDetailModal/ComnCodeMgrDetailModal';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';

export interface IListComnDtlCodJsonResponse {
    totalCntComnDtlCod : number;
    listComnDtlCodModel : IComnCodDetailList[];
    pageSize: number;
    currentPageComnCod : number;
}

export interface IComnCodDetailList {
    row_num: number;
    grp_cod: string;
    grp_cod_nm: string;
    dtl_cod: string;
    dtl_cod_nm: string;
    dtl_cod_eplti: string;
    use_poa: string;
    fst_enlm_dtt: string;
    fst_rgst_sst_id: string;
    fnl_mdfd_dtt: string;
  }
  
export const ComnCodeMgrDetailMain = () => {
    const { grpCod } = useParams();//메인에서 부터 계속 가져오네 ......
    const navigate = useNavigate();
    const [comnCodDetailList, setComnDetailList] = useState<IComnCodDetailList[]>();
    const [modal, setModal] = useRecoilState(modalState);
    const [detailCod, setDetailCode] = useState<string>();


    console.log(grpCod); // grpCod 값을 콘솔에 출력
    useEffect (()=>{
        searchComnCodDetail();
    },[grpCod])

    const searchComnCodDetail = (cpage?: number) => {
        cpage =cpage || 1;
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/system/listComnDtlCodJson.do',
            data: { grp_cod:grpCod, currentPage: cpage, pageSize: 5 },
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(postAction).then((res:AxiosResponse<IListComnDtlCodJsonResponse>) => {
            setComnDetailList(res.data.listComnDtlCodModel);
            console.log(comnCodDetailList, comnCodDetailList?.length)
        })
    };

    const handlerModal = (dtlCd?: string) => {
        setModal(!modal);
        setDetailCode(dtlCd);
    }

    const onPostSuccess = () => {
        setModal(!modal);
        searchComnCodDetail();
    }
    return (
        <ComnCodMgrDetailStyled>
            <ContentBox>공통코드 상세조회</ContentBox>
            <Button onClick={()=> navigate(-1)} >뒤로가기</Button>
            <Button onClick={handlerModal}>신규등록</Button>
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={10}>그룹코드</StyledTh>
                        <StyledTh size={10}>상세코드</StyledTh>
                        <StyledTh size={7}>상세코드명</StyledTh>
                        <StyledTh size={10}>상세코드 설명</StyledTh>
                        <StyledTh size={5}>사용여부</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {comnCodDetailList && comnCodDetailList.length > 0 ? (
                        comnCodDetailList.map((a)=> {
                           
                            return (
                                <tr key={a.row_num} onClick={()=> handlerModal (a.dtl_cod)}>
                                <StyledTd >{a.grp_cod}</StyledTd>
                                <StyledTd >{a.dtl_cod}</StyledTd>
                                <StyledTd >{a.dtl_cod_nm}</StyledTd>
                                <StyledTd >{a.dtl_cod_eplti}</StyledTd>
                                <StyledTd >{a.use_poa}</StyledTd>
                               
                             </tr>              
                            )
                        })
                    ): (
                        <tr>
                            <StyledTd colSpan={5}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                        
                </tbody>
               
            </StyledTable>
            <ComnCodeMgrDetailModal detailCod={detailCod} onPostSuccess={onPostSuccess}></ComnCodeMgrDetailModal>
        </ComnCodMgrDetailStyled>
    );
};
