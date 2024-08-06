import { FC, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ComnCodMgrModalStyled, ComnCodMgrTableStyled } from "../../ComnCodMgr/ComnCodMgrModal/styled";
import { Button } from "../../../common/Button/Button";

export interface IComnCod {
    grp_cod?: string;
    grp_cod_nm?: string;
    use_poa?: string;
    grp_cod_eplti?:string;
}

export interface IPostResponse {
    result: 'SUCCESS';
}

export interface IDetailResponse extends IPostResponse {
    comnGrpCodModel : IComnCod;
    resultMsg: string;
}

export interface IComnCodMgrModalProps {
    onPostSuccess: () => void;
    grpCod: string;
    setGrpCod: (grpCod: string)=>void;
}
//FC는 Function Component의 약자로, TypeScript에서 함수형 컴포넌트를 정의할 때 사용하는 유틸리티 타입입니다.
// FC는 기본적으로 컴포넌트의 props를 나타내는 제네릭 타입을 받으며, 
//이 타입을 통해 컴포넌트가 받아야 할 props의 타입을 명시할 수 있습니다.
export const ComnCodMgr2Modal :FC<IComnCodMgrModalProps>= ({onPostSuccess, grpCod, setGrpCod}) => {
    const [modal, setModal] = useRecoilState(modalState);
    const [comnCod, setComnCod] = useState<IComnCod>();
    useEffect(() => {
        if(modal&& grpCod) searchDetail(grpCod);
    },[modal]);

    const searchDetail = async(grpCod : string ) =>{
        const postAction : AxiosRequestConfig = {
            method : 'POST',
            url : '/system/selectComnGrpCod.do',
            data : {grp_cod : grpCod},
            headers : {
                'Content-Type': 'application/json',
            },
        };
        try {
            await axios(postAction).then((res : AxiosResponse<IDetailResponse>)=>{
                if(res.data.result === 'SUCCESS')setComnCod(res.data.comnGrpCodModel);
            });
        }catch(error) {
            alert(error);
        }
    };

    const handlerSave = () => {
        const postAction: AxiosRequestConfig = {
            method: 'POST',
            url: '/system/saveComnGrpCodJson.do',
            data: comnCod,
            headers: {
                'Content-Type': 'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<IPostResponse>) => {
            if (res.data.result === 'SUCCESS') {
                onPostSuccess();
            }
        });
    };

    const handlerUpdate =() =>{
        const postAction :  AxiosRequestConfig = {
            method : 'POST',
            url:'/system/updateComnGrpCodJson.do',
            data: comnCod,
            headers : {
                'Content-Type':'application/json',
            },
        };
        axios(postAction).then((res: AxiosResponse<IPostResponse>)=>{
            if(res.data.result === 'SUCCESS' ){
                onPostSuccess();
            }
        });
    };

    const handlerDelete = () => {
        const postAction : AxiosRequestConfig = {
            method: 'POST',
            url : '/system/deleteComnGrpCod.do',
            data : {grp_cod : grpCod},
            headers : {
                'Content-Type' : 'application/json',
            },
        };
        axios(postAction).then((res : AxiosResponse<IPostResponse>)=>{
            if(res.data.result === 'SUCCESS') {
                onPostSuccess();
            }
        });
    };

    const cleanUp = () =>{
        setComnCod(undefined);
        setGrpCod('');
    }
    return (
        <ComnCodMgrModalStyled isOpen={modal} ariaHideApp={false} onAfterClose={cleanUp}>
            <div className="wrap">
                <div className="header">그룹 코드 관리</div>
                <ComnCodMgrTableStyled>
                    <tbody>
                        <tr>
                            <th>그룹 코드 id *</th>
                            <td>
                                <input 
                                type="text"
                                name="grp_cod"
                                required
                                onChange={(e) =>{
                                    setComnCod({ ...comnCod, grp_cod: e.target.value});
                                }}
                                defaultValue={comnCod?.grp_cod || ''}
                                readOnly={grpCod ? true : false}
                                ></input>
                                </td>
                            <th>그룹 코드 명 *</th>
                            <td>
                                <input 
                                type="text"
                                name="grp_cod_nm"
                                onChange={(e) =>{
                                    setComnCod({...comnCod, grp_cod_nm : e.target.value});
                                }}
                                defaultValue={comnCod?.grp_cod_nm || ''}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>코드 설명</th>
                            <td colSpan={3}>
                                <input type="text"
                                onChange={(e) =>{
                                    setComnCod({...comnCod, grp_cod_eplti : e.target.value});
                                }}
                                defaultValue={comnCod?.grp_cod_eplti || ''}
                                ></input>
                            </td>
                        </tr>
                        <tr>
                            <th>사용 유무 *</th>
                            <td colSpan={3}>
                                <input 
                                type="radio"
                                name="useYn"
                                value={'Y'}
                                onChange={(e) => setComnCod({...comnCod,use_poa:e.target.value})}
                                checked={comnCod?.use_poa === 'Y'}
                                ></input>
                                사용
                                 <input
                                    type="radio"
                                    name="useYn"
                                    value={'N'}
                                    onChange={(e) => setComnCod({ ...comnCod, use_poa: e.target.value })}
                                    checked={comnCod?.use_poa === 'N'}
                                ></input>
                                미사용
                            </td>
                        </tr>
                    </tbody>
                </ComnCodMgrTableStyled>
                <Button onClick={grpCod ? handlerUpdate : handlerSave}>{grpCod ? '수정' : '저장'}</Button>
                    {grpCod ? <Button onClick={handlerDelete}>삭제</Button> : null}
                <Button onClick={()=> setModal(!modal)}>닫기</Button>
            </div>
        </ComnCodMgrModalStyled>
    )
}