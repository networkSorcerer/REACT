import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentBox } from '../../../common/ContentBox/ContentBox';
import { Button } from '../../../common/Button/Button';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { ComnCodMgrDetailStyled } from './styled';
import { AxiosRequestConfig } from 'axios';

export const ComnCodeMgrDetailMain = () => {
    const { grpCod } = useParams();
    const navigate = useNavigate();
    console.log(grpCod); // grpCod 값을 콘솔에 출력
    useEffect (()=>{
        searchComnCodDetail();
    })

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
    };
    return (
        <ComnCodMgrDetailStyled>
            <ContentBox>공통코드 상세조회</ContentBox>
            <Button onClick={()=> navigate(-1)} >뒤로가기</Button>
            <Button >신규등록</Button>
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

                        <tr>
                            <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
                        </tr>
                </tbody>
                {/* <ComnCodMgrDetailModal
                ></ComnCodMgrDetailModal> */}
            </StyledTable>
        </ComnCodMgrDetailStyled>
    );
};
