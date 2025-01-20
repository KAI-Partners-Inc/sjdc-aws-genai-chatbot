import os
import json
import uuid
from datetime import datetime
from genai_core.registry import registry
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.utilities import parameters
from aws_lambda_powertools.utilities.batch import BatchProcessor, EventType
from aws_lambda_powertools.utilities.batch.exceptions import BatchProcessingError
from aws_lambda_powertools.utilities.data_classes.sqs_event import SQSRecord
from aws_lambda_powertools.utilities.typing import LambdaContext
import boto3
import adapters
from genai_core.utils.websocket import send_to_client
from genai_core.types import ChatbotAction
from genai_core.langchain import DynamoDBChatMessageHistory
from langchain.schema import AIMessage, HumanMessage


processor = BatchProcessor(event_type=EventType.SQS)
tracer = Tracer()
logger = Logger()

AWS_REGION = os.environ["AWS_REGION"]
API_KEYS_SECRETS_ARN = os.environ["API_KEYS_SECRETS_ARN"]
bedrock_agent_client = boto3.client('bedrock-agent-runtime', region_name='us-east-1')

sequence_number = 0


def on_llm_new_token(user_id, session_id, self, token, run_id, *args, **kwargs):
    if token is None or len(token) == 0:
        return
    global sequence_number
    sequence_number += 1
    run_id = str(run_id)

    send_to_client(
        {
            "type": "text",
            "action": ChatbotAction.LLM_NEW_TOKEN.value,
            "userId": user_id,
            "timestamp": str(int(round(datetime.now().timestamp()))),
            "data": {
                "sessionId": session_id,
                "token": {
                    "runId": run_id,
                    "sequenceNumber": sequence_number,
                    "value": token,
                },
            },
        }
    )


def handle_heartbeat(record):
    user_id = record["userId"]
    session_id = record["data"]["sessionId"]

    send_to_client(
        {
            "type": "text",
            "action": ChatbotAction.HEARTBEAT.value,
            "timestamp": str(int(round(datetime.now().timestamp()))),
            "userId": user_id,
            "data": {
                "sessionId": session_id,
            },
        }
    )


def retrieveAndGenerateSJDC1(input, sessionId=None, model_id = "anthropic.claude-instant-v1"):
    model_arn = f'arn:aws:bedrock:us-east-1::foundation-model/{model_id}'
    kbId = "ABM3Q1NO8Z"
    if sessionId:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn
                }
            },
            sessionId=sessionId
        )
    else:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn
                }
            }
        )

def retrieveAndGenerateSJDC2(input, sessionId=None, model_id = "anthropic.claude-instant-v1"):
    model_arn = f'arn:aws:bedrock:us-east-1::foundation-model/{model_id}'
    kbId = "75GGXZP2LO"
    if sessionId:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn
                }
            },
            sessionId=sessionId
        )
    else:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn
                }
            }
        )

def retrieveAndGenerateKAIP(input, sessionId=None, model_id = "anthropic.claude-instant-v1"):
    model_arn = f'arn:aws:bedrock:us-east-1::foundation-model/{model_id}'
    kbId = "EEZJ01SGD8"
    if sessionId:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn,
                    'generationConfiguration': {
                        'guardrailConfiguration': {
                            'guardrailId': '3cfzoipc4j97',
                            'guardrailVersion': '2'
                        }
                    }
                }
            },
            sessionId=sessionId
        )
    else:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn,
                    'generationConfiguration': {
                        'guardrailConfiguration': {
                            'guardrailId': '3cfzoipc4j97',
                            'guardrailVersion': '2'
                        }
                    }
                }
            },
        )
def retrieveAndGenerateC4O(input, sessionId=None, model_id = "anthropic.claude-instant-v1"):
    model_arn = f'arn:aws:bedrock:us-east-1::foundation-model/{model_id}'
    kbId = "COXAUXAUCG"
    if sessionId:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn
                }
            },
            sessionId=sessionId
        )
    else:
        return bedrock_agent_client.retrieve_and_generate(
            input={
                'text': input
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': kbId,
                    'modelArn': model_arn
                }
            }
        )  

### 2
def handle_run(record):
    user_id = record["userId"]
    data = record["data"]
    provider = data["provider"]
    model_id = data["modelName"]
    mode = data["mode"]
    prompt = data["text"]
    workspace_id = data.get("workspaceId", None)
    session_id = data.get("sessionId")
    if not session_id:
        session_id = str(uuid.uuid4())
    try:
        if model_id == "SJDC_Model":
            retrieve_generate_response = retrieveAndGenerateSJDC1(prompt, None, "anthropic.claude-3-sonnet-20240229-v1:0")
            output = retrieve_generate_response["output"]["text"]
            citations = retrieve_generate_response["citations"]
            logger.info(output)
            metadata = {
                    "modelId": model_id,
                    "modelKwargs": data.get("modelKwargs", {}),
                    "mode": mode,
                    "citations": citations,
                    "sessionId": session_id,
                    "userId": user_id,
                    "documents": [],
                    "prompts": [],
                }
            try:

                db_chat_history = DynamoDBChatMessageHistory(
                table_name=os.environ["SESSIONS_TABLE_NAME"],
                session_id=session_id,
                user_id=user_id,
                )
                db_chat_history.add_message(HumanMessage(content=prompt))
                db_chat_history.add_message(AIMessage(content=output))
                db_chat_history.add_metadata(metadata)
            except Exception as e:
                logger.error("ERROR: db add meta data")
                logger.error(e)
                pass
            response = {
                    "sessionId": session_id,
                    "type": "text",
                    "content": output,
                    "metadata": metadata
                }
            logger.info(response)
            send_to_client(
                {
                    "type": "text",
                    "action": ChatbotAction.FINAL_RESPONSE.value,
                    "timestamp": str(int(round(datetime.now().timestamp()))),
                    "userId": user_id,
                    "data": response,
                }
            )
        # elif model_id == "SJDC_Model_Crawler":
        #     retrieve_generate_response = retrieveAndGenerateSJDC2(prompt, None, "anthropic.claude-3-sonnet-20240229-v1:0")
        #     output = retrieve_generate_response["output"]["text"]
        #     citations = retrieve_generate_response["citations"]
        #     logger.info(output)
        #     metadata = {
        #             "modelId": model_id,
        #             "modelKwargs": data.get("modelKwargs", {}),
        #             "mode": mode,
        #             "citations": citations,
        #             "sessionId": session_id,
        #             "userId": user_id,
        #             "documents": [],
        #             "prompts": [],
        #         }
        #     try:

        #         db_chat_history = DynamoDBChatMessageHistory(
        #         table_name=os.environ["SESSIONS_TABLE_NAME"],
        #         session_id=session_id,
        #         user_id=user_id,
        #         )
        #         db_chat_history.add_message(HumanMessage(content=prompt))
        #         db_chat_history.add_message(AIMessage(content=output))
        #         db_chat_history.add_metadata(metadata)
        #     except Exception as e:
        #         logger.error("ERROR: db add meta data")
        #         logger.error(e)
        #         pass
        #     response = {
        #             "sessionId": session_id,
        #             "type": "text",
        #             "content": output,
        #             "metadata": metadata
        #         }
        #     logger.info(response)
        #     send_to_client(
        #         {
        #             "type": "text",
        #             "action": ChatbotAction.FINAL_RESPONSE.value,
        #             "timestamp": str(int(round(datetime.now().timestamp()))),
        #             "userId": user_id,
        #             "data": response,
        #         }
        #     )
        elif model_id == "C4O_Model":
            retrieve_generate_response = retrieveAndGenerateC4O(prompt, None, "anthropic.claude-3-sonnet-20240229-v1:0")
            output = retrieve_generate_response["output"]["text"]
            citations = retrieve_generate_response["citations"]
            logger.info(output)
            metadata = {
                    "modelId": model_id,
                    "modelKwargs": data.get("modelKwargs", {}),
                    "mode": mode,
                    "citations": citations,
                    "sessionId": session_id,
                    "userId": user_id,
                    "documents": [],
                    "prompts": [],
                }
            output += "\n\nCitations\n\n"
            citations_string = ''
            titles = []
            citations_indexes = []
            for citation in citations:
                generated_response = citation.get('generatedResponsePart', {})
                text_response = generated_response.get('textResponsePart', {})
                span = text_response.get('span', {})
                
                index_start = span.get('start')
                index_end = span.get('end')
                cit_nums=''
                for ref in citation.get("retrievedReferences", []):
                    md = ref.get("metadata", {})
                    title = md.get("x-amz-bedrock-kb-title", "Unknown Title")
                    uri = md.get("x-amz-bedrock-kb-source-uri", "Unknown URI")
                    if title not in titles:
                        titles.append(title)
                        ref_num = len(titles)
                        cit_nums += f'[[{ref_num}]]({uri})'
                        citations_string += f"{ref_num}. {title} {uri}\n"
                    else:
                        ref_num = titles.index(title)
                        ref_num+=1
                        temp_cit_num = f'[[{ref_num}]]({uri})'
                        if temp_cit_num not in cit_nums:
                            cit_nums+=temp_cit_num
                        else:
                            pass
                citations_indexes.append((index_start,index_end, cit_nums))
            citations_indexes = sorted(citations_indexes, key=lambda x: x[1], reverse=True)
            # Insert strings into the output
            for start_index, end_index, string in citations_indexes:
                output = output[:end_index + 1] + "**" + string + "**" + output[end_index + 1:]
            output+= citations_string
            try:
                db_chat_history = DynamoDBChatMessageHistory(
                table_name=os.environ["SESSIONS_TABLE_NAME"],
                session_id=session_id,
                user_id=user_id,
                )
                db_chat_history.add_message(HumanMessage(content=prompt))
                db_chat_history.add_message(AIMessage(content=output))
                db_chat_history.add_metadata(metadata)
            except Exception as e:
                logger.error("ERROR: db add meta data")
                logger.error(e)
                pass
            response = {
                    "sessionId": session_id,
                    "type": "text",
                    "content": output,
                    "metadata": metadata
                }
            logger.info(response)
            send_to_client(
                {
                    "type": "text",
                    "action": ChatbotAction.FINAL_RESPONSE.value,
                    "timestamp": str(int(round(datetime.now().timestamp()))),
                    "userId": user_id,
                    "data": response,
                }
            )
        elif model_id == "KAIP_Model":
            retrieve_generate_response = retrieveAndGenerateKAIP(prompt, None, "anthropic.claude-3-sonnet-20240229-v1:0")
            output = retrieve_generate_response["output"]["text"]
            citations = retrieve_generate_response["citations"]
            logger.info(output)
            metadata = {
                    "modelId": model_id,
                    "modelKwargs": data.get("modelKwargs", {}),
                    "mode": mode,
                    "citations": citations,
                    "sessionId": session_id,
                    "userId": user_id,
                    "documents": [],
                    "prompts": [],
                }
            output += "\n\nCitations\n\n"
            citations_string = ''
            titles = []
            citations_indexes = []
            for citation in citations:
                generated_response = citation.get('generatedResponsePart', {})
                text_response = generated_response.get('textResponsePart', {})
                span = text_response.get('span', {})
                
                index_start = span.get('start')
                index_end = span.get('end')
                cit_nums=''
                for ref in citation.get("retrievedReferences", []):
                    md = ref.get("metadata", {})
                    title = md.get("x-amz-bedrock-kb-title", "Unknown Title")
                    uri = md.get("x-amz-bedrock-kb-source-uri", "Unknown URI")
                    if title not in titles:
                        titles.append(title)
                        ref_num = len(titles)
                        cit_nums += f'[[{ref_num}]]({uri})'
                        citations_string += f"{ref_num}. {title} {uri}\n"
                    else:
                        ref_num = titles.index(title)
                        ref_num+=1
                        temp_cit_num = f'[[{ref_num}]]({uri})'
                        if temp_cit_num not in cit_nums:
                            cit_nums+=temp_cit_num
                        else:
                            pass
                citations_indexes.append((index_start,index_end, cit_nums))
            citations_indexes = sorted(citations_indexes, key=lambda x: x[1], reverse=True)
            # Insert strings into the output
            for start_index, end_index, string in citations_indexes:
                output = output[:end_index + 1] + "**" + string + "**" + output[end_index + 1:]
            output+= citations_string
            try:
                db_chat_history = DynamoDBChatMessageHistory(
                table_name=os.environ["SESSIONS_TABLE_NAME"],
                session_id=session_id,
                user_id=user_id,
                )
                db_chat_history.add_message(HumanMessage(content=prompt))
                db_chat_history.add_message(AIMessage(content=output))
                db_chat_history.add_metadata(metadata)
            except Exception as e:
                logger.error("ERROR: db add meta data")
                logger.error(e)
                pass
            response = {
                    "sessionId": session_id,
                    "type": "text",
                    "content": output,
                    "metadata": metadata
                }
            logger.info(response)
            send_to_client(
                {
                    "type": "text",
                    "action": ChatbotAction.FINAL_RESPONSE.value,
                    "timestamp": str(int(round(datetime.now().timestamp()))),
                    "userId": user_id,
                    "data": response,
                }
            )
        else:
            adapter = registry.get_adapter(f"{provider}.{model_id}")

            ### 4
            ### EVERYTHING BELOW in this handle_run function IS STEP 4
            adapter.on_llm_new_token = lambda *args, **kwargs: on_llm_new_token(
                user_id, session_id, *args, **kwargs
            )

            model = adapter(
                model_id=model_id,
                mode=mode,
                session_id=session_id,
                user_id=user_id,
                model_kwargs=data.get("modelKwargs", {}),
            )

            response = model.run(
                prompt=prompt,
                workspace_id=workspace_id,
            )

            logger.info(response)

            send_to_client(
                {
                    "type": "text",
                    "action": ChatbotAction.FINAL_RESPONSE.value,
                    "timestamp": str(int(round(datetime.now().timestamp()))),
                    "userId": user_id,
                    "data": response,
                }
            )
    except Exception as error:
        logger.error(error)
    # adapter = registry.get_adapter(f"{provider}.{model_id}")

    # ### 4
    # ### EVERYTHING BELOW in this handle_run function IS STEP 4
    # adapter.on_llm_new_token = lambda *args, **kwargs: on_llm_new_token(
    #     user_id, session_id, *args, **kwargs
    # )

    # model = adapter(
    #     model_id=model_id,
    #     mode=mode,
    #     session_id=session_id,
    #     user_id=user_id,
    #     model_kwargs=data.get("modelKwargs", {}),
    # )

    # response = model.run(
    #     prompt=prompt,
    #     workspace_id=workspace_id,
    # )

    # logger.info(response)

    # send_to_client(
    #     {
    #         "type": "text",
    #         "action": ChatbotAction.FINAL_RESPONSE.value,
    #         "timestamp": str(int(round(datetime.now().timestamp()))),
    #         "userId": user_id,
    #         "data": response,
    #     }
    # )


@tracer.capture_method
def record_handler(record: SQSRecord):
    payload: str = record.body
    message: dict = json.loads(payload)
    detail: dict = json.loads(message["Message"])
    logger.info(detail)

    if detail["action"] == ChatbotAction.RUN.value:
        handle_run(detail)
    elif detail["action"] == ChatbotAction.HEARTBEAT.value:
        handle_heartbeat(detail)


def handle_failed_records(records):
    for triplet in records:
        status, error, record = triplet
        payload: str = record.body
        message: dict = json.loads(payload)
        detail: dict = json.loads(message["Message"])
        logger.info(detail)
        user_id = detail["userId"]
        data = detail.get("data", {})
        session_id = data.get("sessionId", "")

        send_to_client(
            {
                "type": "text",
                "action": "error",
                "direction": "OUT",
                "userId": user_id,
                "timestamp": str(int(round(datetime.now().timestamp()))),
                "data": {
                    "sessionId": session_id,
                    "content": str(error),
                    "type": "text",
                },
            }
        )


@logger.inject_lambda_context(log_event=True)
@tracer.capture_lambda_handler
def handler(event, context: LambdaContext):
    batch = event["Records"]

    api_keys = parameters.get_secret(API_KEYS_SECRETS_ARN, transform="json")
    for key in api_keys:
        os.environ[key] = api_keys[key]

    try:
        with processor(records=batch, handler=record_handler):
            processed_messages = processor.process()
    except BatchProcessingError as e:
        logger.error(e)

    logger.info(processed_messages)
    handle_failed_records(
        message for message in processed_messages if message[0] == "fail"
    )

    return processor.response()


# if __name__ == "__main__":
#     testing()