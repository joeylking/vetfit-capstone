import { fetchAllCoins } from "../../State/coins/allCoins"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { addCoinToWallet } from "../../State/wallet/savedCoins"
import { fetchAllSavedCoinsByUser } from "../../State/wallet/savedCoins"
import { fetchUserProfile } from "../../State/profile/userProfile"
import { FcSearch } from "react-icons/fc"
import { RiSearchLine } from 'react-icons/ri'
import { AiFillStar, AiOutlineStar } from "react-icons/ai"
import Pagination from "../templates/Pagination"
import { parseMoneyValue, getImg } from "./helperMethods"
import { setLoading } from "../../State/loading"
import "./home.css"

const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [query, setQuery] = useState("")
    const allCoins = useSelector(state => state.allCoins.value)
    const allSavedCoins = useSelector(state => state.savedCoins.value)
    const currentUser = useSelector(state => state.currentUser.value)
    const loggedIn = useSelector(state => state.loggedIn.value)
    const [startIndex, setStartIndex] = useState(0)
    const [lastIndex, setLastIndex] = useState(10)

    const filteredCoins = allCoins?.filter(item => {
        return item.id.toLowerCase().includes(query.toLowerCase()) || item.symbol.toLowerCase().includes(query.toLowerCase())
    })

    useEffect(() => {
        dispatch(setLoading(true))
        Promise.resolve(dispatch(fetchAllCoins()))
            .then(() => dispatch(setLoading(false)))

        if (loggedIn) {
            dispatch(fetchAllSavedCoinsByUser(currentUser.id))
        }

    }, [currentUser, loggedIn])

    const handleAddToWallet = (e) => {
        if (!loggedIn) return navigate("/login")

        let coin = {
            userId: currentUser.id,
            currencyName: e.currentTarget.dataset.name
        }
        dispatch(setLoading(true))
        Promise.resolve(dispatch(addCoinToWallet(coin)))
            .then(() => {
                dispatch(fetchUserProfile(currentUser.username))
                dispatch(setLoading(false))
            })
    }

    // if (allCoins.length < 1)
    //     return <h1>Loading...</h1>

    const foundInWallet = (id) => {
        let found = false
        allSavedCoins?.forEach(coin => {
            if (coin.currencyName == id)
                found = true
        })
        return found
    }

    const updateIndex = (num) => {
        setStartIndex(prev => prev + num)
        setLastIndex(prev => prev + num)
    }

    const handleQueryChange = (e) => {
        setQuery(e.target.value)
        setStartIndex(0)
        setLastIndex(10)
    }
    return (
        <div className="allCoinsContainer">
            <div className="filterCoinsContainer">
                <RiSearchLine className='searchIcon' style={{ fontSize: "1.5rem" }} />
                <input
                    className="filterCoinsInput"
                    // type="search"
                    value={query}
                    onChange={handleQueryChange}
                    // onChange={e => setQuery(e.target.value)}
                    placeholder="Search for a coin by name or symbol..." />
            </div>


            <div className="coinGridHeaderContainer">
                <div className="gridHeader">Currency</div>
                <div className="gridHeader">Price</div>
                <div className="gridHeader">Change</div>
                <div className="gridHeader marketCap">Market cap</div>
                <div className="gridHeader volume">Volume(24hr)</div>
                <div className="gridHeader supply">Supply</div>
                <div className="gridHeader">Watching</div>
            </div>

            {filteredCoins.slice(startIndex, lastIndex).map(elem =>
                <div className="individualCoinContainer" key={elem.id}>
                    <div className="imgSymbolCointainer">
                        <img src={getImg(elem.symbol)} height="32" />
                        <div>
                            <div>{elem.name}</div>
                            <div className="symbol">{elem.symbol}</div>
                        </div>
                    </div>

                    <div>${elem.priceUsd.toFixed(2)}</div>

                    <div style={{ "color": elem.changePercent24Hr < 0 ? "#FF3131" : "#66FF00" }}>{elem.changePercent24Hr.toFixed(2)}%</div>
                    <div className="marketCap">${parseMoneyValue(elem.marketCapUsd)}</div>
                    <div className="volume">${parseMoneyValue(elem.volumeUsd24Hr)}</div>
                    <div className="supply">${parseMoneyValue(elem.supply)}</div>

                    {(!loggedIn || !foundInWallet(elem.id)) ? <AiOutlineStar className="addToWathListIcon" data-name={elem.id} onClick={handleAddToWallet} /> : <AiFillStar className="addToWathListIcon filled" />}

                </div>
            )}

            <Pagination
                startIndex={startIndex}
                lastIndex={lastIndex}
                length={filteredCoins.length}
                updateIndex={updateIndex}
                itemsPerPage={10}
            />
        </div>
    )
}

export default Home
