export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return Response.json({ success: false, message: "Missing credentials" }, { status: 400 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return Response.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Login success
    return Response.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error("Admin login error:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
