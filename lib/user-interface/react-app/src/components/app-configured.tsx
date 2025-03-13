import { useEffect, useState } from "react";
import {
  Authenticator,
  Heading,
  ThemeProvider,
  defaultDarkModeOverride,
  useTheme,
  Button,
  Divider,
  View,
} from "@aws-amplify/ui-react";
import App from "../app";
import { Amplify} from "aws-amplify";
import { AppConfig } from "../common/types";
import { AppContext } from "../common/app-context";
import { Alert, StatusIndicator } from "@cloudscape-design/components";
import { StorageHelper } from "../common/helpers/storage-helper";
import { Mode } from "@cloudscape-design/global-styles";
import "@aws-amplify/ui-react/styles.css";
import { CHATBOT_NAME } from "../common/constants";

function parseJwt( token: string) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export default function AppConfigured() {
  const { tokens } = useTheme();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [error, setError] = useState<boolean | null>(null);
  const [theme, setTheme] = useState(StorageHelper.getTheme());

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("/aws-exports.json");
        const awsExports = await result.json();
        const currentConfig = Amplify.configure(awsExports) as AppConfig | null;

        // Extract the query string from the current URL
        const queryString = window.location.search;

        // Use URLSearchParams to work with the query string easily
        const urlParams = new URLSearchParams(queryString);
        const authCode = urlParams.get("code");
        const client_id = currentConfig?.aws_user_pools_web_client_id || '3fd8t8j929vop26jukj610q78b'
        
        if (authCode) {
          const tokenEndpoint = `https://kaip-chatbot.auth.us-east-1.amazoncognito.com/oauth2/token`
          const params = new URLSearchParams();
          localStorage.setItem('aws-genai-llm-chatbot-navigation-panel-state', '{"collapsed":false}')
          params.append('grant_type', 'authorization_code');
          params.append('code', authCode);
          params.append('client_id', client_id);
          params.append('redirect_uri', 'https://sage-ai.kaipartners.com/')
          // If the code is present, exchange it for tokens
          try {
            const response = await fetch(tokenEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }, body: params
            });
      
            if (!response.ok) {
              throw new Error(`HTTP ERROR! status: ${response.status}`);
            }
            const data = await response.json();
            const decodedIdToken = parseJwt(data.id_token);
            const userIdentifier = decodedIdToken.email || decodedIdToken.preferred_username || decodedIdToken.sub;
            localStorage.setItem('authTokens', JSON.stringify(data));
            localStorage.setItem(
              `CognitoIdentityServiceProvider.${client_id}.LastAuthUser`,
              userIdentifier
            );
            localStorage.setItem(
              `CognitoIdentityServiceProvider.${client_id}.${userIdentifier}.idToken`,
              data.id_token
            );
            localStorage.setItem(
              `CognitoIdentityServiceProvider.${client_id}.${userIdentifier}.accessToken`,
              data.access_token
            );
            localStorage.setItem(
              `CognitoIdentityServiceProvider.${client_id}.${userIdentifier}.refreshToken`,
              data.refresh_token
            );
            window.location.reload();
          } catch (error) {
            console.error("Error exchanging code for tokens:", error);
            window.location.href = "/";
          }
        } else {
          // If no code is present, proceed as normal
          setConfig(currentConfig);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
    })();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const newValue =
            document.documentElement.style.getPropertyValue(
              "--app-color-scheme"
            );

          const mode = newValue === "dark" ? Mode.Dark : Mode.Light;
          if (mode !== theme) {
            setTheme(mode);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => {
      observer.disconnect();
    };
  }, [theme]);

  if (!config) {
    if (error) {
      return (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Alert header="Configuration error" type="error">
            Error loading configuration from "
            <a href="/aws-exports.json" style={{ fontWeight: "600" }}>
              /aws-exports.json
            </a>
            "
          </Alert>
        </div>
      );
    }

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusIndicator type="loading">Loading</StatusIndicator>
      </div>
    );
  }

  const signInUrl = `https://kaip-chatbot.auth.us-east-1.amazoncognito.com/login?client_id=${config?.aws_user_pools_web_client_id}&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=${encodeURIComponent("https://sage-ai.kaipartners.com/")}`;

  return (
    <AppContext.Provider value={config}>
      <ThemeProvider
        theme={{
          name: "default-theme",
          overrides: [defaultDarkModeOverride],
        }}
        colorMode={theme === Mode.Dark ? "dark" : "light"}
      >
        <Authenticator
          hideSignUp={true}
          components={{
            SignIn: {
              Header: () => {
                return (
                  <Heading
                    padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
                    level={3}
                  >
                    {CHATBOT_NAME}
                    <View as="div" paddingTop="1rem" paddingBottom="1rem">
                      <a
                        href={signInUrl} // Sign-in with KAIP redirects here
                        // target="_blank" // Optional: Open in new tab
                      >
                        <Button variation="primary">
                          Sign in with{" "}
                          {config.config.auth_federated_provider?.name}
                        </Button>
                      </a>
                    </View>
                    <Divider label="OR" />
                  </Heading>
                );
              },
            },
          }}
        >
          <App />
        </Authenticator>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
