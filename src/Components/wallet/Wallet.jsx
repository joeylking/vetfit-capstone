import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { fetchAllSavedCoinsByUser, deleteFromWallet } from "../../State/wallet/savedCoins"
import { fetchIndividualCoinData, setAllCoinData } from "../../State/wallet/allCoinData"
import { fetchUserProfile } from "../../State/profile/userProfile"
import Pagination from "../templates/Pagination"
import { getImg, parseMoneyValue } from "../home/helperMethods"
import { setLoading } from "../../State/loading"
import { BsTrash } from "react-icons/bs"


const Wallet = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const allSavedCoins = useSelector(state => state.savedCoins.value)
    const allCoinData = useSelector(state => state.allCoinData.value)
    const currentUser = useSelector(state => state.currentUser.value)
    const loggedIn = useSelector(state => state.loggedIn.value)
    const [startIndex, setStartIndex] = useState(0)
    const [lastIndex, setLastIndex] = useState(10)

    useEffect(() => {
        if (!loggedIn && localStorage.getItem('cryptoEagleUser') === null)
            return redirectToLogin()

        if (currentUser.id) {
            dispatch(setLoading(true))
            Promise.resolve(dispatch(fetchAllSavedCoinsByUser(currentUser.id)))
                .then(() => dispatch(setLoading(false)))
        }
    }, [currentUser])

    useEffect(() => {
        if (allSavedCoins?.length > 0)
            getCoinData()
    }, [allSavedCoins?.length])

    const redirectToLogin = () => {
        navigate("/")
        navigate("/login")
    }

    const getCoinData = () => {
        dispatch(setAllCoinData([]))
        allSavedCoins.forEach(elem => {
            dispatch(fetchIndividualCoinData(elem.currencyName))
        })
    }

    const handleRemoveFromWallet = (e) => {
        let id;

        dispatch(setLoading(true))
        allSavedCoins.forEach(elem => {
            if (elem.currencyName === e.currentTarget.dataset.name) {
                id = elem.id
            }
        })

        Promise.resolve(dispatch(deleteFromWallet(id)))
            .then(() => {
                dispatch(fetchUserProfile(currentUser.username))
                dispatch(setLoading(false))
            })
    }
    const updateIndex = (num) => {
        setStartIndex(prev => prev + num)
        setLastIndex(prev => prev + num)
    }

    if (allSavedCoins?.length < 1)
        return (
            <div className="allCoinsContainer">
                <h1>You do not have any saved coins!</h1>
            </div>)

    return (
        <div className="allCoinsContainer">

            <div className="coinGridHeaderContainer">
                <div className="gridHeader">Currency</div>
                <div className="gridHeader">Price</div>
                <div className="gridHeader">Change</div>
                <div className="gridHeader marketCap">Market cap</div>
                <div className="gridHeader volume">Volume(24hr)</div>
                <div className="gridHeader supply">Supply</div>
                <div className="gridHeader">Watching</div>
            </div>

            {allCoinData.slice(startIndex, lastIndex).map(elem =>

                <div className="individualCoinContainer" key={elem.id}>

                    <div className="imgSymbolCointainer">
                        <img src={getImg(elem.symbol)} height="32" />
                        <div>
                            <div>{elem.name}</div>
                            <div className="symbol">{elem.symbol}</div>
                        </div>
                    </div>

                    <div>${elem.priceUsd.toFixed(2)}</div>

                    <div
                        style={{ "color": elem.changePercent24Hr < 0 ? "#FF3131" : "#66FF00" }}>
                        {elem.changePercent24Hr.toFixed(2)}%
                    </div>
                    <div className="marketCap">${parseMoneyValue(elem.marketCapUsd)}</div>
                    <div className="volume">${parseMoneyValue(elem.volumeUsd24Hr)}</div>
                    <div className="supply">${parseMoneyValue(elem.supply)}</div>

                    <BsTrash
                        data-name={elem.id}
                        onClick={handleRemoveFromWallet}
                        className="deleteCoinFromWalletBtn"
                        style={{ "color": "#FF3131", "fontSize": "1.5rem" }} />

                </div>
            )}
            <Pagination
                startIndex={startIndex}
                lastIndex={lastIndex}
                length={allCoinData.length}
                updateIndex={updateIndex}
                itemsPerPage={10}
            />
        </div>
    )
}

export default Wallet