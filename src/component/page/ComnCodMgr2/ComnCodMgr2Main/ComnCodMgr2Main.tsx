import { useContext, useEffect, useState } from 'react';
import { ComnCodMainStyled } from './styled';
import { ComnCodContext } from '../../../../pages/ComnCodMgr';
import { modalState } from '../../../../stores/modalState';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ComnCodMgrMainStyled } from '../../ComnCodMgr/ComnCodMgrMain/styled';
import { Button } from '../../../common/Button/Button';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { fomatDate } from '../../../../common/fomatData';

import { ComnCodMgr2Modal } from '../ComnCodMgr2Modal/ComnCodMgr2Modal';

export interface IComnCodList {
    row_num: number;
    grp_cod: string;
    grp_cod_nm: string;
    grp_cod_eplti: string;
    use_poa: string;
    fst_enlm_dtt: number;
    reg_date: string | null;
    detailcnt: number;
}

export interface ISearchComnCod {
    totalCount: number;
    listComnGrpCod: IComnCodList[];
}

export const ComnCodMgr2Main = () => {
    const [comnCodList, setComnCodList] = useState<IComnCodList[]>();
    const [totalCount, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const {searchKeyword} = useContext(ComnCodContext);
    const [modal, setModal] = useRecoilState(modalState);
    const [grpCod, setGrpCod] = useState<string>('');
    const navigate = useNavigate();
    useEffect(()=>{
        searchComnCod();
    },[searchKeyword]);

    const searchComnCod = (cpage? : number) => {
        cpage = cpage || 1;

        const postAction : AxiosRequestConfig = {
            method: 'POST',
            url: '/system/listComnGrpCodJson.do',
            data:{...searchKeyword, currentPage: cpage, pageSize: 5},
            headers: {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<ISearchComnCod>)=>{
            setComnCodList(res.data.listComnGrpCod);
            setTotalCnt(res.data.totalCount);
            setCurrentPage(cpage);
        });
    };

    const onPostSuccess = () => {
        setModal(!modal);
        searchComnCod(currentPage);
    };
    const handlerModal = (grpCod: string, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        setGrpCod(grpCod);
        setModal(!modal);
    }

    return (
    <>
        <ComnCodMainStyled>
            <Button
            onClick={()=> {
                setModal(!modal);
            }}>신규등록</Button>
            <StyledTable>
            <colgroup>
                    <col width="20%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="7%" />
                    <col width="10%" />
                    <col width="5%" />
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={10}>그룹코드</StyledTh>
                        <StyledTh size={5}>그룹코드명</StyledTh>
                        <StyledTh size={10}>그룹코드 설명</StyledTh>
                        <StyledTh size={5}>사용여부</StyledTh>
                        <StyledTh size={7}>등록일</StyledTh>
                        <StyledTh size={3}>비고</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {comnCodList && comnCodList?.length > 0 ? (
                        comnCodList.map((a) => {
                            return (
                                <tr
                                key={a.grp_cod}
                                onClick={()=>{
                                    navigate(a.grp_cod, {state: {grpCodNm: a.grp_cod_nm}});
                                }}
                                >
                                <StyledTd>{a.grp_cod}</StyledTd>
                                <StyledTd>{a.grp_cod_nm}</StyledTd>
                                <StyledTd>{a.grp_cod_eplti}</StyledTd>
                                <StyledTd>{a.use_poa}</StyledTd>
                                <StyledTd>{fomatDate(a.fst_enlm_dtt)}</StyledTd>
                                <StyledTd>
                                    <a
                                    onClick={(e) => {
                                        handlerModal(a.grp_cod, e)
                                    }}
                                    >수정</a>
                                </StyledTd>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <StyledTd colSpan={6}>데이터가 없습니다.</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate>
                totalItemsCount={totalCount}
                onChange={searchComnCod}
                itemsCountPerPage={5}
                activePage={currentPage as number}
            </PageNavigate>
            <ComnCodMgr2Modal onPostSuccess={onPostSuccess} grpCod={grpCod} setGrpCod={setGrpCod}></ComnCodMgr2Modal>
        </ComnCodMainStyled>
    </>
    )
}