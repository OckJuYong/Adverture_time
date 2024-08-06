import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from 'react-router-dom';
import Creprodmainstyle from "./creprodmain.module.css";
import Creprodfooterstyle from "./creprodfooter.module.css";

function Creprodmain() {
  const [index, setIndex] = useState(0);
  const [sortedRoutes, setSortedRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const travelInfo = location.state;

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const memberId = localStorage.getItem('memberId');
        const response = await axios.post('https://seominjae.duckdns.org/recommend/route/', {
          travel_user_id: memberId,
          start_date: travelInfo.start_date,
          end_date: travelInfo.end_date,
          place: travelInfo.place
        });
        
        if (response.data && Array.isArray(response.data)) {
          const optimizedRoutes = response.data.map(optimizeRoute);
          console.log(optimizedRoutes);
          setSortedRoutes(optimizedRoutes);
        } else {
          console.error('Invalid data format:', response.data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching routes:', error);
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [travelInfo]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const optimizeRoute = (route) => {
    if (!route || route.length === 0) return [];
    const optimizedRoute = [route[0]];
    const unvisited = route.slice(1);

    while (unvisited.length > 0) {
      const current = optimizedRoute[optimizedRoute.length - 1];
      let nearestIndex = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const distance = calculateDistance(
          current.latitude, current.longitude,
          unvisited[i].latitude, unvisited[i].longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          nearestIndex = i;
        }
      }

      optimizedRoute.push(unvisited[nearestIndex]);
      unvisited.splice(nearestIndex, 1);
    }

    return optimizedRoute;
  };

  const handleSwiped = (direction) => {
    if (direction === 'LEFT') {
      setIndex((prevIndex) => (prevIndex + 1) % sortedRoutes.length);
    } else if (direction === 'RIGHT') {
      setIndex((prevIndex) => (prevIndex - 1 + sortedRoutes.length) % sortedRoutes.length);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwiped('LEFT'),
    onSwipedRight: () => handleSwiped('RIGHT'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const calculateTimes = (route) => {
    const startTime = new Date();
    startTime.setHours(9, 0, 0, 0);

    const totalDuration = route.length * 90;
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    return {
      totalHours: Math.floor(totalDuration / 60),
      totalMinutes: totalDuration % 60,
      startTimeString: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTimeString: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const handlebackclick = () => {
    navigate("/credatepage");
  };

  const handleRouteClick = (route) => {
    setSelectedRouteDetails(route);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRouteDetails(null);
  };

  const handlereturnclick = async () => {
    try {
        const startDate = new Date(travelInfo.start_date).toISOString();
        const endDate = new Date(travelInfo.end_date).toISOString();

        const selectedRoute = sortedRoutes[index];

        const firstPlace = selectedRoute[0];

        const travelRoute = selectedRoute.map(place => ({
            vertex: place.location,
            latitude: place.latitude,
            longitude: place.longitude
        }));

        console.log(travelRoute, startDate, endDate);

        const response = await axios.post(
            'https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/travel/addition',
            {
                travelStartDate: startDate,
                travelEndDate: endDate,
                location: travelInfo.place,
                latitude: firstPlace.latitude,
                longitude: firstPlace.longitude,
                travelRoute: travelRoute
            },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.status === 200) {
            navigate("/mateporp1", { state: response.data });
        } else {
            console.error('Match failed');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={Creprodmainstyle.pordmainbox}>
      <p className={Creprodmainstyle.credatemaintext1}>추천 여행 코스를 선택해</p>
      <p className={Creprodmainstyle.credatemaintext2}>OO님께 제안하세요!</p>
      <p className={Creprodmainstyle.choicprtext}>페르소나 맞춤형 추천 코스</p>

      <div {...handlers} className={Creprodmainstyle.rcslider}>
        <div
          className={Creprodmainstyle.rcslidercontainer1}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {sortedRoutes.map((route, routeIndex) => {
            if (!route || route.length === 0) {
              return <div key={routeIndex} className={Creprodmainstyle.rcslideritem1}>No Data Available</div>;
            }

            const { totalHours, totalMinutes, startTimeString, endTimeString } = calculateTimes(route);
            return (
              <div key={routeIndex} className={Creprodmainstyle.rcslideritem1} onClick={() => handleRouteClick(route)}>
                <p className={Creprodmainstyle.traveltext}>{travelInfo.place} 여행</p>
                <p className={Creprodmainstyle.traveldatetext}>
                  {new Date(travelInfo.start_date).getMonth() + 1}월 중
                </p>
                <p className={Creprodmainstyle.traveltimetext}>
                  {totalHours}시간 {totalMinutes}분 소요
                </p>
                <div className={Creprodmainstyle.userinfobox}>
                  <div className={Creprodmainstyle.usercousbox}>
                    {route.map((place, placeIndex) => (
                      <div key={placeIndex} style={{ display: 'flex', alignItems: 'center' }} className={Creprodmainstyle.container}>
                        <span className={Creprodmainstyle.circle}></span>
                        <p className={Creprodmainstyle[`cous${placeIndex + 1}`]}>
                          {place.location}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for detailed route information */}
      {showModal && selectedRouteDetails && (
        <div className={Creprodmainstyle.modalOverlay}>
          <div className={Creprodmainstyle.modal}>
            <div className={Creprodmainstyle.modalHeader}>
              <h2>경로 세부 정보</h2>
              <button className={Creprodmainstyle.closeButton} onClick={closeModal}>닫기</button>
            </div>
            <div className={Creprodmainstyle.modalContent}>
              <ul>
                {selectedRouteDetails.map((place, index) => (
                  <li key={index}>
                    <strong>{place.location}</strong>
                    <p>{place.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className={Creprodfooterstyle.prodfooterbox}>
        <div className={Creprodfooterstyle.datecreleftbutton}>
          <div className={Creprodfooterstyle.datecrebuttontext1} onClick={handlebackclick}>이전</div>
          <div className={Creprodfooterstyle.datecresold1}></div>
        </div>
        <div className={Creprodfooterstyle.datecrerightbutton}>
          <div className={Creprodfooterstyle.datecrebuttontext2} onClick={handlereturnclick}>매이트 매칭</div>
        </div>
      </div>
    </div>
  );
}

export default Creprodmain;
