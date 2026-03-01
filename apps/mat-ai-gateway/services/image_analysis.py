"""
services/image_analysis.py — Image Analysis service stub.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.4
  "Image Analysis: GPT-4 Vision, photo evidence → description + compliance"
"""

from __future__ import annotations


class ImageAnalyser:
    """
    Analyses photographic evidence for compliance description and classification.

    Uses GPT-4 Vision (gpt-4o) to extract textual descriptions from images
    and map them to compliance controls.  Full implementation is wired in a
    later wave; this stub satisfies the architectural interface contract.
    """

    def analyse(self, image_url: str, tenant_id: str) -> dict:
        """
        Analyse an image from *image_url* and return a compliance description.

        Parameters
        ----------
        image_url:
            Publicly accessible URL of the image to analyse (JPEG, PNG, WEBP).
        tenant_id:
            Tenant scoping key for multi-tenancy isolation and audit trail.

        Returns
        -------
        dict
            Image analysis result or task queue entry.
        """
        return {
            "status": "queued",
            "task_id": "stub",
            "image_url": image_url,
            "tenant_id": tenant_id,
        }
