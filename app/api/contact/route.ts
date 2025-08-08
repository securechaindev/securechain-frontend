import { type NextRequest, NextResponse } from 'next/server'
import { getServerTranslations, getTranslation } from '../../../lib/server-i18n'

export async function POST(request: NextRequest) {
  try {
    const { email, subject, message, language = 'en' } = await request.json()

    const translations = getServerTranslations(language)

    if (!email || !subject || !message) {
      return NextResponse.json(
        {
          error: getTranslation(translations, 'contactApiErrors.missingFields'),
        },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: getTranslation(translations, 'contactApiErrors.invalidEmail'),
        },
        { status: 400 }
      )
    }

    if (!process.env.WEB3FORMS_ACCESS_KEY) {
      return NextResponse.json(
        {
          error: getTranslation(translations, 'contactApiErrors.serviceNotConfigured'),
        },
        { status: 500 }
      )
    }

    const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        subject: `Secure Chain Contact Form: ${subject}`,
        from_name: 'Secure Chain Contact Form',
        email: email,
        message: `
New message from Secure Chain Landing Page:

From: ${email}
Subject: ${subject}

Message:
${message}

---
Submitted at: ${new Date().toLocaleString()}
`,
      }),
    })

    if (!web3formsResponse.ok) {
      await web3formsResponse.text() // Consume response body
      throw new Error(`Web3Forms API error: ${web3formsResponse.status}`)
    }

    let web3formsData
    try {
      const responseText = await web3formsResponse.text()
      web3formsData = JSON.parse(responseText)
    } catch {
      throw new Error('Invalid response from email service')
    }

    if (web3formsData.success) {
      return NextResponse.json({
        success: true,
        message: getTranslation(translations, 'contactApiSuccess.messageSent'),
      })
    } else {
      throw new Error(web3formsData.message || 'Email service reported failure')
    }
  } catch (error) {
    let language = 'en'
    try {
      const body = await request.clone().json()
      language = body.language || 'en'
    } catch {
      language = 'en'
    }

    const translations = getServerTranslations(language)

    return NextResponse.json(
      {
        error: getTranslation(translations, 'contactApiErrors.serviceFailed'),
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
