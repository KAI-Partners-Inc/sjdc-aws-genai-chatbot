import BaseAppLayoutv from '../components/v2-base-app-layout';
import {
    Box,
    SpaceBetween,
    Table,
    Pagination,
    Button,
    TableProps,
    Header,
    CollectionPreferences,
    Modal,
  } from "@cloudscape-design/components";
import { DateTime } from "luxon";
import { React, useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useCollection } from "@cloudscape-design/collection-hooks";
import { ApiClient } from "../../common/api-client/api-client";
import { AppContext } from "../../common/app-context";
import RouterButton from "../wrappers/router-button";
import { Session } from "../../API";


type Feedback = {
    feedback: string;
    date: string;
    message: string;
    response: string;
  };


function Feedback() {
    const appContext = useContext(AppContext);
    const [data, setData] =  useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(null)
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
          setIsError(e);
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
    
      if (isError) {
        return <div>Error: {isError.message}</div>;
      }
    return (
        <BaseAppLayoutv
            content={
                <div>
                    <h1>Feedback Table</h1>
                    <FeedbackTable data={data} />
                </div>
            }
        />
    )
}

type FeedbackTableProps = {
    data: Feedback[];
  };

const FeedbackTable: React.FC<FeedbackTableProps> = ({ data }) => {
return (
    <table>
        <thead>
            <tr>
            <th>Feedback</th>
            <th>Date</th>
            <th>Message</th>
            <th>Response</th>
            </tr>
        </thead>
        <tbody>
            {data.map((item, index) => (
            <tr key={index}>
                <td>{item.feedback}</td>
                <td>{item.date}</td>
                <td>{item.message}</td>
                <td>{item.response}</td>
            </tr>
            ))}
        </tbody>
    </table>
);
  };

export default Feedback;