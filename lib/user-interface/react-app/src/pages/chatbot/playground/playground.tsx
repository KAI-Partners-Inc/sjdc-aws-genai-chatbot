import BaseAppLayout from "../../../components/base-app-layout";
import Chat from "../../../components/chatbot/chat";
import BaseAppLayoutv from "../../../components/v2-base-app-layout";
import { Link, useLocation, useParams } from "react-router-dom";
import { Header, HelpPanel } from "@cloudscape-design/components";

export default function Playground() {
  const { sessionId } = useParams();
  const location = useLocation();
  const pathname = location.pathname;
  const versionPath = pathname.split('/')
  if (versionPath[1] == 'v2'){
    return (
      <BaseAppLayoutv
        info={
          <HelpPanel header={<Header variant="h3">Using the chat</Header>}>
            <p>
              This chat playground allows user to interact with a chosen LLM and
              optional RAG retriever. You can create new RAG workspaces via the{" "}
              <Link to="/v2/rag/workspaces">Workspaces</Link> console.
            </p>
            <h3>Settings</h3>
            <p>
              You can configure additional settings for the LLM via the setting
              action at the bottom-right. You can change the Temperature and Top P
              values to be used for the answer generation. You can also enable and
              disable streaming mode for those models that support it (the setting
              is ignored if the model does not support streaming). Turning on
              Metadata displays additional information about the answer, such as
              the prompts being used to interact with the LLM and the document
              passages that might have been retrieved from the RAG storage.
            </p>
            <h3>Multimodal chat</h3>
            <p>
              If you select a multimodal model (like Anthropic Claude 3), you can
              upload images to use in the conversation.
            </p>
          </HelpPanel>
        }
        toolsWidth={300}
        content={<Chat sessionId={sessionId} />}
      />
    )
  }
  else{
    return (
      <BaseAppLayout
        info={
          <HelpPanel header={<Header variant="h3">Using the chat</Header>}>
            <p>
              This chat playground allows user to interact with a chosen LLM and
              optional RAG retriever. You can create new RAG workspaces via the{" "}
              <Link to="/rag/workspaces">Workspaces</Link> console.
            </p>
            <h3>Settings</h3>
            <p>
              You can configure additional settings for the LLM via the setting
              action at the bottom-right. You can change the Temperature and Top P
              values to be used for the answer generation. You can also enable and
              disable streaming mode for those models that support it (the setting
              is ignored if the model does not support streaming). Turning on
              Metadata displays additional information about the answer, such as
              the prompts being used to interact with the LLM and the document
              passages that might have been retrieved from the RAG storage.
            </p>
            <h3>Multimodal chat</h3>
            <p>
              If you select a multimodal model (like Anthropic Claude 3), you can
              upload images to use in the conversation.
            </p>
            <h3>Session history</h3>
            <p>
              All conversations are saved and can be later accessed via the{" "}
              <Link to="/chatbot/sessions">Session</Link> in the navigation bar.
            </p>
          </HelpPanel>
        }
        toolsWidth={300}
        content={<Chat sessionId={sessionId} />}
      />
    );
  }
}
