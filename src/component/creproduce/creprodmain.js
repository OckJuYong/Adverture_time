import React, { useState, useEffect } from "react";
import axios from 'axios';
import Creprodmainstyle from "./creprodmain.module.css";
import { useSwipeable } from "react-swipeable";
import { useLocation } from 'react-router-dom';

function Creprodmain() {
  const [index, setIndex] = useState(0);
  const [sortedRoutes, setSortedRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
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
        
        const optimizedRoutes = response.data.map(optimizeRoute);
        console.log(optimizedRoutes);
        setSortedRoutes(optimizedRoutes);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching routes:', error);
        setIsLoading(false);
      }
    };

    fetchRoutes();
  }, [travelInfo]);

  // 두 지점 간의 거리 계산 (Haversine 공식 사용)
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

  // 최적의 경로 계산 (Nearest Neighbor 알고리즘)
  const optimizeRoute = (route) => {
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
    startTime.setHours(9, 0, 0, 0); // 시작 시간을 오전 9시로 설정

    const totalDuration = route.length * 90; // 각 경로당 90분(1시간 30분)
    const endTime = new Date(startTime.getTime() + totalDuration * 60000);

    return {
      totalHours: Math.floor(totalDuration / 60),
      totalMinutes: totalDuration % 60,
      startTimeString: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTimeString: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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
            const { totalHours, totalMinutes, startTimeString, endTimeString } = calculateTimes(route);
            return (
              <div key={routeIndex} className={Creprodmainstyle.rcslideritem1}>
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
                      <p key={placeIndex} className={Creprodmainstyle[`cous${placeIndex + 1}`]}>
                        {place.location}
                      </p>
                    ))}
                  </div>
                  {route.map((_, placeIndex) => (
                    <div key={placeIndex} className={Creprodmainstyle[`a${placeIndex}box`]}>
                      <p className={Creprodmainstyle.circle}></p>
                      {placeIndex < route.length - 1 && (
                        <>
                          <p className={Creprodmainstyle.aline1}></p>
                          <p className={Creprodmainstyle.aline2}></p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default Creprodmain;