import os
import uuid
import boto3
import json
from pydantic import BaseModel
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler.appsync import Router
from langchain.schema.messages import (
    BaseMessage,
    _message_to_dict,
    messages_from_dict,
    messages_to_dict,
)

tracer = Tracer()
router = Router()
logger = Logger()

from datetime import datetime

try:
    dynamodb_client = boto3.resource("dynamodb")
    USER_FEEDBACK_BUCKET_NAME = os.environ.get("USER_FEEDBACK_BUCKET_NAME")
except:
    pass
s3_client = boto3.client("s3")




def add_user_feedback(
    sessionId: str,
    key: str,
    feedback: str,
    prompt: str,
    completion: str,
    model: str,
    userId: str
):
    feedbackId = str(uuid.uuid4())
    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    prefix = datetime.utcnow().strftime("user_feedback/year=%Y/month=%m/")
    sessions_table_name = os.environ["SESSIONS_TABLE_NAME"]
    item = {
        "feedbackId": feedbackId,
        "sessionId": sessionId,
        "userId": userId,
        "key": key,
        "prompt": prompt,
        "completion": completion,
        "model": model,
        "feedback": feedback,
        "createdAt": timestamp
    }

    new_feedback_data = {
        "message": prompt,
        "response": completion,
        "feedback": feedback,
        "date": timestamp
    }
    try:
        table = dynamodb_client.Table(sessions_table_name)
        try:
            response = table.get_item(Key={"SessionId": sessionId, "UserId": userId})
            if response and "Item" in response:
                items = response["Item"]["History"]
            else:
                items = []

            messages = messages_from_dict(items)
            prev_message = ""
            for i in range(len(messages)):
                if i == 0:
                    prev_message = messages[i]["content"]
                else:
                    prev_message = messages[i-1]["content"]
                    if messages[i]["content"] == completion:
                        break       
            
        except Exception as e:
            logger.error("Table get messages feedback error")
            logger.error(e)
            prev_message = "There was an error retrieving the message"
        new_feedback_data["message"] = prev_message
        db_response = table.update_item(
            Key={
                'SessionId': sessionId,
                "UserId": userId
            },
            UpdateExpression="SET Feedback = :Feedback",
            ExpressionAttributeValues={
                ':Feedback': new_feedback_data
            },
            ReturnValues="UPDATED_NEW"
        )
    except Exception as e:
        logger.error("Dynamo db session feedback error")
        logger.error(e)

    response = s3_client.put_object(
        Bucket=USER_FEEDBACK_BUCKET_NAME,
        Key=f"{prefix}{feedbackId}.json",
        Body=json.dumps(item),
        ContentType="application/json",
        StorageClass='STANDARD_IA',
    )
    print(response)
    
    return {
        "feedback_id": feedbackId
    }
    
    