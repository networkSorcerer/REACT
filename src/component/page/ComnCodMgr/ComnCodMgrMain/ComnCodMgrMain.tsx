import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Button } from '../../../common/Button/Button';
import { StyledTable, StyledTd, StyledTh } from '../../../common/styled/StyledTable';
import { ComnCodMgrMainStyled } from './styled';
import { useContext, useEffect, useState } from 'react';
import { fomatDate } from '../../../../common/fomatData';
import { PageNavigate } from '../../../common/pageNavigation/PageNavigate';
import { ConmCodContext } from '../../../../api/provider/ComnCodMgrProvider';
import { useRecoilState } from 'recoil';
import { modalState } from '../../../../stores/modalState';
import { ComnCodMgrModal } from '../ComnCodMgrModal/ComnCodMgrModal';
import {  useNavigate } from 'react-router-dom';

export interface IComnCodList {//타입을 정의 해주는 타입스크립트 라이브러리를 활용한 방법이다 
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

export const ComnCodMgrMain = () => {
    const [comnCodList, setComnCodList] = useState<IComnCodList[]>();//useState는 상태 변수와 그 상태를 업데이트 할수 있는 함수를 반환합니다
    const [totalCnt, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const { searchKeyword } = useContext(ConmCodContext); // React의 Context API를 사용하여 전역 상태나 값을 컴포넌트 트리에서 가져옵니다.
    //애플리케이션 전체에서 사용해야 하는 데이터나 설정을 한 곳에서 정의할 수 있습니다.
    //이 데이터를 하위 컴포넌트들이 필요할 때 어디에서든 접근할 수 있게 됩니다.
    const [modal, setModal] = useRecoilState(modalState);//Recoil 상태 관리를 위한 훅으로, Recoil 상태를 읽고 업데이트할 수 있습니다
//     useContext: 주로 컴포넌트 트리에서 데이터를 전달하고 공유하는 데 사용됩니다. 간단한 전역 상태를 필요로 하는 경우 적합합니다.
// Recoil: 복잡한 전역 상태를 관리하거나, 상태의 파생값을 계산하고 비동기 작업을 처리할 필요가 있을 때 유용합니다.
    const [grpCod, setGrpCod] = useState<string>('');
    const navigate = useNavigate();//React Router의 useNavigate 훅을 사용하여 프로그래밍적으로 페이지를 이동할 수 있습니다.
    useEffect(() => {//컴포넌트가 렌더링될 때 특정 작업을 수행하거나 상태가 변경될 때 작업을 수행합니다.
        searchComnCod();
    }, [searchKeyword]);

    const searchComnCod = (cpage?: number) => {
        cpage = cpage || 1;
        // axios.post('/system/listComnGrpCodJson.do', { currentPage: cpage, pageSize: 5 });
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/system/listComnGrpCodJson.do',
            data: { ...searchKeyword, currentPage: cpage, pageSize: 5 },
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios(postAction).then((res: AxiosResponse<ISearchComnCod>) => {
            setComnCodList(res.data.listComnGrpCod);
            setTotalCnt(res.data.totalCount);
            setCurrentPage(cpage);
        });

        //const postSearchComnCod = await postComnCodMgrApi<ISearchComnCod>(comnCodMgrApi.listComnGrpCodJson, {
        //...searchKeyword,
        //currentPage : cpage,
        //pageSize: 5,
        //}) 모듈화했을때 사용법 API , AXIOS 등등 다 따로 모아서 처리함 
    };

    const onPostSuccess = () => {
        setModal(!modal);
        searchComnCod(currentPage);
    };

    const handlerModal = (grpCod: string, e:React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        setGrpCod(grpCod);
        setModal(!modal);
    };

    return (
        <ComnCodMgrMainStyled>
            <Button
                onClick={() => {
                    setModal(!modal);
                }}
            >
                신규등록
            </Button>
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
                                    onClick={() => {
                                        navigate(a.grp_cod, { state: { grpCodNm: a.grp_cod_nm } });
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
                                                handlerModal(a.grp_cod, e);
                                            }}
                                        >
                                            수정
                                        </a>
                                    </StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        
                    )}
                </tbody>
            </StyledTable>
            <PageNavigate
                totalItemsCount={totalCnt}
                onChange={searchComnCod}
                itemsCountPerPage={5}
                activePage={currentPage as number}
            ></PageNavigate>
            <ComnCodMgrModal onPostSuccess={onPostSuccess} grpCod={grpCod} setGrpCod={setGrpCod}></ComnCodMgrModal>
        </ComnCodMgrMainStyled>
    );
};