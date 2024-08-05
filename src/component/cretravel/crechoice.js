import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from "react-router-dom";
import Crechoicestyle from "./crechoice.module.css";
import Creprodmainstyle from "./creprodmain.module.css";
import Crefooterstyle from './crefooter.module.css';

function Crechoice() {
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const fetchRecommendedPlaces = async () => {
        try {
            const travelUserId = localStorage.getItem('memberId');
            const response = await axios.post(
                'https://seominjae.duckdns.org/recommend/places/',
                { travel_user_id: travelUserId },
                {
                    withCredentials: false,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            setRecommendedPlaces(response.data);
        } catch (error) {
            console.error('Error fetching recommended places:', error);
        }
    };

    useEffect(() => {
        fetchRecommendedPlaces();
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: () => handleSwipe('left'),
        onSwipedRight: () => handleSwipe('right'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const handleSwipe = (direction) => {
        if (direction === 'left') {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % recommendedPlaces.length);
        } else {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + recommendedPlaces.length) % recommendedPlaces.length);
        }
    };

    const handleDatePageClick = () => {
        if (recommendedPlaces.length > 0) {
            const selectedPlace = recommendedPlaces[currentIndex];
            navigate("/credatepage", { state: { selectedPlace: selectedPlace.place } });
        } else {
            alert("여행지를 선택해주세요.");
        }
    };

    return (
        <div className={Crechoicestyle.choicebox}>
            <div className={Crechoicestyle.Crebackbutton}></div>
            <p className={Crechoicestyle.choicetext1}>OO님과 함께 가고 싶은</p>
            <p className={Crechoicestyle.choicetext2}>여행지를 선택해봐요!!</p>

            <p className={Crechoicestyle.choicprtext}>알고리즘 추천 여행지</p>

            <div {...handlers} className={Creprodmainstyle.rcslider}>
                <div
                    className={Creprodmainstyle.rcslidercontainer1}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {recommendedPlaces.map((place, idx) => (
                        <div key={idx} className={Creprodmainstyle.rcslideritem1}>
                            <h3 className={Creprodmainstyle.placeName}>{place.place}</h3>
                        </div>
                    ))}
                </div>
            </div>
            <div className={Crefooterstyle.crefootercontainer}>
                <div className={Crefooterstyle.creleftbutton}>
                    <div className={Crefooterstyle.crebuttontext1}>이전</div>
                    <div className={Crefooterstyle.cresold1}></div>
                </div>
                <div className={Crefooterstyle.crerightbutton}>
                    <div className={Crefooterstyle.crebuttontext2} onClick={handleDatePageClick}>다음</div>
                    <div className={Crefooterstyle.cresold2}></div>
                </div>
            </div>
        </div>
    );
}

export default Crechoice;