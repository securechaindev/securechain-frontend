'use client'
import { useState, type FormEvent } from 'react'
import { contactAPI } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  Input,
  Label,
  Textarea,
} from '@/components/ui'
import { Send } from 'lucide-react'
import { useToast } from '@/hooks/ui'

interface ContactModalProps {
  currentLang: 'en' | 'es'
  translations: {
    contactModalTitle: string
    contactModalDescription: string
    emailLabel: string
    emailPlaceholder: string
    subjectLabel: string
    subjectPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    contactEmailHelperText: string
    cancelButton: string
    sendButton: string
    sendingButton: string
    toastErrorTitle: string
    toastErrorDescription: string
    toastInvalidEmailTitle: string
    toastInvalidEmailDescription: string
    contactToastSuccessTitle: string
    contactToastSuccessDescription: string
    toastSubmissionFailedTitle: string
    contactToastSubmissionFailedDescription: string
  }
}

export function ContactModal({ currentLang, translations: t }: ContactModalProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !subject.trim() || !message.trim()) {
      toast({
        title: t.toastErrorTitle,
        description: t.toastErrorDescription,
        variant: 'destructive',
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast({
        title: t.toastInvalidEmailTitle,
        description: t.toastInvalidEmailDescription,
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await contactAPI.sendMessage({
        name: '', // You might want to add a name field
        email: email.trim(),
        message: `${subject.trim()}\n\n${message.trim()}`, // Combine subject and message
      })

      toast({
        title: t.contactToastSuccessTitle,
        description: t.contactToastSuccessDescription,
      })
      setEmail('')
      setSubject('')
      setMessage('')
      setOpen(false)
    } catch (error: any) {
      toast({
        title: t.toastSubmissionFailedTitle,
        description: error.message || t.contactToastSubmissionFailedDescription,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="secondary" className="gap-2">
          <Send className="h-5 w-5" />
          {t.sendButton}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t.contactModalTitle}</DialogTitle>
          <DialogDescription>{t.contactModalDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground">{t.contactEmailHelperText}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">{t.subjectLabel}</Label>
              <Input
                id="subject"
                placeholder={t.subjectPlaceholder}
                value={subject}
                onChange={e => setSubject(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">{t.messageLabel}</Label>
              <Textarea
                id="message"
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={e => setMessage(e.target.value)}
                disabled={isSubmitting}
                required
                rows={5}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              {t.cancelButton}
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="outline">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t.sendingButton}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t.sendButton}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
