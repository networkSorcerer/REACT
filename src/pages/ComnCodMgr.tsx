import React, { FC, useState } from "react";
import { ComnCodMgrMain } from "../component/page/ComnCodMgr/ComnCodMgrMain/ComnCodMgrMain";
import { ContentBox } from "../component/common/ContentBox/ContentBox";
import { ComnCodSearch } from "../component/page/ComnCodMgr/ComnCodSearch/ComnCodSearch";
import { createContext } from "react";

interface Context {
    searchKeyword : object;
    setSearchKeyword : (keyword: object) => void;
}

const defaultValue: Context = {
    searchKeyword: {},
    setSearchKeyword: () => {},
}

export const ComnCodContext = createContext(defaultValue);

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
