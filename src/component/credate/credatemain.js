import React, { useState } from "react";
import Calendar from "react-calendar";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import styles from "./credatemain.module.css"; 
import Credatefooterstyles from './credatefooter.module.css';
import { useLocation } from 'react-router-dom';

function Credatemain() {
    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [viewMode, setViewMode] = useState('month');
    const location = useLocation();
    const navigate = useNavigate();
    const selectedPlace = location.state?.selectedPlace;

    console.log(selectedPlace);

    const handlebackclick = () => {
        navigate("/createpage1");
    }

    const handlereturnclick = () => {
        if (dateRange[0] && dateRange[1] && selectedPlace) {
            const travelInfo = {
                start_date: formatDateForAPI(dateRange[0]),
                end_date: formatDateForAPI(dateRange[1]),
                place: selectedPlace
            };
            navigate("/creproducepage", { state: travelInfo });
        } else {
            alert("날짜와 여행지를 모두 선택해주세요.");
        }
    }

    const handleToggle = () => {
        setViewMode(prevViewMode => (prevViewMode === 'month' ? 'year' : 'month'));
    };

    const handleDateChange = (value) => {
        if (Array.isArray(value) && value.length === 2) {
            const [start, end] = value;
            if (isValidDate(start) && isValidDate(end)) {
                setDateRange([start, end]);
            }
        } else if (isValidDate(value)) {
            setDateRange([value, value]);
        }

        if (viewMode === 'year') {
            setViewMode('month');
        }
    };

    const isValidDate = (date) => {
        return date instanceof Date && !isNaN(date);
    };

    const formatDate = (date) => {
        if (!isValidDate(date)) return '날짜 선택';
        return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDateForAPI = (date) => {
        if (!isValidDate(date)) return '';
        return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
    };

    return (
        <div className={styles.credatemaincontainer}>
            <p className={styles.credatemaintext1}>원하는 여행 날짜를</p>
            <p className={styles.credatemaintext2}>선택해 주세요.</p>
            <div className={styles.datetogglebutton} onClick={handleToggle}>
                <div className={styles.datetoggletextleft}>날짜 지정</div>
                <div className={styles.datetoggletextright}>월단위</div>
                <div className={`${styles.datetogglecircle} ${viewMode === 'year' ? styles.on : styles.off}`}></div>
            </div>
            <div className={styles.datebox}>
                <Calendar
                    onChange={handleDateChange}
                    value={dateRange}
                    selectRange={true}
                    view={viewMode}
                    onViewChange={({view}) => setViewMode(view)}
                    className={styles.reactCalendar}
                    minDate={new Date()}
                    next2Label={null}
                    prev2Label={null}
                    navigationLabel={({ date }) => 
                        `${date.getFullYear()}년 ${date.getMonth() + 1}월`
                    }
                />
            </div>
            <div className={Credatefooterstyles.datecreleftbutton}>
                <div className={Credatefooterstyles.datecrebuttontext1} onClick={handlebackclick}>이전</div>
                <div className={Credatefooterstyles.datecresold1}></div>
            </div>
            <div className={Credatefooterstyles.datecrerightbutton}>
                <div className={Credatefooterstyles.datecrebuttontext2} onClick={handlereturnclick}>다음</div>
                <div className={Credatefooterstyles.datecresold2}></div>
            </div>
        </div>
    );
}

export default Credatemain;