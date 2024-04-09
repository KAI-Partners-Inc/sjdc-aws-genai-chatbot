import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/testpage.scss';
import kaipLogo from '../assets/images/kaip_logo.png';
  
function TestPage() {  
    const [collegeName, setCollegeName] = useState('');
    const [district, setDistrict] = useState('');
    const [chatbotLabel, setChatbotLabel] = useState('');
    const [language, setLanguage] = useState('english');
    const [color, setColor] = useState('');
    const [chatcolor, setChatColor] = useState('');
    const [collegeLogo, setFile] = useState<File | null>(null);
    const history = useNavigate();
    useEffect(() => {
      document.title = 'KAI Partners Chatbot Tool';
    })
    const handleColorChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setColor(event.target.value);
    };
    const handleChatColorChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setChatColor(event.target.value);
    };
    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setFile(file);
      }
    };
    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Do something with the form data, such as submitting it to a server
        if (collegeName.length < 4 || district.length < 2) {
            alert('College Name and District must have at least 4 characters.');
            return;
        }
        localStorage.setItem('collegeName', collegeName);
        console.log(localStorage.getItem('collegeName'))
        if (collegeLogo) {
          const reader = new FileReader();
          reader.onload = () => {
            var imageData = reader.result;
            if(imageData== null){
              imageData= ""
            }
            localStorage.setItem('uploadedImage', imageData.toString()); // Store image data in local storage
            
            history('/welcome-test',
              {state: { collegeName, district, language, color, chatcolor, chatbotLabel }});
          };
          reader.readAsDataURL(collegeLogo);
        }
        else{
          history('/welcome-test',
              {state: { collegeName, district, language, color, chatcolor, chatbotLabel }});
        }
    };
      
   return (
    <div className="page-container">
      <div className="left-section">
        <div className="form-header">
          <h1 className="left-h1"> <img className="kaip-logo" src={kaipLogo}></img>KAI Partners Chatbot</h1>
          <p className="left-description">To view an example, please fill in the following details:</p>
        </div>
      </div>
      <div className="right-section">
        <div className="form-container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="collegeName">College Name:</label>
              <input
                type="text"
                id="collegeName"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">District:</label>
              <input
                type="text"
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="district">Chatbot Button Label:</label>
              <input
                type="text"
                id="chatbotLabel"
                value={chatbotLabel}
                onChange={(e) => setChatbotLabel(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="language">Language:</label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor="collegeLogo">Upload your college logo:</label>
              <input type="file" onChange={handleLogoChange} accept='image/*' />
            </div>
            <div className="form-group">
              <label htmlFor="color">Select Header Color:</label>
              <select
                id="color"
                value={color}
                onChange={handleColorChange}
                required
              >
                <option value="">Select Color</option>
                <option value="navy">Navy Blue</option>
                <option value="gray">Gray</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="chatcolor">Select Chatbot Button Color:</label>
              <select
                id="chatcolor"
                value={chatcolor}
                onChange={handleChatColorChange}
                required
              >
                <option value="">Select Color</option>
                <option value="navy">Navy Blue</option>
                <option value="gray">Gray</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
              </select>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default TestPage;