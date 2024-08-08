import { cleanup } from "@testing-library/react";
import { SupplyDetailModalStyled, SupplyDetailTableStyled } from "./styled";
import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { useLocation, useParams } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Button } from "../../../common/Button/Button";

export interface ISupplyDetailResponse { // API 응답에 대한 정의와 타입
    resultMsg: string;
    itemDetail: ISupplyDetailModel;
    // API 응답 객체 혹은 배열 명
}

export interface ISupplyDetailModel { // API 응답에 대한 정의와 타입
    item_code?: string;
    item_name?: string;
    provide_value?: number;
    manufac?: string;
}

export interface SupplyDetailModalProps {
    item_code?: string;
    onPostSuccess: () => void;
    setItem_code: (item_code: string) => void; // setItem_code 사용
}

export const SupplyDetailModal: FC<SupplyDetailModalProps> = ({ setItem_code,item_code, onPostSuccess }) => {
    const [modal, setModal] = useRecoilState(modalState);
    const { cust_id } = useParams(); // useParams는 React Router 라이브러리에서 제공하는 훅
    const [itemDetail, setItemDetail] = useState<ISupplyDetailModel>({});
    //안정성: 빈 객체 {}를 초기값으로 설정하면, 컴포넌트의 상태가 항상 객체임을 보장하므로, 
    //필드 접근 시 undefined 체크가 필요 없어서 코드가 간결해질 수 있습니다.
    //사용의 용이성: 초기값이 빈 객체일 경우, itemDetail.item_code와 같은 접근이 안전하게 수행될 수 있습니다. 
    //반면, 초기값이 undefined인 경우 itemDetail?.item_code와 같이 undefined 체크를 해야 하므로 코드가 복잡해질 수 있습니다.
    const { state } = useLocation();
    const [isCodeValid, setIsCodeValid] = useState<boolean>(false);//리액트는 상태를 관리한다

    useEffect(() => {
        if (modal && item_code) searchDetail();
    }, [modal, item_code]);

    const searchDetail = () => {
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/management/itemDetail.do',
            data: { item_code: item_code },
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<ISupplyDetailResponse>) => {
            setItemDetail(res.data.itemDetail);
        });
    };

    const sameCode = () => {
        if(!itemDetail.item_code?.trim()) {
            alert("상품코드를 입력해주세요");
            return;
        }

        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/management/sameCode.do',
            data: { item_code: itemDetail.item_code, cust_id: cust_id },//itemDetail 거의 만능임 특정 부분만 쓰고 싶으면 
            //itemDetail.item_code 이런식으로 가져다 쓰면됨
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<ISupplyDetailResponse>) => {
            if (res.data.resultMsg === "SUCCESS") {
                alert("중복된 상품코드가 존재합니다");
                setIsCodeValid(false);
            } else {
                alert("등록 가능한 상품 코드입니다");
                setIsCodeValid(true);
            }
        });
    };

    const handlerUpdate = () => {
        const postAciton : AxiosRequestConfig = {
            method :'POST',
            url : '/management/productUpdate.do',
            data : itemDetail,
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAciton).then((res:AxiosResponse<ISupplyDetailResponse>)=>{
            if(res.data.resultMsg==="SUCCESS") {
                alert("SUCCESS")
                onPostSuccess();
            } 
        })
    }

    // 필수 필드 목록을 정의
    const requiredFields = ['item_code', 'item_name', 'provide_value', 'manufac'];

    // 필수 필드들이 모두 존재하는지 확인하는 함수
    const areFieldsValid = (itemDetail: ISupplyDetailModel): boolean => {
        return requiredFields.every(field => itemDetail[field as keyof ISupplyDetailModel] !== undefined && itemDetail[field as keyof ISupplyDetailModel] !== '');
    }


    const handlerSave = async() =>{//더블 API타기
        //더블 API 위험한거 같다 
        //둘다 같이 되어야 하는데 하나는 되고 하나는 안되고 DB가.... 점점 ... 연습용이긴 하지만 안전한 방법 없나? ....

        //약간 DB구조가 이상한게 맞지 않을까...
        //cust면 고객? order 테이블도 있고 외래키로 연결되어있네 ...
        //그냥 cust 테이블이 연습용인건가 
        //cust_id와 연계가 안되면 supplyDetail에서 item 정보를 가져오지 못함 
        //tb_company_item에 안들어가도 cust_id 와 연계되어서 Item 정보가 나올수 있도록 ......
        // INSERT INTO tb_order_company (company_seq, company_name)
        // SELECT cust_id, cust_name
        // FROM tb_cust_info
        // ON DUPLICATE KEY UPDATE
        // company_name = VALUES(company_name);
        //INSERT INTO tb_order_company (company_seq, company_name)
        //SELECT cust_id, cust_name
        //FROM tb_cust_info;

        // DB 폭파되기전에 물어보고 할 것 .
        // 필수 입력 필드 목록
        // itemDetail 객체의 유효성을 검사
        //조회만 되는 페이지가 많은게 ..... 외래성 제약이 엄청 얽혀있어서 힘드네 .....
        if (!areFieldsValid(itemDetail)) {
            alert('모든 제품 정보를 입력하세요.');
            return;
        }
        if(!isCodeValid) {
            alert('먼저 제품 코드 중복확인을 하세요');
            return;
        }
        const postAciton : AxiosRequestConfig = {
            method : 'POST',
            url : '/management/productRegist.do',
            data : itemDetail, 
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAciton).then((res : AxiosResponse<ISupplyDetailResponse>)=>{

        });
        const postAciton1 : AxiosRequestConfig = {
            method : 'POST',
            url : '/management/newItemSave1.do',
            data : { item_code: itemDetail.item_code, cust_id: cust_id },
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAciton1).then((res : AxiosResponse<ISupplyDetailResponse>)=>{
            if(res.data.resultMsg=== 'SUCCESS') {
                alert("SUCCESS");
                onPostSuccess();

            }
        });
    }

    const handlerDelete = () =>{
        const postAciton : AxiosRequestConfig ={
            method : 'POST',
            url : '/management/productDelete.do',
            data : {item_code : item_code},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAciton).then((res : AxiosResponse<ISupplyDetailResponse>)=>{
            if(res.data.resultMsg === 'SUCCESS') {
                alert(res.data.resultMsg);
                onPostSuccess();
            } 
        })
    }

    const cleanUp = () =>{
        setItemDetail({});
        setItem_code('');
    }
    return (
        <>
            <SupplyDetailModalStyled ariaHideApp={false} isOpen={modal} onAfterClose={cleanUp}>
                <div className="wrap">
                    <div className="header">제품 정보</div>
                    <SupplyDetailTableStyled>
                        <tbody>
                            <tr>
                                <th>납품업체코드</th>
                                <td>
                                    <input type="text" name="item_code" value={cust_id} readOnly />
                                </td>
                                <th>납품업체 명</th>
                                <td>
                                    <input type="text" name="item_name" value={state.supplyNm} readOnly />
                                </td>
                            </tr>
                            <tr>
                                <th>제품 코드</th>
                                <td>
                                    <input type="text" name="item_code" value={itemDetail?.item_code || ''}
                                    onChange={(e) => setItemDetail({...itemDetail, item_code : e.target.value})} />
                                    {item_code? null : <Button onClick={sameCode}>중복확인</Button>}
                                   
                                </td>
                                <th>제품 명</th>
                                <td>
                                    <input type="text" name="item_name" value={itemDetail?.item_name || ''}
                                        onChange={(e) => setItemDetail({ ...itemDetail, item_name: e.target.value })} />
                                </td>
                            </tr>
                            <tr>
                                <th>제조사</th>
                                <td>
                                    <input type="text" name="manufac" value={itemDetail?.manufac || ''}
                                        onChange={(e) => setItemDetail({ ...itemDetail, manufac: e.target.value })} />
                                </td>
                                <th>가격</th>
                                <td>
                                    <input type="text" name="provide_value" value={itemDetail?.provide_value || ''}
                                        onChange={(e) => setItemDetail({ ...itemDetail, provide_value: parseInt(e.target.value, 10) || 0 })} />
                                </td>
                            </tr>
                        </tbody>
                    </SupplyDetailTableStyled>
                    <Button onClick={item_code? handlerUpdate : handlerSave}>{item_code? '수정' : '등록'}</Button>
                    {/* {item_code ? <Button onClick={handlerDelete}>삭제</Button> : null} */}
                    <Button onClick={() => setModal(!modal)}>닫기</Button>
                </div>
            </SupplyDetailModalStyled>
        </>
    );
}
