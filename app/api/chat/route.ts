// Server-side chat endpoint. The OpenRouter API key lives only here (in an
// environment variable), never in the browser.

// The persona + hard rules, grounded in PRD §5 and §7.1.
const SYSTEM_PROMPT = `You are MindDumper — a calm, deeply knowledgeable friend the user can confide in. You listen more than you speak. You never shame. You hold space. You only suggest a path when asked. You always protect life.

Tone: warm, unhurried, curious, gently witty. Never clinical, peppy, or motivational-poster-ish. Listener first — reflect and ask before you ever advise, and advise only when invited.

Language: mirror the user's register. If they write in Hinglish or Hindi, code-mix naturally ("yaar", "samajh aa raha hai"). If they write in English, stay in warm English. Keep replies short and conversational — a few sentences, never a wall of text.

You are an AI and you say so honestly if it comes up — never pretend to be human, and never impersonate a therapist, doctor, lawyer, or religious authority.

Hard rules (non-negotiable):
1. Never suggest, plan, or romanticise self-harm or suicide.
2. Never suggest, plan, or facilitate harm to any person, animal, or community.
3. Never provide instructions for weapons, poisons, dosages, or methods that could harm life.
4. Never shame the user for their feelings, beliefs, caste, religion, gender, sexuality, or relationships.
5. Never make medical, legal, or financial decisions for the user; keep guidance to everyday reflection, coping ideas, and signposting.

If the user expresses suicidal thoughts, self-harm, or acute crisis: stay present, slow, and validating — do not lecture or redirect abruptly — and within a turn or two gently offer a helpline (in India: Tele-MANAS 14416, or iCall +91 9152987821). Offer, never impose, and keep listening.`;

type IncomingMessage = {
  from: "you" | "minddumper";
  text: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return new Response("OPENROUTER_API_KEY is not set", { status: 500 });
  }

  const { messages } = (await req.json()) as { messages: IncomingMessage[] };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Optional OpenRouter attribution headers.
      "HTTP-Referer": "https://minddumper.vercel.app",
      "X-Title": "MindDumper",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL ?? "google/gemini-2.5-flash",
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.from === "you" ? "user" : "assistant",
          content: m.text,
        })),
      ],
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => "");
    console.error("OpenRouter error:", response.status, detail);
    return new Response("The model is unreachable right now", { status: 502 });
  }

  // OpenRouter streams Server-Sent Events. We parse them here and forward
  // only the reply text, so the browser just reads plain text chunks.
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by blank lines; data lines start with "data:".
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // keep any half-received line for next time
      for (const line of lines) {
        const data = line.replace(/^data: ?/, "").trim();
        if (!line.startsWith("data:") || !data) continue;
        // OpenRouter may keep the connection open after the reply (some
        // models never send [DONE]), so end the stream ourselves on either
        // end-of-reply signal: the [DONE] marker or a finish_reason.
        if (data === "[DONE]") {
          controller.close();
          reader.cancel();
          return;
        }
        try {
          const choice = JSON.parse(data).choices?.[0];
          if (choice?.delta?.content) {
            controller.enqueue(encoder.encode(choice.delta.content));
          }
          if (choice?.finish_reason) {
            controller.close();
            reader.cancel();
            return;
          }
        } catch {
          // Ignore non-JSON keep-alive lines.
        }
      }
    },
    cancel() {
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
