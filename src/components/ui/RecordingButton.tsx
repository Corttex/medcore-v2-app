'use client';

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, CheckCircle2 } from 'lucide-react';

interface RecordingButtonProps {
  meetingId: string;
  onTranscriptionComplete?: (dados: any) => void;
}

export default function RecordingButton({ meetingId, onTranscriptionComplete }: RecordingButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsDone(false);
    } catch (err) {
      console.error('Erro ao acessar microfone:', err);
      alert('Permissão de microfone negada ou dispositivo não encontrado.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      // O nome do arquivo importa menos pois o backend vai gerar um uuid, mas a extensão ajuda o multer/File
      formData.append('audio', blob, 'recording.webm');
      formData.append('meetingId', meetingId);

      const res = await fetch('/api/ai/prontuario', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Falha ao processar áudio');

      setIsDone(true);
      if (onTranscriptionComplete) {
        onTranscriptionComplete(data);
      }
    } catch (error) {
      console.error('Erro no upload/processamento:', error);
      alert('Ocorreu um erro ao gerar o prontuário inteligente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isDone) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 w-fit">
        <CheckCircle2 className="w-5 h-5" />
        <span className="font-medium text-sm">Prontuário Inteligente Gerado!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {!isRecording && !isProcessing && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 bg-[--color-rd-coral] hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg"
        >
          <Mic className="w-5 h-5" />
          Ditar Prontuário (Dra. Conte)
        </button>
      )}

      {isRecording && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="font-medium text-sm">Gravando...</span>
          </div>
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-full font-semibold transition-all"
          >
            <Square className="w-4 h-4 fill-current" />
            Parar e Processar
          </button>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-[--color-rd-navy] bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium text-sm">Dra. Conte está gerando o prontuário...</span>
        </div>
      )}
    </div>
  );
}
