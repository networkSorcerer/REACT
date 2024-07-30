import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import { NoticeModalStyled } from "../../Notice/NoticeModal/styled";

export interface INoticeModalProps {
    noticeSeq? : number;
}

export interface INoticeDetail {
    file_ext: string | null;
    file_name: string | null;
    file_size: number | null;
    logical_path: string | null;
    phsycal_path: string | null;
    loginID: string;
    noti_content: string;
    noti_date: string;
    noti_seq: number;
    noti_title: string;
}

export interface INoticeDetailResponse {
    detailValue : INoticeDetail;
}

export const NoticeModal : FC<INoticeModalProps> = ({noticeSeq}) =>{
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail | null>(null);

    useEffect(() => {
        if (noticeSeq !== undefined) {
            searchDetail();
        }
    }, [noticeSeq]);

    const searchDetail = () => {
        console.log(noticeSeq);
        axios.post("/board/noticeDetail.do", {noticeSeq}).then((res: AxiosResponse<INoticeDetailResponse>) =>{
            setNoticeDetail(res.data.detailValue);
        });
    };
    useEffect(() => {
        console.log(noticeDetail);
    }, [noticeDetail]);

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :
                    <input type="text" defaultValue={noticeDetail?.noti_title}></input>
                    {/* <input
                        type="text"
                        value={noticeDetail?.noti_title || ""}
                        onChange={(e) =>
                            setNoticeDetail((prevDetail) => prevDetail ? { ...prevDetail, noti_title: e.target.value } : null)
                        }
                    /> */}
                </label>
                <label>
                    내용 :
                    <input type="text" defaultValue={noticeDetail?.noti_content}></input>
                    {/* <input
                        type="text"
                        value={noticeDetail?.noti_content || ""}
                        onChange={(e) =>
                            setNoticeDetail((prevDetail) => prevDetail ? { ...prevDetail, noti_content: e.target.value } : null)
                        }
                    /> */}
                </label>
                <div className="button-container">
                    <button>등록</button>
                    <button>삭제</button>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
}