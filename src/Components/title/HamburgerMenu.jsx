import ReactDOM from "react-dom"
import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LogOutBtn from "./LogOutBtn"
import LoginSignupBtns from "./LoginSignupBtns"
import { AiOutlineClose } from "react-icons/ai"

const HamburgerMenu = ({ setShowHamMenu, updateActiveTab }) => {
    const currentUser = useSelector(state => state.currentUser.value)
    const loggedIn = useSelector(state => state.loggedIn.value)
    const location = useLocation()


    useEffect(() => {
        updateActiveTab()
    }, [location])

    return ReactDOM.createPortal(
        <div className="hamNavContainer" onMouseLeave={() => setShowHamMenu(false)}>
            <AiOutlineClose className="openHamIcon" onClick={() => setShowHamMenu(prev => !prev)} />

            <Link className="navLink hamLink" to="/" id="/">Home</Link>

            <Link className="navLink hamLink" to="/forum" id="/forum">Forum</Link>

            <Link className="navLink hamLink" to="/wallet" id="/wallet">Wallet</Link>
            {loggedIn &&
                <>
                    <Link
                        className="navLink hamLink"
                        to={`/profile/${currentUser.username}/${currentUser.id}`}
                        id={`/profile/${currentUser.username}/${currentUser.id}`}>
                        Profile
                    </Link>
                </>}


            {loggedIn ? <LogOutBtn /> : <LoginSignupBtns />}
        </div>
        , document.getElementById("portal"))
}

export default HamburgerMenu