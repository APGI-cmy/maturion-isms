"""Public chat service for Maturion."""

from __future__ import annotations

import os
import re
from typing import Any

from openai import OpenAI

from services.apw_specialist_stubs import APWSpecialistRedTestStubs


_TEST_OPENAI_KEY = "test-openai-key-fixture"
_SAFE_PAGE_PATTERN = re.compile(r"^/[A-Za-z0-9/_-]{0,119}$")
_APW_IN