import React, { useState } from "react";
import Loginstyle from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(validateEmail(newEmail));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isValidEmail || !password) {
      alert("유효한 이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // 로그인 요청
      const loginResponse = await axios.post('https://port-0-travelproject-9zxht12blqj9n2fu.sel4.cloudtype.app/login', {
        email: email,
        password: password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("로그인 응답:", loginResponse.data);

      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem('jwtToken', loginResponse.data.jwtToken);
      localStorage.setItem('jwtRefreshToken', loginResponse.data.jwtRefreshToken);

      // 토큰 전송 요청
      const response=await axios.post( 'https://port-0-travelproject-umnqdut2blqqevwyb.sel4.cloudtype.app/users/', {
        jwtToken: loginResponse.data.jwtToken,
        jwtRefreshToken: loginResponse.data.jwtRefreshToken
      })
      console.log("로그인 성공",response.data.travel_user_id)

      // const response1 = await axios.post('http://43.202.121.14:8000/getlist/friends/7/')
      alert("로그인 성공!");

      // 로그인 성공 후 이동할 페이지로 네비게이트
      navigate('/logincom');
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className={Loginstyle.container}>
      <h1 className={Loginstyle.title}>로그인</h1>
      <form onSubmit={handleLogin}>
        <div className={Loginstyle.inputGroup}>
          <label className={Loginstyle.label}>이메일 주소</label>
          <div className={Loginstyle.inputWrapper}>
            <input
              type="email"
              placeholder="email@gmail.com"
              className={Loginstyle.input}
              value={email}
              onChange={handleEmailChange}
              required
            />
            <div className={Loginstyle.checkmark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill={isValidEmail ? "#6285E1" : "#CCCCCC"} />
                <path d="M7 13L10 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className={Loginstyle.inputGroup}>
          <label className={Loginstyle.label}>비밀번호</label>
          <div className={Loginstyle.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={Loginstyle.input}
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              className={Loginstyle.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {/* SVG 코드는 그대로 유지 */}
            </button>
          </div>
        </div>

        <a href="#" className={Loginstyle.forgotPassword}>비밀번호를 잊어버렸나요?</a>

        <button type="submit" className={Loginstyle.loginButton}>로그인</button>
      </form>

      <p className={Loginstyle.signupLink}>
        아직 계정이 없으신가요? <Link to="/mkidpage">계정생성</Link>
      </p>
    </div>
  );
}

export default Login;