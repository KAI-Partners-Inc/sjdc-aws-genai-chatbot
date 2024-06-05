import {
  SideNavigation,
  SideNavigationProps,
} from "@cloudscape-design/components";
import useOnFollow from "../common/hooks/use-on-follow";
import { useNavigationPanelState } from "../common/hooks/use-navigation-panel-state";
import { AppContext } from "../common/app-context";
import { useContext, useState } from "react";
import { CHATBOT_NAME } from "../common/constants";
import kaipLogo from '../assets/images/kaip_logo.png';

export default function NavigationPanelv() {
  const appContext = useContext(AppContext);
  const onFollow = useOnFollow();
  const [navigationPanelState, setNavigationPanelState] =
    useNavigationPanelState();
  const [items] = useState<SideNavigationProps.Item[]>(() => {
    const items: SideNavigationProps.Item[] = [
      {
        type: "link",
        text: "Home",
        href: "/v2",
      },
      { type: "divider" },
      {
        type: "section",
        text: "Chatbot",
        items: [
          {
            type: "link",
            text: "Multi Modal Chat",
            href: "/v2/chatbot/multichat",
          },
          {
            type: "link",
            text: "Client Admin",
            href: "/v2/client-admin",
          }
        ],
      },
    ];

    if (appContext?.config.rag_enabled) {
      const crossEncodersItems: SideNavigationProps.Item[] = appContext?.config
        .cross_encoders_enabled
        ? [
            {
              type: "link",
              text: "Cross-encoders",
              href: "/v2/rag/cross-encoders",
            },
          ]
        : [];

      items.push(
        { type: "divider" },
        {
        type: "section",
        text: "Retrieval-Augmented Generation (RAG)",
        items: [
          { type: "link", text: "Dashboard", href: "/v2/rag" },
          {
            type: "link",
            text: "Semantic search",
            href: "/v2/rag/semantic-search",
          },
          { type: "link", text: "Workspaces", href: "/v2/rag/workspaces" },
          {
            type: "link",
            text: "Embeddings",
            href: "/v2/rag/embeddings",
          },
          ...crossEncodersItems,
          { type: "link", text: "Engines", href: "/v2/rag/engines" },
        ],
      });
    }
    items.push(
      { type: "divider" },
      {
        type: "link",
        text: "User Feedback",
        href: "/v2/user-feedback",
      }
    )
    items.push(
      { type: "divider" },
      {
        type: "link",
        text: "Documentation",
        href: "https://aws-samples.github.io/aws-genai-llm-chatbot/",
        external: true,
      }
    );

    return items;
  });

  const onChange = ({
    detail,
  }: {
    detail: SideNavigationProps.ChangeDetail;
  }) => {
    const sectionIndex = items.indexOf(detail.item);
    setNavigationPanelState({
      collapsedSections: {
        ...navigationPanelState.collapsedSections,
        [sectionIndex]: !detail.expanded,
      },
    });
  };

  return (
    <div className="sideNav">
      <SideNavigation
        onFollow={onFollow}
        onChange={onChange}
        header={{ href: "/", text: CHATBOT_NAME, logo:{alt:"logo", src:kaipLogo} }}
        items={items.map((value, idx) => {
          if (value.type === "section") {
            const collapsed =
              navigationPanelState.collapsedSections?.[idx] === true;
            value.defaultExpanded = !collapsed;
          }

          return value;
        })}
      />
    </div>
  );
}
