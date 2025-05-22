export const getOpenAIResponse = async (query: string): Promise<string> => {
  try {
    const apiKey = `${import.meta.env.VITE_OPEN_AI_KEY}`;

    // Making a POST request to OpenAI API
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: query
              }
            ]
          }
        ],
        // text: {
        //   format: {
        //     type: "json"
        //   }
        // },
        // reasoning: {},
        temperature: 1,
        max_output_tokens: 1000,
        top_p: 1,
        store: false
      }),
    });

    // Checking if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch response from OpenAI: ${response.statusText}`);
    }

    // Parsing the response JSON
    const data = await response.json();

    // Extracting the output text from the response structure
    const textAnswer = data.output[0]?.content[0]?.text;

    return textAnswer || "No text response found"; // Return the response text or a fallback message
  } catch (err: any) {
    console.error("Error:", err); // Log the error for debugging

    // Throw a new error to be handled when calling this function
    throw new Error(err?.message || "Error fetching response from OpenAI");
  }
};
