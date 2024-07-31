import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NoticeSearchStyled } from "../../Notice/NoticeSearch/styled";
import { Button } from "../../../common/Button/Button";
import { useRecoilState } from "recoil";
import { modalState } from "../../../../stores/modalState";

export const NoticeSearch = () => {

    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const title = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [modal, setModal] = useRecoilState<boolean>(modalState);

    const handlerSearch = () => {
        const query : string[] =[];

        !title.current?.value || query.push(`searchTitle=${title.current?.value}`);
        !startDate || query.push(`startDate = ${startDate}`);
        !endDate || query.push(`endDate = ${endDate}`);

        const queryString = query.length > 0 ? `?${query.join('&')}` :'';
        navigate(`/react/board/notice.do${queryString}`);

    }
    const handlerModal= () =>{
        setModal(!modal);
    }
    return (
    <>
        <NoticeSearchStyled>
            <input ref={title}></input>
            <input type ="date" onChange={(e) => setStartDate(e.target.value)}></input>
            <input type="date" onChange={(e) => setEndDate(e.target.value)}></input>
            <Button onClick={handlerSearch}>검색</Button>
            <Button onClick={handlerSearch}>등록</Button>
        </NoticeSearchStyled>
    </>

    );
};