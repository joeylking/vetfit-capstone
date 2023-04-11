import { useEffect, useState } from 'react'
import { IconContext } from "react-icons";
import { GrPrevious, GrNext } from "react-icons/gr"
import { RiArrowRightSFill, RiArrowLeftSFill } from "react-icons/ri"
import "./pagination.css"

const Pagination = ({ startIndex, lastIndex, length, updateIndex, itemsPerPage }) => {

    const [currentPage, setCurrentPage] = useState(1)
    const numOfPages = Math.ceil(length / itemsPerPage)

    useEffect(() => {
        if (startIndex === 0)
            setCurrentPage(1)
    }, [startIndex])

    const handleChangePage = (index, page) => {
        updateIndex(index)
        setCurrentPage(prev => prev + page)
        window.scroll(0, 0)
    }

    return (
        <div className="paginationContainer">
            {startIndex > 0 &&
                <RiArrowLeftSFill
                    className='paginationBtn'
                    onClick={() => handleChangePage(-itemsPerPage, -1)} />
            }

            {numOfPages !== 0 && <div>{currentPage} of {numOfPages}</div>}
            {lastIndex < length &&
                <RiArrowRightSFill
                    className='paginationBtn'
                    onClick={() => handleChangePage(itemsPerPage, 1)} />
            }

        </div>
    )
}

export default Pagination