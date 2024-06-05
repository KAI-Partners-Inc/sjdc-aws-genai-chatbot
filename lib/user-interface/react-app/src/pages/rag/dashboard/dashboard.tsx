import { ContentLayout, SpaceBetween } from "@cloudscape-design/components";
import { BreadcrumbGroup } from "@cloudscape-design/components";
import { useContext, useEffect, useState } from "react";
import { ApiClient } from "../../../common/api-client/api-client";
import { AppContext } from "../../../common/app-context";
import DashboardHeader from "./dashboard-header";
import WorkspacesTable from "./workspaces-table";
import useOnFollow from "../../../common/hooks/use-on-follow";
import BaseAppLayout from "../../../components/base-app-layout";
import GeneralConfig, { WorkspacesStatistics } from "./general-config";
import { CHATBOT_NAME } from "../../../common/constants";
import { Workspace } from "../../../API";
import { useLocation } from "react-router-dom";
import BaseAppLayoutv from "../../../components/v2-base-app-layout";

export default function Dashboard() {
  const location = useLocation();
  const pathname = location.pathname;
  const versionPath = pathname.split('/')
  const onFollow = useOnFollow();
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [statistics, setStatistics] = useState<WorkspacesStatistics | null>(
    null
  );

  useEffect(() => {
    (async () => {
      if (!appContext) return;
      console.log("WorkspacesTable: useEffect");

      const apiClient = new ApiClient(appContext);
      try {
        const result = await apiClient.workspaces.getWorkspaces();

        const data = result.data?.listWorkspaces!;
        setWorkspaces(data);
        console.log(data);
        setStatistics({
          count: data.length,
          documents: data.reduce((a, b) => a + b.documents!, 0),
          vectors: data.reduce((a, b) => a + b.vectors!, 0),
          sizeInBytes: data.reduce((a, b) => a + b.sizeInBytes!, 0),
        });

        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [appContext]);

  if (versionPath[1] == 'v2'){
    return (
      <BaseAppLayoutv
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
            ]}
            expandAriaLabel="Show path"
            ariaLabel="Breadcrumbs"
          />
        }
        content={
          <ContentLayout header={<DashboardHeader />}>
            <SpaceBetween size="l">
              <GeneralConfig statistics={statistics} />
              <WorkspacesTable loading={loading} workspaces={workspaces} />
            </SpaceBetween>
          </ContentLayout>
        }
      />
    );
  }
  else{
    return (
      <BaseAppLayout
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
            ]}
            expandAriaLabel="Show path"
            ariaLabel="Breadcrumbs"
          />
        }
        content={
          <ContentLayout header={<DashboardHeader />}>
            <SpaceBetween size="l">
              <GeneralConfig statistics={statistics} />
              <WorkspacesTable loading={loading} workspaces={workspaces} />
            </SpaceBetween>
          </ContentLayout>
        }
      />
    );
  }
}
