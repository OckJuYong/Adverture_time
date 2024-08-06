import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './component/Home/home';
import Persona from './component/persona/personaChat'; 
import CrePage1 from './component/cretravel/createpage1';
import Credatepage from './component/credate/credatepage';
import Creproducepage from './component/creproduce/creproducepage';
import Proposepage from './component/propose/proposepage';
import Logininputpage from './component/logininput/loginhome';
import Mkidpage from './component/mkid/mkidpage';
import Login from './component/login/login';
import Logincom from './component/logincom/logincom';

import Dashboard from './component/login/dashboard';

import LoginUpdate from './component/logininput/personaUpdate';
import TravelQuestions from './component/logininput/personaQpage';
import InfoResult from './component/logininput/result';

import Gps from './component/GPS/Gps';
import GpsSub from './component/GPS/GpsSub';

import Dairy from './component/Diary/Diary';
import DiaryInput from './component/Diary/DiaryInput';

import Potouploadpage from './component/potoupload/potoupload';
import Potocom from './component/potocom/potocom';

import UploadWait from './component/potoupload/uploadWait';

import Insight from './component/insight/insight';
import InsightWrite from './component/insight/insightWrite';

import CreateDiary from './component/insight/createDiary';

import Test from './component/test/test';

import Managemate from './component/manage_mate/managemate';
import Firstmatepate from './component/first_mate/firtsmate';
import Nextmate from './component/next_mate/mextmate';
import Mateprop1 from './component/mate_prop1/mateprop1';
import CreateChatRoom from './component/test/chatamke';
import FriendManagement from './component/test/friendtest';
import ChatRoomTest from './component/test/checklist';

import ChatRoomPage  from './component/manage_mate/ChatRoomPage';

import Createguide from './component/create_guide/createguide';
import Manageguide from './component/myguide/myguide';


function App() {
  return (
    <BrowserRouter>
      <div className="App" >
        <div className="content">
          <Routes>
            <Route path="/" element={<Logininputpage />} /> //시작 페이지
            <Route path="/loginpage" element={<Login />} />  //로그인 페이지
            <Route path="/mkidpage" element={<Mkidpage />} />   //회원가입
            <Route path="/logincom" element={<Logincom />} />  //로그인 성공 페이지
            <Route path="/potouploadpage" element={<Potouploadpage/>} />  //이미지 업로드 페이지
            //이미지 업로드 페이지 들가야함
            <Route path="/potocompage" element={<Potocom/>} />  //완성페이지
            <Route path="/InfoResult" element={<InfoResult />} />  //페르소나 소개 페이지
            <Route path="/home" element={<Home />} />
            <Route path="/persona" element={<Persona />} />

            <Route path="/createpage1" element={<CrePage1 />} /> 
            <Route path="/credatepage" element={<Credatepage />} /> 
            <Route path="/creproducepage" element={<Creproducepage />} /> 
            <Route path="/proposepage" element={<Proposepage />} /> 
            <Route path="/loginUpdate" element={<LoginUpdate />} /> 
            <Route path="/TravelQuestions" element={<TravelQuestions />} /> 

            <Route path="/Gps" element={<Gps />} /> 
            <Route path="/GpsSub" element={<GpsSub />} /> 
            <Route path="/Diary" element={<Dairy />} /> 
            <Route path="/DiaryInput" element={<DiaryInput />} /> 
            <Route path="/dashboard" element={<Dashboard/>} />


            <Route path="/UploadWait" element={<UploadWait/>} />

            <Route path="/Insight" element={<Insight/>} />
            <Route path="/insightWrite" element={<InsightWrite/>} />
            <Route path="/CreateDiary" element={<CreateDiary/>} />
            
            <Route path="/Test" element={<Test/>} />
             <Route path="/Managematepage" element={<Managemate/>} />
         <Route path="/frmatepage" element={<Firstmatepate/>} />
        <Route path="/nextpage" element={<Nextmate></Nextmate>} />
        <Route path="/mateporp1" element={< Mateprop1></ Mateprop1>} />
        <Route path="/chatmake" element={<CreateChatRoom />} />
        <Route path="/friendtestpage" element={ <FriendManagement/>} />
        <Route path="/cheklist" element={<ChatRoomTest/>} />

        <Route path="/chat-room/:roomId" element={<ChatRoomPage />} />

        <Route path="/myguide" element={< Manageguide />} />
        <Route path="/createguide" element={<Createguide />} />

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}



export default App;
