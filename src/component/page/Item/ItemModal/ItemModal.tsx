import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import NoImage from '../../../../assets/noImage.jpg';
import { ItemModalStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { ItemCodeModal } from "../ItemCodeModal/ItemCodeModal";
import { Protal } from "../../../common/potal/Portal";

export interface IItemModalProps {
    itemCode : string;
    onSuccess : () =>void;
    setItemCode : (item_code: any) => void;
}

export interface IItemDetail {
    item_code? : string;
    item_name? : string;
    manufac? : string;
    provide_value? : number;
    major_class? : string; //file_name
    item_note? : string; //phsycal_path
    img_path? : string; //logical_path
    sub_class? : number; // file_size
    item_stand? : string; //file_ext
}


export interface IItemDetailResponse {
    //나중에 변수명? 확인
    itemDetail : IItemDetail;
    resultMsg : string;
}



export const ItemModal : FC<IItemModalProps> = ({itemCode, onSuccess, setItemCode}) =>{
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [itemDetail, setItemDetail] = useState<IItemDetail>({});
    const item_code = useRef<HTMLInputElement>(null);
    const item_name = useRef<HTMLInputElement>(null);
    const manufac = useRef<HTMLInputElement>(null);
    const provide_value = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>('noImage');
    const [fileData, setFileData] = useState<File>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>();

    useEffect(() =>{
        if(itemCode) {
            searchDetail();
        }
        return() =>{
            setItemCode(undefined);
        }
        
    },[]);

    const searchDetail = () =>{
        axios.post('/management/', {itemCode}).then((res: AxiosResponse<IItemDetailResponse>)=>{
            if(res.data.itemDetail) {
                setItemDetail(res.data.itemDetail);
                const fileExt = res.data.itemDetail.img_path;
                if(fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png'){
                    setImageUrl(res.data.itemDetail.img_path || NoImage)
                } else {
                    setImageUrl('notImage');
                }

            }
        })
    }

    const downloadFile = () =>{

    }
    const handlerUpdate = () =>{

    }
    //신규등록할때 제품코드를 먼저 선택하는데 제품 코드 선택 버튼을 누르면 작은 모달창에 
    //item_code를 선택할수 있는 페이징 되는 화면이 나온다 
    //거기서 선택을 하면 이전화면으로 돌아가면서 item_code가 선택된 화면이 나온다 
    //유효성 검사하는 거 공부해서 여기에도 넣어보자 

    const requiredFields =  ['item_code', 'item_name', 'provide_value', 'manufac'];

    const areFieldsValid= (itemDetail :IItemDetail) : boolean =>{
        return requiredFields.every(a => itemDetail[a as keyof IItemDetail] !== undefined &&  itemDetail[a as keyof IItemDetail] !=='');
    }

    const handlerSave = async() => {// 파일 저장 컬럼명은 상관없음 
        //property쪽에서도 경로를 지정해줘야하함 
        //multipartfile을 사용함 
        if(!areFieldsValid(itemDetail)){
            alert('모든 제품 정보를 입력하세요.');
            return;
        }
        const fileForm = new FormData();
        const textData = {
            item_code: item_code.current?.value,
            item_name: item_name.current?.value,
            manufac: manufac.current?.value,
            provide_value: provide_value.current?.value,
        };
        if (fileData) fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], { type: 'application/json' }));
    
        axios.post('/management/ItemFileSaveJson', fileForm).then((res: AxiosResponse<IItemDetailResponse>) => {
            if (res.data.resultMsg === 'SUCCESS') {
                onSuccess();
            }
        });
    }
    
    const handlerDelete = () =>{

    }
    const checkItemCode = () =>{
        setModal(!modal);
    }

    
    const handlerFile = (e:ChangeEvent<HTMLInputElement>) =>{
        const fileInfo = e.target.files;
        if(fileInfo?.length) {
            const fileInfoSplit = fileInfo[0].name.split('.');
            const fileExtension = fileInfoSplit[1].toLowerCase();

            if(fileExtension === 'jpg' || fileExtension === 'gif' || fileExtension === 'png') {
                setImageUrl(URL.createObjectURL(fileInfo[0]));
            } else {
                setImageUrl('notImage');
            }
            setFileData(fileInfo[0]);
        }
    }
    return (
        <>
            <ItemModalStyled>
                <div className="container">
                    <label>
                        제품 코드: {itemCode ? (
                            <input type="text" defaultValue={itemDetail?.item_code} ref={item_code} />
                        ) : (
                            <Button onClick={() => setIsModalOpen(true)}>제품코드 선택</Button>
                        )}
                    </label>
    
                    {isModalOpen ? (
                        <ItemCodeModal />
                    ) : (
                        <>
                            <label>
                                제품 명: <input type="text" defaultValue={itemDetail?.item_name} ref={item_name} />
                            </label>
                            <label>
                                제조사: <input type="text" defaultValue={itemDetail?.manufac} ref={manufac} />
                            </label>
                            <label>
                                가격: <input type="text" defaultValue={itemDetail?.provide_value} ref={provide_value} />
                            </label>
                            파일: <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handlerFile} />
                            <label className="img-label" htmlFor="fileInput">
                                파일 첨부하기
                            </label>
                            <div onClick={downloadFile}>
                                {imageUrl === 'notImage' ? (
                                    <div>
                                        <label>파일명</label>
                                        {fileData?.name || itemDetail?.major_class}
                                    </div>
                                ) : (
                                    <div>
                                        <label>미리보기</label>
                                        <img src={imageUrl} alt="미리보기" />
                                    </div>
                                )}
                            </div>
                            <div className="button-container">
                                <button onClick={itemCode ? handlerUpdate : handlerSave}>
                                    {itemCode ? '수정' : '등록'}
                                </button>
                                {itemCode && <button onClick={handlerDelete}>삭제</button>}
                            </div>
                        </>
                    )}
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </ItemModalStyled>
        </>
    )
}    