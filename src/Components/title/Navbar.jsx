import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import LoginSignupBtns from "./LoginSignupBtns";
import LogOutBtn from "./LogOutBtn";
import { GiHamburgerMenu } from "react-icons/gi"
import "./title.css"
import HamburgerMenu from "./HamburgerMenu";
import logo from "../../Assets/CryptoEagle.png"

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const loggedIn = useSelector(state => state.loggedIn.value);
    const currentUser = useSelector(state => state.currentUser.value)
    const [showHamMenu, setShowHamMenu] = useState(false)
    const storedUser = JSON.parse(localStorage.getItem('cryptoEagleUser'))

    useEffect(() => {
        updateActiveTab()
    }, [location])


    const updateActiveTab = () => {
        document.querySelectorAll(".navLink").forEach(elem => {
            elem.classList.remove("activeLink")
            elem.id == location.pathname && elem.classList.add("activeLink")
        })
    }

    return (
        <div className="navbarContainer">
            <div className="navLogoTitle">
            <div className="navLogo">
            <img src={logo} height="55" onClick={() => navigate("/")} />
            </div>
            <h1 className="navTitle" onClick={() => navigate("/")}>
                CRYPTO EAGLE
            </h1>
            </div>
            {location.pathname !== "/login" && location.pathname !== "/create-acc" &&
                <>
                    <div className="navLinksContainer standardMenu">
                        <Link className="navLink" to="/" id="/">Home</Link>
                        |
                        <Link className="navLink" to="/forum" id="/forum">Forum</Link>
                        |
                        <Link className="navLink" to="/wallet" id="/wallet">Wallet</Link>
                        {(localStorage.getItem('cryptoEagleUser') !== null || loggedIn) &&
                            <>
                                |
                                <Link
                                    className="navLink"
                                    to={`/profile/${currentUser.username || storedUser?.username}`}
                                    id={`/profile/${currentUser.username || storedUser?.username}`}>
                                    Profile
                                </Link>
                            </>}
                    </div>

                    <div className="standardMenu">
                        {loggedIn ? <LogOutBtn /> : <LoginSignupBtns />}
                    </div>

                    <div className="hamburgerMenuContainer">
                        <GiHamburgerMenu onClick={() => setShowHamMenu(true)} style={{ fontSize: "3rem" }} />
                        {showHamMenu && <HamburgerMenu setShowHamMenu={setShowHamMenu} updateActiveTab={updateActiveTab} />}
                    </div>
                </>
            }
        </div>
    )
}

export default Navbar