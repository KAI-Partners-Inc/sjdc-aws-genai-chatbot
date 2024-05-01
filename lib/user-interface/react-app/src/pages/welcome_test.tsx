import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import '../styles/welcome.scss';
import defaultLogo from '../assets/images/defaultLogo.png'
import bannerImg from "../assets/images/ccc_background.png";
import contentImg1 from "../assets/images/content_img1.jpg";
import contentImg2 from "../assets/images/content_img2.webp";
import contentImg3 from "../assets/images/content_img3.webp";

function setTextColor(bgcolor: string) {
  const darkcolors = ['navy', 'blue', 'green', 'red', 'orange', 'purple']
  if (darkcolors.includes(bgcolor)){
    return 'white'
  }
  return 'black'
}
interface headerInterface {
  imgurl: string,
  imgAlt: string,
  collegeName: string
}
interface contentInterface {
  collegeName: string,
  district: string
}

interface footerInterface {
  collegeName: string
}
interface bannerInterface {
  collegeName: string
}
function Header({imgurl, imgAlt, collegeName}: headerInterface) {
  return (
    <header className="header">
      <img src={imgurl} alt={imgAlt}/>
      <h1>{collegeName}</h1>
    </header>
  );
}

function Banner({collegeName}: bannerInterface) {
  return (
    <div className="banner" aria-hidden="true" >
      <img className="bannerImg" src={bannerImg}></img>
      <h1 className="bannerImageText"> Welcome to {collegeName}</h1>
    </div>
  );
}

function Content({collegeName, district}: contentInterface) {
  return (
    <main className="content" >
      <h2 className="contentIntro">Welcome to {collegeName}, where opportunities for academic growth and personal development are within reach for every student. Located in the {district} district, our college serves as a vibrant hub for diverse learners seeking quality education and pathways to success.</h2>
      <div className="contentContainer">
        <div className="text-column">
          <h2 className="contentHeads">About us</h2>
          <p className="contentP">At {collegeName}, we believe in accessible, affordable, and high-quality education. Whether you're a recent high school graduate, a working professional looking to advance your career, or someone returning to academia after a hiatus, we offer a supportive environment where you can thrive.</p>
          <h2 className="contentHeads">Values</h2>
          <p  className="contentP">Our dedicated faculty members are committed to fostering a culture of learning excellence. With small class sizes and personalized attention, students have the opportunity to engage deeply with course material and receive individualized support when needed.</p>
          <h2 className="contentHeads">What we have to offer</h2>
          <p  className="contentP">We take pride in our comprehensive range of academic programs, designed to meet the evolving needs of our community and the workforce. From transfer programs that seamlessly transition to four-year institutions to career and technical education pathways that lead directly to the workforce, we offer diverse options to suit your goals and interests.</p>
          <h2 className="contentHeads">Resources</h2>
          <p  className="contentP">Beyond the classroom, {collegeName} provides a rich array of extracurricular activities, clubs, and organizations to enhance your college experience. Whether you're interested in student government, cultural clubs, or academic societies, you'll find ample opportunities to connect with peers, develop leadership skills, and make lasting friendships.</p>
          <h2 className="contentHeads">Community</h2>
          <p  className="contentP">As an institution deeply rooted in our community, we are proud to offer resources and support services that empower students to succeed. From tutoring and academic advising to career counseling and wellness programs, we are here to help you navigate your educational journey and achieve your aspirations.</p>

          <p className="contentP">Discover your potential and embark on a transformative educational experience at {collegeName}. Explore our website to learn more about our programs, services, and how you can become part of our vibrant learning community. We look forward to welcoming you to our campus and helping you reach your academic and professional goals.</p>
        </div>
        <div className="img-column">
          <img src= {contentImg1}></img>
          <img src= {contentImg2}></img>
          <img src= {contentImg3}></img>
        </div>
      </div>
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
        iframe.setAttribute('src', 'https://d17p4fgzczcwdj.cloudfront.net/embedded');
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
      <Header imgurl={logoUrl} imgAlt={imgAlt} collegeName={collegeName}/>
      <Banner collegeName={collegeName}/>
      <Content district={district} collegeName={collegeName}/>
      <Footer collegeName={collegeName}/>
    </div>
  );
};

export default WelcomePage;
