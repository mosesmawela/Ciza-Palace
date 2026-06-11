import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email is present and format is valid
    if (!email || typeof email !== "string" || !email.trim() || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const sanitizedEmail = email.trim();
    const sanitizedName = name ? String(name).trim() : "";

    // Log to standard server streams
    console.log(`[CIZA Fans Signup - Next.js] Name: "${sanitizedName || "N/A"}", Email: "${sanitizedEmail}"`);

    // =========================================================================
    // TODO: connect Resend here
    // =========================================================================
    // Example Node integration code using the Resend package:
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // try {
    //   await resend.emails.send({
    //     from: "CIZA Fans <newsletter@cizamusic.com>",
    //     to: sanitizedEmail,
    //     subject: "Welcome to the Movement | CIZA Amapiano",
    //     text: `Hi ${sanitizedName || 'Fan'},\n\nWelcome to CIZA's inner circle! You're now subscribed to exclusive news, music releases, and tour dates.\n\nBlessings,\nCIZA & LVRN Team`
    //   });
    // } catch (sendError) {
    //   console.error("Failed to route mail via Resend API:", sendError);
    //   // Note: You can still return success to the user so the UX is unaffected,
    //   // or raise an alert based on your business logic.
    // }
    // =========================================================================

    return NextResponse.json({ success: true, message: "Subscribed successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Subscription API Router Failure:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
