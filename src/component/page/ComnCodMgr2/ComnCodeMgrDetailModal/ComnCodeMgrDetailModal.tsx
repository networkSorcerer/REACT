import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IselectComnDtlCod } from "../../ComnCodMgr/ComnCodeMgrDetailModal/ComnCodeMgrDetailModal";
import { ComnCodDetalTableStyled, ComnCodeMgrDetailModalStyled } from "./styled";
import { Button } from "../../../common/Button/Button";

export interface ISelectComnDtlCodResponse {
    result : 'SUCCESS';
    comnDtlCodModel : IComnDtlCodModel;
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
    detailCod?:string;
    onPostSuccess : () =>void;
}

export interface ISelectComnDtlCod {
    result : 'SUCCESS';
    resultMsg: string;
}

export const ComnCodeMgrDetailModal : FC<ComnCodMgrDetailModalProps> =({detailCod, onPostSuccess}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const {grpCod} = useParams();
    const [comnDetail, setComnDetail] = useState<IComnDtlCodModel>();
    const {state} = useLocation();
    //현재의 URL에 대한 정보를 얻을 수 있도록 합니다.
    // 이 훅을 사용하면 컴포넌트가 렌더링될 때마다 URL이 변경된 경우 이를 감지하고,
    // URL의 경로와 쿼리 문자열, 해시 등의 정보를 얻을 수 있습니다.

    useEffect(()=>{
        if(modal && detailCod) searchDetail();
    }, [detailCod]);

    const searchDetail = ()=>{
        const postAction : AxiosRequestConfig = {
            method : 'POST',
            url : '/system/selectComnDtlCod.do',
            data : {grp_cod: grpCod, dtl_cod:detailCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res : AxiosResponse<ISelectComnDtlCodResponse>) =>{
            setComnDetail(res.data.comnDtlCodModel);
        }).catch((error) =>{

        })
    }

    const handlerSave = () =>{
        const postAction: AxiosRequestConfig={
            method: 'POST',
            url : '/system/saveComnDtlCodJson.do',
            data: {...comnDetail, dtl_grp_cod : grpCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res : AxiosResponse<ISelectComnDtlCod>)=>{
            if(res.data.result ==='SUCCESS')onPostSuccess();
        })
    }

    const handlerUpdate = () => {
        const postAction : AxiosRequestConfig={
            method:'POST',
            url : '/system/updateCOmnDtlCodJson.do',
            data : {...comnDetail, dtl_grp_cod :grpCod},
            headers : {
                'Content-Type' : 'application.json',
            },
        };
        axios(postAction).then((res:AxiosResponse<IselectComnDtlCod>)=>{
            if(res.data.result === 'SUCCESS') onPostSuccess();
        })
    }
    const handlerDelete = () =>{
        const postAction :AxiosRequestConfig ={
            method:'POST',
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

    const cleanUp = () =>{
        setComnDetail(undefined);
    }

    return(
    <>
    <ComnCodeMgrDetailModalStyled ariaHideApp={false} isOpen={modal} onAfterClose={cleanUp}>
        <div className="wrap">
            <ComnCodDetalTableStyled>
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
                            <input type="text" name="grp_cod_nm" defaultValue={state.grpCodNm}
                            readOnly
                            ></input>
                        </td>
                    </tr>
                    <tr>
                        <th>상세 코드 id</th>
                        <td>
                            <input type="text" defaultValue={comnDetail?.dtl_cod}
                            onChange={(e)=> setComnDetail({...comnDetail, dtl_cod: e.target.value})}
                            readOnly={detailCod ? true : false}
                            ></input>
                        </td>
                        <th>상세 코드 명</th>
                        <td>
                            <input type="text" defaultValue={comnDetail?.dtl_cod_nm}
                            onChange={(e)=> setComnDetail({...comnDetail,dtl_cod_nm : e.target.value})}
                            ></input>
                        </td>
                    </tr>
                    <tr>
                        <th>코드 설명</th>
                        <td colSpan={3}>
                            <input type="text" defaultValue={comnDetail?.dtl_cod_eplti}
                            onChange={(e)=>setComnDetail({...comnDetail, dtl_cod_eplti: e.target.value})}
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
            <Button onClick={detailCod? handlerUpdate : handlerSave}>{detailCod?'수정':'등록'}</Button>
            {detailCod? <Button onClick={handlerDelete}>삭제</Button> : null}
            <Button onClick={()=> setModal(!modal)}>닫기</Button>
            <div className="btn-group"></div>
        </div>
    </ComnCodeMgrDetailModalStyled>
    </>)
    
}
