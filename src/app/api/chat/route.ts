import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, chatInput } = body

    if (!chatInput || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId and chatInput' },
        { status: 400 }
      )
    }

    // n8n webhook URL - can be configured via environment variable
    const n8nWebhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      'https://n8n.cardinalquality.com/webhook/463f1166-f02d-4440-b09f-318f0eafd706/chat'

    // Call n8n with action as query parameter
    const webhookUrl = `${n8nWebhookUrl}?action=sendMessage`

    console.log('Proxying to n8n:', { webhookUrl, sessionId, chatInput })

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        chatInput,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n error response:', errorText)
      return NextResponse.json(
        { error: `n8n webhook error: ${response.status}` },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    let data: any

    try {
      data = JSON.parse(responseText)
    } catch {
      data = { output: responseText }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
