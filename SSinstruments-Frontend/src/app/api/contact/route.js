let messages = [];

export async function POST(request) {
  const body = await request.json();

  const newMessage = {
    id: Date.now().toString(),
    ...body,
    submittedAt: new Date().toISOString(),
  };

  messages.push(newMessage);

  return Response.json(
    { message: "Message received successfully", id: newMessage.id },
    { status: 201 },
  );
}

export async function GET() {
  return Response.json(messages);
}
