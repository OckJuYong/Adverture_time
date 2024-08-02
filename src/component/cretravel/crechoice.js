import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';
import Crechoicestyle from "./crechoice.module.css";
import Creprodmainstyle from "./creprodmain.module.css";

function Crechoice() {
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [index1, setIndex1] = useState(0);

    const fetchRecommendedPlaces = async () => {
        try {
            const travelUserId = localStorage.getItem('memberId');
            const response = await axios.post(
                'http://43.202.121.14:8000/recommend/places/',
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

    const handleSwipedLeft1 = () => {
        setIndex1((prevIndex) => (prevIndex + 1) % recommendedPlaces.length);
    };

    const handleSwipedRight1 = () => {
        setIndex1((prevIndex) => (prevIndex - 1 + recommendedPlaces.length) % recommendedPlaces.length);
    };

    const handlers1 = useSwipeable({
        onSwipedLeft: handleSwipedLeft1,
        onSwipedRight: handleSwipedRight1,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div className={Crechoicestyle.choicebox}>
            <div className={Crechoicestyle.Crebackbutton}></div>
            <p className={Crechoicestyle.choicetext1}>OO님과 함께 가고 싶은</p>
            <p className={Crechoicestyle.choicetext2}>여행지를 선택해봐요!!</p>

            <p className={Crechoicestyle.choicprtext}>알고리즘 추천 여행지</p>

            <div {...handlers1} className={Creprodmainstyle.rcslider}>
                <div
                    className={Creprodmainstyle.rcslidercontainer1}
                    style={{ transform: `translateX(-${index1 * 105}%)` }}
                >
                    {recommendedPlaces.map((place, idx) => (
                        <div key={idx} className={Creprodmainstyle.rcslideritem1}>
                            <h3 className={Creprodmainstyle.placeName}>{place.place}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Crechoice;
