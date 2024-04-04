import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import '../styles/welcome.scss';
import defaultLogo from '../assets/images/defaultLogo.png'

function setTextColor(bgcolor: string) {
  const darkcolors = ['navy', 'blue', 'green', 'red', 'orange', 'purple']
  if (darkcolors.includes(bgcolor)){
    return 'white'
  }
  return 'black'
}
interface headerInterface {
  imgurl: string,
  imgAlt: string
}
interface contentInterface {
  collegeName: string,
  district: string
}

interface footerInterface {
  collegeName: string
}
function Header({imgurl, imgAlt}: headerInterface) {
  return (
    <header className="header">
      <img src={imgurl} alt={imgAlt}/>
      <nav>
        <ul >
          <li><a href="/" >Student Login</a></li>
          <li><a href="/" >Apply</a></li>
          <li><a href="/" >Employees</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Banner() {
  return (
    <div className="banner" aria-hidden="true" ></div>
  );
}

function Content({collegeName, district}: contentInterface) {
  return (
    <main className="content" >
      <h1>{collegeName} Chatbot</h1>
      <h2 >Welcome to {collegeName}.</h2>
      <h2> District of {district} </h2>
      <p >Welcome to {collegeName}, where we seek higher education.</p>
      <p >If you have any questions, please use the chatbot accessible via the button in the lower right hand corner!</p>
      <h3>Explore Our Programs</h3>
      <ul>
        <li>Associate of Arts in Liberal Arts</li>
        <li>Associate of Science in Information Technology</li>
        <li>Certificate Programs in Business Administration</li>
        <li>Continuing Education and Professional Development</li>
      </ul>
    </main>
  );
}

function Footer({collegeName}:footerInterface) {
  return (
    <div className="footer">
      <p>© 2024 {collegeName}. All rights reserved.</p>
    </div>
  );
}


const WelcomePage = () => {
    const location = useLocation();
    const { collegeName, district, color, chatcolor, chatbotLabel } = location.state || {};
    if (!collegeName || !district){
        <Navigate to="/test"/>
    }
    const logoUrl = localStorage.getItem('uploadedImage') || defaultLogo;
    // localStorage.removeItem("uploadedImage")
    const chatTextColor = setTextColor(chatcolor)
    const headTextColor = setTextColor(color)
    useEffect(() => {
        document.title = collegeName + 'Chatbot Sandbox';
        const style = document.createElement('style');
        document.head.appendChild(style);

        const styleSheet = style.sheet;
        if (styleSheet) {
          styleSheet.insertRule(` .header {
            background: ${color};
            color: ${headTextColor}
          }`)
          styleSheet.insertRule(` #KAIChatButton {
            align-items: center;
            background: ${chatcolor};
            bottom: 0;
            color: ${chatTextColor};
            display: flex;
            font-family: "Open Sans", sans-serif;
            font-weight: 700;
            height: 36px;
            justify-content: center;
            padding: 0;
            position: fixed;
            right: 10px;
            width: 300px;
            z-index: 2147483640;
          }`);
    
          styleSheet.insertRule(` #KAIChatButton.close {
            bottom: 600px;
            right: 10px;
            top: auto;
            width: 100px;
          }`);
    
          styleSheet.insertRule(` #KAIChatButton:active { color: #9a7d17; }`);
          styleSheet.insertRule(` #KAIChatButton:hover { color: #9a7d17; }`);
        }
    
        const iframe = document.createElement('iframe');
        iframe.setAttribute('title', 'Chat Window');
        iframe.setAttribute('src', 'https://d2ins6zcpv691t.cloudfront.net/embedded');
        iframe.setAttribute('allow', 'fullscreen');
        iframe.setAttribute('name', 'chat');
        iframe.setAttribute('style', `
          background: white;
          border: none;
          border-radius: 10px;
          bottom: 0;
          display: none;
          height: 600px;
          position: fixed;
          right: 10px;
          width: 600px;
          z-index: 10000;
        `);
        document.body.appendChild(iframe);
    
        const chatButton = document.createElement('button');
        chatButton.setAttribute('id', 'KAIChatButton');
        chatButton.innerHTML = chatbotLabel;
        chatButton.addEventListener("click", () => {
          if (iframe.style.display === "none") {
            iframe.style.display = "block";
            iframe.focus();
            chatButton.classList.add('close');
            chatButton.innerHTML = "Close";
          } else {
            iframe.style.display = "none";
            chatButton.classList.remove('close');
            chatButton.innerHTML = chatbotLabel;
          }
        });
        document.body.appendChild(chatButton);
    
        const chatWidgetContainer = document.getElementById('chat-widget-container');
        if (chatWidgetContainer) {
          chatWidgetContainer.style.display = 'none';
        }
    
        // Cleanup function
        return () => {
          document.head.removeChild(style);
          document.body.removeChild(iframe);
          document.body.removeChild(chatButton);
        };
      }, []);
  const imgAlt = `${collegeName} Logo`
  return (
    <div className="welcome-container" >
      <Header imgurl={logoUrl} imgAlt={imgAlt}/>
      <Banner />
      <Content district={district} collegeName={collegeName}/>
      <Footer collegeName={collegeName}/>
    </div>
  );
};

export default WelcomePage;
