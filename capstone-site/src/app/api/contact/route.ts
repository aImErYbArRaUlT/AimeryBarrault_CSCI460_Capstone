import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, type ContactFormData } from '../../../lib/emailService'

export async function POST(req: NextRequest) {
    try {
        // Get form data from request
        const body = await req.json() as ContactFormData
        const { name, email, subject, message } = body
        
        // Validate required fields
        if (!name || !email || !message || !subject) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Missing required fields' 
                },
                { status: 400 }
            )
        }
        
        try {
            // Send the email using our reusable email service
            const messageId = await sendContactEmail(body)
            
            // Return success response
            return NextResponse.json(
                { 
                    success: true, 
                    data: { 
                        message: 'Your message has been sent successfully. We will contact you soon!',
                        messageId
                    } 
                },
                { status: 200 }
            )
        } catch (error: any) {
            // Return error response with more details in development
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to send email. Please try again later.',
                    details: process.env.NODE_ENV !== 'production' ? error.message : undefined
                },
                { status: 500 }
            )
        }
    } catch (error: any) {
        // Return error response
        return NextResponse.json(
            {
                success: false,
                error: 'An unexpected error occurred. Please try again later.'
            },
            { status: 500 }
        )
    }
}