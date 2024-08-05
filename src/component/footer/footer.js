import React, { useState, useEffect } from 'react';
import icon1 from './P_F.png';
import icon2 from './I_F.png';
import icon3 from './M_F.png';
import icon1Active from './P_T.png';
import icon2Active from './I_T.png';
import icon3Active from './M_T.png';

import footerStyles from './footer.module.css'
import { useNavigate, useLocation } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(null);

  useEffect(() => {
    // 현재 경로에 따라 activeIcon 설정
    if (location.pathname === '/home') {
      setActiveIcon(1);
    } else if (location.pathname === '/frmatepage' || location.pathname === '/Managematepage') {
      setActiveIcon(3);
    } else if (location.pathname === '/insight') {  // 두 번째 아이콘의 경로 추가
      setActiveIcon(2);
    } else {
      setActiveIcon(null);  // 다른 경로의 경우 아무 아이콘도 활성화하지 않음
    }
  }, [location.pathname]);  // location 객체 전체가 아닌 pathname만 의존성으로 설정

  const handleIconClick = (iconNumber, path) => {
    if (location.pathname !== path) {  // 현재 경로와 다를 때만 네비게이션 실행
      navigate(path);
    }
    setActiveIcon(iconNumber);
  }

  return (
    <div className={footerStyles.main_container}>
      <img 
        src={activeIcon === 1 ? icon1Active : icon1} 
        alt="Icon 1" 
        className={footerStyles.icon} 
        onClick={() => handleIconClick(1, "/home")}
      />
      <img 
        src={activeIcon === 2 ? icon2Active : icon2} 
        alt="Icon 2" 
        className={footerStyles.icon} 
        onClick={() => handleIconClick(2, "/insight")}  // 두 번째 아이콘의 경로 수정
      />
      <img 
        src={activeIcon === 3 ? icon3Active : icon3} 
        alt="Icon 3" 
        className={footerStyles.icon} 
        onClick={() => handleIconClick(3, "/frmatepage")}
      />
    </div>
  );
}

export default Footer;