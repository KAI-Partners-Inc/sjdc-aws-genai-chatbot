import { useContext } from "react";
import {
  BrowserRouter,
  HashRouter,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { AppContext } from "./common/app-context";
import GlobalHeader from "./components/global-header";
import Models from "./pages/chatbot/models/models";
import MultiChatPlayground from "./pages/chatbot/playground/multi-chat-playground";
import Playground from "./pages/chatbot/playground/playground";
import NotFound from "./pages/not-found";
import "./styles/app.scss";
import Embedded from "./pages/chatbot/embedded/embedded.tsx";
import GlobalFooter from "./components/global-footer.tsx";
import TestPage from "./pages/test-page.tsx";
import WelcomeTest from "./pages/welcome_test.tsx";


const subHeaderWrapperStyles = {
  fontSize: '1.6rem',
  lineHeight: '1.95em',
  color: '#666666',
  backgroundColor: '#FFFFFF',
  display: 'block'
}
const Layout = () => (
  <div id="layout" style={{ backgroundColor: "#f9c623" }}>
    <GlobalHeader />
    <div id="header-spacer" style={{ height: 56, backgroundColor: "#000716" }} />
    <div>
      <div id="subheader-wrapper" style={subHeaderWrapperStyles}>
        <div className="subHeader">
          <a href="https://www.deltacollege.edu/">
            <img alt="San Joaquin Delta College Logo - Home" className="desktop" src="https://www.deltacollege.edu/sites/default/files/images/delta-logo.jpg" style={{ height: 98, maxHeight: '100%'}} />
            <img alt="San Joaquin Delta College Logo - Home" className="mobile" src="https://www.deltacollege.edu/sites/default/files/images/header-mobile-logo.jpg" style={{ height: 70, maxHeight: '100%'}} />
          </a>
        </div>
      </div>
      <Outlet />
      <GlobalFooter />
    </div>
  </div>
)

function App() {
  const appContext = useContext(AppContext);
  const Router = appContext?.config.privateWebsite ? HashRouter : BrowserRouter;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Router>
          <Routes>
            <Route path = "/test" element={<TestPage/>} />
            <Route path = "/welcome-test" element={<WelcomeTest />} />
            <Route path="/embedded" element={<Embedded />} /> 
            <Route path="/" element={<Layout />}>
              <Route index element={<Playground />} />
              <Route path="/chatbot" element={<Outlet />}>
                <Route path="playground" element={<Playground />} />
                <Route path="playground/:sessionId" element={<Playground />} />
                <Route path="multichat" element={<MultiChatPlayground />} />
                <Route path="models" element={<Models />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
      </Router>
    </div>
  );
}

export default App;
