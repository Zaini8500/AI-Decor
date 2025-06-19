import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ✅ Uses secret key from .env

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ Parses JSON body sent by frontend
    console.log("💡 Received request body:", body);

    const { credits } = body;

    if (!credits || credits <= 0) {
      console.error("❌ Invalid credits value:", credits); // ✅ Input validation
      return new Response("Invalid credits", { status: 400 });
    }

    const unitPriceInCents = 100; // ✅ $1 per credit
    const amount = credits * unitPriceInCents;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} AI Decor Credit${credits > 1 ? "s" : ""}`,
            },
            unit_amount: amount, // ✅ Price per credit in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/dashboard?success=true&credits=${credits}`, // ✅ Return credit count for success handling
      cancel_url: `http://localhost:3000/dashboard?canceled=true`,
    });

    console.log("✅ Stripe session created:", session.id);
    return Response.json({ url: session.url }); // ✅ Return Stripe URL to frontend

  } catch (err) {
    console.error("🔥 Error in create-checkout-session:", err);
    return new Response("Server error: " + err.message, { status: 500 });
  }
}
