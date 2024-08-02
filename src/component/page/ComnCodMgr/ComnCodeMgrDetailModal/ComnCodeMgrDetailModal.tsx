import { useRecoilState } from "recoil"
import { ComnCodDetalTableStyled, ComnCodeMgrDetailModalStyled } from "./styled"
import { modalState } from "../../../../stores/modalState"
import { Button } from "../../../common/Button/Button"
import { FC, useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

export interface ISelectComnDtlCodResponse {
    result : 'SUCCESS';
    comnDtlCodModel: IComnDtlCodModel;
}

export interface IComnDtlCodModel {
    row_num? : number;
    grp_cod? : string;
    grp_cod_nm? : string;
    dtl_cod? : string;
    dtl_cod_nm?: string;
    dtl_cod_eplti? : string;
    use_poa? : string;
}

export interface ComnCodMgrDetailModalProps {
    detailCod?: string;
    onPostSuccess :()=> void;
}

export interface IselectComnDtlCod{
    result: 'SUCCESS';
    resultMsg: string;
}

export const ComnCodeMgrDetailModal : FC<ComnCodMgrDetailModalProps> = ({detailCod, onPostSuccess}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const {grpCod} = useParams();
    const [comnDetail, setComnDetail] = useState<IComnDtlCodModel>();
    const {state} =useLocation();


    useEffect(()=> {
        if(modal && detailCod) searchDetail();
    }, [detailCod]); //의존성 배열은 이 배열안에 있는 요소가 변경될때마다 useEffect가 실행된다 
    // 이것은 모달이 등장할때 마다 props가 변경이 될때 사용하기 용이 하다 


    const searchDetail = () => {
        const postAction : AxiosRequestConfig ={
            method: 'POST',
            url : '/system/selectComnDtlCod.do',
            data : {grp_cod: grpCod, dtl_cod:detailCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction)
        .then((res: AxiosResponse<ISelectComnDtlCodResponse>) => {
            setComnDetail(res.data.comnDtlCodModel);
        })
        .catch((error) => {
          console.error('There was an error!', error);
        });
      
    }

    const handlerSave = () => {
        const postAction : AxiosRequestConfig ={
            method: 'POST',
            url : '/system/saveComnDtlCodJson.do',
            data : {...comnDetail, dtl_grp_cod : grpCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res : AxiosResponse<IselectComnDtlCod>)=>{
            if(res.data.result === 'SUCCESS' ) onPostSuccess();
        })
    }

    const handlerUpdate = () => {
        const postAction : AxiosRequestConfig ={
            method: 'POST',
            url : '/system/updateComnDtlCodJson.do',
            data : {...comnDetail, dtl_grp_cod : grpCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res : AxiosResponse<IselectComnDtlCod>)=>{
            if(res.data.result === 'SUCCESS' ) onPostSuccess();
        })
    }


    const handlerDelete = () => {
        const postAction : AxiosRequestConfig ={
            method: 'POST',
            url : '/system/deleteComnDtlCodJson.do',
            data : {...comnDetail, dtl_grp_cod : grpCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res : AxiosResponse<IselectComnDtlCod>)=>{
            if(res.data.result === 'SUCCESS' ) onPostSuccess();
        })
    }


    const cleanUp = () => {
        setComnDetail(undefined);

    };
    return (
        <>
        <ComnCodeMgrDetailModalStyled ariaHideApp={false} isOpen={modal} onAfterClose={cleanUp}>{/*ariaHideApp을 사용하지 않겠다 */}
        <div className="wrap">
                <div className="header">상세 코드 관리</div>
                <ComnCodDetalTableStyled  >
                    <tbody>
                        <tr>
                            <th>그룹 코드 id</th>
                            <td>
                                <input type="text" name="grp_cod" defaultValue={grpCod}
                                readOnly={true}
                                ></input>
                                
                            </td>
                            <th>그룹 코드 명</th>
                            <td>
                                <input type="text" name="grp_cod_nm"  defaultValue={state.grpCodNm}//강사님은 state.grpCod 이런식으로 쓰심 
                                readOnly
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>상세 코드 id </th>
                            <td>
                                <input type="text" defaultValue={comnDetail?.dtl_cod}
                                 onChange={(e) => setComnDetail({...comnDetail, dtl_cod: e.target.value})}
                                 readOnly={detailCod ? true : false}
                                 ></input>
                            </td>
                            <th>상세 코드 명</th>
                            <td>
                                <input type="text" defaultValue={comnDetail?.dtl_cod_nm}
                                onChange={(e) => setComnDetail({...comnDetail, dtl_cod_nm: e.target.value})}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>코드 설명</th>
                            <td colSpan={3}>
                                <input type="text" defaultValue={comnDetail?.dtl_cod_eplti}
                                onChange={(e) => setComnDetail({...comnDetail, dtl_cod_eplti: e.target.value})}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>사용 유무 *</th>
                            <td colSpan={3}>
                                <input type="radio" name="useYn" value={'Y'} checked={comnDetail?.use_poa === 'Y'}
                                onChange={(e) => setComnDetail({...comnDetail, use_poa: e.target.value})}
                                ></input>
                                사용
                                <input type="radio" name="useYn" value={'N'} checked={comnDetail?.use_poa === 'N'}
                                onChange={(e) => setComnDetail({...comnDetail, use_poa: e.target.value})}
                                ></input>
                                미사용
                            </td>
                        </tr>
                    </tbody>
                </ComnCodDetalTableStyled>
                <Button onClick={detailCod? handlerUpdate : handlerSave}>{detailCod? '수정' : '등록'}</Button>
                {detailCod? <Button onClick={ handlerDelete }>삭제</Button>: null}
                <Button onClick={() => setModal(!modal)}>닫기</Button>
                <div className="btn-group"></div>
            </div>
        </ComnCodeMgrDetailModalStyled>
           
        </>
    )

}