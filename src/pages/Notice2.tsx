import { ContentBox } from "../component/common/ContentBox/ContentBox"
import { NoticeMain } from "../component/page/Notice2/NoticeMain/NoticeMain"
import { NoticeSearch } from "../component/page/Notice2/NoticeSearch/NoticeSearch"


export const Notice2 = () => {
    return (
        <>
             <ContentBox>공지사항</ContentBox>
             <NoticeSearch></NoticeSearch>
             <NoticeMain></NoticeMain>
        </>
       
    )
}