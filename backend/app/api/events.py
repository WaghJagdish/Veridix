from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import asyncio
import json

router = APIRouter(prefix="/scans", tags=["Events"])

QUEUES = {}

def get_scan_queue(scan_id: str) -> asyncio.Queue:
    if scan_id not in QUEUES:
        QUEUES[scan_id] = asyncio.Queue()
    return QUEUES[scan_id]

@router.get("/{scan_id}/events")
async def scan_events(scan_id: str, request: Request):
    async def event_generator():
        queue = get_scan_queue(scan_id)
        while True:
            if await request.is_disconnected():
                break
            event = await queue.get()
            if event == "DONE":
                break
            yield f"data: {json.dumps(event)}\n\n"
    return StreamingResponse(event_generator(), media_type="text/event-stream")
