from __future__ import annotations

import copy
import importlib
import os
import sys
import types
from pathlib import Path
from typing import Any

import pytest
from fastapi.testclient import TestClient


API_GATEWAY_PATH = Path(__file__).resolve().parents[1] / "services" / "api_gateway"
sys.path.insert(0, str(API_GATEWAY_PATH))
os.environ["JWT_SECRET_KEY"] = "test-only-signing-key-at-least-32-bytes-long"
os.environ["JWT_ALGORITHM"] = "HS256"


class FakeCursor:
    def __init__(self, documents: list[dict[str, Any]]) -> None:
        self.documents = documents

    def sort(self, key: str, direction: int) -> FakeCursor:
        self.documents.sort(key=lambda item: item.get(key), reverse=direction < 0)
        return self

    def limit(self, count: int) -> FakeCursor:
        self.documents = self.documents[:count]
        return self

    async def to_list(self, length: int | None = None) -> list[dict[str, Any]]:
        return self.documents[:length] if length is not None else self.documents


class FakeCollection:
    def __init__(self) -> None:
        self.documents: list[dict[str, Any]] = []
        self.next_id = 1

    def reset(self) -> None:
        self.documents.clear()
        self.next_id = 1

    async def create_index(self, *_args: Any, **_kwargs: Any) -> None:
        return None

    async def find_one(self, query: dict[str, Any]) -> dict[str, Any] | None:
        return next((copy.deepcopy(doc) for doc in self.documents if self._matches(doc, query)), None)

    async def insert_one(self, document: dict[str, Any]) -> Any:
        saved = copy.deepcopy(document)
        saved.setdefault("_id", self.next_id)
        self.next_id += 1
        self.documents.append(saved)
        return types.SimpleNamespace(inserted_id=saved["_id"])

    async def delete_one(self, query: dict[str, Any]) -> Any:
        for index, document in enumerate(self.documents):
            if self._matches(document, query):
                del self.documents[index]
                return types.SimpleNamespace(deleted_count=1)
        return types.SimpleNamespace(deleted_count=0)

    def find(self, query: dict[str, Any], projection: dict[str, Any] | None = None) -> FakeCursor:
        documents = [copy.deepcopy(doc) for doc in self.documents if self._matches(doc, query)]
        if projection and projection.get("_id") == 0:
            for document in documents:
                document.pop("_id", None)
        return FakeCursor(documents)

    async def count_documents(self, query: dict[str, Any]) -> int:
        return sum(self._matches(document, query) for document in self.documents)

    @staticmethod
    def _matches(document: dict[str, Any], query: dict[str, Any]) -> bool:
        for key, expected in query.items():
            actual = document.get(key)
            if isinstance(expected, dict) and "$ne" in expected:
                if actual == expected["$ne"]:
                    return False
            elif actual != expected:
                return False
        return True


mongo_stub = types.ModuleType("database.mongo")
mongo_stub.users_collection = FakeCollection()
mongo_stub.threat_logs_collection = FakeCollection()
mongo_stub.reports_collection = FakeCollection()
mongo_stub.api_keys_collection = FakeCollection()


async def fake_init_db() -> None:
    return None


mongo_stub.init_db = fake_init_db
sys.modules["database.mongo"] = mongo_stub
gateway = importlib.import_module("main")


@pytest.fixture(autouse=True)
def reset_fake_database() -> None:
    for collection_name in (
        "users_collection",
        "threat_logs_collection",
        "reports_collection",
        "api_keys_collection",
    ):
        getattr(mongo_stub, collection_name).reset()


@pytest.fixture
def client() -> TestClient:
    return TestClient(gateway.app)


@pytest.fixture
def auth_headers() -> dict[str, str]:
    token = gateway.create_access_token({"sub": "tester@example.com"})
    return {"Authorization": f"Bearer {token}"}