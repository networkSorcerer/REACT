import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { useNavigate } from "react-router-dom";
import { SupplyMainStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { SupplyModal } from "../SupplyModal/SupplyModal";
import { SupplyContext } from "../../../../pages/Supply";

export interface ISupplyList {
    cust_id: number;
    cust_name :string;
    loginID : string;
    password: string;
    cust_person :string;
    cust_person_ph : string;
}

export interface ISearchSupply {
    supplyCnt : number;
    supplyList : ISupplyList[];
}

export const SupplyMain = () => {
    const {searchKeyword} = useContext(SupplyContext)
    const [supplyList, setSupplyList] = useState<ISupplyList[]>();
    const [totalCnt, setTotalCnt] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>();
    const [modal, setModal] = useRecoilState(modalState);
    const [cust_id, setCust_id] = useState<number>(0);
  
    const navigate = useNavigate();

    useEffect(()=>{
        searchSupply();
    },[searchKeyword]);
     // /management/supplyList.do 납품업체 리스트 출력
    // /management/custProduct.do 납품업체 클릭했을 때 납품업체가 제공하는 제품 리스트 출력
    // /management/supplySearch.do 검색기능을 구현하는 API가 따로 존재함 ???? 그냥 이걸로 호출해도 상관은 없을 듯 
    const searchSupply = (cpage?:number) =>{
        cpage = cpage || 1;
        const param = {...searchKeyword, currentPage : cpage, pageSize: 5}
        const postAction : AxiosRequestConfig = {
            method : 'POST',
            url : '/management/supplyList1.do',//기존의 백단에서 json으로 바꾸지 않고 @RequestParam을 RequestBody로 바꾸니까 응답이 온다 
            //근데 json 형태로 바꿔야 할듯 ..... comnCod 백단 확인
            //json 변형후 currentPage등을 인식하지 못함 
            //@RequestParam을 @RequestBody로 하니까 인식함 
            //JSON 데이터 전송:
            //searchSupply 함수에서 param 객체를 JSON 형태로 전송하고 있습니다. 
            //이 경우, 백엔드에서 JSON 형태의 요청 본문을 처리해야 합니다. 
            //@RequestParam은 쿼리 파라미터나 폼 데이터를 처리하는 데 적합하지만, 
            //JSON 데이터를 처리하기에는 적절하지 않습니다.

            //@RequestBody 사용:
            //@RequestBody를 사용하면 JSON 형태의 요청 본문을 Java 객체로 직접 매핑할 수 있습니다. 
            //따라서 클라이언트에서 JSON 형식으로 데이터를 보내면, 백엔드에서 이를 @RequestBody를 통해 손쉽게 처리할 수 있습니다.
            data : param,
            headers : {
                'Content-Type' : 'application/json',
            },
        };

        axios(postAction).then((res : AxiosResponse<ISearchSupply>)=>{
            setSupplyList(res.data.supplyList);
            setTotalCnt(res.data.supplyCnt);
            setCurrentPage(cpage);
        });
       
    }

    const onPostSuccess = () =>{
        setModal(!modal);
        searchSupply(currentPage);
    };

    const handlerModal = (cust_id: number, e:React.MouseEvent<HTMLElement, MouseEvent>)=>{
        e.stopPropagation();
        setCust_id(cust_id);
        setModal(!modal);
    };
    return (
    <>
        <SupplyMainStyled>
            <Button
            onClick={() =>{
                setModal(!modal);
            }}>
                신규등록
            </Button>
            <StyledTable>
            <colgroup>
                    <col width="30%" />
                    <col width="10%" />
                    <col width="10%" />
                    <col width="20%" />
                    <col width="30%" />
                   
                </colgroup>
                <thead>
                    <tr>
                        <StyledTh size={10}>납품업체명</StyledTh>
                        <StyledTh size={5}>LoginID</StyledTh>
                        <StyledTh size={10}>패스워드</StyledTh>
                        <StyledTh size={5}>담당자명</StyledTh>
                        <StyledTh size={7}>담당자 연락처</StyledTh>
                        <StyledTh size={5}></StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {supplyList && supplyList?.length > 0 ? (
                        supplyList.map((a) =>{
                            return (
                                <tr
                                key={a.cust_id}
                                onClick={()=> {
                                    navigate(`${a.cust_id}`, {state: {supplyNm : a.cust_name}})
                                }}
                                >
                                <StyledTd>{a.cust_name}</StyledTd>
                                <StyledTd>{a.loginID}</StyledTd>   
                                <StyledTd>{a.password}</StyledTd>   
                                <StyledTd>{a.cust_person}</StyledTd>   
                                <StyledTd>{a.cust_person_ph}</StyledTd>   
                                <StyledTd>
                                <a 
                                    onClick={(e) => {
                                        handlerModal(a.cust_id, e);
                                    }}
                                    >수정</a>     
                                </StyledTd>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <StyledTd  colSpan={6}>데이터가 없습니다</StyledTd>
                        </tr>
                    )}
                </tbody>
            </StyledTable>
            <div>

            </div>
            <PageNavigate
            totalItemsCount={totalCnt}
            onChange={searchSupply}
            itemsCountPerPage={5}
            activePage={currentPage as number}
            ></PageNavigate>
            <SupplyModal onPostSuccess={onPostSuccess} cust_id={cust_id} setCust_id={setCust_id}></SupplyModal>
        </SupplyMainStyled>
    </>
    )
}