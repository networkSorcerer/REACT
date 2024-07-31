import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import axios, { AxiosResponse } from "axios";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { Protal } from "../../../common/potal/Portal";
import { NoticeModal } from "../../Notice2/NoticeModal/NoticeModal";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";

export interface INoticeList {
    file_ext: string;
    file_name : string;
    file_size : number;
    logical_path : string;
    loginID : string;
    noti_content: string;
    noti_date : string;
    noti_seq : number;
    noti_title : string;
    phsycal_path :string;
}

export interface INoticeListJsonResponse {
    noticeList : INoticeList[];
    listCount : number
}

export const NoticeMain = () => {
    const {search} = useLocation(); // 현재 URL에 대한 정보를 반환한다 search는 URL에 정보를 담았었다 
    const [noticeList, setNoticeList] = useState<INoticeList[]>([]); //useState는 상태변수와 해당 상태를 갱신할수 있는 함수를 반환한다
    //컴포넌트 내에서 상태를 저장하고, 상태가 변경되면 컴포넌트가 다시 렌더링됩니다.
    //제네릭 형식으로 <INoticeList[]>정보의 타입을 설정 하는 듯함 

    const [modal, setModal] = useRecoilState<boolean>(modalState);
    //전역적으로 상태를 관리할 수 있으며, Recoil atom이나 selector와 함께 사용됩니다.
    //컴포넌트 간에 상태를 쉽게 공유할 수 있습니다.
    const [notiSeq, setNoticeSeq] = useState<number>();
//     요약
// useLocation은 현재 URL 정보를 가져와 URL이 변경될 때 컴포넌트를 다시 렌더링합니다.
// useState는 컴포넌트 내에서 상태를 관리하고, 상태가 변경될 때 컴포넌트를 다시 렌더링합니다.
// useRecoilState는 전역 상태를 관리하고, 여러 컴포넌트 간에 상태를 쉽게 공유할 수 있습니다.
// 각 훅의 역할과 특징을 이해하면, React 애플리케이션에서 상태와 URL을 효과적으로 관리할 수 있습니다.
    const [listCount, setListCount] = useState<number>(0);
    const [currentParam, setCurrentParam] = useState<number | undefined>();

    useEffect(() => {
        searchNoticeList();
        console.log(search);
    }, [search]);

    const searchNoticeList = (cpage? : number) => {
        cpage = cpage || 1;
        const searchParam = new URLSearchParams(search);

        searchParam.append('cpage', cpage.toString());
        searchParam.append('pageSize', '5');

        axios.post('/board/noticeListJson.do', searchParam).then((res : AxiosResponse<INoticeListJsonResponse>)=>{
            setNoticeList(res.data.noticeList);
            setListCount(res.data.listCount);
            setCurrentParam(cpage);
        });    
    };

    const handlerModal = (seq? : number) =>{
        setNoticeSeq(seq);
        setModal(!modal);
    }
    const postSuccess = () => {
        setModal(!modal);
        searchNoticeList();
    }
    return (
        <>
             총 갯수 : 0 현재 페이지 : 0
          <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                    {noticeList?.length > 0 ? ( noticeList?.map((a) => {//
                    return (
                        <tr key={a.noti_seq} onClick={() => handlerModal(a.noti_seq)}>
                            <StyledTd>{a.noti_seq}</StyledTd>
                            <StyledTd>{a.noti_title}</StyledTd>
                            <StyledTd>{a.noti_date}</StyledTd>
                        </tr>
                    )
                })
            
        ) : (
            <tr>
                <StyledTd colSpan={3}>데이터가 없습니다.</StyledTd>
            </tr>
        )}
        </tbody>
       
            
            
        </StyledTable>   
        <PageNavigate
                totalItemsCount={listCount}
                onChange={searchNoticeList}
                itemsCountPerPage={5}
                activePage={currentParam as number}
            ></PageNavigate>
             {modal ? (
            <Protal>
                <NoticeModal noticeSeq={notiSeq} onSuccess={postSuccess} setNoticeSeq={setNoticeSeq}></NoticeModal>
            </Protal>
        ) : null}
        </>
    ) 
}