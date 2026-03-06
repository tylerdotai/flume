"""Socket.IO server for real-time updates."""
import json
from typing import Dict, Any

from socketio import AsyncServer, AsyncNamespace

# Connected clients
connected_clients: Dict[str, set] = {}


class FlumeNamespace(AsyncNamespace):
    """Custom namespace for Flume real-time events."""
    
    def on_connect(self, sid: str, environ: dict):
        """Handle client connection."""
        print(f"Client connected: {sid}")
        connected_clients[sid] = set()
    
    def on_disconnect(self, sid: str):
        """Handle client disconnection."""
        print(f"Client disconnected: {sid}")
        if sid in connected_clients:
            del connected_clients[sid]
    
    def on_join_board(self, sid: str, data: dict):
        """Client joins a board room."""
        board_id = data.get('board_id')
        if board_id:
            self.enter_room(sid, f"board_{board_id}")
            if board_id not in connected_clients:
                connected_clients[board_id] = set()
            connected_clients[board_id].add(sid)
            print(f"SID {sid} joined board_{board_id}")
    
    def on_leave_board(self, sid: str, data: dict):
        """Client leaves a board room."""
        board_id = data.get('board_id')
        if board_id:
            self.leave_room(sid, f"board_{board_id}")
            if board_id in connected_clients:
                connected_clients[board_id].discard(sid)


# Global server instance
sio = AsyncServer(cors_allowed_origins="*", async_mode='asgi')

# Create namespace
flume_ns = FlumeNamespace('/flume')
sio.register_namespace(flume_ns)


async def emit_board_event(board_id: int, event: str, data: Dict[str, Any]) -> None:
    """Emit an event to all clients watching a board."""
    room = f"board_{board_id}"
    payload = {
        "event": event,
        "data": data,
    }
    await sio.emit(room=room, data=payload)


async def emit_card_created(board_id: int, card: Dict[str, Any]) -> None:
    """Emit card created event."""
    await emit_board_event(board_id, "card.created", card)


async def emit_card_updated(board_id: int, card: Dict[str, Any]) -> None:
    """Emit card updated event."""
    await emit_board_event(board_id, "card.updated", card)


async def emit_card_deleted(board_id: int, card_id: int) -> None:
    """Emit card deleted event."""
    await emit_board_event(board_id, "card.deleted", {"id": card_id})


async def emit_list_created(board_id: int, list_data: Dict[str, Any]) -> None:
    """Emit list created event."""
    await emit_board_event(board_id, "list.created", list_data)


async def emit_list_updated(board_id: int, list_data: Dict[str, Any]) -> None:
    """Emit list updated event."""
    await emit_board_event(board_id, "list.updated", list_data)


async def emit_list_deleted(board_id: int, list_id: int) -> None:
    """Emit list deleted event."""
    await emit_board_event(board_id, "list.deleted", {"id": list_id})


async def emit_comment_created(board_id: int, comment: Dict[str, Any]) -> None:
    """Emit comment created event."""
    await emit_board_event(board_id, "comment.created", comment)
