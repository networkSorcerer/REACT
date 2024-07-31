import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Button } from '../../../common/Button/Button';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { ComnCodMainStyled } from './styled';
import { useContext, useEffect, useState } from 'react';
//import {fomatData} from './././';
import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';
import { ComnCodContext } from '../../../../pages/ComnCodMgr';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { ComnCodMgrModal } from '../ComnCodMgrModal/ComnCodMgrModal';

export interface IComnCodList {
    row_num : number;
    grp_cod: string;
    grp_cod_nm : string;
    grp_cod_eplti:string;
    use_poa : string;
    fst_enlm_dtt : number;
    reg_date : number;
    detailcnt :number;
}

export interface ISearchComnCod {
    totalCount : number,
    listComnGrpCod: IComnCodList[];
}

export const ComnCodMgrMain = () => {
    const [comnCodList, setComnCodList] =useState<IComnCodList[]>([]);
    const [totalCnt, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const {searchKeyword} =useContext(ComnCodContext);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [grpCod, setGrpCod] = useState<>();

    const onPostSuccess = () =>{
        setModal(!modal);
        searchComnCod(currentPage);
    }

    const handlerModal = (grpCod :string) => {
        setGrpCod(grpCod);

    }
    useEffect(()=>{
        searchComnCod();
    },[])
    useEffect(()=>{
        console.log(searchKeyword)
    },[searchKeyword])


    const searchComnCod = (cpage? : number) => {
        cpage =cpage || 1;

        const postAction : AxiosRequestConfig = {
            method : "POST",
            url : '/system/listComnGrpCodJson.do',
            data : { ...searchKeyword,currentPage : cpage, pageSize : 5},
            headers : {
                'Content-Type ': 'application/json'
            }
        };
        axios(postAction).then((res : AxiosResponse<ISearchComnCod>)=>{
            setComnCodList(res.data.listComnGrpCod);
            setTotalCnt(res.data.totalCount);
            setCurrentPage(cpage);
            
        });

        // axios.post('/system/vueListComnGrpCod.do', { currnetPage : cpage, pageSize: 5});
    };

    const formatData = (timeStamp: number) => {
        const date = new Date(timeStamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    return (
        <ComnCodMainStyled>
            <Button
                onClick={()=>{
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
                    {comnCodList && comnCodList?.length > 0 ? (comnCodList.map((a) => {
                        return (
                        <tr key={a.grp_cod}>
                            <StyledTd>{a.grp_cod}</StyledTd>
                            <StyledTd>{a.grp_cod_nm}</StyledTd>
                            <StyledTd>{a.grp_cod_eplti}</StyledTd>
                            <StyledTd>{a.use_poa}</StyledTd>
                            <StyledTd>{formatData(a.fst_enlm_dtt)}</StyledTd>
                            <StyledTd>
                                <a onClick={onClick=()}>수정</a>
                            </StyledTd>
                        </tr>

                        )
                    })
                ) :(
                    <tr>
                        <StyledTd colSpan={6}>데이터가 없습니다 </StyledTd>     
                    </tr>
                )}
                    
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={totalCnt}
                onChange={searchComnCod}
                itemsCountPerPage={5}
                activePage={currentPage as number}
            ></PageNavigate>
           {modal ? <ComnCodMgrModal onPostSuccess={onPostSuccess}/> : null}

        </ComnCodMainStyled>
    );
};