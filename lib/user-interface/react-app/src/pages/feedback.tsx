import BaseAppLayoutv from '../components/v2-base-app-layout';
// import { ApiClient } from "../../common/api-client/api-client";

function Feedback() {

    // const getSessions = useCallback(async () => {
    //     if (!appContext) return;
    
    //     const apiClient = new ApiClient(appContext);
    //     try {
    //       const result = await apiClient.sessions.getSessions();
    //       console.log(result.data!.listSessions)
    //       setFeedback(result.data!.listSessions);
    //     } catch (e) {
    //       console.log(e);
    //       setSessions([]);
    //     }
    //   }, [appContext]);

      
    return (
        <BaseAppLayoutv
            content={
                <p>Work in progress</p>
            }
        />
    )
}
export default Feedback;