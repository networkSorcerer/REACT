import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { atom } from "recoil";
import { ItemSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";
import { modalState } from "../../../../stores/modalState";

// export const modalState = atom<boolean>({
//     key : 'modalState',
//     default : false,
// })

//*atom**은 Recoil 상태의 기본 단위로, 상태를 정의하고, 관리할 수 있는 객체입니다. 
//Recoil의 atom을 사용하여 상태를 선언하고, 이를 다양한 컴포넌트에서 공유하거나 수정할 수 있습니다.
export const ItemSearch = () => {
    const navigate = useNavigate();
    //useNavigate는 React Router v6에서 제공하는 훅(hook)으로, 프로그래밍 방식으로 페이지 이동을 처리하는 데 사용됩니다. 
    //이를 통해 React 애플리케이션 내에서 URL을 변경하거나, 다른 페이지로 리디렉션할 수 있습니다.
    const [modal, setModal] =useRecoilState<boolean>(modalState);
    const itemSearch = useRef<HTMLInputElement>(null);
    //HTMLInputElement는 TypeScript에서 사용되는 타입으로, HTML의 <input> 요소를 나타냅니다. 
    const handlerSearch = () => {
        const query : string[]=[];

        !itemSearch.current?.value || query.push(`searchItemCode=${itemSearch.current?.value}`);

        const queryString = query.length > 0? `?${query.join('&')}` :'';
        navigate(`/react/management/productInfo.do${queryString}`);
    };

    const handlerModal = () =>{
        setModal(!modal);
    }
    return (
        <>
        <ItemSearchStyled>
            <input ref={itemSearch}></input>
        <Button onClick={handlerSearch}>검색</Button>
        <Button onClick={handlerModal}>등록</Button>
        </ItemSearchStyled>
        </>
    )
}