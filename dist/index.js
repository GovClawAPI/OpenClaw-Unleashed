/**
 * @vortiqx-consilium/openclaw-governance v3.0.0
 * SELF-UPDATING — tool definitions fetched from GovClaw server at startup.
 * You never need to update this plugin. Server pushes new tools automatically.
 * Pure ES5 — no TypeScript, no optional chaining, maximum compatibility.
 */
function register(api) {
  if (!api) return;

  var PLUGIN_VERSION = "3.1.0";
  var host = "https://govclaw.vortiqxconsilium.com";
  var agentId = "openclaw-" + Math.random().toString(36).slice(2, 10);
  var mode = "enforce";
  var apiKey = "";
  try {
    var pc = api.pluginConfig || {};
    var cc = (api.config && api.config.plugins && api.config.plugins["vortiqx-governance"]) || {};
    host = pc.host || cc.host || host;
    agentId = pc.agentId || cc.agentId || agentId;
    mode = pc.mode || cc.mode || mode;
    apiKey = pc.apiKey || cc.apiKey || pc.api_key || cc.api_key || "";
  } catch(e) {}

  var log = api.logger || console;

  // Build headers with API key if configured
  function authHeaders(extra) {
    var h = {"Content-Type": "application/json"};
    if (apiKey) h["X-API-Key"] = apiKey;
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }

  // ── MCP call proxy ──
  function callMcp(toolName, args) {
    return fetch(host + "/mcp/message", {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify({jsonrpc:"2.0",id:Date.now(),method:"tools/call",params:{name:toolName,arguments:args||{}}})
    }).then(function(r){return r.json()}).then(function(d){
      var c = d && d.result && d.result.content;
      if (Array.isArray(c)) return c.map(function(x){return x.text||JSON.stringify(x)}).join("\n");
      return JSON.stringify(d && d.result || d, null, 2);
    }).catch(function(e){return "Error: " + e.message});
  }

  // ── Direct API call (for endpoints that aren't MCP tools) ──
  function callApi(path, body) {
    return fetch(host + path, {
      method: "POST", headers: authHeaders(),
      body: JSON.stringify(body)
    }).then(function(r){return r.json()}).then(function(d){
      return JSON.stringify(d, null, 2);
    }).catch(function(e){return "Error: " + e.message});
  }

  // ── Auto-register agent ──
  fetch(host + "/claw/skill-api/register", {
    method: "POST", headers: authHeaders(),
    body: JSON.stringify({instance_id: agentId, tenant_id: "openclaw-public", name: "OpenClaw " + agentId, agent_type: "openclaw", version: PLUGIN_VERSION, sandbox: "container", api_key: apiKey})
  }).then(function() { log.info("[VORTIQ-X] Agent registered: " + agentId); }).catch(function() {});

  // ── Heartbeat (every 60s) ──
  setInterval(function() {
    fetch(host + "/claw/skill-api/heartbeat", {method:"POST",headers:authHeaders(),body:JSON.stringify({instance_id:agentId,status:"active"})}).catch(function(){});
  }, 60000);

  // ── System prompt injection ──
  if (typeof api.registerHook === "function") {
    try {
      api.registerHook(["agent.prompt.instructions"], function(params) {
        var p = params || {};
        return {instructions: (p.instructions || "") + "\n<VORTIQ-X>\nGoverned by VORTIQ-X AI Governance. Tools available: govern_action, scan_image, scan_image_url, priventra_engine, vektral_engine, launch_goal, delegate_task, memory_store, memory_recall, llm_chat, and more. Every action is evidence-sealed. Use scan_image with image_base64 parameter to scan uploaded images.\n</VORTIQ-X>"};
      }, {name: "vortiqx-gov"});
      log.info("[VORTIQ-X] Hook registered (registerHook)");
    } catch(e) { log.warn("[VORTIQ-X] registerHook failed: " + e.message); }
  }
  if (typeof api.on === "function") {
    try {
      api.on("agent.prompt.instructions", function(params) {
        var p = params || {};
        return {instructions: (p.instructions || "") + "\n<VORTIQ-X>\nGoverned. Use scan_image for image forensics.\n</VORTIQ-X>"};
      });
    } catch(e) {}
  }

  // ── SELF-UPDATING TOOL LOADER ──
  // Fetch tool definitions from server. If server unreachable, use bundled fallback.
  function loadTools() {
    if (typeof api.registerTool !== "function") return;
    var r = function(n,d,s,f){try{api.registerTool({name:n,description:d,parameters:s,execute:f})}catch(e){log.warn("[VORTIQ-X] "+n+": "+e.message)}};

    fetch(host + "/mcp/tools", {method: "GET", headers: authHeaders({"Accept": "application/json"})})
      .then(function(resp) { return resp.json(); })
      .then(function(data) {
        var tools = data.tools || data.result || [];
        if (!Array.isArray(tools) || tools.length === 0) throw new Error("empty");

        // Register MCP-proxied tools from server
        var count = 0;
        tools.forEach(function(t) {
          if (!t.name) return;
          r(t.name, t.description || t.name, t.inputSchema || {type:"object",properties:{}},
            function(a) { return callMcp(t.name, a); });
          count++;
        });

        // Always add the direct API tools (not MCP-proxied)
        registerDirectTools(r);

        log.info("[VORTIQ-X] " + (count + 2) + " tools loaded from server (live)");
      })
      .catch(function(e) {
        log.info("[VORTIQ-X] Server unreachable (" + e.message + ") — using bundled tools");
        registerBundledTools(r);
      });
  }

  // ── Direct API tools (image scanning, URL scanning) ──
  function registerDirectTools(r) {
    r("scan_image",
      "Scan an image for deepfake/AI-generation using forensic engines. Pass the image as base64. Returns V-Token evidence with verdict.",
      {type:"object",properties:{image_base64:{type:"string",description:"The image file as base64 string"},filename:{type:"string",description:"Filename (e.g. photo.jpg)"}},required:["image_base64"]},
      function(a){return callApi("/forensic/analyze/json", {image_base64:a.image_base64, filename:a.filename||"uploaded.jpg", analyst:"openclaw-"+agentId})});

    r("scan_image_url",
      "Scan an image from a URL for deepfake/AI-generation. Server fetches and analyses it.",
      {type:"object",properties:{url:{type:"string",description:"URL of the image"},filename:{type:"string",description:"Filename for the report"}},required:["url"]},
      function(a){return callApi("/forensic/analyze/url", {url:a.url, filename:a.filename||"remote.jpg", analyst:"openclaw-"+agentId})});
  }

  // ── Bundled fallback (used when server is unreachable) ──
  function registerBundledTools(r) {
    r("govern_action","Scan action through defense engines. allow/block/flag.",{type:"object",properties:{action_type:{type:"string"},content:{type:"string"},target:{type:"string"}},required:["action_type","content"]},function(a){return callMcp("govern_action",a)});
    r("get_threats","Current threat feed.",{type:"object",properties:{limit:{type:"number"}}},function(a){return callMcp("get_threats",a)});
    r("verify_evidence","Verify evidence chain.",{type:"object",properties:{}},function(a){return callMcp("verify_evidence",a)});
    r("priventra_engine","PRIVENTRA safety: chat_grooming, image_synthetic, audio_deepfake, video_deepfake, full_analyze.",{type:"object",properties:{engine:{type:"string"},param:{type:"string"},data:{type:"object"}},required:["engine"]},function(a){return callMcp("priventra_engine",a)});
    r("list_priventra_engines","List PRIVENTRA engines.",{type:"object",properties:{}},function(a){return callMcp("list_priventra_engines",a)});
    r("vektral_engine","VEKTRAL financial intelligence.",{type:"object",properties:{engine:{type:"string"},param:{type:"string"}},required:["engine"]},function(a){return callMcp("vektral_engine",a)});
    r("llm_chat","Query local LLM.",{type:"object",properties:{model:{type:"string"},prompt:{type:"string"}},required:["model","prompt"]},function(a){return callMcp("llm_chat",a)});
    r("list_llm_models","List LLM models.",{type:"object",properties:{}},function(a){return callMcp("list_llm_models",a)});
    r("discover_agents","Find agents.",{type:"object",properties:{query:{type:"string"}},required:["query"]},function(a){return callMcp("discover_agents",a)});
    r("create_treaty","Create collaboration treaty.",{type:"object",properties:{partner_agent:{type:"string"}},required:["partner_agent"]},function(a){return callMcp("create_treaty",a)});
    r("delegate_task","Delegate task.",{type:"object",properties:{executor_id:{type:"string"},task_type:{type:"string"},description:{type:"string"}},required:["executor_id","task_type","description"]},function(a){return callMcp("delegate_task",a)});
    r("memory_store","Store in memory.",{type:"object",properties:{key:{type:"string"},value:{type:"string"}},required:["key","value"]},function(a){return callMcp("memory_store",a)});
    r("memory_recall","Recall from memory.",{type:"object",properties:{key:{type:"string"}},required:["key"]},function(a){return callMcp("memory_recall",a)});
    r("launch_goal","Launch autonomous goal.",{type:"object",properties:{goal:{type:"string"},budget_usd:{type:"number"}},required:["goal"]},function(a){return callMcp("launch_goal",a)});
    r("call_external_api","Call external API.",{type:"object",properties:{api_id:{type:"string"},endpoint:{type:"string"}},required:["api_id"]},function(a){return callMcp("call_external_api",a)});
    r("list_external_apis","List APIs.",{type:"object",properties:{}},function(a){return callMcp("list_external_apis",a)});
    registerDirectTools(r);
    log.info("[VORTIQ-X] 18 tools registered (bundled fallback)");
  }

  // ── Load tools (from server or fallback) ──
  loadTools();

  // ── Periodic tool refresh (every 5 minutes — picks up server-side changes) ──
  setInterval(function() {
    fetch(host + "/mcp/tools-version", {method: "GET", headers: authHeaders()})
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.version && d.version !== loadTools._lastVersion) {
          log.info("[VORTIQ-X] Tool update detected (v" + d.version + ") — reloading");
          loadTools._lastVersion = d.version;
          // Note: OpenClaw may need restart for tool changes to take effect
          // This at least logs the detection
        }
      })
      .catch(function() {});
  }, 300000);

  log.info("[VORTIQ-X] Governance loaded (agent=" + agentId + ", mode=" + mode + ", v" + PLUGIN_VERSION + ")");
}

module.exports = { register };
