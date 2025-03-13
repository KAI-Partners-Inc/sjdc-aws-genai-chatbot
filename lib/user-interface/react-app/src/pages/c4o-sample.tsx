import { useEffect } from 'react';
import '../styles/welcome.scss';

const C4OPage = () => {
    useEffect(() => {
      const handleBeforeUnload = () => {
        localStorage.removeItem('collegeName');
      };
  
      // Add event listener when the component mounts
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      // Cleanup function to remove the event listener when the component unmounts
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, []);
    useEffect(() => {
        document.title = 'C4O Chatbot Sandbox';
        const style = document.createElement('style');
        document.head.appendChild(style);
        const chatTextColor = 'white';
        const color = 'navy';
        const headTextColor = 'white';
        const chatcolor = 'navy';
        const chatbotLabel = 'Ask Sage!'
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
        iframe.setAttribute('src', 'https://sage-ai.kaipartners.com/embedded');
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
  return (
    <div className="welcome-container" >
      <iframe
        src="https://www.caladulted.org"
        title="California Adult Education"
        width="100%"
        height="100%"
        style={{ border: "none", position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default C4OPage;
