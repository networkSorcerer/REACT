import React, { FC, useState } from "react";
import { ComnCodMgrMain } from "../component/page/ComnCodMgr/ComnCodMgrMain/ComnCodMgrMain";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ComnCodSearch } from "../component/page/ComnCodMgr/ComnCodSearch/ComnCodSearch";
import { createContext } from "react";
//전역적으로 상태를 공유하기 위해 사용되는 Context 객체를 생성합니다. 
interface Context {
    searchKeyword : object;
    setSearchKeyword : (keyword: object) => void;
}

const defaultValue: Context = {
    searchKeyword: {},
    setSearchKeyword: () => {},
}

export const ComnCodContext = createContext(defaultValue);
//FC는 Function Component의 약자로, TypeScript에서 함수형 컴포넌트를 정의할 때 사용하는 유틸리티 타입입니다. 
export const ComnCodProvider : FC<{children : React.ReactNode | React.ReactNode[]}>= ({children}) => {
    const [searchKeyword, setSearchKeyword] = useState({});
    return <ComnCodContext.Provider value={{ searchKeyword, setSearchKeyword }}>{children}</ComnCodContext.Provider>
    };

export const ComnCodMgr = () => {
    return (
        <>
            <ComnCodProvider>
                <ContentBox>공통코드</ContentBox>
                <ComnCodMgrMain />
                <ComnCodSearch/>
            </ComnCodProvider>
            
        </>
    );
};
