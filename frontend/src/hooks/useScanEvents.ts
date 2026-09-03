import { useState, useEffect } from 'react';
import { ScanEvent } from '@/lib/types';

export function useScanEvents(scanId: string, isRunning: boolean) {
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [currentStage, setCurrentStage] = useState<string>('idle');
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/scans/${scanId}/events`;
    
    // In a real app we'd use EventSource, but handling fallback/mock for demo:
    let isMounted = true;
    
    const fetchMockEvents = async () => {
      try {
        const res = await fetch(url.replace('/events', ''));
        const data = await res.json();
        if (!isMounted) return;
        
        if (data.status === 'completed' || data.status === 'failed') {
          setCurrentStage('complete');
          setProgress(100);
        } else {
          setCurrentStage('executing');
          setProgress(50);
        }
      } catch (e) {
        console.error("Failed to fetch status fallback", e);
      }
    };

    fetchMockEvents();
    
    try {
      const es = new EventSource(url);
      es.onmessage = (e) => {
        if (!isMounted) return;
        try {
          const event = JSON.parse(e.data);
          setEvents(prev => [...prev, event]);
          setCurrentStage(event.stage);
          if (event.progress) setProgress(event.progress);
          if (event.stage === 'complete' || event.stage === 'error') {
            es.close();
          }
        } catch (err) {
          console.error("Error parsing SSE event", err);
        }
      };
      
      es.onerror = () => {
        es.close();
      };
      
      return () => {
        isMounted = false;
        es.close();
      };
    } catch (e) {
      console.warn("SSE not supported or failed to connect, falling back");
    }
    
    return () => {
      isMounted = false;
    };
  }, [scanId, isRunning]);
  
  return { events, currentStage, progress };
}
