from __future__ import annotations


def _auth_headers(token: str = "test-mcp-token") -> dict[str, str]:
    return {"Authorization": "Bearer" + " " + token}


class TestMcpProbe:
    def test_get_mcp_requires_auth(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.get("/mcp")

        assert response.status_code == 401
        assert response.json() == {"detail": "Unauthorized."}

    def test_get_mcp_rejects_malformed_or_invalid_auth(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        malformed = test_client.get(
            "/mcp",
            headers={"Authorization": "Basic" + " " + "test-mcp-token"},
        )
        wrong_token = test_client.get(
            "/mcp",
            headers=_auth_headers("wrong-token"),
        )

        assert malformed.status_code == 401
        assert malformed.json() == {"detail": "Unauthorized."}
        assert wrong_token.status_code == 401
        assert wrong_token.json() == {"detail": "Unauthorized."}

    def test_get_mcp_returns_503_when_token_not_configured(self, test_client, monkeypatch):
        monkeypatch.delenv("MCP_TOKEN", raising=False)

        response = test_client.get("/mcp")

        assert response.status_code == 503
        assert response.json() == {"detail": "MCP auth is not configured on server."}

    def test_get_mcp_returns_tool_probe_when_authenticated(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.get("/mcp", headers=_auth_headers())

        assert response.status_code == 200
        assert response.json() == {
            "status": "ok",
            "service": "mcp",
            "tools": ["agent_bootstrap"],
        }


class TestMcpJsonRpc:
    def test_tools_list_returns_agent_bootstrap(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.post(
            "/mcp",
            json={"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}},
            headers=_auth_headers(),
        )

        assert response.status_code == 200
        assert response.json() == {
            "jsonrpc": "2.0",
            "id": 1,
            "result": {
                "tools": [
                    {
                        "name": "agent_bootstrap",
                        "description": "Load a governed agent contract by agent_id.",
                        "inputSchema": {
                            "type": "object",
                            "properties": {"agent_id": {"type": "string"}},
                            "required": ["agent_id"],
                            "additionalProperties": False,
                        },
                    }
                ]
            },
        }

    def test_tools_call_returns_placeholder_payload(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.post(
            "/mcp",
            json={
                "jsonrpc": "2.0",
                "id": 2,
                "method": "tools/call",
                "params": {
                    "name": "agent_bootstrap",
                    "arguments": {"agent_id": "api-builder"},
                },
            },
            headers=_auth_headers(),
        )

        assert response.status_code == 200
        assert response.json() == {
            "jsonrpc": "2.0",
            "id": 2,
            "result": {
                "content": [
                    {
                        "type": "json",
                        "json": {
                            "ok": True,
                            "tool": "agent_bootstrap",
                            "arguments": {"agent_id": "api-builder"},
                            "message": "MCP endpoint is live; bootstrap backend is not wired in this service.",
                        },
                    }
                ]
            },
        }

    def test_tools_call_rejects_unknown_tool(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.post(
            "/mcp",
            json={
                "jsonrpc": "2.0",
                "id": 3,
                "method": "tools/call",
                "params": {"name": "unknown_tool", "arguments": {}},
            },
            headers=_auth_headers(),
        )

        assert response.status_code == 200
        assert response.json() == {
            "jsonrpc": "2.0",
            "id": 3,
            "error": {
                "code": -32601,
                "message": "Unknown tool 'unknown_tool'.",
            },
        }

    def test_tools_call_requires_tool_name(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.post(
            "/mcp",
            json={"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {}},
            headers=_auth_headers(),
        )

        assert response.status_code == 200
        assert response.json() == {
            "jsonrpc": "2.0",
            "id": 5,
            "error": {
                "code": -32602,
                "message": "Invalid params: missing tool name.",
            },
        }

    def test_rejects_unknown_method(self, test_client, monkeypatch):
        monkeypatch.setenv("MCP_TOKEN", "test-mcp-token")

        response = test_client.post(
            "/mcp",
            json={"jsonrpc": "2.0", "id": 4, "method": "ping", "params": {}},
            headers=_auth_headers(),
        )

        assert response.status_code == 200
        assert response.json() == {
            "jsonrpc": "2.0",
            "id": 4,
            "error": {
                "code": -32601,
                "message": "Method 'ping' not implemented.",
            },
        }
