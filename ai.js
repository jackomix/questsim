hordeAPIKey = ""
debug_mode = true // Prevents automatically trying generation again on error
log_mode = true // Logs prompt and raw AI output to console

function setAPIKey() {
    hordeAPIKey = prompt("paste AI Horde key. you can get a free one at https://stablehorde.net if you don't have one")
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function genHorde(prompt) {
    const headers = {
        "Content-Type": "application/json",
        "apikey": hordeAPIKey
    }

    const response = await fetch(
        "https://stablehorde.net/api/v2/generate/text/async",
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                prompt,
                params: {
                    max_context_length: 2048,
                    max_length: 512,
                    singleline: false,
                    temperature: 0.8,
                    top_p: 0.92,
                    top_k: 100,
                    /*temperature: 1.2,
                    top_p: 0.92,
                    top_k: 0,*/
                    top_a: 0,
                    typical: 1,
                    tfs: 1,
                    rep_pen: 1.1,
                    rep_pen_range: 1024,
                    rep_pen_slope: 0.7,
                    sampler_order: [6, 0, 1, 3, 4, 2, 5],
                },
                models: ["aphrodite\/Undi95\/Emerhyst-20B", "aphrodite\/Undi95\/MXLewd-L2-20B", "aphrodite\/Undi95\/PsyMedRP-v1-20B", "koboldcpp\/Emerhyst-20B.q6_k", ],
            }),
        }
    )

    const { id } = await response.json()
    let done = false

    while (!done) {
        await sleep(1000)
        const checkResponse = await fetch(
            `https://stablehorde.net/api/v2/generate/text/status/${id}`,
            {
                headers,
            }
        )
        const checkData = await checkResponse.json();

        updateStatusWaitTime(checkData)

        if (checkData.finished) done = true
    }

    const statusResponse = await fetch(
        `https://stablehorde.net/api/v2/generate/text/status/${id}`,
        {
            headers,
        }
    )
    const statusData = await statusResponse.json()
    const finalText = statusData.generations[0].text

    return finalText
}

async function gen(prompt) {
    return await genHorde(prompt)
    // Feel free to add other generation APIs lol
}

async function smartGen(prompt) {
    if (log_mode) {
        console.log("--- prompt input ---")
        console.log(promptWrapper(prompt))
    }

    result = await gen(promptWrapper(prompt))
    result = "partyMembers:" + result

    if (result.includes("--- YAML Output End ---")) result = result.split("--- YAML Output End ---")[0]

    if (log_mode) {
        console.log("--- raw ai result ---")
        console.log(result)
    }

    try {
        const yamlObject = jsyaml.load(result)
        return yamlObject
    } catch (error) {
        console.info("error: generated output was not (at least perfectly) in YAML format. regenerating...")
        if (!log_mode) return smartGen(prompt)
    }
}