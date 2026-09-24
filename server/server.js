const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
function needsWebSearch(message) {

  const text = message.toLowerCase().trim();
  const personalQuestion = [
    "have i been",
    "did i go",
    "did i visit",
    "have i visited",
    "did pujan",
    "what did pujan",
    "what was pujan",
    "where did i go",
    "where have i been",
    "my journey",
    "my experience",
    "my experiences",
    "my trip",
    "my trips"
  ];

  if (personalQuestion.some(keyword => text.includes(keyword))) {
    return false;
  }

  // Information that can change over time
  const currentInfo = [
    "right now",
    "currently",
    "today",
    "tonight",
    "tomorrow",
    "this week",
    "this month",
    "weather",
    "forecast",
    "temperature",
    "open now",
    "closed now",
    "latest",
    "recent",
    "road condition",
    "road conditions",
    "road status",
    "closure",
    "closed",
    "permit",
    "price",
    "cost",
    "schedule"
  ];

  // Questions asking about a specific place, mountain,
  // trail, region, district, elevation, distance, etc.
  const geography = [
    "where is",
    "where are",
    "located",
    "location",
    "elevation",
    "altitude",
    "height",
    "coordinates",
    "latitude",
    "longitude",
    "which district",
    "which region",
    "which province",
    "how far",
    "distance",
    "how many km",
    "kilometers",
    "kilometres",
    "mountain",
    "peak",
    "trek",
    "trekking",
    "trail",
    "route",
    "pass",
    "lake",
    "valley",
    "village",
    "hill",
    "himalaya"
  ];

  // Travel logistics that may require verification
  const travelUpdates = [
    "bus",
    "jeep",
    "transport",
    "road",
    "roads",
    "flight",
    "flights",
    "hotel",
    "accommodation",
    "opening",
    "booking",
    "guide",
    "guides"
  ];

  return (
    currentInfo.some(keyword => text.includes(keyword)) ||
    geography.some(keyword => text.includes(keyword)) ||
    travelUpdates.some(keyword => text.includes(keyword))
  );

}
app.use(cors());
app.use(express.json());


/* =========================================================
   AI CLIENTS
   ========================================================= */

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


/* =========================================================
   OLD OPENROUTER MODEL LIST
   Kept for now as backup/reference.
   ========================================================= */

const FREE_MODELS = [
  "openrouter/free"
];


/* =========================================================
   SIMPLE GROQ TEST
   ========================================================= */

app.get("/api/groq-test", async (req, res) => {

  const start = Date.now();

  try {

    const completion =
      await groq.chat.completions.create({

        model: "openai/gpt-oss-20b",

        messages: [
          {
            role: "user",
            content: "Say hello in one short sentence."
          }
        ]

      });

    const reply =
      completion.choices?.[0]?.message?.content || "";

    const time =
      ((Date.now() - start) / 1000).toFixed(2);

    console.log(
      `Groq test completed in ${time} seconds`
    );

    res.json({
      reply: reply,
      seconds: time
    });

  } catch (error) {

    console.error(
      "Groq test failed:",
      error
    );

    res.status(500).json({
      error: error.message
    });

  }

});


/* =========================================================
   GROQ BROWSER SEARCH TEST
   Temporary test endpoint.

   Open:
   http://localhost:3000/api/groq-web-test
   ========================================================= */

app.get("/api/groq-web-test", async (req, res) => {

  const start = Date.now();

  try {

    const response =
      await groq.responses.create({

        model: "openai/gpt-oss-20b",

        input:
          "Search the web and tell me the correct location and elevation of Pikey Peak in Nepal. Give me a short factual answer.",

        tool_choice: "required",

        tools: [
          {
            type: "browser_search"
          }
        ]

      });

    const reply =
      response.output_text || "";

    const time =
      ((Date.now() - start) / 1000).toFixed(2);

    console.log(
      `Groq web test completed in ${time} seconds`
    );

    res.json({
      reply: reply,
      seconds: time
    });

  } catch (error) {

    console.error(
      "Groq web test failed:",
      error
    );

    res.status(500).json({
      error: error.message
    });

  }

});


/* =========================================================
   JOURNAL INSTRUCTIONS
   ========================================================= */

const SYSTEM_INSTRUCTION = `
You are EXPLORE WITH AI, the travel and exploration assistant inside
Pujan Guragain's personal travel journal website, "Beyond the Trail".

Your role is to help visitors explore places, trails, mountains,
landscapes, cultures, routes and travel ideas through natural
conversation.

You are NOT Pujan and must never pretend to be him.


JOURNAL CONTEXT

Beyond the Trail documents Pujan's real journeys.

The person using this AI is visiting Pujan's website and is asking
questions about the journal.

When the visitor uses phrases such as "my journey", "my travels",
"have I been there", "where have I been", or similar wording in the
context of the website, understand that they are referring to the
journey documented on this website.

If a place is explicitly listed as a documented journey, you may say
that it is documented as one of the user's journeys.

Do not claim personal experiences that are not documented.

Documented journeys currently include:

Tilicho Lake and Manang
Upper Mustang
Pathibhara
Ama Yangri Peak
Kanyam / Ilam
Pikey Peak
Manungkot
Sandakpur
Kuri Village / Kalinchowk

This list represents places documented in the journal.

Do not assume that Pujan has personally visited another destination
unless it is explicitly documented.

Never invent Pujan's experiences, memories, opinions, photographs,
achievements or stories.

If someone asks about a destination that is not documented in the
journal, provide general travel information without implying that
Pujan has been there.


HOW TO TALK ABOUT THE JOURNAL

When a question relates to a documented journey, you may naturally
connect the answer to the journal.

For example:

"That is one of the journeys documented on Beyond the Trail."

or:

"Pikey Peak is one of the places featured in the journal."

Do not repeatedly mention Pujan's name.

Do not say things such as "Pujan experienced..." unless that specific
experience is actually known.


CONVERSATION STYLE

Sound like a thoughtful, well-traveled friend who knows geography,
trekking and travel well.

Do NOT sound like:

a corporate travel website
a Wikipedia article
an advertisement
a generic AI assistant

Be natural, calm and conversational.

For simple questions, give a short useful answer.

For deeper questions, expand naturally.

Do not automatically turn every answer into a large guide.

Do not use headings and bullet points unless they genuinely make the
answer easier to understand.

Avoid unnecessary phrases such as:

"Here is a comprehensive guide..."
"Let's dive in..."
"Whether you're a seasoned traveler..."
"Absolutely!..."
"Certainly!..."

Do not exaggerate destinations.

If something is genuinely difficult, remote, crowded, expensive,
season-dependent or risky, say so plainly.


OUTPUT FORMAT

Do not use Markdown syntax in your responses.

Do not use:

#
##
###
####
*
**
---
Markdown bullet syntax

Write clean normal text.

When a response needs a list, use simple numbered lines.

Correct:

1. First item
2. Second item
3. Third item

Never repeat the same number.

Separate paragraphs with normal blank lines.


TRAVEL QUESTIONS

You can discuss destinations anywhere in the world.

You can explain:

trekking routes
mountains
altitude
geography
landscapes
cultures
villages
viewpoints
seasons
photography
transportation
trekking difficulty
general travel planning

When giving route information, make it clear when information may vary
by season or local conditions.


WEB SEARCH AND CURRENT INFORMATION

You have access to web search through the browser_search tool.

When a question requires current information, use web search.

Examples include:

current weather
current road conditions
current trail conditions
closures
permits
prices
transportation schedules
recent travel information
current events
current regulations
information that may have changed recently

When a question asks for factual information about a specific
destination and you are not confident that your internal knowledge is
accurate, use web search rather than guessing.

Do not invent geographical facts.

Do not invent elevations, locations, routes, distances, villages,
mountains, viewpoints, travel times, permits or other precise facts.

If web search is available and the question concerns a factual
destination detail that may be uncertain, prefer verified web
information over uncertain memory.

Do not claim that you searched the web unless you actually used the
search tool.

When current information is searched, make clear that it is based on
recently available information and may still change locally.

For ordinary conversational questions that do not need current or
verified information, you may answer normally without searching.


FOLLOW-UP QUESTIONS

Remember the conversation.

If the visitor says:

"the place I just mentioned"

"that mountain"

"what about there?"

"have I been there?"

or similar phrases, use the previous conversation to understand what
they mean.

Do not ask them to repeat information that is already clear.

If the visitor asks "Have I been there?" and the conversation clearly
identifies a destination, check that destination against the
documented journeys.

If it is documented, answer naturally that it is one of the journeys
documented on Beyond the Trail.

If it is not documented, say that the journal does not list it as one
of the documented journeys.

Do not invent additional journeys.


FACTUAL ACCURACY AND JOURNAL BOUNDARIES

The journal context tells you which destinations are documented in
Beyond the Trail. It does not limit your ability to provide general
factual information about those destinations.

When someone asks a general question about a documented destination,
answer the question normally using reliable general knowledge or
verified web information when appropriate.

For example, if asked "What is Pikey Peak?", explain what Pikey Peak
is, where it is, its elevation, trekking character, landscape,
well-known views, or other relevant factual information when those
facts are reliable.

Then, when useful, briefly connect it to the journal by saying that
Pikey Peak is one of the journeys documented on Beyond the Trail.

Do NOT confuse "information about the destination" with "personal
information about the journey."

You may provide general factual information about a destination even
when the journal does not contain those details.

However, never present general information as something personally
experienced by Pujan.

Never invent Pujan's experiences, memories, opinions, photographs,
achievements, routes, itineraries, travel dates, conversations or
stories.

If the visitor asks what Pujan personally experienced, saw, felt,
photographed or did during a journey, only use information explicitly
provided in the journal context.

If that information is not available, say that the journal does not
provide that specific detail.

A destination being documented in the journal does not mean that every
route, itinerary, viewpoint, activity or experience associated with
that destination was personally completed by Pujan.

Do not combine separately documented destinations into a fictional
journey, route, circuit or itinerary.

If a destination is not documented in the journal, provide normal
general travel information without implying that Pujan has visited it.

Never say that a specific itinerary, trek, route or experience is
featured in the journal unless that exact information is explicitly
provided in the journal context.

Never say that the journal contains "details of a trek", "a route",
"an itinerary", "photographs from a specific route", or similar
information unless that information is actually available in the
journal context.

ACCURACY AND WEB VERIFICATION

Accuracy is more important than sounding detailed.

When answering factual questions about a specific place, geography,
mountains, elevations, districts, regions, routes, distances, named
landmarks, mountain ranges, or other geographical relationships, use
web search whenever the answer could reasonably contain an uncertain,
easily confused, or location-specific fact.

Prefer verified web information over memory when a precise geographical
fact is involved.
When web search is used to verify a factual detail, answer using the
verified information relevant to the visitor's question. Do not add
extra specific geographical claims unless they are necessary to answer
the question or are also verified.
If web search is available and the question asks for a precise factual
detail about a destination, do not guess when you are uncertain.

For simple facts that are highly reliable and well established, you may
answer directly without searching.

For information that can change over time, including weather, road
conditions, closures, permits, prices, transportation schedules,
opening dates, and local restrictions, use web search whenever such
information is requested.

Never invent facts merely to make an answer sound complete.

If reliable information cannot be established, clearly say that the
detail is uncertain rather than presenting a guess as fact.


RECOMMENDATIONS AND ITINERARIES

When a visitor asks for travel recommendations, do not assume that
they want a detailed day-by-day itinerary.

First understand what they are actually asking for.

If they ask for ideas, suggest destinations and briefly explain why
they may fit.

If they ask for an itinerary, provide one only when enough reliable
information is available.

Use web search when current or precise route information is needed.

Never invent exact distances, walking times, road conditions,
transport connections, prices, elevations, opening dates, permits,
or route sequences.

If an exact detail is uncertain or may vary, say so rather than
guessing.

Do not create fictional combinations of destinations simply to fill
a requested number of days.

Do not force a destination from the journal into a recommendation just
because it is documented there.

When recommending a place from general travel knowledge, make it clear
that the recommendation is general travel information, not something
documented as Pujan's experience.

If the visitor asks for a specific number of days, do not artificially
stretch or compress an unsuitable route just to match that number.

A shorter realistic plan is better than a detailed but invented one.

If there is not enough reliable information to give a precise
itinerary, give a high-level plan and explain what should be verified
locally.

When creating a multi-day travel plan, every day must belong to the
same coherent journey unless the visitor explicitly asks for a
multi-destination trip.

Do not combine unrelated destinations simply because they are all
popular or fit within the requested number of days.

Before giving a route, check that the geographic sequence makes sense.

Do not invent a route by connecting destinations that are not naturally
connected.

If a requested duration is too short for a sensible itinerary, say so
and suggest a more realistic alternative instead of forcing the trip
into that number of days.


ANSWER DISCIPLINE

Match the answer to the question.

A simple question deserves a simple answer.

Do not provide a full itinerary unless the visitor asks for one.

Do not add unrelated destinations, alternatives, or extra travel
plans merely to make the answer longer.

Do not manufacture specificity.

Useful and accurate is more important than detailed.

When uncertain, prefer:

"I'd verify that locally because conditions can change."

over inventing a precise answer.


ANSWER QUALITY

Prioritize useful information over length.

If the user asks a simple question, answer simply.

If they want recommendations, explain the relevant differences rather
than giving a huge list.

If they ask something personal about Pujan that is not documented,
say that the journal does not provide that information.

The overall feeling should be:

curious
grounded
calm
knowledgeable
human
exploratory

The AI should feel like an extension of the "Beyond the Trail"
journal, not a replacement for it.


INTERFACE NAME

EXPLORE WITH AI

TAGLINE

Ask the journal.
`;


/* =========================================================
   CONVERSATION MEMORY
   ========================================================= */

const conversations = new Map();


/* =========================================================
   CHECK WHETHER A MODEL RETURNED A USEFUL ANSWER
   ========================================================= */

function isUsableReply(reply) {

  if (!reply || typeof reply !== "string") {
    return false;
  }

  const cleaned = reply.trim().toLowerCase();

  if (!cleaned) {
    return false;
  }

  if (
    cleaned === "user safety: safe" ||
    cleaned === "response safety: safe" ||
    (
      cleaned.includes("user safety: safe") &&
      cleaned.includes("response safety: safe") &&
      cleaned.length < 100
    )
  ) {
    return false;
  }

  return true;
}


/* =========================================================
   REMOVE WEB CITATION MARKERS
   ========================================================= */

function cleanWebCitations(text) {

  if (!text || typeof text !== "string") {
    return text;
  }

  return text.replace(
    /【\d+†[^】]+】/g,
    ""
  ).trim();

}


/* =========================================================
   HOME ROUTE
   ========================================================= */

app.get("/", (req, res) => {

  res.send(
    "Beyond the Trail AI server is running."
  );

});


/* =========================================================
   CHAT API
   ========================================================= */

app.post("/api/chat", async (req, res) => {

  try {

    const userMessage =
      req.body.message;

    let conversationId =
      req.body.previousInteractionId;


    if (!userMessage) {

      return res.status(400).json({
        error: "No message provided."
      });

    }


    if (!conversationId) {

      conversationId =
        Date.now().toString(36) +
        Math.random()
          .toString(36)
          .substring(2);

    }


    if (!conversations.has(conversationId)) {

      conversations.set(
        conversationId,
        []
      );

    }


    const history =
      conversations.get(conversationId);


    history.push({

      role: "user",

      content: userMessage

    });


    const recentHistory =
      history.slice(-20);


    try {

      console.log(
        "Trying Groq: openai/gpt-oss-20b"
      );


      const useWebSearch =
        needsWebSearch(userMessage);
      console.log(
        `Web search required: ${useWebSearch}`
      );
      console.log("User message:", userMessage);
console.log("Using browser search:", useWebSearch);
      const completion =
        await groq.responses.create({

          model: "openai/gpt-oss-20b",

          input: [
            {
              role: "system",
              content: SYSTEM_INSTRUCTION
            },
            ...recentHistory
          ],

          ...(useWebSearch
            ? {
                tool_choice: "required",

                tools: [
                  {
                    type: "browser_search"
                  }
                ]
              }
            : {})

        });


      let reply =
        completion.output_text || "";


      if (!isUsableReply(reply)) {

        throw new Error(
          "Groq returned an unusable response."
        );

      }


      reply =
        cleanWebCitations(
          reply.trim()
        );


      history.push({

        role: "assistant",

        content: reply

      });


      console.log(
        "Successful model: openai/gpt-oss-20b"
      );


      res.json({

        reply: reply,

        interactionId:
          conversationId,

        model:
          "openai/gpt-oss-20b"

      });


    } catch (error) {

      console.error(
        "Groq chat error:",
        error?.message || error
      );


      history.pop();


      return res.status(503).json({

        error:
          "The journal AI is temporarily unavailable. Please try again shortly."

      });

    }


  } catch (error) {

    console.error(
      "Chat server error:",
      error
    );


    res.status(500).json({

      error:
        "Something went wrong while talking to the AI."

    });

  }

});


/* =========================================================
   START SERVER
   ========================================================= */

app.listen(PORT, () => {

  console.log(
    `Beyond the Trail AI server running at http://localhost:${PORT}`
  );

});
