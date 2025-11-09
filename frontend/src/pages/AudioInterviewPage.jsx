import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Footer from '../components/Footer'

// Audio Interview Page
// - Five questions appear one-by-one
// - Single MediaRecorder instance used across all questions
// - Pause (between questions) and resume (for next question) append audio
// - After final stop the entire audio blob is saved locally (IndexedDB) and can be uploaded

const QUESTIONS = [
  'How has your energy been lately? For example, have you been feeling rested when you wake up, or more tired than usual?',
  'What has been taking up most of your attention or focus recently?',
  'What’s something you’ve done in the last few days that you genuinely enjoyed or found interesting?',
  'What are you looking forward to in the next few days or weeks?',
  'How have interactions with other people felt for you recently?'
]

// --- Lightweight IndexedDB helpers (no external libs) ---
function openAudioDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('audio-db', 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('files')) db.createObjectStore('files')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveBlobToIDB(key, blob) {
  const db = await openAudioDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite')
    const store = tx.objectStore('files')
    const req = store.put(blob, key)
    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error)
  })
}

async function getBlobFromIDB(key) {
  const db = await openAudioDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readonly')
    const store = tx.objectStore('files')
    const req = store.get(key)
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => reject(req.error)
  })
}

async function deleteBlobFromIDB(key) {
  const db = await openAudioDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', 'readwrite')
    const store = tx.objectStore('files')
    const req = store.delete(key)
    req.onsuccess = () => resolve(true)
    req.onerror = () => reject(req.error)
  })
}

export default function AudioInterviewPage() {
  const { hashId } = useParams()
  console.log('AudioInterviewPage mounting with hashId:', hashId)
  const [currentQuestion, setCurrentQuestion] = useState(0) // 0..4
  const [recordingStatus, setRecordingStatus] = useState('idle') // 'idle' | 'recording' | 'paused' | 'ended' | 'permission-denied'
  const [isUploading, setIsUploading] = useState(false)
  const [savedExists, setSavedExists] = useState(false)
  const [savedUrl, setSavedUrl] = useState(null)

  const mediaRecorderRef = useRef(null)
  const mediaStreamRef = useRef(null)
  const audioChunksRef = useRef([]) // will hold all chunks across questions
  const advanceTimerRef = useRef(null)
  const SAVED_KEY = 'answers-complete'

  // helper to pick a supported mimeType
  const pickMimeType = () => {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp3'
    ]
    if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
      return ''
    }
    return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || ''
  }

  // request microphone and create MediaRecorder once when user first starts
  const initMediaRecorder = async (forcePrompt = false) => {
    if (mediaRecorderRef.current) return
    try {
      // If permission was previously denied in browser UI, calling getUserMedia may not prompt again.
      // forcePrompt parameter allows calling when user clicks "Allow Microphone" retry button.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream

      const mimeType = pickMimeType()
      const options = mimeType ? { mimeType } : {}
      const mr = new MediaRecorder(stream, options)

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data)
          console.log('chunk received', e.data.size)
        }
      }

      mr.onstop = async () => {
        const completeBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        try {
          await saveBlobToIDB(SAVED_KEY, completeBlob)
          setSavedExists(true)
          const url = URL.createObjectURL(completeBlob)
          setSavedUrl(url)
          toast.success('Recording saved locally')
        } catch (err) {
          console.error('Failed to save locally', err)
          toast.error('Failed to save recording locally')
        }

        audioChunksRef.current = []
        mediaRecorderRef.current = null
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((t) => t.stop())
          mediaStreamRef.current = null
        }

        setIsUploading(false)
      }

      mediaRecorderRef.current = mr
      // if we previously set permission-denied, revert to idle so user can start
      if (recordingStatus === 'permission-denied') setRecordingStatus('idle')
    } catch (err) {
      console.error('Microphone permission or creation failed', err)
      // Specifically handle permission denial
      if (err && (err.name === 'NotAllowedError' || err.name === 'SecurityError' || err.name === 'PermissionDeniedError')) {
        setRecordingStatus('permission-denied')
        toast.error('Microphone permission denied. Click "Allow Microphone" or enable microphone access in browser/site settings.')
      } else if (err && err.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone and try again.')
      } else {
        toast.error('Unable to access microphone. Please allow microphone permissions.')
      }
      throw err
    }
  }

  // start or resume recording
  const startRecording = async () => {
    if (recordingStatus === 'permission-denied') {
      toast.error('Microphone permission denied. Click "Allow Microphone" and retry.')
      return
    }
    try {
      await initMediaRecorder()
    } catch (err) {
      return
    }
    const mr = mediaRecorderRef.current
    if (!mr) return

    try {
      if (mr.state === 'inactive') {
        mr.start()
      } else if (mr.state === 'paused') {
        mr.resume()
      }
      setRecordingStatus('recording')
    } catch (err) {
      console.error(err)
      toast.error('Recording failed to start/resume')
    }
  }

  const pauseForQuestion = () => {
    const mr = mediaRecorderRef.current
    if (!mr || mr.state !== 'recording') return
    try {
      mr.pause()
      setRecordingStatus('paused')

      advanceTimerRef.current = setTimeout(() => {
        setCurrentQuestion((idx) => Math.min(4, idx + 1))
      }, 2000)
    } catch (err) {
      console.error('Pause failed', err)
      toast.error('Unable to pause recording')
    }
  }

  const stopSessionAndSave = async () => {
    const mr = mediaRecorderRef.current
    if (!mr) return
    try {
      setRecordingStatus('ended')
      setIsUploading(true)
      mr.stop()
    } catch (err) {
      console.error('Stop failed', err)
      toast.error('Unable to stop recorder')
      setIsUploading(false)
    }
  }

  const uploadAudioBlob = async (blobToUpload) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('audio', blobToUpload)
      formData.append('questionsCount', QUESTIONS.length)

      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/staff/${hashId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Failed to upload audio interview' }))
        toast.error(err.message || 'Failed to upload audio interview')
      } else {
        toast.success('Audio interview uploaded successfully')
        await deleteLocalSavedBlob()
      }
    } catch (err) {
      console.error('Upload error', err)
      toast.error('Upload failed, please try again')
    } finally {
      setIsUploading(false)
    }
  }

  // handle the single record button click (toggles behavior per spec)
  const handleRecordButton = async () => {
    if (recordingStatus === 'permission-denied') {
      // attempt a user-initiated retry (some browsers will re-prompt)
      try {
        await initMediaRecorder(true)
        toast.info('If prompted, allow microphone for this site.')
      } catch (err) {
        // still denied
      }
      return
    }

    if (recordingStatus === 'idle') {
      await startRecording()
      return
    }

    if (recordingStatus === 'recording') {
      if (currentQuestion === QUESTIONS.length - 1) {
        if (advanceTimerRef.current) {
          clearTimeout(advanceTimerRef.current)
          advanceTimerRef.current = null
        }
        await stopSessionAndSave()
      } else {
        pauseForQuestion()
      }
      return
    }

    if (recordingStatus === 'paused') {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current)
        advanceTimerRef.current = null
      }
      await startRecording()
      return
    }

    if (recordingStatus === 'ended') {
      toast.info('Recording session has ended')
    }
  }

  // Local storage helpers
  const loadLocalSavedBlob = async () => {
    try {
      const blob = await getBlobFromIDB(SAVED_KEY)
      if (blob) {
        setSavedExists(true)
        const url = URL.createObjectURL(blob)
        setSavedUrl(url)
      } else {
        setSavedExists(false)
      }
    } catch (err) {
      console.error('Failed to load saved blob', err)
    }
  }

  const clearSavedUrl = () => {
    if (savedUrl) {
      URL.revokeObjectURL(savedUrl)
      setSavedUrl(null)
    }
    setSavedExists(false)
  }

  const deleteLocalSavedBlob = async () => {
    try {
      await deleteBlobFromIDB(SAVED_KEY)
      clearSavedUrl()
      toast.info('Local copy cleared')
    } catch (err) {
      console.error('Failed to delete local copy', err)
      toast.error('Failed to clear local copy')
    }
  }

  // upload the locally-saved blob (if exists)
  const uploadLocalCopy = async () => {
    try {
      const blob = await getBlobFromIDB(SAVED_KEY)
      if (!blob) return toast.error('No saved recording found')
      await uploadAudioBlob(blob)
    } catch (err) {
      console.error('Upload local copy failed', err)
      toast.error('Upload failed')
    }
  }

  // cleanup on unmount
  useEffect(() => {
    loadLocalSavedBlob()
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop() } catch (e) { }
        mediaRecorderRef.current = null
      }
      clearSavedUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Label logic for button
  const buttonLabel = (() => {
    if (recordingStatus === 'permission-denied') return 'Allow Microphone'
    if (recordingStatus === 'idle') return 'Start Recording'
    if (recordingStatus === 'recording') return currentQuestion === QUESTIONS.length - 1 ? 'Stop Recording' : 'Stop Recording'
    if (recordingStatus === 'paused') return 'Start Recording'
    if (recordingStatus === 'ended') return 'Session Ended'
    return 'Record'
  })()

  return (
    <main className="w-full min-h-screen font-['QuickSand'] bg-stone-100 pt-20">
      <div className="p-8 flex flex-col gap-8">
        <div className="max-w-4xl mx-auto bg-[#FCF6F5] rounded-2xl shadow p-8 border-2" style={{ borderColor: '#990011' }}>

          <h1 className="text-3xl font-medium text-[#990011] mb-2">Audio Interview</h1>
          <p className="text-sm text-gray-600 mb-6">Answer the five questions using audio. Your answers will be recorded into a single audio file. The recording is saved locally after finishing so you can preview or retry upload.</p>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
              <p className="text-2xl font-bold text-[#990011]">{QUESTIONS[currentQuestion]}</p>
            </div>
            <div className="text-right">
              <p className="italic font-serif text-sm text-gray-700">Click the record button below to start answering.</p>
              <div className="mt-3">
                <button
                  onClick={handleRecordButton}
                  disabled={recordingStatus === 'ended' || isUploading}
                  className={`px-6 py-3 rounded-full font-semibold shadow-lg focus:outline-none transform transition-transform ${recordingStatus === 'recording' ? 'animate-pulse scale-105' : 'hover:scale-105'}`}
                  style={{ backgroundColor: '#990011', color: '#FCF6F5' }}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="p-4 rounded-lg border" style={{ borderColor: '#990011' }}>
              <p className="text-sm text-gray-700">Status: <strong>{recordingStatus}</strong></p>
              <p className="text-sm text-gray-700">{recordingStatus === 'recording' ? 'Recording...' : recordingStatus === 'paused' ? 'Paused between questions' : ''}</p>
              {recordingStatus === 'permission-denied' && (
                <p className="text-sm text-red-600">Microphone access is blocked. Please enable microphone for this site in browser settings or click "Allow Microphone".</p>
              )}
              {isUploading && <p className="text-sm text-gray-700">Processing...</p>}
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex gap-2 items-center">
                <span className="text-sm font-semibold">Local copy:</span>
                {savedExists ? (
                  <span className="text-sm text-green-700">Saved</span>
                ) : (
                  <span className="text-sm text-slate-600">None</span>
                )}
              </div>

              {savedUrl && (
                <div className="flex flex-col gap-2">
                  <audio controls src={savedUrl} className="w-full" />
                  <div className="flex gap-2">
                    <button onClick={uploadLocalCopy} className="px-4 py-2 rounded bg-[#990011] text-[#FCF6F5]">Upload</button>
                    <button onClick={deleteLocalSavedBlob} className="px-4 py-2 rounded border">Clear Local Copy</button>
                    <a href={savedUrl} download="answers.mp3" className="px-4 py-2 rounded border">Download</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-5 gap-2">
              {QUESTIONS.map((q, i) => (
                <div key={i} className={`p-2 text-xs text-center rounded ${i < currentQuestion ? 'bg-[#990011] text-[#FCF6F5]' : i === currentQuestion ? 'border-2' : 'bg-white'} shadow-sm`} style={{ borderColor: '#990011' }}>
                  Q{i + 1}
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600">Note: This page uses the browser's MediaRecorder API and IndexedDB to store the final recording locally. Make sure your browser supports both and microphone permission is allowed.</p>
        </div>
      </div>

      <Footer />
    </main>
  )
}