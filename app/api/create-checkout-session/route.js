import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Uses secret key from .env

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("💡 Received request body:", body);

    const { credits } = body;

    if (!credits || credits <= 0) {
      console.error("❌ Invalid credits value:", credits);
      return new Response("Invalid credits", { status: 400 });
    }

    const unitPriceInCents = 100; // $1 per credit
    const amount = credits * unitPriceInCents;

    // ✅ Declare baseUrl outside of Stripe config
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} AI Decor Credit${credits > 1 ? "s" : ""}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/dashboard?success=true&credits=${credits}`,
      cancel_url: `${baseUrl}/dashboard?canceled=true`,
    });

    console.log("✅ Stripe session created:", session.id);
    return Response.json({ url: session.url });

  } catch (err) {
    console.error("🔥 Error in create-checkout-session:", err);
    return new Response("Server error: " + err.message, { status: 500 });
  }
}
