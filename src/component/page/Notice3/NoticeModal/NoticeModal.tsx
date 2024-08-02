import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { loginInfoState } from "../../../../stores/userInfo";
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import NoImage from '../../../../assets/noImage.jpg';
import { NoticeModalStyled } from "./styled";

export interface INoticeModalProps {
    noticeSeq?: number;
    onSuccess : () => void;
    setNoticeSeq : (noticeSeq : undefined) => void;
}

export interface INoticeDetail {
    noti_seq: number;
    loginID: string;
    noti_title: string;
    noti_content: string;
    noti_date: string;
    file_name: string | null;
    phsycal_path: string | null;
    logical_path: string | null;
    file_size: number | null;
    file_ext: string | null;
}

export interface INoticeDetailResponse {
    detailValue: INoticeDetail;
}

export interface IPostResponse {
    result: string;
}



export const NoticeModal: FC<INoticeModalProps> = ({noticeSeq, onSuccess, setNoticeSeq}) => {
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [noticeDetail, setNoticeDetail] = useState<INoticeDetail>();
    const [userInfo] = useRecoilState(loginInfoState);
    const title = useRef<HTMLInputElement>(null);
    const content = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>('notImage');
    const [fileData, setFileData] = useState<File>();

    useEffect(()=>{
        if(noticeSeq) {
            searchDetail();
        }
        return () => {
            setNoticeSeq(undefined)//setNoticeDetail을 초기화 했다가 등록을 눌렀을때도 상세 모달창이 나오는 오류가 발생했다 
        };
    },[]);

    //상세내용
    const searchDetail = () => {
        axios.post('/board/noticeDetail.do', {noticeSeq}//param을 객체 형태로 바로 넣음

        ).then((res: AxiosResponse<INoticeDetailResponse>//res도 타입을 넣어줌 

        )=> {
            if(res.data.detailValue) {//응답에 detailValue가 있으면 
                setNoticeDetail(res.data.detailValue); //setNoticeDetail함수에 넣어줌 나중에 noticeDetail 변수명을 통해서 분배? 배포? 한다
                const fileExt = res.data.detailValue.file_ext;
                if(fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png'){
                    setImageUrl(res.data.detailValue.logical_path || NoImage);
                } else {
                    setImageUrl('notImage');
                }
            }
        });
    };

    //저장
    const handlerSave = () =>{
        const fileForm = new FormData();//fileForm 객체 생성 
        const textData = {
            title: title.current?.value,// useRef를 통해서 값을 저장하는 방법 그냥 title.value는 input을 통해서 바로 값을 가져오는 방법임
            content: content.current?.value, //useRef를 사용하는 이유는 React와의 통합, 상태 유지, 재렌더링 방지 등입니다.
            loginId : userInfo.loginId,
        };
        if(fileData) fileForm.append('file', fileData);//fileData가 존재하면 fileForm에 추가 
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type: 'application/json'}));//textData를 fileForm에 json의
        //데이터 덩어리로 붙여 준다 Blob은 정보 덩어리 객체를 뜻한다 
        axios.post('/board/noticeFileSaveJson.do', fileForm).then((res: AxiosResponse<IPostResponse>)=>{
            if(res.data.result === 'success') {
                onSuccess();
            }
        })
    }

    //수정
    const handlerUpdate = () =>{
        const fileForm = new FormData();
        const textData = {
            title : title.current?.value,
            content: content.current?.value,
            loginId : userInfo.loginId,
            noticeSeq: noticeSeq
        };
        if(fileData) fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], {type:'application/json'}));
        axios.post('/board/noticeFileUpdateJson.do', fileForm).then((res: AxiosResponse<IPostResponse>)=>{
            if(res.data.result === 'success'){
                onSuccess();
            }
        })
    }

    //삭제
    const handlerDelete = () => {
        axios.post('/board/noticeDelete.do', {
            noticeSeq:noticeSeq,
        }).then((res : AxiosResponse<IPostResponse>) => {
            if(res.data.result === 'success'){
                onSuccess();
            }
        })
    }

    //파일 미리 보기 
    const handlerFile = (e : ChangeEvent<HTMLInputElement>) => {
        const fileInfo = e.target.files;
        if(fileInfo?.length) {
            const fileInfoSplit = fileInfo[0].name.split('.');
            const fileExtension =fileInfoSplit[1].toLowerCase();

            if(fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension === 'png'){
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else {
                setImageUrl('notImage');
            }
            setFileData(fileInfo[0]);
        }
    };

    const downLoadFile = async() => {
        let param = new URLSearchParams();
        param.append('noticeSeq', noticeSeq?.toString() as string);

        const postAction: AxiosRequestConfig = {
            url : "/board/noticeDownload.do",
            method:'POST',
            data : param,
            responseType: 'blob',
        };

        await axios(postAction).then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', noticeDetail?.file_name as string);
            document.body.appendChild(link);
            link.click();
            link.click();
        })
    }
    return(
        <>
            <NoticeModalStyled>
                <div className="container">
                    <label>
                        제목 : <input type="text" defaultValue={noticeDetail?.noti_title} ref={title}></input>
                    </label>
                    <label>
                        내용 : <input type="text" defaultValue={noticeDetail?.noti_content} ref={content}></input>
                    </label>
                    파일 : <input type="file" id="fileInput" style={{display: 'none'}} onChange={handlerFile}></input>
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
                            <img src={imageUrl} alt="Preview" />
                        </div>
                        )}

                    </div>
                    <div className={'button-container'}>
                        <button onClick={noticeSeq ? handlerUpdate : handlerSave}>{noticeSeq ? '수정' : '등록'}</button>
                        {noticeSeq ? <button onClick={handlerDelete}>삭제</button> : null}
                        <button onClick={()=> setModal(!modal)}>나가기</button>
                    </div>
                </div>
            </NoticeModalStyled>
        </>
    )


}