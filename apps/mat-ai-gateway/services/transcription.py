"""
services/transcription.py — Audio Transcription service stub.

Architecture reference: modules/mat/02-architecture/system-architecture.md §3.4
  "Transcription: Whisper, audio → timestamped transcript"
"""

from __future__ import annotations


class AudioTranscriber:
    """
    Converts audio recordings to timestamped transcripts using OpenAI Whisper.

    Typical use case: transcribing auditor interview recordings for evidence
    capture and later AI analysis.  Full implementation is wired in a later
    wave; this stub satisfies the architectural interface contract.
    """

    def transcribe(self, audio_url: str, tenant_id: str) -> dict:
        """
        Transcribe audio from *audio_url* and return a timestamped transcript.

        Parameters
        ----------
        audio_url:
            Publicly accessible URL of the audio file to transcribe (MP3, WAV, M4A, etc.)
        tenant_id:
            Tenant scoping key for multi-tenancy isolation and audit trail.

        Returns
        -------
        dict
            Transcript result or task queue entry.
        """
        return {
            "status": "queued",
            "task_id": "stub",
            "audio_url": audio_url,
            "tenant_id": tenant_id,
        }
