from typing import Any, Optional

class CacheService:
    """
    A simple in-memory cache to simulate Redis.
    TODO (Production): Replace the dict with `aioredis` to connect to a real Redis cluster.
    """
    _cache = {}

    @classmethod
    async def get(cls, key: str) -> Optional[Any]:
        return cls._cache.get(key)

    @classmethod
    async def set(cls, key: str, value: Any, ttl_seconds: int = 3600) -> None:
        # Ignoring TTL for this simple mock
        cls._cache[key] = value

    @classmethod
    def clear(cls) -> None:
        cls._cache.clear()
