import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { modalState } from "../../../../stores/modalState";
import { useRecoilState } from "recoil";
import { NoticeSearchStyled } from "./styled";
import { Button } from "../../../common/Button/Button";

export const NoticeSearch = () => {
    const [startDate, setStartDate] = useState<string>();
    // setStartDate는 startDate 상태를 업데이트하기 위해 사용되는 함수입니다
    // 이 함수는 새로운 값을 인자로 받아 startDate를 그 값으로 업데이트하고, 컴포넌트를 리렌더링합니다.
    const [endDate, setEndDate] = useState<string>(); //startDate와 endDate는 uesState로 연결됨 
    const title = useRef<HTMLInputElement>(null);//title useRef로 연결됨 
    const navigate = useNavigate();
    const [modal, setModal] = useRecoilState<boolean>(modalState);

    const handlerSearch = () => {
        const query : string[] = [];

        !title.current?.value || query.push(`searchTitle=${title.current?.value}`);//title이 없으면 아무것도 실행되지 않고 
        //있으면 query 배열에 searchTitle이름으로 ${} 안의 값을 저장함 
        !startDate || query.push(`startDate = ${startDate}`);
        !endDate || query.push(`endDate=${endDate}`);

        const queryString = query.length > 0 ? `${query.join('&')}` : '';
        navigate(`/react/board/notice.do${queryString}`);//URL에 저장해서 내용을 출력하는 방식이다 
        //?searchTitle=1&startDate%20=2024-08-01&endDate%20=2024-08-02
    };

    const handlerModal = () =>{
        setModal(!modal);
    }

    return (
        <>
            <NoticeSearchStyled>
                <input ref={title}></input>
                <input type="date" onChange={(e) => setStartDate(e.target.value)}></input>
                <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
            <Button onClick={handlerSearch}>검색</Button>
            <Button onClick={handlerModal}>등록</Button>
            </NoticeSearchStyled>
        </>
    )
}