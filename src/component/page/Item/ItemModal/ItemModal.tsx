import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosResponse } from "axios";
import NoImage from '../../../../assets/noImage.jpg';
import { ItemModalStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { ItemCodeModal } from "../ItemCodeModal/ItemCodeModal";
import {  ItemContext } from "../../../../pages/Product";
import { ItemCodeSearch } from "../ItemCodeSearch/ItemCodeSearch";
import {ItemCodeSearchProvider} from "../../../../api/provider/ItemCodeSearchProvider";

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
    itemDetail : IItemDetail;
    resultMsg : string;
}



export const ItemModal : FC<IItemModalProps> = ({itemCode, onSuccess, setItemCode}) =>{
    const [modal, setModal] = useRecoilState<boolean>(modalState);
    const [itemDetail, setItemDetail] = useState<IItemDetail>({});
    const item_code_ref = useRef<HTMLInputElement>(null);
    const item_name = useRef<HTMLInputElement>(null);
    const manufac = useRef<HTMLInputElement>(null);
    const provide_value = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState<string>('noImage');
    const [fileData, setFileData] = useState<File>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>();
    const {itemCodeContext} = useContext(ItemContext);
    const cust_id_ref = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        // 상태가 정의되었을 때 searchDetail 함수 호출
        if (itemCode) {
            searchDetail();
            
        }
        
        // 클린업 함수
        return () => {
            setItemCode(undefined); // 상태 초기화
        };
    }, [itemCode]); // itemCode 변경 시 effect 실행

    useEffect(() => {
        // itemCodeContext가 변경될 때 input 요소의 값 업데이트
        if (cust_id_ref.current) {
            cust_id_ref.current.value = itemCodeContext;
        }
     
        console.log('itemCodeContext updated:', itemCodeContext);
    }, [itemCodeContext]); // itemCodeContext 변경 시 effect 실행


    const searchDetail = () =>{
       
        axios.post('/management/itemDetail.do', {item_code : itemCode}).then((res: AxiosResponse<IItemDetailResponse>)=>{
            if(res.data.itemDetail) {
                setItemDetail(res.data.itemDetail);
                const fileExt = res.data.itemDetail.item_stand;
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

    //const requiredFields =  ['item_code', 'item_name', 'provide_value', 'manufac'];

    //const areFieldsValid= (itemDetail :IItemDetail) : boolean =>{
        //return requiredFields.every(a => itemDetail[a as keyof IItemDetail] !== undefined &&  itemDetail[a as keyof IItemDetail] !=='');
   // }

    const handlerSave = async() => {
        // 파일 저장 컬럼명은 상관없음 
        //property쪽에서도 경로를 지정해줘야하함 
        //multipartfile을 사용함 
        //if(!areFieldsValid(itemDetail)){
            //alert('모든 제품 정보를 입력하세요.');
            //return;
       // }
        //tb_item_code랑 tb_company_item 에 같이 넣을려고 하는데 
        //serviceImpl단에서 2개를 처리하면 된다고 하신다 
        const fileForm = new FormData();
        const cust_id = cust_id_ref.current?.value;
        const item_code= item_code_ref.current?.value;
        const textData = {
            cust_id,
            item_code,
            item_name: item_name.current?.value,
            manufac: manufac.current?.value,
            provide_value: provide_value.current?.value,
        };
        
        
        const areAllFieldsValid = Object.values(textData).every(value => value !== null && value !== undefined && value !== '');


        if (fileData) fileForm.append('file', fileData);
        fileForm.append('text', new Blob([JSON.stringify(textData)], { type: 'application/json' }));
        if (areAllFieldsValid) {
            axios.post('/management/ItemFileSaveJson', fileForm).then((res: AxiosResponse<IItemDetailResponse>) => {
                if (res.data.resultMsg === 'SUCCESS') {
                    onSuccess();
                }
            });
           
        } else {
            alert('모든 내용을 작성하세요');
        }
    }
    
    const handlerDelete = () =>{

    }
    const checkItemCode = () =>{
        setIsModalOpen(!isModalOpen);
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
                     
                    <div>
                    {itemCodeContext ? <label>기업 코드 : <input type="text" ref={cust_id_ref}></input></label> : null}
                    </div>
                    <div>
                    {itemCode ? (
                           null
                        ) 
                        : 
                        ( <Button onClick={() => checkItemCode()}>납품업체 선택</Button>)
                    }
                    
                    </div>
                    <div>
                    {isModalOpen ? (
                        <>
                        <ItemCodeSearchProvider>
                            <ItemCodeSearch/>
                            <ItemCodeModal />
                            
                        </ItemCodeSearchProvider>
                       
                        </>
                    ) : (
                        <>
                            <label>
                                제품 코드: <input type="text" defaultValue={itemDetail?.item_code} ref={item_code_ref} />
                            </label>
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
                    </div>
                    <button onClick={() => setModal(!modal)}>나가기</button>
                </div>
            </ItemModalStyled>
            
        </>
    )
}    