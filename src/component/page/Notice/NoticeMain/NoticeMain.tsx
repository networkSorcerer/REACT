import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StyledTable, StyledTd, StyledTh } from "../../../common/styled/StyledTable";
import { NoticeModal } from "../NoticeModal/NoticeModal";
import { Protal } from "../../../common/potal/Portal";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export interface INtoceList {
    file_ext: string;
    file_name : string;
    file_size : Number;
    logical_path : string;
    loginID : string;
    noti_content: string;
    noti_date : string;
    noti_seq : number;
    noti_title : string;
    phsycal_path :string;
}

export interface INoticeListJsonResponse {
    noticeList : INtoceList[];
    noticeCnt : number
}

export const NoticeMain = () => {
    const { search } = useLocation();
    const [noticeList, setNoticeList] = useState<INtoceList[]>([]);
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [notiSeq, setNoticeSeq] = useState<number>();


    useEffect(() => {
        searchNoticeList();
        console.log(search);
    }, [search]);

    const searchNoticeList = (cpage?: number) => {
        cpage = cpage || 1;
        const searchParam = new URLSearchParams(search);

        searchParam.append('cpage', cpage.toString());
        searchParam.append('pageSize', '5');

        axios.post('/board/noticeListJson.do',searchParam)
            .then((res : AxiosResponse<INoticeListJsonResponse>) => {
                setNoticeList(res.data.noticeList);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handlerModal = (seq? : number) => {
        setNoticeSeq(seq);
        setModal(!modal);
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
        {modal ? (
            <Protal>
                <NoticeModal noticeSeq={notiSeq}></NoticeModal>
            </Protal>
        ) : null}
            
            
        </StyledTable>   
    </>
    );
};
