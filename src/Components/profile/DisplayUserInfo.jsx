import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { setSavedCoins } from '../../State/wallet/savedCoins'
import { setLoggedIn } from '../../State/user/loggedIn'
import { setCurrentUser } from '../../State/user/currentUser'
import { setUserProfile } from '../../State/profile/userProfile'
import { USER_URL } from '../../State/url'

const DisplayUserInfo = ({ setEditinguser }) => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const currentUser = useSelector(state => state.currentUser.value)
    const userProfile = useSelector(state => state.userProfile.value)
    const [memberString, setMemberString] = useState("")
    const [userDate, setUserDate] = useState("")

    useEffect(() => {
        if (userProfile?.date)
            calcDaysOfMembership()
    }, [userProfile])

    const calcDaysOfMembership = () => {
        let splitDate = userProfile?.date.split("-");
        let userJoinedDate = new Date(splitDate[0], splitDate[1] - 1, splitDate[2])
        setUserDate(userJoinedDate.toDateString())

        let diff = new Date(new Date().getTime() - userJoinedDate.getTime())

        let years = diff.getUTCFullYear() - 1970
        let months = diff.getUTCMonth()
        let days = diff.getUTCDate()

        pasrseMembership(years, months, days)
    }

    const pasrseMembership = (years, months, days) => {
        let y = years == 1 ? "" : "s"
        let m = months == 1 ? "" : "s"
        let d = days == 1 ? "" : "s"

        setMemberString(`Eagle for ${years} year${y}, ${months} month${m} and ${days} day${d}`)
    }

    const handleDeleteProfile = async () => {
        const res = await fetch(USER_URL.DELETE + currentUser.id, { method: "DELETE" })

        if (res.status === 202)
            handleLogOut()
    }
    const handleLogOut = () => {
        dispatch(setSavedCoins([]))
        dispatch(setLoggedIn(false))
        dispatch(setCurrentUser({}))
        dispatch(setUserProfile([]))
        navigate("/")
        window.location.reload()
    }
    return (
        <>
            <div><h3>{memberString}</h3></div>
            <div><span>Username: </span>{userProfile.username}</div>

            <div><span>Email: </span>{userProfile.email}</div>

            <div><span>Member since: </span>{userDate}</div>

            <div><span>Bio: </span>{userProfile.userBio}</div>

            <div className='userDataEditDeleteBtnContainer'>
                {currentUser?.id == id &&
                    <>
                        <button onClick={() => setEditinguser(true)}>Edit my profile</button>
                        <button onClick={handleDeleteProfile}>Delete profile</button>
                    </>
                }
            </div>
        </>
    )
}

export default DisplayUserInfo