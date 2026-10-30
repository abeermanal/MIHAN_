export async function GET() {
  return new Response(
    "google.com, pub-5963533274767345, DIRECT, f08c47fec0942fa0\n",
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
