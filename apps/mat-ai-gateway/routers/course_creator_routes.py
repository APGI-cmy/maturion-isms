"""Authenticated server-to-server Course Creator entry point; no browser keys."""
from fastapi import APIRouter, Request
from services.course_creator_runtime import delegate

router = APIRouter(prefix='/api/v1/course-creator', tags=['Private Course Creator'])


@router.post('/delegate')
async def private_delegation(request: Request):
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > 64000:
            from fastapi import HTTPException
            raise HTTPException(413, 'Private context exceeds bounded request size')
    # Blocking model calls run outside the event loop; health probes remain responsive.
    from starlette.concurrency import run_in_threadpool
    return await run_in_threadpool(delegate, bytes(raw), request.headers)


@router.post('/controller')
async def private_controller(request: Request):
    from services.course_creator_controller import controller
    from starlette.concurrency import run_in_threadpool
    from fastapi import HTTPException
    raw = bytearray()
    async for chunk in request.stream():
        raw.extend(chunk)
        if len(raw) > 32000:
            raise HTTPException(413, 'Controller receipt is too large')
    return await run_in_threadpool(controller, bytes(raw), request.headers)
