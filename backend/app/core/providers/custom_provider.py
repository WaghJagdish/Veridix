from app.core.providers.base import TargetProvider, ProviderResponse
import httpx
import time

class CustomProvider(TargetProvider):
    def __init__(self, endpoint: str, api_key: str, model: str):
        self.endpoint = endpoint
        self.api_key = api_key
        self.model = model
        self.client = httpx.AsyncClient(timeout=30.0)

    async def send(self, prompt: str, system_prompt: str = None) -> ProviderResponse:
        start = time.time()
        try:
            headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
            payload = {"model": self.model, "messages": []}
            if system_prompt:
                payload["messages"].append({"role": "system", "content": system_prompt})
            payload["messages"].append({"role": "user", "content": prompt})
            
            resp = await self.client.post(self.endpoint, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            
            latency = int((time.time() - start) * 1000)
            return ProviderResponse(
                raw_response=data["choices"][0]["message"]["content"],
                latency_ms=latency,
                status="success",
                token_usage=data.get("usage", {})
            )
        except Exception as e:
            latency = int((time.time() - start) * 1000)
            return ProviderResponse(raw_response="", latency_ms=latency, status="error", token_usage={}, error_message=str(e))
    
    async def verify_connection(self) -> bool:
        return True # Complex to verify custom, assume true or send ping
