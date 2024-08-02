import { ContentBox } from "../component/common/ContentBox/ContentBox"
import { NoticeMain } from "../component/page/Notice3/NoticeMain/NoticeMain"
import { NoticeSearch } from "../component/page/Notice3/NoticeSearch/NoticeSearch"
import { ComnCodMgr } from "./ComnCodMgr"
import { ComnCodMgr2 } from "./ComnCodMgr2"


export const Notice2 = () => {
    return (
        <>
            <ContentBox>공지사항</ContentBox>
            <NoticeMain></NoticeMain>
            <NoticeSearch></NoticeSearch>
        </>
       
    )
}