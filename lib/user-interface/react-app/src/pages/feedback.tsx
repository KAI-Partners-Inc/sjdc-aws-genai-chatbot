import BaseAppLayoutv from '../components/v2-base-app-layout';
import { useState, useEffect, useContext, useCallback } from "react";
import { ApiClient } from "../common/api-client/api-client";
import { AppContext } from "../common/app-context";

// interface FeedbackTableInterface  {
//     data = Feedback[]
// }
// interface Feedback  {
//     feedback: string;
//     date: string;
//     message: string;
//     response: string;
//   };

// function FeedbackTable( data : FeedbackTableInterface) {
//     return (
//         <table>
//           <thead>
//             <tr>
//               <th>Feedback</th>
//               <th>Date</th>
//               <th>Message</th>
//               <th>Response</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.data.map((item : Feedback, index : number) => (
//               <tr key={index}>
//                 <td>{item.feedback}</td>
//                 <td>{item.date}</td>
//                 <td>{item.message}</td>
//                 <td>{item.response}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       );
// }

interface FeedbackData {
    message: string;
    response: string;
    feedback: number;
}

function Feedback() {
    const appContext = useContext(AppContext);
    const [data, setData] = useState<FeedbackData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const getSessions = useCallback(async () => {
        if (!appContext) return;
        const apiClient = new ApiClient(appContext);
        try {
          const result = await apiClient.sessions.getSessions();
          const feedbackData = [];
          console.log(result.data!.listSessions)
          var listSessions = result.data!.listSessions
          for (let i = 0 ; i<listSessions.length; i++){
            if (listSessions[i].feedback != null){
                feedbackData.push(listSessions[i].feedback)
            }
          }
          setData(feedbackData);
          setIsLoading(false)
        } catch (e) {
          console.log(e);
          setIsLoading(false)
        }
      }, [appContext]);
    
    useEffect(() => {
        if (!appContext) return;

        (async () => {
            setIsLoading(true);
            await getSessions();
            setIsLoading(false);
        })();
    }, [appContext, getSessions]);
      
    if (isLoading) {
        return <div>Loading...</div>;
      }

    return (
        <BaseAppLayoutv
            content={
                <div>
                    <h1>Feedback Table</h1>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            }
        />
    )
}



export default Feedback;