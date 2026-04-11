'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface PinConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
}

export function PinConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmação de Segurança",
  description = "Insira seu PIN hospitalar para confirmar esta ação crítica."
}: PinConfirmModalProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const { user, verifyPin } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', ''])
      setError(null)
      setIsSuccess(false)
      setTimeout(() => inputRefs[0].current?.focus(), 100)
    }
  }, [isOpen])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleSubmit = async () => {
    const fullPin = pin.join('')
    if (fullPin.length < 4) {
      setError('Insira os 4 dígitos do PIN')
      return
    }

    if (!user) return

    setIsVerifying(true)
    setError(null)

    try {
      const isValid = await verifyPin(user.id, fullPin)
      if (isValid) {
        setIsSuccess(true)
        setTimeout(() => {
          onConfirm()
          onClose()
        }, 800)
      } else {
        setError('PIN incorreto. Tente novamente.')
        setPin(['', '', '', ''])
        inputRefs[0].current?.focus()
      }
    } catch {
      setError('Erro ao verificar PIN')
    } finally {
      setIsVerifying(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-indigo-500/10"
        >
          {/* Header */}
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 mb-4">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 text-sm">{description}</p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            <div className="flex justify-center gap-3 mb-6">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={isVerifying || isSuccess}
                  className="w-12 h-16 text-center text-2xl font-bold bg-zinc-800/50 border border-zinc-700 rounded-xl text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm justify-center mb-4"
              >
                <AlertCircle size={14} />
                <span>{error}</span>
              </motion.div>
            )}

            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm justify-center mb-4"
              >
                <CheckCircle2 size={14} />
                <span>Autenticado com sucesso</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleSubmit}
                disabled={isVerifying || isSuccess || pin.some(d => !d)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                {isVerifying ? 'Verificando...' : 'Confirmar Ação'}
              </button>
              <button
                onClick={onClose}
                disabled={isVerifying || isSuccess}
                className="w-full py-3 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white font-medium rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
