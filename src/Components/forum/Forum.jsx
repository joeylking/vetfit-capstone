import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchAllPosts } from "../../State/posts/allPosts"
import { fetchAllComments, postNewComment } from '../../State/comments/allComments'
import { showAllAddCommentBtns, hideCurrentCommentBtn, hideAllTextAreas, showCurrentTextArea } from './helperMethods'
import "./Forum.css"
import DisplayComments from './DisplayComments'
import NewCommentContainer from './NewCommentContainer'

const Forum = () => {
    const dispatch = useDispatch();
    const allPosts = useSelector(state => state.allPosts.value)
    const currentUser = useSelector(state => state.currentUser.value)
    const [text, setText] = useState("")

    useEffect(() => {
        dispatch(fetchAllPosts())
        dispatch(fetchAllComments())
    }, [])

    const handleViewComments = (e) => {
        document.querySelectorAll(".commentsContainer").forEach(item => {
            if (item.dataset.postId == e.target.dataset.postId)
                return item.classList.toggle("hide")
        })
    }

    const handleVewTextArea = (e) => {
        setText("")
        showAllAddCommentBtns()
        hideCurrentCommentBtn(e)
        hideAllTextAreas()
        showCurrentTextArea(e)
    }

    const handlePostComment = (e) => {
        if (text.trim().length < 1) return;

        const newComment = {
            "userId": currentUser.id,
            "postId": e.target.dataset.postId,
            "body": text
        }
        dispatch(postNewComment(newComment))

        hideAllTextAreas()
        showAllAddCommentBtns()
        setText("")
    }

    const handleCancel = (e) => {
        showAllAddCommentBtns()
        hideAllTextAreas()
        setText("")
    }

    return (
        <div className='allPostsContainer'>
            {allPosts.map(elem =>
                <div key={elem.id} className="individualPostContainer">
                    <h3>{elem.title}</h3>
                    <p>{elem.body}</p>
                    <p>{elem.id}</p>

                    <div className='postBtnContainer'>
                        <button onClick={handleViewComments} data-post-id={elem.id}>Toggle Comments</button>
                        <button
                            onClick={handleVewTextArea}
                            data-post-id={elem.id}
                            className="addCommentBtn">Add Comment
                        </button>
                    </div>

                    <div className='newCommentContainer hide' data-post-id={elem.id}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            data-post-id={elem.id}
                            className='newCommentTextArea' />
                        <div className='addCommentBtnContainer'>
                            <button onClick={handlePostComment} data-post-id={elem.id}>Reply</button>
                            <button onClick={handleCancel} data-post-id={elem.id}>Cancel</button>
                        </div>

                    </div>
                    <NewCommentContainer elem={elem} />
                    <DisplayComments elem={elem} />

                </div>)}

        </div>
    )
}

export default Forum