import {
  BreadcrumbGroup,
  Cards,
  StatusIndicator,
  Header,
} from "@cloudscape-design/components";
import { EnginesPageHeader } from "./engines-page-header";
import { ApiClient } from "../../../common/api-client/api-client";
import { AppContext } from "../../../common/app-context";
import { useContext, useEffect, useState } from "react";
import useOnFollow from "../../../common/hooks/use-on-follow";
import BaseAppLayout from "../../../components/base-app-layout";
import { CHATBOT_NAME } from "../../../common/constants";
import { RagEngine } from "../../../API";
import { useLocation } from "react-router-dom";
import BaseAppLayoutv from "../../../components/v2-base-app-layout";

const CARD_DEFINITIONS = {
  header: (item: RagEngine) => (
    <div>
      <Header>{item.name}</Header>
    </div>
  ),
  sections: [
    {
      id: "id",
      header: "id",
      content: (item: RagEngine) => item.id,
    },
    {
      id: "state",
      header: "State",
      content: (item: RagEngine) => (
        <StatusIndicator type={item.enabled ? "success" : "stopped"}>
          {item.enabled ? "Enabled" : "Disabled"}
        </StatusIndicator>
      ),
    },
  ],
};

export default function Engines() {
  const location = useLocation();
  const pathname = location.pathname;
  const versionPath = pathname.split('/')
  const onFollow = useOnFollow();
  const appContext = useContext(AppContext);
  const [data, setData] = useState<RagEngine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appContext?.config) return;

    (async () => {
      const apiClient = new ApiClient(appContext);
      try {
        const result = await apiClient.ragEngines.getRagEngines();

        setData(result.data?.listRagEngines!);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    })();
  }, [appContext]);
  if (versionPath[1] == 'v2'){
    return (
      <BaseAppLayoutv
        contentType="cards"
          breadcrumbs={
            <BreadcrumbGroup
              onFollow={onFollow}
              items={[
                {
                  text: CHATBOT_NAME,
                  href: "/",
                },
                {
                  text: "RAG",
                  href: "/rag",
                },
                {
                  text: "Engines",
                  href: "/rag/engines",
                },
              ]}
            />
          }
          content={
            <Cards
              stickyHeader={true}
              cardDefinition={CARD_DEFINITIONS}
              loading={loading}
              loadingText="Loading engines"
              items={data || []}
              variant="full-page"
              header={<EnginesPageHeader />}
            />
          }
      />
    );
  }
  else{
    return (
      <BaseAppLayout
        contentType="cards"
        breadcrumbs={
          <BreadcrumbGroup
            onFollow={onFollow}
            items={[
              {
                text: CHATBOT_NAME,
                href: "/",
              },
              {
                text: "RAG",
                href: "/rag",
              },
              {
                text: "Engines",
                href: "/rag/engines",
              },
            ]}
          />
        }
        content={
          <Cards
            stickyHeader={true}
            cardDefinition={CARD_DEFINITIONS}
            loading={loading}
            loadingText="Loading engines"
            items={data || []}
            variant="full-page"
            header={<EnginesPageHeader />}
          />
        }
      />
    );
  }
}
