import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { NoticeModalStyled } from "../../Notice/NoticeModal/styled";
import { loginInfoState } from "../../../../stores/userInfo";
import NoImage from '../../../../assets/noImage.jpg';

export interface INoticeModalProps {
    noticeSeq? : number;
    onSuccess: () => void;
    setNoticeSeq: (noticeSeq: undefined) => void;
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

export interface IPostResponse {
    result : string;
}

export const NoticeModal : FC<INoticeModalProps> = ({noticeSeq, onSuccess, setNoticeSeq}) =>{
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail | null>(null);
    const [userInfo] =useRecoilState(loginInfoState);
    const title = useRef<HTMLInputElement>(null);
    const content = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>('noImage');
    const [fileData, setFileData] = useState<File>();

    useEffect(() => {
        if (noticeSeq !== undefined) {
            searchDetail();
        }
        return () => {
            setNoticeSeq(undefined);
        }
    }, []);

    const searchDetail = () => {
        console.log(noticeSeq);
        axios.post("/board/noticeDetail.do", {noticeSeq}).then((res: AxiosResponse<INoticeDetailResponse>) =>{
            if(res.data.detailValue){
                setNoticeDetail(res.data.detailValue);
                const fileExt = res.data.detailValue.file_ext;
                if(fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png') {
                    setImageUrl(res.data.detailValue.logical_path || NoImage);
                } else {
                    setImageUrl('noImage');
                }
            }
        });
    };

    const handlerSave = () => {
        const fileForm = new FormData();
        const textData = {
            title : title.current?.value,
            content: content.current?.value,
            loginId: userInfo.loginId,
        };
        if(fileData) fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}));
        axios.post('/board/noticeFileSaveJson.do', fileForm).then((res: AxiosResponse<IPostResponse>)=>{
            if(res.data.result === 'success'){
                onSuccess();
            }
        })
    }


    const handlerUpdate = () => {
        const fileForm = new FormData();
        const textData = {
            title : title.current?.value,
            content: content.current?.value,
            loginId : userInfo.loginId,
            noticeSeq : noticeSeq,
        };
        if (fileData) fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], { type: 'application/json' }));
        axios.post('/board/noticeFileUpdateJson.do', fileForm).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === 'success') {
                onSuccess();
            }
        });
    }

    const handlerDelete = () => {
        axios.post('/board/noiceDelete.do', {
            noticeSeq : noticeSeq,
        }).then((res :AxiosResponse<IPostResponse>) => {
            if(res.data.result === 'success') {
                onSuccess();
            }
        });
    };

    const handlerFile = (e: ChangeEvent<HTMLInputElement>) =>{
        const fileInfo = e.target.files;
        if(fileInfo?.length) {
            const  fileInfoSplit = fileInfo[0].name.split('.');
            const fileExtension = fileInfoSplit[1].toLowerCase();

            if(fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension ==='png') {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else {
                setImageUrl('notImage');
            }
            setFileData(fileInfo[0]);
        }
    }

    const downLoadFile = async() => {
        let param = new URLSearchParams();
        param.append('noticeSeq', noticeSeq?.toString() as string);

        const postAction : AxiosRequestConfig = {
            url : '/board/noticeDownload.do',
            method: 'POST',
            data : param,
            responseType : 'blob',
        }

        await axios(postAction).then((res) =>{
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', noticeDetail?.file_name as string);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
    }
    useEffect(() => {
        console.log(noticeDetail);
    }, [noticeDetail]);

    return (
        <NoticeModalStyled>
            <div className="container">
                <label>
                    제목 :
                    <input type="text" defaultValue={noticeDetail?.noti_title}ref={title}></input>
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
                    <input type="text" defaultValue={noticeDetail?.noti_content} ref={content}></input>
                    {/* <input
                        type="text"
                        value={noticeDetail?.noti_content || ""}
                        onChange={(e) =>
                            setNoticeDetail((prevDetail) => prevDetail ? { ...prevDetail, noti_content: e.target.value } : null)
                        }
                    /> */}
                </label>
                파일 :<input type="file" id="fileInput" style={{ display: 'none' }} onChange={handlerFile}></input>
                <label className="img-label" htmlFor="fileInput">
                    파일 첨부하기
                </label>
                <div onClick={downLoadFile}>
                    {imageUrl === 'notImage' ? (
                        <div>
                            <label>파일명</label>
                            {fileData?.name || noticeDetail?.file_name}
                        </div>
                    ) : (
                        <div>
                            <label>미리보기</label>
                            <img src={imageUrl} />
                        </div>
                    )}
                </div>
                <div className={'button-container'}>
                    <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? '수정' : '등록'}</button>
                    {noticeSeq ? <button onClick={handlerDelete}>삭제</button> : null}

                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </div>
        </NoticeModalStyled>
    );
}