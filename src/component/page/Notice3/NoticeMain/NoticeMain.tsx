import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import axios, { AxiosResponse } from "axios";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { PageNavigate } from "../../../common/pageNavigation/PageNavigate";
import { Protal } from "../../../common/potal/Portal";
import { NoticeModal } from "../NoticeModal/NoticeModal";

export interface INoticeList {//api로 가져오는 정보에 대한 타입 정의 
    file_ext: string;
    file_name: string;
    file_size: number;
    logical_path: string;
    loginID: string;
    noti_content: string;
    noti_date: string;
    noti_seq: number;
    noti_title: string;
    phsycal_path: string;
}

export interface INoticeListJsonResponse {//api로 param값을 전달해주기 위한 타입 정의
    listCount: number;
    noticeList: INoticeList[];//가져온 리스트를 재활용해서 타입을 정의해준다 
}


export const NoticeMain = () => {
    const {search} = useLocation();// 현재 URL과 관련된 정보를 쉽게 접근할 수 있습니다.
    const [noticeList, setNoticeList] = useState<INoticeList[]>([]);//[]배열 값에 대한 정의
    const [listCount, setListCount] = useState<number>(0);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [notiSeq, setNotiSeq] = useState<number>();
    const [currentParam, setCurrentParam] = useState<number | undefined>();

    useEffect(() => {
        searchNoticeList();
    }, [search]);

    const searchNoticeList = (cpage?: number) =>{
        cpage = cpage || 1;
        const searchParam = new URLSearchParams(search);

        searchParam.append('cpage', cpage.toString());
        searchParam.append('pageSize', '5');

        axios.post('/board/noticeListJson.do', searchParam).then((res : AxiosResponse<INoticeListJsonResponse>) =>{
            setNoticeList(res.data.noticeList);
            setListCount(res.data.listCount);
            setCurrentParam(cpage);
        });
    };

    const handlerModal = (seq?:number) =>{
        setModal(!modal);
        setNotiSeq(seq);
    };

    const postSuccess = () =>{
        setModal(!modal);
        searchNoticeList();
    }
    return (
        <>
            총 갯수 : {listCount} 현재 페이지 : {currentParam}
            <StyledTable>
                <thead>
                    <tr>
                        <StyledTh size={5}>번호</StyledTh>
                        <StyledTh size={50}>제목</StyledTh>
                        <StyledTh size={20}>등록일</StyledTh>
                    </tr>
                </thead>
                <tbody>
                {noticeList.length > 0 ? (
                    noticeList?.map((a) => (//map함수를 통해서 noticeList 각 배열값을 순회한다 
                        <tr key={a.noti_seq} onClick={() => handlerModal(a.noti_seq)}>
                        <StyledTd>{a.noti_seq}</StyledTd>
                        <StyledTd>{a.noti_title}</StyledTd>
                        <StyledTd>{a.noti_date}</StyledTd>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan={3}>No notices available</td>
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
                    <NoticeModal noticeSeq={notiSeq} onSuccess={postSuccess} setNoticeSeq={setNotiSeq}></NoticeModal>
                </Protal>
            ) : null}
        </>
    )
}