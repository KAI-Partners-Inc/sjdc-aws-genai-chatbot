import BaseAppLayoutv from '../components/v2-base-app-layout';
import { useState, useEffect, useContext, useCallback } from "react";
import { ApiClient } from "../common/api-client/api-client";
import { AppContext } from "../common/app-context";
import '../styles/feedback.scss';

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
    message: string | null;
    response: string | null;
    date: string | null;
    feedback: string | null;
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};


function Feedback() {
    const appContext = useContext(AppContext);
    const [data, setData] = useState<FeedbackData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const getSessions = useCallback(async () => {
        if (!appContext) return;
        const apiClient = new ApiClient(appContext);
        try {
          const result = await apiClient.sessions.getSessions();
          const feedbackData: FeedbackData[] = []
          console.log(result.data!.listSessions)
          var listSessions = result.data!.listSessions
          for (let i = 0 ; i<listSessions.length; i++){
            if (listSessions[i] && listSessions[i].feedback){
                const feedback = listSessions[i]?.feedback;
                if (feedback){
                    var fbd: FeedbackData = {
                        "feedback": feedback.feedback ?? 'N/A',
                        "date": feedback.date ?? 'N/A',
                        "message": feedback.message ?? 'N/A',
                        "response": feedback.response ?? 'N/A'
                    }
                    feedbackData.push(fbd)
                }
                
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
        return <BaseAppLayoutv
        content={ <div>Loading...</div>}/>
      }
    

    const filteredFeedbackList = data.filter(item => item.feedback !== "N/A");
    
    for (var i =0 ; i < filteredFeedbackList.length; i++){
        if (filteredFeedbackList[i].feedback == '1'){
            filteredFeedbackList[i].feedback = 'Positive'
        }
        else if (filteredFeedbackList[i].feedback == '0'){
            filteredFeedbackList[i].feedback = 'Negative'
        }
    }


    return (
        <BaseAppLayoutv
            content={
                <div>
                    <h1>Feedback Table</h1>
                    <table className="feedback-table">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Response</th>
                                <th>Date</th>
                                <th>Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbackList.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.message}</td>
                                    <td>{item.response}</td>
                                    <td>{formatDate(item.date)}</td>
                                    <td>{item.feedback}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        />
    )
}

export default Feedback;