import os
import uuid
import boto3
import json
from pydantic import BaseModel
from datetime import datetime

dynamodb_client = boto3.resource("dynamodb")
s3_client = boto3.client("s3")

USER_FEEDBACK_BUCKET_NAME = os.environ.get("USER_FEEDBACK_BUCKET_NAME")


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
    
    table = dynamodb_client.Table(table_name)
    db_response = table.update_item(
        Key={
            'sessionId': session_id
        },
        UpdateExpression="SET feedback = :feedback",
        ExpressionAttributeValues={
            ':feedback': new_feedback_data
        },
        ReturnValues="UPDATED_NEW"
    )

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
    
    