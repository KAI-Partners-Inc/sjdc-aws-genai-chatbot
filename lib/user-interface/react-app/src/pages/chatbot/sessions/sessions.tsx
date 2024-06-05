import { useState } from "react";
import BaseAppLayout from "../../../components/base-app-layout";
import Sessions from "../../../components/chatbot/sessions";
import { BreadcrumbGroup } from "@cloudscape-design/components";
import { CHATBOT_NAME } from "../../../common/constants";
import useOnFollow from "../../../common/hooks/use-on-follow";
import { useLocation } from "react-router-dom";
import BaseAppLayoutv from "../../../components/v2-base-app-layout";

export default function SessionPage() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const onFollow = useOnFollow();
  const location = useLocation();
  const pathname = location.pathname;
  const versionPath = pathname.split('/')
  if (versionPath[1] == 'v2'){
    return (
      <BaseAppLayoutv
        contentType="table"
        toolsOpen={toolsOpen}
        onToolsChange={(e) => setToolsOpen(e.detail.open)}
        breadcrumbs={
          <BreadcrumbGroup
            onFollow={onFollow}
            items={[
              {
                text: CHATBOT_NAME,
                href: "/",
              },
              {
                text: "Sessions",
                href: "/chatbot/sessions",
              },
            ]}
          />
        }
        content={<Sessions toolsOpen={true} />}
      />
    )
  }
  else{
    return (
      <BaseAppLayout
        contentType="table"
        toolsOpen={toolsOpen}
        onToolsChange={(e) => setToolsOpen(e.detail.open)}
        breadcrumbs={
          <BreadcrumbGroup
            onFollow={onFollow}
            items={[
              {
                text: CHATBOT_NAME,
                href: "/",
              },
              {
                text: "Sessions",
                href: "/chatbot/sessions",
              },
            ]}
          />
        }
        content={<Sessions toolsOpen={true} />}
      />
    );
  }
}
